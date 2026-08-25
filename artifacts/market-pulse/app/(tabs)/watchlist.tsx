import React, { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Screen } from '@/src/components/Screen';
import { ScreenHeader, SectionHeading, WatchlistToggle, formatPercent, formatPrice } from '@/src/components/MarketPulseUI';
import { useWatchlist } from '@/src/context/WatchlistContext';
import { MARKET_REFRESH_INTERVAL_MS } from '@/src/config/api';
import { getGetMarketOverviewQueryKey, useGetMarketOverview } from '@workspace/api-client-react';

export default function WatchlistScreen() {
  const colors = useColors();
  const [searchTerm, setSearchTerm] = useState('');
  const { symbols, isLoading } = useWatchlist();
  const marketQuery = useGetMarketOverview({
    request: { cache: 'no-store' },
    query: {
      queryKey: getGetMarketOverviewQueryKey(),
      refetchInterval: MARKET_REFRESH_INTERVAL_MS,
      staleTime: MARKET_REFRESH_INTERVAL_MS - 2_000,
    },
  });
  const allAssets = marketQuery.data?.assets ?? [];
  const assets = allAssets.filter((asset) => symbols.includes(asset.symbol));
  const searchResults = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    const matchingAssets = normalizedTerm
      ? allAssets.filter((asset) => `${asset.symbol} ${asset.name}`.toLowerCase().includes(normalizedTerm))
      : allAssets;
    return matchingAssets.slice(0, 18);
  }, [allAssets, searchTerm]);

  return (
    <Screen>
      <ScreenHeader eyebrow="관심 뉴스와 자산" title="관심목록" onPress={() => router.push('/settings')} />
      <Text style={[styles.intro, { color: colors.mutedForeground }]}>관심 있는 코인과 관련 뉴스를 한눈에 확인하세요.</Text>

      <SectionHeading label="내 관심목록" action={`${assets.length}개`} />
      {isLoading || marketQuery.isLoading ? (
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>관심목록을 불러오는 중…</Text>
      ) : assets.length === 0 ? (
        <View style={[styles.empty, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Ionicons name="star-outline" size={28} color={colors.primary} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{marketQuery.isError ? '실시간 시세를 불러오지 못했습니다' : '관심목록이 비어 있습니다'}</Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{marketQuery.isError ? 'API 연결을 확인한 뒤 다시 시도하세요.' : '아래 검색창에서 코인을 추가해보세요.'}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {assets.map((asset) => (
            <Pressable
              key={asset.symbol}
              testID={`watchlist-row-${asset.symbol}`}
              onPress={() => router.push(`/coin/${asset.symbol}`)}
              style={[styles.row, { borderColor: colors.border, backgroundColor: colors.card }]}
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
      <View style={[styles.searchBox, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Ionicons name="search" size={17} color={colors.mutedForeground} />
        <TextInput
          testID="watchlist-search"
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="코인 이름 또는 심볼 검색"
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="characters"
          style={[styles.searchInput, { color: colors.foreground }]}
          returnKeyType="search"
        />
        {searchTerm.length > 0 && (
          <Pressable testID="watchlist-search-clear" onPress={() => setSearchTerm('')} hitSlop={8}>
            <Ionicons name="close-circle" size={17} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>
      <Text style={[styles.helper, { color: colors.mutedForeground }]}>
        {searchTerm.trim() ? '검색 결과에서 별표를 눌러 추가하세요.' : '거래량 상위 코인입니다. 원하는 코인을 검색할 수도 있어요.'}
      </Text>

      {marketQuery.isError ? (
        <Text style={[styles.errorText, { color: colors.negative }]}>전체 코인 목록을 불러오지 못했습니다. 잠시 후 다시 시도하세요.</Text>
      ) : searchResults.length === 0 && !marketQuery.isLoading ? (
        <View style={[styles.noResults, { borderColor: colors.border, backgroundColor: colors.card }]}>
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 19, maxWidth: 320 },
  list: { gap: 9 },
  row: { minHeight: 76, borderWidth: 1, borderRadius: 9, padding: 14, flexDirection: 'row', alignItems: 'center' },
  asset: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 },
  assetDot: { width: 9, height: 9, borderRadius: 5 },
  symbol: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  name: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 3 },
  resultName: { maxWidth: 130 },
  priceBlock: { alignItems: 'flex-end', marginRight: 11 },
  price: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  change: { fontFamily: 'Inter_700Bold', fontSize: 11, marginTop: 4 },
  empty: { minHeight: 190, borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center', padding: 28 },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 14 },
  emptyText: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 7 },
  searchBox: { minHeight: 48, borderWidth: 1, borderRadius: 13, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, gap: 9 },
  searchInput: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13, paddingVertical: 11 },
  helper: { fontFamily: 'Inter_500Medium', fontSize: 11, lineHeight: 17, marginTop: 9 },
  errorText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, lineHeight: 18, marginTop: 15 },
  addList: { marginTop: 10 },
  addRow: { minHeight: 61, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 9 },
  resultPrice: { fontFamily: 'Inter_500Medium', fontSize: 10, marginRight: 10 },
  noResults: { minHeight: 92, borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 },
  noResultsText: { fontFamily: 'Inter_500Medium', fontSize: 12 },
});