import React, { useEffect, useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { formatPercent, formatPrice, NewsRow, Sparkline, WatchlistToggle } from '@/src/components/MarketPulseUI';
import { useGetMarketAsset, useGetNewsByCoin } from '@workspace/api-client-react';
import { Screen } from '@/src/components/Screen';
import { addPriceAlertWithPermission, loadPriceAlerts, PriceAlert, PriceAlertDirection, removePriceAlert } from '@/src/notifications/priceAlerts';

export default function CoinDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const selectedSymbol = symbol?.toUpperCase() ?? 'BTC';
  const assetQuery = useGetMarketAsset(selectedSymbol);
  const newsQuery = useGetNewsByCoin(selectedSymbol);
  const [range, setRange] = useState('24H');
  const asset = assetQuery.data;
  const goBack = () => { if (router.canGoBack()) router.back(); else router.replace('/'); };

  if (!asset) return <Screen><Pressable testID="coin-back" onPress={goBack} style={styles.back}><Ionicons name="arrow-back" size={20} color={colors.foreground} /><Text style={[styles.backText, { color: colors.foreground }]}>돌아가기</Text></Pressable><Text style={[styles.section, { color: assetQuery.isError ? colors.negative : colors.mutedForeground }]}>{assetQuery.isError ? '실시간 시세를 불러오지 못했습니다.' : '실시간 시세를 불러오는 중…'}</Text></Screen>;

  const related = newsQuery.data ?? [];
  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 40 }]}>
    <Pressable testID="coin-back" onPress={goBack} style={styles.back}><Ionicons name="arrow-back" size={20} color={colors.foreground} /><Text style={[styles.backText, { color: colors.foreground }]}>돌아가기</Text></Pressable>
    <View style={styles.coinHead}>
      <View><Text style={[styles.symbol, { color: colors.mutedForeground }]}>{asset.name} · {asset.symbol}</Text><Text style={[styles.price, { color: colors.foreground }]}>{formatPrice(asset.price)}</Text><Text style={[styles.change, { color: asset.change24h >= 0 ? colors.positive : colors.negative }]}>{formatPercent(asset.change24h)} 오늘</Text></View>
      <WatchlistToggle symbol={asset.symbol} />
    </View>
    <View style={[styles.chart, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <View style={styles.chartHead}><Text style={[styles.chartLabel, { color: colors.mutedForeground }]}>Upbit 가격 흐름</Text><View style={styles.ranges}>{['24H', '7D', '30D'].map((item) => <Pressable key={item} testID={`range-${item}`} onPress={() => setRange(item)} style={[styles.range, { backgroundColor: range === item ? colors.primary : colors.secondary }]}><Text style={[styles.rangeText, { color: range === item ? colors.primaryForeground : colors.mutedForeground }]}>{item === '24H' ? '24시간' : item === '7D' ? '7일' : '30일'}</Text></Pressable>)}</View></View>
      <Sparkline points={asset.sparkline} color={asset.change24h >= 0 ? colors.positive : colors.negative} width={320} height={150} strokeWidth={3} />
    </View>
    <View style={styles.stats}>{[['24시간 거래량', asset.volume24h], ['시가총액', asset.marketCap], ['24시간 고가', formatPrice(asset.high24h)], ['24시간 저가', formatPrice(asset.low24h)]].map(([label, value]) => <View key={label} style={[styles.stat, { borderColor: colors.border, backgroundColor: colors.card }]}><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text><Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text></View>)}</View>
    <PriceAlertPanel symbol={asset.symbol} currentPrice={asset.price} />
    <Text style={[styles.section, { color: colors.foreground }]}>관련 뉴스</Text>
    {newsQuery.isError && <Text style={{ color: colors.negative }}>뉴스 연결을 확인하세요.</Text>}
    {related.map((item) => <NewsRow key={item.id} item={item} />)}
  </ScrollView>;
}

function PriceAlertPanel({ symbol, currentPrice }: { symbol: string; currentPrice: number }) {
  const colors = useColors();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [targetPrice, setTargetPrice] = useState('');
  const [direction, setDirection] = useState<PriceAlertDirection>('above');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadPriceAlerts().then((all) => { if (!cancelled) setAlerts(all.filter((alert) => alert.symbol === symbol)); });
    return () => { cancelled = true; };
  }, [symbol]);

  const submit = async () => {
    const price = Number(targetPrice.replace(/[^\d.]/g, ''));
    if (!price || price <= 0) { Alert.alert('목표가를 입력해 주세요', '숫자로 목표 가격을 입력해 주세요.'); return; }
    setSubmitting(true);
    try {
      const result = await addPriceAlertWithPermission(symbol, price, direction);
      if (result.status === 'added') {
        setAlerts(result.alerts.filter((alert) => alert.symbol === symbol));
        setTargetPrice('');
      } else if (result.status === 'denied') {
        Alert.alert('알림 권한이 필요합니다', '설정에서 Market Pulse 알림을 허용하면 목표가 도달 시 알려드릴 수 있어요.', [
          { text: '나중에', style: 'cancel' },
          { text: '설정 열기', onPress: () => void Linking.openSettings() },
        ]);
      } else {
        Alert.alert('지원하지 않는 환경입니다', '가격 알림은 모바일 앱에서 사용할 수 있어요.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    const updated = await removePriceAlert(id);
    setAlerts(updated.filter((alert) => alert.symbol === symbol));
  };

  return <View style={[styles.alertCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
    <View style={styles.alertHead}>
      <Ionicons name="notifications-outline" size={16} color={colors.primary} />
      <Text style={[styles.alertTitle, { color: colors.foreground }]}>가격 알림</Text>
    </View>
    <Text style={[styles.alertHint, { color: colors.mutedForeground }]}>{symbol}이(가) 목표가에 도달하면 알려드려요. 현재가 {formatPrice(currentPrice)}</Text>
    {alerts.map((alert) => <View key={alert.id} style={[styles.alertRow, { borderColor: colors.border }]}>
      <Text style={[styles.alertRowText, { color: colors.foreground }]}>{formatPrice(alert.targetPrice)} {alert.direction === 'above' ? '이상' : '이하'}</Text>
      <Pressable testID={`alert-remove-${alert.id}`} onPress={() => void remove(alert.id)}><Ionicons name="close-circle" size={18} color={colors.mutedForeground} /></Pressable>
    </View>)}
    <View style={styles.alertForm}>
      <View style={styles.alertDirection}>
        <Pressable testID="alert-direction-above" onPress={() => setDirection('above')} style={[styles.alertDirectionButton, { backgroundColor: direction === 'above' ? colors.primary : colors.secondary }]}><Text style={[styles.alertDirectionText, { color: direction === 'above' ? colors.primaryForeground : colors.mutedForeground }]}>이상</Text></Pressable>
        <Pressable testID="alert-direction-below" onPress={() => setDirection('below')} style={[styles.alertDirectionButton, { backgroundColor: direction === 'below' ? colors.primary : colors.secondary }]}><Text style={[styles.alertDirectionText, { color: direction === 'below' ? colors.primaryForeground : colors.mutedForeground }]}>이하</Text></Pressable>
      </View>
      <TextInput
        testID="alert-target-input"
        value={targetPrice}
        onChangeText={setTargetPrice}
        placeholder="목표 가격 (원)"
        placeholderTextColor={colors.mutedForeground}
        keyboardType="numeric"
        style={[styles.alertInput, { borderColor: colors.border, color: colors.foreground }]}
      />
      <Pressable testID="alert-submit" disabled={submitting} onPress={() => void submit()} style={[styles.alertSubmit, { backgroundColor: colors.primary, opacity: submitting ? 0.6 : 1 }]}><Text style={[styles.alertSubmitText, { color: colors.primaryForeground }]}>{Platform.OS === 'web' ? '앱에서 사용 가능' : '알림 추가'}</Text></Pressable>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 32 },
  backText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  coinHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  symbol: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.3 },
  price: { fontFamily: 'Inter_700Bold', fontSize: 38, letterSpacing: -1.6, marginTop: 11 },
  change: { fontFamily: 'Inter_700Bold', fontSize: 12, marginTop: 7 },
  chart: { borderWidth: 1, borderRadius: 10, padding: 16, marginTop: 27 },
  chartHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  chartLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.2 },
  ranges: { flexDirection: 'row', gap: 5 },
  range: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 4 },
  rangeText: { fontFamily: 'Inter_700Bold', fontSize: 9 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 },
  stat: { width: '48%', borderWidth: 1, borderRadius: 8, padding: 13 },
  statLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.8 },
  statValue: { fontFamily: 'Inter_700Bold', fontSize: 16, marginTop: 8 },
  section: { fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 28, marginBottom: 12 },
  alertCard: { borderWidth: 1, borderRadius: 12, padding: 15, marginTop: 18 },
  alertHead: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  alertTitle: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  alertHint: { fontFamily: 'Inter_500Medium', fontSize: 11, lineHeight: 16, marginTop: 6 },
  alertRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, paddingVertical: 10, marginTop: 8 },
  alertRowText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  alertForm: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  alertDirection: { flexDirection: 'row', borderRadius: 7, overflow: 'hidden' },
  alertDirectionButton: { paddingHorizontal: 9, paddingVertical: 9 },
  alertDirectionText: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  alertInput: { flex: 1, borderWidth: 1, borderRadius: 7, paddingHorizontal: 10, paddingVertical: 9, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  alertSubmit: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 7 },
  alertSubmitText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
});
