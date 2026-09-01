import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Screen } from '@/src/components/Screen';
import { MarketCard, ScreenHeader, SectionHeading, TopMovers, WatchlistToggle, formatPercent, formatPrice } from '@/src/components/MarketPulseUI';
import { useWatchlist } from '@/src/context/WatchlistContext';
import { getGetMarketOverviewQueryKey, useGetMarketOverview } from '@workspace/api-client-react';
import { MARKET_REFRESH_INTERVAL_MS } from '@/src/config/api';
import { MarketAsset } from '@/src/models';

type MarketView = 'all' | 'watchlist';

export default function MarketsScreen() {
  const colors = useColors();
  const [view, setView] = useState<MarketView>('all');
  const [query, setQuery] = useState('');
  const marketQuery = useGetMarketOverview({ request: { cache: 'no-store' }, query: { queryKey: getGetMarketOverviewQueryKey(), refetchInterval: MARKET_REFRESH_INTERVAL_MS, staleTime: MARKET_REFRESH_INTERVAL_MS - 2_000 } });
  const { symbols, isLoading: watchlistLoading } = useWatchlist();
  const snapshot = marketQuery.data;
  const assets = snapshot?.assets ?? [];

  return <Screen>
    <ScreenHeader eyebrow="KRW 실시간" title="시장" onPress={() => router.push('/settings')} />
    <View style={[styles.segment, { backgroundColor: colors.card }]}>
      <SegmentButton label="전체 시장" active={view === 'all'} onPress={() => setView('all')} />
      <SegmentButton label="관심목록" active={view === 'watchlist'} onPress={() => setView('watchlist')} count={symbols.length} />
    </View>
    {view === 'all'
      ? <AllMarketsView assets={assets} query={query} setQuery={setQuery} isError={marketQuery.isError} />
      : <WatchlistView assets={assets} symbols={symbols} isLoading={watchlistLoading || marketQuery.isLoading} isError={marketQuery.isError} query={query} setQuery={setQuery} />}
  </Screen>;
}

function AllMarketsView({ assets, query, setQuery, isError }: { assets: MarketAsset[]; query: string; setQuery: (value: string) => void; isError: boolean }) {
  const colors = useColors();
  const normalizedQuery = query.trim().toLowerCase();
  const filteredAssets = normalizedQuery
    ? assets.filter((asset) => asset.symbol.toLowerCase().includes(normalizedQuery) || asset.name.toLowerCase().includes(normalizedQuery))
    : assets;

  return <>
    <View style={styles.stats}><Stat label="24시간 거래량" value={assets.length > 0 ? `${assets.length}개 자산` : '불러오는 중'} /></View>
    <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
      <Ionicons name="search" size={15} color={colors.mutedForeground} />
      <TextInput testID="market-search" value={query} onChangeText={setQuery} placeholder="코인 이름 또는 심볼 검색" placeholderTextColor={colors.mutedForeground} style={[styles.searchInput, { color: colors.foreground }]} />
      {query.length > 0 && <Pressable testID="market-search-clear" onPress={() => setQuery('')}><Ionicons name="close-circle" size={16} color={colors.mutedForeground} /></Pressable>}
    </View>
    {normalizedQuery ? <>
      <SectionHeading label={`“${query}” 검색 결과`} />
      {filteredAssets.length === 0 && <Text style={[styles.emptyHint, { color: colors.mutedForeground }]}>일치하는 코인이 없어요.</Text>}
      <View style={styles.grid}>{filteredAssets.slice(0, 48).map((asset) => <View key={asset.symbol} style={styles.gridItem}><MarketCard asset={asset} compact /></View>)}</View>
    </> : <>
      <SectionHeading label="거래량 상위 KRW 자산" />
      <View style={styles.grid}>{assets.slice(0, 24).map((asset) => <View key={asset.symbol} style={styles.gridItem}><MarketCard asset={asset} compact /></View>)}</View>
      {isError && <Text style={{ color: colors.negative }}>실시간 시세를 불러오지 못했습니다.</Text>}
      <SectionHeading label="주요 변동" />
      <TopMovers assets={assets} />
    </>}
  </>;
}

