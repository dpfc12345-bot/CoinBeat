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
    <ScreenHeader eyebrow="LIVE MARKET INTELLIGENCE" title="Market Pulse" onPress={() => router.push('/settings')} />
    <View style={[styles.status, { backgroundColor: colors.muted, borderColor: colors.border }]}>
      <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
      <Text style={[styles.statusText, { color: colors.mutedForeground }]}>MOCK LIVE · REFRESH 8S</Text>
    </View>
    <View style={styles.overviewIntro}>
      <Text style={[styles.overviewTitle, { color: colors.foreground }]}>Market overview</Text>
      <Text style={[styles.updatedText, { color: colors.mutedForeground }]}>A real-time read of price, volume, and sentiment.</Text>
    </View>
    <View style={styles.horizontalScroll}><View style={styles.marketRow}>{snapshot.assets.slice(0, 4).map((asset) => <MarketCard key={asset.symbol} asset={asset} />)}</View></View>
    <SectionHeading label="Market sentiment" />
    <SentimentCard score={snapshot.sentiment.score} label={snapshot.sentiment.label} change={snapshot.sentiment.change} />
    <SectionHeading label="Breaking news" action="View all" onAction={() => router.push('/news')} />
    <NewsRow item={mockNews[0]} featured />
    <SectionHeading label="News impact" />
    <ImpactWidget item={mockNews[0]} />
    <SectionHeading label="Top movers" action="Markets" onAction={() => router.push('/markets')} />
    <TopMovers assets={snapshot.assets} />
    <View style={[styles.marketTape, { borderTopColor: colors.border }]}>
      <Text style={[styles.tapeLabel, { color: colors.mutedForeground }]}>MARKET TAPE</Text>
      <Text style={[styles.tapeValue, { color: colors.foreground }]}>MCAP {snapshot.totalMarketCap}</Text>
      <Text style={[styles.tapeValue, { color: colors.foreground }]}>VOL {snapshot.totalVolume}</Text>
      <Text style={[styles.tapeValue, { color: colors.primary }]}>BTC.D {snapshot.btcDominance}</Text>
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
