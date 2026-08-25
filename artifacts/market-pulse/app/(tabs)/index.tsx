import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Screen } from '@/src/components/Screen';
import { ImpactWidget, MarketCard, NewsRow, ScreenHeader, SectionHeading, SentimentCard } from '@/src/components/MarketPulseUI';
import { getMockSnapshot, mockNews } from '@/src/data/mockData';
import { MarketSnapshot } from '@/src/models';

export default function HomeScreen() {
  const colors = useColors();
  const [tick, setTick] = useState(0);
  const [snapshot, setSnapshot] = useState<MarketSnapshot>(() => getMockSnapshot());
  useEffect(() => {
    const id = setInterval(() => setTick((value) => value + 1), 8000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    setSnapshot(getMockSnapshot(tick));
  }, [tick]);
  return <Screen>
    <ScreenHeader eyebrow="COINNESS MARKET BRIEFING" title="Market Pulse" onPress={() => router.push('/settings')} />
    <View style={styles.utilityRow}>
      <View style={[styles.status, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <View style={[styles.statusDot, { backgroundColor: colors.positive }]} />
        <Text style={[styles.statusText, { color: colors.mutedForeground }]}>라이브 · 8초마다 갱신</Text>
      </View>
      <Pressable testID="widget-launcher" onPress={() => router.push('/widgets')} style={({ pressed }) => [styles.widgetButton, { borderColor: colors.border, backgroundColor: colors.secondary, opacity: pressed ? 0.72 : 1 }]}>
        <Ionicons name="grid-outline" size={14} color={colors.primary} />
        <Text style={[styles.widgetButtonText, { color: colors.foreground }]}>위젯</Text>
      </Pressable>
    </View>
    <Pressable testID="home-lead-news" onPress={() => router.push(`/news/${mockNews[0].id}`)} style={({ pressed }) => [styles.hero, { borderColor: colors.border, backgroundColor: colors.card, opacity: pressed ? 0.78 : 1 }]}>
      <View style={styles.heroMeta}>
        <View style={[styles.heroDot, { backgroundColor: colors.primary }]} />
        <Text style={[styles.heroKicker, { color: colors.primary }]}>지금 읽을 뉴스</Text>
        <Text style={[styles.heroTime, { color: colors.mutedForeground }]}>{mockNews[0].relativeTime}</Text>
      </View>
      <Text style={[styles.heroTitle, { color: colors.foreground }]}>{mockNews[0].title}</Text>
      <View style={styles.heroFooter}>
        <Text style={[styles.heroSource, { color: colors.mutedForeground }]}>{mockNews[0].source} · {mockNews[0].relatedSymbols.join(' · ')}</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.primary} />
      </View>
    </Pressable>
    <SectionHeading label="주요 뉴스" action="전체 보기" onAction={() => router.push('/news')} />
    {mockNews.slice(1, 3).map((item) => <NewsRow key={item.id} item={item} />)}
    <SectionHeading label="시장 한눈에 보기" action="시장" onAction={() => router.push('/markets')} />
    <View style={styles.horizontalScroll}>
      <View style={styles.marketRow}>{snapshot.assets.slice(0, 2).map((asset) => <MarketCard key={asset.symbol} asset={asset} />)}</View>
    </View>
    <SectionHeading label="뉴스 영향도" />
    <ImpactWidget item={mockNews[0]} />
    <SectionHeading label="시장 심리" />
    <SentimentCard score={snapshot.sentiment.score} label={snapshot.sentiment.label} change={snapshot.sentiment.change} />
    <View style={[styles.marketTape, { borderTopColor: colors.border }]}>
      <Text style={[styles.tapeLabel, { color: colors.mutedForeground }]}>시장 요약</Text>
      <Text style={[styles.tapeValue, { color: colors.foreground }]}>시총 {snapshot.totalMarketCap}</Text>
      <Text style={[styles.tapeValue, { color: colors.foreground }]}>거래량 {snapshot.totalVolume}</Text>
      <Text style={[styles.tapeValue, { color: colors.primary }]}>BTC 비중 {snapshot.btcDominance}</Text>
    </View>
  </Screen>;
}

const styles = StyleSheet.create({
  utilityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  status: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.7 },
  widgetButton: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  widgetButtonText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  hero: { borderWidth: 1, borderRadius: 20, padding: 18, marginBottom: 2 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  heroDot: { width: 7, height: 7, borderRadius: 999 },
  heroKicker: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.8 },
  heroTime: { fontFamily: 'Inter_500Medium', fontSize: 10, marginLeft: 'auto' },
  heroTitle: { fontFamily: 'Inter_700Bold', fontSize: 22, lineHeight: 30, letterSpacing: -0.8, marginTop: 14 },
  heroFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  heroSource: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  horizontalScroll: { marginRight: -18, overflow: 'hidden' },
  marketRow: { flexDirection: 'row', paddingRight: 18 },
  marketTape: { marginTop: 26, paddingTop: 14, borderTopWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 14, alignItems: 'center' },
  tapeLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.3 },
  tapeValue: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
});
