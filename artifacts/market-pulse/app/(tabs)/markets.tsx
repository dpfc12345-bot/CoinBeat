import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Screen } from '@/src/components/Screen';
import { MarketCard, ScreenHeader, SectionHeading, TopMovers } from '@/src/components/MarketPulseUI';
import { getMockSnapshot } from '@/src/data/mockData';
import { MarketSnapshot } from '@/src/models';
export default function MarketsScreen() { const [snapshot, setSnapshot] = useState<MarketSnapshot>(() => getMockSnapshot()); useEffect(() => { const id = setInterval(() => setSnapshot(getMockSnapshot(Date.now() / 8000)), 8000); return () => clearInterval(id); }, []); return <Screen><ScreenHeader eyebrow="시장 데이터" title="시장" onPress={() => router.push('/settings')} /><View style={styles.stats}><Stat label="전체 시가총액" value={snapshot.totalMarketCap} /><Stat label="24시간 거래량" value={snapshot.totalVolume} /><Stat label="BTC 비중" value={snapshot.btcDominance} /></View><SectionHeading label="주요 자산" /><View style={styles.grid}>{snapshot.assets.map((asset) => <View key={asset.symbol} style={styles.gridItem}><MarketCard asset={asset} compact /></View>)}</View><SectionHeading label="주요 변동" /><TopMovers assets={snapshot.assets} /></Screen>; }
function Stat({ label, value }: { label: string; value: string }) { const colors = useColors(); return <View style={[styles.stat, { backgroundColor: colors.card }]}><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text><Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text></View>; }
const styles = StyleSheet.create({ stats: { flexDirection: 'row', gap: 8, marginBottom: 4 }, stat: { flex: 1, padding: 10, borderRadius: 7 }, statLabel: { fontFamily: 'Inter_700Bold', fontSize: 8, letterSpacing: 0.8 }, statValue: { fontFamily: 'Inter_700Bold', fontSize: 15, marginTop: 7 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, gridItem: { width: '48%' } });