import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Screen } from '@/src/components/Screen';
import { MarketCard, ScreenHeader, SectionHeading, TopMovers } from '@/src/components/MarketPulseUI';
import { getGetMarketOverviewQueryKey, useGetMarketOverview } from '@workspace/api-client-react';
import { MARKET_REFRESH_INTERVAL_MS } from '@/src/config/api';

export default function MarketsScreen() {
  const colors = useColors();
  const [query, setQuery] = useState('');
  const marketQuery = useGetMarketOverview({ request: { cache: 'no-store' }, query: { queryKey: getGetMarketOverviewQueryKey(), refetchInterval: MARKET_REFRESH_INTERVAL_MS, staleTime: MARKET_REFRESH_INTERVAL_MS - 2_000 } });
  const snapshot = marketQuery.data;
  const normalizedQuery = query.trim().toLowerCase();
  const assets = snapshot?.assets ?? [];
  const filteredAssets = normalizedQuery
    ? assets.filter((asset) => asset.symbol.toLowerCase().includes(normalizedQuery) || asset.name.toLowerCase().includes(normalizedQuery))
    : assets;

  return <Screen>
    <ScreenHeader eyebrow="UPBIT KRW 실시간" title="시장" onPress={() => router.push('/settings')} />
    <View style={styles.stats}><Stat label="24시간 거래량" value={snapshot?.totalVolume ?? '불러오는 중'} /></View>
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
      {marketQuery.isError && <Text style={{ color: colors.negative }}>실시간 시세를 불러오지 못했습니다.</Text>}
      <SectionHeading label="주요 변동" />
      <TopMovers assets={assets} />
    </>}
  </Screen>;
}
function Stat({ label, value }: { label: string; value: string }) { const colors = useColors(); return <View style={[styles.stat, { backgroundColor: colors.card }]}><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text><Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text></View>; }
const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  stat: { flex: 1, padding: 14, borderRadius: 16, boxShadow: '0px 4px 12px rgba(0,0,0,0.24)' },
  statLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.8 },
  statValue: { fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 8, fontVariant: ['tabular-nums'] },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 14, paddingHorizontal: 13, paddingVertical: 12, marginBottom: 4, boxShadow: '0px 4px 12px rgba(0,0,0,0.24)' },
  searchInput: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13 },
  emptyHint: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 18, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  gridItem: { width: '48%' },
});