function WatchlistView({ assets: allAssets, symbols, isLoading, isError, query, setQuery }: { assets: MarketAsset[]; symbols: string[]; isLoading: boolean; isError: boolean; query: string; setQuery: (value: string) => void }) {
  const colors = useColors();
  const assets = allAssets.filter((asset) => symbols.includes(asset.symbol));
  const searchResults = useMemo(() => {
    const normalizedTerm = query.trim().toLowerCase();
    const matchingAssets = normalizedTerm
      ? allAssets.filter((asset) => `${asset.symbol} ${asset.name}`.toLowerCase().includes(normalizedTerm))
      : allAssets;
    return matchingAssets.slice(0, 18);
  }, [allAssets, query]);

  return <>
    <Text style={[styles.intro, { color: colors.mutedForeground }]}>관심 있는 코인을 한눈에 확인하세요.</Text>
    <SectionHeading label="내 관심목록" action={`${assets.length}개`} />
    {isLoading ? (
      <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>관심목록을 불러오는 중…</Text>
    ) : assets.length === 0 ? (
      <View style={[styles.empty, { backgroundColor: colors.card }]}>
        <Ionicons name="star-outline" size={28} color={colors.primary} />
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{isError ? '실시간 시세를 불러오지 못했습니다' : '관심목록이 비어 있습니다'}</Text>
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{isError ? 'API 연결을 확인한 뒤 다시 시도하세요.' : '아래 검색창에서 코인을 추가해보세요.'}</Text>
      </View>
    ) : (
      <View style={styles.list}>
        {assets.map((asset) => (
          <Pressable
            key={asset.symbol}
            testID={`watchlist-row-${asset.symbol}`}
            onPress={() => router.push(`/coin/${asset.symbol}`)}
            style={[styles.row, { backgroundColor: colors.card }]}
          >
            <View style={styles.asset}>
              <View style={[styles.assetDot, { backgroundColor: asset.accent }]} />
              <View>
                <Text style={[styles.symbol, { color: colors.foreground }]}>{asset.symbol}</Text>
                <Text style={[styles.name, { color: colors.mutedForeground }]}>{asset.name}</Text>
              </View>
            </View>
            <View style={styles.priceBlock}>
              <Text style={[styles.price, { color: colors.foreground }]}>{formatPrice(asset.price)}</Text>
              <Text style={[styles.change, { color: asset.change24h >= 0 ? colors.positive : colors.negative }]}>{formatPercent(asset.change24h)}</Text>
            </View>
            <WatchlistToggle symbol={asset.symbol} />
          </Pressable>
        ))}
      </View>
    )}

    <SectionHeading label="코인 추가" action={`${allAssets.length}개 KRW 마켓`} />
    <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
      <Ionicons name="search" size={17} color={colors.mutedForeground} />
      <TextInput
        testID="watchlist-search"
        value={query}
        onChangeText={setQuery}
        placeholder="코인 이름 또는 심볼 검색"
        placeholderTextColor={colors.mutedForeground}
        autoCapitalize="characters"
        style={[styles.searchInput, { color: colors.foreground }]}
        returnKeyType="search"
      />
      {query.length > 0 && (
        <Pressable testID="watchlist-search-clear" onPress={() => setQuery('')} hitSlop={8}>
          <Ionicons name="close-circle" size={17} color={colors.mutedForeground} />
        </Pressable>
      )}
    </View>
    <Text style={[styles.helper, { color: colors.mutedForeground }]}>
      {query.trim() ? '검색 결과에서 별표를 눌러 추가하세요.' : '거래량 상위 코인입니다. 원하는 코인을 검색할 수도 있어요.'}
    </Text>

    {isError ? (
      <Text style={[styles.errorText, { color: colors.negative }]}>전체 코인 목록을 불러오지 못했습니다. 잠시 후 다시 시도하세요.</Text>
    ) : searchResults.length === 0 && !isLoading ? (
      <View style={[styles.noResults, { backgroundColor: colors.card }]}>
        <Ionicons name="search-outline" size={22} color={colors.mutedForeground} />
        <Text style={[styles.noResultsText, { color: colors.mutedForeground }]}>일치하는 코인이 없습니다.</Text>
      </View>
    ) : (
      <View style={styles.addList}>
        {searchResults.map((asset) => (
          <View key={asset.symbol} testID={`watchlist-add-${asset.symbol}`} style={[styles.addRow, { borderBottomColor: colors.border }]}>
            <View style={styles.asset}>
              <View style={[styles.assetDot, { backgroundColor: asset.accent }]} />
              <View>
                <Text style={[styles.symbol, { color: colors.foreground }]}>{asset.symbol}</Text>
                <Text numberOfLines={1} style={[styles.name, styles.resultName, { color: colors.mutedForeground }]}>{asset.name}</Text>
              </View>
            </View>
            <Text style={[styles.resultPrice, { color: colors.mutedForeground }]}>{formatPrice(asset.price)}</Text>
            <WatchlistToggle symbol={asset.symbol} />
          </View>
        ))}
      </View>
    )}
  </>;
}

