import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetMarketAsset, useGetNewsById } from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import { formatCategory, formatPercent, formatPrice, Sparkline, WatchlistToggle } from '@/src/components/MarketPulseUI';

export default function NewsDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const newsQuery = useGetNewsById(id ?? '');
  const assetQuery = useGetMarketAsset(newsQuery.data?.relatedSymbols[0] ?? 'BTC');
  const contentStyle = [styles.content, { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 40 }];

  if (newsQuery.isLoading) {
    return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={contentStyle}>
      <BackButton />
      <View style={styles.state}><Ionicons name="newspaper-outline" size={28} color={colors.primary} /><Text style={[styles.stateTitle, { color: colors.foreground }]}>뉴스를 불러오는 중이에요</Text></View>
    </ScrollView>;
  }

  if (newsQuery.isError || !newsQuery.data) {
    return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={contentStyle}>
      <BackButton />
      <View style={styles.state}><Ionicons name="cloud-offline-outline" size={28} color={colors.negative} /><Text style={[styles.stateTitle, { color: colors.foreground }]}>뉴스를 불러오지 못했어요</Text><Text style={[styles.stateCopy, { color: colors.mutedForeground }]}>잠시 후 다시 시도해 주세요.</Text></View>
    </ScrollView>;
  }

  const item = newsQuery.data;
  const asset = assetQuery.data;
  const changeColor = item.priceChange >= 0 ? colors.positive : colors.negative;

  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={contentStyle}>
    <BackButton />
    <Text style={[styles.category, { color: item.importance === 'breaking' ? colors.negative : colors.primary }]}>{item.importance === 'breaking' ? '속보' : item.categories.map(formatCategory).join(' · ')}</Text>
    <Text style={[styles.time, { color: colors.mutedForeground }]}>{item.relativeTime} · {item.source}</Text>
    <Text style={[styles.title, { color: colors.foreground }]}>{item.title}</Text>
    <Text style={[styles.body, { color: colors.secondaryForeground }]}>{item.content}</Text>
    {asset ? <View style={[styles.reaction, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <View style={styles.reactionHead}>
        <View>
          <Text style={[styles.kicker, { color: colors.mutedForeground }]}>시장 반응</Text>
          <Text style={[styles.assetName, { color: colors.foreground }]}>{asset.symbol} · {formatPrice(asset.price)}</Text>
        </View>
        <WatchlistToggle symbol={asset.symbol} />
      </View>
      <View style={styles.reactionRow}>
        <Reaction label="뉴스 전" value={formatPrice(asset.price * (1 - item.priceChange / 100))} />
        <Ionicons name="arrow-forward" size={17} color={colors.mutedForeground} />
        <Reaction label="현재" value={formatPrice(asset.price)} change={item.priceChange} color={changeColor} />
      </View>
      <Sparkline points={asset.sparkline} color={changeColor} width={300} height={80} />
    </View> : <View style={[styles.reaction, { borderColor: colors.border, backgroundColor: colors.card }]}><Text style={[styles.kicker, { color: colors.mutedForeground }]}>시장 반응</Text><Text style={[styles.stateCopy, { color: assetQuery.isError ? colors.negative : colors.mutedForeground }]}>실시간 시세를 {assetQuery.isError ? '불러오지 못했어요.' : '불러오는 중이에요.'}</Text></View>}
    <View style={[styles.scoreRow, { borderTopColor: colors.border }]}>
      <Text style={[styles.kicker, { color: colors.mutedForeground }]}>뉴스 영향도 점수</Text>
      <Text style={[styles.score, { color: colors.primary }]}>{item.impactScore}<Text style={[styles.scoreOutOf, { color: colors.mutedForeground }]}> / 100</Text></Text>
    </View>
  </ScrollView>;
}

function BackButton() {
  const colors = useColors();
  return <Pressable testID="news-back" onPress={() => { if (router.canGoBack()) router.back(); else router.replace('/'); }} style={styles.back}>
    <Ionicons name="arrow-back" size={20} color={colors.foreground} />
    <Text style={[styles.backText, { color: colors.foreground }]}>뉴스로 돌아가기</Text>
  </Pressable>;
}

function Reaction({ label, value, change, color }: { label: string; value: string; change?: number; color?: string }) {
  const colors = useColors();
  const highlight = change !== undefined;
  return <View>
    <Text style={[styles.reactionLabel, { color: colors.mutedForeground }]}>{label}</Text>
    <Text style={[styles.reactionValue, { color: highlight ? colors.foreground : colors.secondaryForeground }]}>{value}</Text>
    {highlight && <Text style={[styles.reactionChange, { color }]}>{formatPercent(change)}</Text>}
  </View>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, flexGrow: 1 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 32 },
  backText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  category: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.2 },
  time: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 7 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 30, lineHeight: 36, letterSpacing: -1.1, marginTop: 18 },
  body: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 23, marginTop: 19 },
  reaction: { borderWidth: 1, borderRadius: 16, padding: 16, marginTop: 28 },
  reactionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.3 },
  assetName: { fontFamily: 'Inter_700Bold', fontSize: 20, marginTop: 8 },
  reactionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, marginBottom: 21 },
  reactionLabel: { fontFamily: 'Inter_500Medium', fontSize: 10, marginBottom: 5 },
  reactionValue: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  reactionChange: { fontFamily: 'Inter_700Bold', fontSize: 11, marginTop: 4 },
  scoreRow: { borderTopWidth: 1, marginTop: 25, paddingTop: 18, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  score: { fontFamily: 'Inter_700Bold', fontSize: 25 },
  scoreOutOf: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  state: { flex: 1, minHeight: 260, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  stateTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 14 },
  stateCopy: { fontFamily: 'Inter_500Medium', fontSize: 13, marginTop: 8 },
});