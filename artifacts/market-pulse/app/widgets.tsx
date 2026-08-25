import React, { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { getGetMarketOverviewQueryKey, useGetMarketOverview, useGetNews, type NewsItem as ApiNewsItem } from '@workspace/api-client-react';
import { Screen } from '@/src/components/Screen';
import { useColors } from '@/hooks/useColors';
import { MarketAsset } from '@/src/models';
import { useWidgetPreferences } from '@/src/context/WidgetPreferencesContext';
import { MARKET_REFRESH_INTERVAL_MS } from '@/src/config/api';

type WidgetKind = 'price' | 'news';
type WidgetSize = 'small' | 'medium' | 'large';

const sizeLabels: Record<WidgetSize, string> = { small: '작은', medium: '중간', large: '큰' };

export default function WidgetsScreen() {
  const colors = useColors();
  const [saved, setSaved] = useState(false);
  const [previewKind, setPreviewKind] = useState<WidgetKind>('price');
  const [previewSize, setPreviewSize] = useState<WidgetSize>('medium');
  const [coinSearch, setCoinSearch] = useState('');
  const { preferences, isLoading: preferencesLoading, savePreferences } = useWidgetPreferences();
  const kind = previewKind;
  const size = previewSize;
  const selectedSymbols = preferences.selectedSymbols;
  const marketQuery = useGetMarketOverview({
    request: { cache: 'no-store' },
    query: {
      queryKey: getGetMarketOverviewQueryKey(),
      refetchInterval: MARKET_REFRESH_INTERVAL_MS,
      staleTime: MARKET_REFRESH_INTERVAL_MS - 2_000,
    },
  });
  const allAssets = marketQuery.data?.assets ?? [];
  const coinOptions = useMemo(() => {
    const normalizedSearch = coinSearch.trim().toLowerCase();
    const matches = normalizedSearch
      ? allAssets.filter((asset) => `${asset.symbol} ${asset.name}`.toLowerCase().includes(normalizedSearch))
      : allAssets;
    return matches.slice(0, 36);
  }, [allAssets, coinSearch]);
  const selectedAssets = useMemo(() => {
    const assetsBySymbol = new Map(allAssets.map((asset) => [asset.symbol, asset]));
    return selectedSymbols
      .map((symbol) => assetsBySymbol.get(symbol))
      .filter((asset): asset is MarketAsset => Boolean(asset));
  }, [allAssets, selectedSymbols]);
  const newsQuery = useGetNews();

  const changeKind = (nextKind: WidgetKind) => {
    setPreviewKind(nextKind);
    setSaved(false);
  };

  const toggleAsset = (symbol: string) => {
    const nextSymbols = selectedSymbols.includes(symbol)
      ? selectedSymbols.length === 1 ? selectedSymbols : selectedSymbols.filter((item) => item !== symbol)
      : [...selectedSymbols, symbol];
    void savePreferences({ ...preferences, selectedSymbols: nextSymbols }).then(() => setSaved(true));
  };

  const selectedLabel = selectedAssets.length === 1
    ? `${selectedAssets[0]?.name ?? selectedSymbols[0]} 가격`
    : `${selectedSymbols.length}개 코인 가격`;

  return <Screen>
    <View style={styles.header}>
      <Pressable testID="widget-back" onPress={() => router.back()} style={[styles.back, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Ionicons name="arrow-back" size={18} color={colors.foreground} />
      </Pressable>
      <View style={styles.headerCopy}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>MARKET PULSE WIDGETS</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>홈 화면 위젯</Text>
      </View>
    </View>
    <Text style={[styles.intro, { color: colors.mutedForeground }]}>가격 위젯에 표시할 코인을 고르고 모양을 미리보세요. 실제 홈 화면에서는 가격·뉴스 위젯과 크기를 직접 선택합니다.</Text>

    <Text style={[styles.label, { color: colors.mutedForeground }]}>미리보기 위젯 종류</Text>
    <View style={styles.segmentRow}>
      <Segment icon="trending-up-outline" label="가격 위젯" active={kind === 'price'} onPress={() => changeKind('price')} />
      <Segment icon="newspaper-outline" label="뉴스 위젯" active={kind === 'news'} onPress={() => changeKind('news')} />
    </View>

    {kind === 'price' && <>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>가격 위젯에 표시할 코인</Text>
      <View style={[styles.searchBox, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Ionicons name="search" size={17} color={colors.mutedForeground} />
        <TextInput
          testID="widget-coin-search"
          value={coinSearch}
          onChangeText={setCoinSearch}
          placeholder="코인 이름 또는 심볼 검색"
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="characters"
          style={[styles.searchInput, { color: colors.foreground }]}
        />
        {coinSearch.length > 0 && <Pressable testID="widget-coin-search-clear" onPress={() => setCoinSearch('')} hitSlop={8}><Ionicons name="close-circle" size={17} color={colors.mutedForeground} /></Pressable>}
      </View>
      <Text style={[styles.coinHint, { color: colors.mutedForeground }]}>선택 {selectedSymbols.length}개 · 작은 위젯은 2개, 중간은 4개, 큰 위젯은 최대 8개를 표시합니다.</Text>
      <View style={styles.coinPicker}>
        {coinOptions.map((asset) => {
          const selected = selectedSymbols.includes(asset.symbol);
          return <Pressable
            key={asset.symbol}
            testID={`widget-coin-${asset.symbol}`}
            onPress={() => toggleAsset(asset.symbol)}
            style={({ pressed }) => [styles.coinChip, { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.secondary : colors.card, opacity: pressed ? 0.72 : 1 }]}
          >
            <View style={[styles.coinDot, { backgroundColor: asset.accent }]} />
            <Text style={[styles.coinChipText, { color: selected ? colors.foreground : colors.mutedForeground }]}>{asset.symbol}</Text>
            {selected && <Ionicons name="checkmark" size={14} color={colors.primary} />}
          </Pressable>;
        })}
      </View>
      {marketQuery.isError && <Text style={[styles.noResults, { color: colors.negative }]}>전체 코인 목록을 불러오지 못했습니다. 잠시 후 다시 시도하세요.</Text>}
      {!marketQuery.isLoading && !marketQuery.isError && coinOptions.length === 0 && <Text style={[styles.noResults, { color: colors.mutedForeground }]}>일치하는 코인이 없습니다.</Text>}
    </>}

    <Text style={[styles.label, { color: colors.mutedForeground }]}>미리보기 크기</Text>
    <View style={styles.sizeRow}>
      {(['small', 'medium', 'large'] as WidgetSize[]).map((itemSize) => <Pressable key={itemSize} testID={`widget-size-${itemSize}`} onPress={() => { setPreviewSize(itemSize); setSaved(false); }} style={[styles.sizeControl, { borderColor: size === itemSize ? colors.primary : colors.border, backgroundColor: size === itemSize ? colors.secondary : colors.card }]}>
        <Text style={[styles.sizeText, { color: size === itemSize ? colors.foreground : colors.mutedForeground }]}>{sizeLabels[itemSize]}</Text>
        <Text style={[styles.sizeMeasure, { color: size === itemSize ? colors.primary : colors.mutedForeground }]}>{itemSize === 'small' ? '2 × 1' : itemSize === 'medium' ? '4 × 2' : '4 × 4'}</Text>
      </Pressable>)}
    </View>

    <Text style={[styles.label, { color: colors.mutedForeground }]}>미리보기</Text>
    <View style={[styles.previewWell, { borderColor: colors.border, backgroundColor: colors.muted }]}>
      {kind === 'price'
        ? <PriceWidget assets={selectedAssets} size={size} />
        : <NewsWidget items={newsQuery.data ?? []} size={size} isLoading={newsQuery.isLoading} isError={newsQuery.isError} />}
    </View>

    <View style={[styles.summary, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <View style={styles.summaryCopy}>
        <Text style={[styles.summaryKicker, { color: colors.mutedForeground }]}>미리보기 구성</Text>
        <Text style={[styles.summaryTitle, { color: colors.foreground }]}>{kind === 'price' ? selectedLabel : '블록미디어 주요 뉴스'} · {sizeLabels[size]} 위젯</Text>
      </View>
      <Ionicons name={saved ? 'checkmark-circle' : 'phone-portrait-outline'} size={22} color={saved ? colors.positive : colors.primary} />
    </View>
    <Pressable testID="save-widget-preview" disabled={preferencesLoading} onPress={() => { void savePreferences(preferences).then(() => setSaved(true)); }} style={({ pressed }) => [styles.saveButton, { backgroundColor: colors.primary, opacity: pressed || preferencesLoading ? 0.6 : 1 }]}>
      <Ionicons name={saved ? 'checkmark' : 'add'} size={18} color={colors.primaryForeground} />
      <Text style={[styles.saveText, { color: colors.primaryForeground }]}>{saved ? '홈 화면 위젯을 새로고침했어요' : '홈 화면 위젯 새로고침'}</Text>
    </Pressable>
    {saved && <Text style={[styles.savedNote, { color: colors.positive }]}>홈 화면을 길게 누른 뒤 위젯에서 Market Pulse를 선택해 추가하세요. 앱이 열려 있을 때는 15초마다 갱신되며, Android의 백그라운드 자동 갱신은 최소 30분입니다.</Text>}
  </Screen>;
}

function Segment({ icon, label, active, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; active: boolean; onPress: () => void }) {
  const colors = useColors();
  return <Pressable testID={`widget-kind-${label}`} onPress={onPress} style={({ pressed }) => [styles.segment, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.secondary : colors.card, opacity: pressed ? 0.76 : 1 }]}>
    <Ionicons name={icon} size={18} color={active ? colors.primary : colors.mutedForeground} />
    <Text style={[styles.segmentText, { color: active ? colors.foreground : colors.mutedForeground }]}>{label}</Text>
    {active && <Ionicons name="checkmark" size={15} color={colors.primary} style={styles.segmentCheck} />}
  </Pressable>;
}

function PriceWidget({ assets, size }: { assets: MarketAsset[]; size: WidgetSize }) {
  const colors = useColors();
  const visibleAssets = assets.slice(0, size === 'small' ? 2 : size === 'medium' ? 4 : 8);
  return <View style={[styles.widgetCard, widgetSizes[size], { backgroundColor: colors.card, borderColor: colors.primary }]}>
    <View style={styles.widgetTop}>
      <View style={styles.assetLine}>
        <View style={[styles.assetIcon, { backgroundColor: colors.secondary }]}><Ionicons name="trending-up" size={14} color={colors.primary} /></View>
        <View><Text style={[styles.widgetName, { color: colors.foreground }]}>선택 코인 가격</Text><Text style={[styles.widgetSymbol, { color: colors.mutedForeground }]}>UPBIT · KRW</Text></View>
      </View>
      <Text style={[styles.liveText, { color: colors.positive }]}>● 거래중</Text>
    </View>
    <View style={styles.priceGrid}>
       {visibleAssets.map((asset) => <View key={asset.symbol} style={[styles.priceCell, { borderColor: colors.border }]}>
        <View style={styles.priceCellTop}><Text style={[styles.priceSymbol, { color: colors.foreground }]}>{asset.symbol}</Text><Text style={[styles.priceChange, { color: asset.change24h >= 0 ? colors.positive : colors.negative }]}>{asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%</Text></View>
        <Text numberOfLines={1} style={[styles.widgetPrice, { color: colors.foreground }]}>{formatKrwPrice(asset.price)}</Text>
      </View>)}
    </View>
     {size === 'large' && <View style={[styles.priceFooter, { borderTopColor: colors.border }]}><Text style={[styles.footerMetric, { color: colors.mutedForeground }]}>선택 코인 <Text style={{ color: colors.foreground }}>{assets.length}개</Text></Text><Text style={[styles.footerMetric, { color: colors.mutedForeground }]}>업데이트 <Text style={{ color: colors.foreground }}>방금 전</Text></Text></View>}
  </View>;
}

function NewsWidget({ items, size, isLoading, isError }: { items: ApiNewsItem[]; size: WidgetSize; isLoading: boolean; isError: boolean }) {
  const colors = useColors();
  const count = size === 'small' ? 2 : size === 'medium' ? 3 : 4;
  return <View style={[styles.widgetCard, widgetSizes[size], { backgroundColor: colors.card, borderColor: colors.primary }]}>
    <View style={[styles.widgetTop, styles.newsTop, { borderBottomColor: colors.border }]}>
      <View style={styles.assetLine}>
        <View style={[styles.assetIcon, { backgroundColor: colors.secondary }]}><Ionicons name="newspaper-outline" size={14} color={colors.primary} /></View>
        <Text style={[styles.widgetName, { color: colors.foreground }]}>블록미디어 뉴스</Text>
      </View>
      <Text style={[styles.widgetSymbol, { color: colors.mutedForeground }]}>실시간</Text>
    </View>
    {isLoading && <View style={styles.widgetState}><Text style={[styles.widgetStateText, { color: colors.mutedForeground }]}>최신 뉴스를 불러오는 중이에요.</Text></View>}
    {isError && <View style={styles.widgetState}><Text style={[styles.widgetStateText, { color: colors.negative }]}>뉴스를 불러오지 못했어요.</Text></View>}
    {!isLoading && !isError && <View style={styles.newsList}>
      {items.slice(0, count).map((item) => <Pressable key={item.id} testID={`widget-news-${item.id}`} onPress={() => { void Linking.openURL(item.sourceUrl); }} style={({ pressed }) => [styles.widgetNewsRow, { borderBottomColor: colors.border, opacity: pressed ? 0.68 : 1 }]}>
        <View style={styles.newsKickerRow}><Text style={[styles.newsKicker, { color: item.importance === 'breaking' ? colors.negative : colors.primary }]}>{item.importance === 'breaking' ? '속보' : item.relatedSymbols.join(' · ')}</Text><Text style={[styles.widgetSymbol, { color: colors.mutedForeground }]}>{item.relativeTime}</Text></View>
        <Text numberOfLines={size === 'small' ? 1 : 2} style={[styles.widgetHeadline, { color: colors.foreground }, size === 'large' && styles.largeHeadline]}>{item.title}</Text>
      </Pressable>)}
    </View>}
    <View style={[styles.newsFooter, { borderTopColor: colors.border }]}><Text style={[styles.source, { color: colors.secondaryForeground }]}>블록미디어 RSS</Text><Text style={[styles.widgetSymbol, { color: colors.mutedForeground }]}>헤드라인을 누르면 원문 열기</Text></View>
  </View>;
}

function formatKrwPrice(price: number) {
  return `₩${Math.round(price).toLocaleString('ko-KR')}`;
}

const widgetSizes = StyleSheet.create({
  small: { width: 250, minHeight: 184 },
  medium: { width: '100%', minHeight: 232 },
  large: { width: '100%', minHeight: 292 },
});

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  back: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerCopy: { flex: 1 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.2 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 27, letterSpacing: -1.1, marginTop: 4 },
  intro: { fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 19, marginBottom: 26 },
  label: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.1, marginBottom: 9 },
  segmentRow: { flexDirection: 'row', gap: 9, marginBottom: 24 },
  segment: { flex: 1, minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 14, paddingHorizontal: 12 },
  segmentText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  segmentCheck: { marginLeft: 'auto' },
  coinPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  coinChip: { minWidth: 74, minHeight: 38, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderRadius: 12, paddingHorizontal: 10 },
  coinDot: { width: 7, height: 7, borderRadius: 4 },
  coinChipText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  searchBox: { minHeight: 47, flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderRadius: 13, paddingHorizontal: 13, marginBottom: 8 },
  searchInput: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13, paddingVertical: 10 },
  coinHint: { fontFamily: 'Inter_500Medium', fontSize: 10, lineHeight: 15, marginBottom: 10 },
  noResults: { fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: -14, marginBottom: 24 },
  sizeRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  sizeControl: { flex: 1, alignItems: 'center', borderWidth: 1, borderRadius: 13, paddingVertical: 10 },
  sizeText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  sizeMeasure: { fontFamily: 'Inter_500Medium', fontSize: 9, marginTop: 3 },
  previewWell: { minHeight: 340, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 20, padding: 18, marginBottom: 16 },
  widgetCard: { borderWidth: 1, borderRadius: 20, padding: 15, justifyContent: 'space-between', alignSelf: 'center' },
  widgetTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  assetLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  assetIcon: { width: 29, height: 29, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  widgetName: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  widgetSymbol: { fontFamily: 'Inter_500Medium', fontSize: 9, letterSpacing: 0.3, marginTop: 2 },
  liveText: { fontFamily: 'Inter_600SemiBold', fontSize: 9 },
  priceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  priceCell: { width: '47%', borderWidth: 1, borderRadius: 11, padding: 9 },
  priceCellTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4 },
  priceSymbol: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  priceChange: { fontFamily: 'Inter_700Bold', fontSize: 8 },
  widgetPrice: { fontFamily: 'Inter_700Bold', fontSize: 12, marginTop: 7, letterSpacing: -0.35 },
  priceFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 10, marginTop: 12 },
  footerMetric: { fontFamily: 'Inter_500Medium', fontSize: 9 },
  newsTop: { paddingBottom: 12, borderBottomWidth: 1 },
  newsList: { flex: 1, justifyContent: 'center' },
  widgetNewsRow: { paddingVertical: 9, borderBottomWidth: 1 },
  newsKickerRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 4 },
  newsKicker: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.4 },
  widgetHeadline: { fontFamily: 'Inter_700Bold', fontSize: 13, lineHeight: 18, letterSpacing: -0.35 },
  largeHeadline: { fontSize: 14, lineHeight: 19 },
  widgetState: { flex: 1, minHeight: 95, alignItems: 'center', justifyContent: 'center' },
  widgetStateText: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  newsFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 10 },
  source: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  summary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 16, padding: 15, marginBottom: 12, gap: 12 },
  summaryCopy: { flex: 1 },
  summaryKicker: { fontFamily: 'Inter_500Medium', fontSize: 10 },
  summaryTitle: { fontFamily: 'Inter_700Bold', fontSize: 13, marginTop: 5, letterSpacing: -0.3 },
  saveButton: { minHeight: 52, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  saveText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  savedNote: { fontFamily: 'Inter_600SemiBold', fontSize: 11, textAlign: 'center', marginTop: 12 },
});