function SegmentButton({ label, active, onPress, count }: { label: string; active: boolean; onPress: () => void; count?: number }) {
  const colors = useColors();
  return (
    <Pressable testID={`market-view-${label}`} onPress={onPress} style={[styles.segmentButton, active && { backgroundColor: colors.primary }]}>
      <Text style={[styles.segmentText, { color: active ? colors.primaryForeground : colors.mutedForeground }]}>{label}{typeof count === 'number' && count > 0 ? ` (${count})` : ''}</Text>
    </Pressable>
  );
}

function Stat({ label, value }: { label: string; value: string }) { const colors = useColors(); return <View style={[styles.stat, { backgroundColor: colors.card }]}><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text><Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text></View>; }

const styles = StyleSheet.create({
  segment: { flexDirection: 'row', borderRadius: 14, padding: 4, gap: 4, marginBottom: 16, boxShadow: '0px 4px 12px rgba(0,0,0,0.24)' },
  segmentButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 11 },
  segmentText: { fontFamily: 'Inter_700Bold', fontSize: 12.5 },
  stats: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  stat: { flex: 1, padding: 14, borderRadius: 16, boxShadow: '0px 4px 12px rgba(0,0,0,0.24)' },
  statLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.8 },
  statValue: { fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 8, fontVariant: ['tabular-nums'] },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 14, paddingHorizontal: 13, paddingVertical: 12, marginBottom: 4, boxShadow: '0px 4px 12px rgba(0,0,0,0.24)' },
  searchInput: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13 },
  emptyHint: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 18, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  gridItem: { width: '48%' },
  intro: { fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 19, maxWidth: 320, marginBottom: 4 },
  list: { gap: 9 },
  row: { minHeight: 76, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', boxShadow: '0px 6px 16px rgba(0,0,0,0.24)' },
  asset: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 },
  assetDot: { width: 9, height: 9, borderRadius: 5 },
  symbol: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  name: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 3 },
  resultName: { maxWidth: 130 },
  priceBlock: { alignItems: 'flex-end', marginRight: 11 },
  price: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  change: { fontFamily: 'Inter_700Bold', fontSize: 11, marginTop: 4 },
  empty: { minHeight: 190, borderRadius: 20, alignItems: 'center', justifyContent: 'center', padding: 28, boxShadow: '0px 6px 16px rgba(0,0,0,0.24)' },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 14 },
  emptyText: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 7 },
  helper: { fontFamily: 'Inter_500Medium', fontSize: 11, lineHeight: 17, marginTop: 9 },
  errorText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, lineHeight: 18, marginTop: 15 },
  addList: { marginTop: 10 },
  addRow: { minHeight: 61, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 9 },
  resultPrice: { fontFamily: 'Inter_500Medium', fontSize: 10, marginRight: 10 },
  noResults: { minHeight: 92, borderRadius: 18, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, boxShadow: '0px 4px 12px rgba(0,0,0,0.24)' },
  noResultsText: { fontFamily: 'Inter_500Medium', fontSize: 12 },
});
