import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Screen } from '@/src/components/Screen';
import { ImpactWidget, MarketCard, NewsRow, ScreenHeader, SectionHeading, SentimentCard, TopMovers } from '@/src/components/MarketPulseUI';
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
    <ScreenHeader eyebrow="실시간 뉴스 인텔리전스" title="Market Pulse" onPress={() => router.push('/settings')} />
    <View style={[styles.status, { backgroundColor: colors.muted, borderColor: colors.border }]}>
      <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
      <Text style={[styles.statusText, { color: colors.mutedForeground }]}>목업 라이브 · 8초마다 갱신</Text>
    </View>
    <View style={styles.overviewIntro}>
      <Text style={[styles.overviewTitle, { color: colors.foreground }]}>시장 개요</Text>
      <Text style={[styles.updatedText, { color: colors.mutedForeground }]}>가격보다 뉴스와 시장 흐름을 빠르게 읽습니다.</Text>
    </View>
    <View style={styles.horizontalScroll}><View style={styles.marketRow}>{snapshot.assets.slice(0, 4).map((asset) => <MarketCard key={asset.symbol} asset={asset} />)}</View></View>
    <SectionHeading label="시장 심리" />
    <SentimentCard score={snapshot.sentiment.score} label={snapshot.sentiment.label} change={snapshot.sentiment.change} />
    <SectionHeading label="속보 뉴스" action="전체 보기" onAction={() => router.push('/news')} />
    <NewsRow item={mockNews[0]} featured />
    <SectionHeading label="뉴스 영향도" />
    <ImpactWidget item={mockNews[0]} />
    <SectionHeading label="주요 변동" action="시장" onAction={() => router.push('/markets')} />
    <TopMovers assets={snapshot.assets} />
    <View style={[styles.marketTape, { borderTopColor: colors.border }]}>
      <Text style={[styles.tapeLabel, { color: colors.mutedForeground }]}>시장 요약</Text>
      <Text style={[styles.tapeValue, { color: colors.foreground }]}>시총 {snapshot.totalMarketCap}</Text>
      <Text style={[styles.tapeValue, { color: colors.foreground }]}>거래량 {snapshot.totalVolume}</Text>
      <Text style={[styles.tapeValue, { color: colors.primary }]}>BTC 비중 {snapshot.btcDominance}</Text>
    </View>
  </Screen>;
}

const styles = StyleSheet.create({
  status: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 4, borderWidth: 1, marginBottom: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.1 },
  overviewIntro: { marginBottom: 12 },
  overviewTitle: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  updatedText: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 4 },
  horizontalScroll: { marginRight: -18, overflow: 'hidden' },
  marketRow: { flexDirection: 'row', paddingRight: 18 },
  marketTape: { marginTop: 26, paddingTop: 14, borderTopWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 14, alignItems: 'center' },
  tapeLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.3 },
  tapeValue: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
});
