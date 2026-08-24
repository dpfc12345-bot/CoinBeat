import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Screen } from '@/src/components/Screen';
import { NewsRow, ScreenHeader } from '@/src/components/MarketPulseUI';
import { mockNews } from '@/src/data/mockData';
import { NewsCategory } from '@/src/models';

const filters: Array<'ALL' | NewsCategory> = ['ALL', 'MARKET', 'ETF', 'MACRO', 'DEFI', 'ALTCOIN'];
export default function NewsScreen() { const colors = useColors(); const [filter, setFilter] = useState<'ALL' | NewsCategory>('ALL'); const filtered = filter === 'ALL' ? mockNews : mockNews.filter((item) => item.categories.includes(filter)); return <Screen><ScreenHeader eyebrow="THE DAILY SIGNAL" title="News" onPress={() => router.push('/settings')} /><Text style={[styles.intro, { color: colors.mutedForeground }]}>The headlines moving the market, ranked by urgency and price reaction.</Text><View style={styles.filters}>{filters.map((item) => <Pressable key={item} testID={`news-filter-${item}`} onPress={() => setFilter(item)} style={[styles.filter, { backgroundColor: filter === item ? colors.primary : colors.card, borderColor: filter === item ? colors.primary : colors.border }]}><Text style={[styles.filterText, { color: filter === item ? colors.primaryForeground : colors.mutedForeground }]}>{item}</Text></Pressable>)}</View>{filtered.map((item) => <NewsRow key={item.id} item={item} />)}</Screen>; }
const styles = StyleSheet.create({ intro: { fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 19, maxWidth: 330, marginBottom: 18 }, filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 18 }, filter: { borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 7 }, filterText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.5 } });