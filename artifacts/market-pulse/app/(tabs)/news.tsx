import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Screen } from '@/src/components/Screen';
import { formatCategory, NewsRow, ScreenHeader } from '@/src/components/MarketPulseUI';
import { NewsCategory } from '@/src/models';
import { useGetNews } from '@workspace/api-client-react';

const filters: Array<'ALL' | NewsCategory> = ['ALL', 'MARKET', 'ETF', 'MACRO', 'DEFI', 'ALTCOIN'];
export default function NewsScreen() { const colors = useColors(); const [filter, setFilter] = useState<'ALL' | NewsCategory>('ALL'); const newsQuery = useGetNews(); const news = newsQuery.data ?? []; const filtered = filter === 'ALL' ? news : news.filter((item) => item.categories.includes(filter)); return <Screen><ScreenHeader eyebrow="블록미디어 RSS" title="뉴스" onPress={() => router.push('/settings')} /><Text style={[styles.intro, { color: colors.mutedForeground }]}>블록미디어가 공개한 최신 암호화폐 헤드라인을 빠르게 확인하세요.</Text><View style={styles.filters}>{filters.map((item) => <Pressable key={item} testID={`news-filter-${item}`} onPress={() => setFilter(item)} style={[styles.filter, { backgroundColor: filter === item ? colors.primary : colors.card, borderColor: filter === item ? colors.primary : colors.border }]}><Text style={[styles.filterText, { color: filter === item ? colors.primaryForeground : colors.mutedForeground }]}>{item === 'ALL' ? '전체' : formatCategory(item)}</Text></Pressable>)}</View>{newsQuery.isError && <Text style={{ color: colors.negative, marginBottom: 16 }}>뉴스 RSS 연결을 확인하세요.</Text>}{filtered.map((item) => <NewsRow key={item.id} item={item} />)}</Screen>; }
const styles = StyleSheet.create({ intro: { fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 19, maxWidth: 330, marginBottom: 18 }, filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 18 }, filter: { borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 7 }, filterText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.5 } });