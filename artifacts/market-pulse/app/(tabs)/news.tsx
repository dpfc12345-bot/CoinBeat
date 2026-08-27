import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Screen } from '@/src/components/Screen';
import { formatCategory, NewsRow, ScreenHeader } from '@/src/components/MarketPulseUI';
import { NewsCategory } from '@/src/models';
import { useWatchlist } from '@/src/context/WatchlistContext';
import { useGetNews } from '@workspace/api-client-react';

const filters: Array<'ALL' | 'WATCHLIST' | NewsCategory> = ['ALL', 'WATCHLIST', 'MARKET', 'ETF', 'MACRO', 'DEFI', 'ALTCOIN'];
const filterLabel = (item: 'ALL' | 'WATCHLIST' | NewsCategory) => item === 'ALL' ? '전체' : item === 'WATCHLIST' ? '관심 코인' : formatCategory(item);

export default function NewsScreen() {
  const colors = useColors();
  const [filter, setFilter] = useState<'ALL' | 'WATCHLIST' | NewsCategory>('ALL');
  const [query, setQuery] = useState('');
  const newsQuery = useGetNews();
  const { symbols: watchlistSymbols } = useWatchlist();
  const news = newsQuery.data ?? [];

  const categoryFiltered = filter === 'ALL'
    ? news
    : filter === 'WATCHLIST'
      ? news.filter((item) => item.relatedSymbols.some((symbol) => watchlistSymbols.includes(symbol)))
      : news.filter((item) => item.categories.includes(filter));
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? categoryFiltered.filter((item) => item.title.toLowerCase().includes(normalizedQuery) || item.content.toLowerCase().includes(normalizedQuery))
    : categoryFiltered;

  return <Screen>
    <ScreenHeader eyebrow="블록미디어 RSS" title="뉴스" onPress={() => router.push('/settings')} />
    <Text style={[styles.intro, { color: colors.mutedForeground }]}>블록미디어가 공개한 최신 암호화폐 헤드라인을 빠르게 확인하세요.</Text>
    <View style={[styles.searchBox, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <Ionicons name="search" size={15} color={colors.mutedForeground} />
      <TextInput testID="news-search" value={query} onChangeText={setQuery} placeholder="뉴스 검색" placeholderTextColor={colors.mutedForeground} style={[styles.searchInput, { color: colors.foreground }]} />
      {query.length > 0 && <Pressable testID="news-search-clear" onPress={() => setQuery('')}><Ionicons name="close-circle" size={16} color={colors.mutedForeground} /></Pressable>}
    </View>
    <View style={styles.filters}>{filters.map((item) => <Pressable key={item} testID={`news-filter-${item}`} onPress={() => setFilter(item)} style={[styles.filter, { backgroundColor: filter === item ? colors.primary : colors.card, borderColor: filter === item ? colors.primary : colors.border }]}><Text style={[styles.filterText, { color: filter === item ? colors.primaryForeground : colors.mutedForeground }]}>{filterLabel(item)}</Text></Pressable>)}</View>
    {newsQuery.isError && <Text style={{ color: colors.negative, marginBottom: 16 }}>뉴스 RSS 연결을 확인하세요.</Text>}
    {filter === 'WATCHLIST' && watchlistSymbols.length === 0 && <Text style={[styles.emptyHint, { color: colors.mutedForeground }]}>관심목록에 코인을 추가하면 관련 뉴스만 모아볼 수 있어요.</Text>}
    {filtered.length === 0 && !newsQuery.isError && normalizedQuery.length > 0 && <Text style={[styles.emptyHint, { color: colors.mutedForeground }]}>“{query}”에 대한 검색 결과가 없어요.</Text>}
    {filtered.map((item) => <NewsRow key={item.id} item={item} />)}
  </Screen>;
}
const styles = StyleSheet.create({
  intro: { fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 19, maxWidth: 330, marginBottom: 18 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 14 },
  searchInput: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 18 },
  filter: { borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 7 },
  filterText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.5 },
  emptyHint: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 18, marginBottom: 16 },
});