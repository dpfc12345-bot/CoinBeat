import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Screen } from '@/src/components/Screen';
import { ImpactWidget, MarketCard, NewsRow, ScreenHeader, SectionHeading, SentimentCard } from '@/src/components/MarketPulseUI';
import { getGetMarketOverviewQueryKey, useGetMarketOverview, useGetNews } from '@workspace/api-client-react';
import { MARKET_REFRESH_INTERVAL_MS } from '@/src/config/api';

export default function HomeScreen() {
  const colors = useColors();
  const marketQuery = useGetMarketOverview({ request: { cache: 'no-store' }, query: { queryKey: getGetMarketOverviewQueryKey(), refetchInterval: MARKET_REFRESH_INTERVAL_MS, staleTime: MARKET_REFRESH_INTERVAL_MS - 2_000 } });
  const newsQuery = useGetNews();
  const snapshot = marketQuery.data;
  const news = newsQuery.data ?? [];
  const leadNews = news[0];
  return <Screen>
    <ScreenHeader eyebrow="UPBIT · 블록미디어" title="CoinBeat" onPress={() => router.push('/settings')} />
    <View style={styles.utilityRow}>
      <View style={[styles.status, { backgroundColor: colors.card }]}>
        <View style={styles.pulseDotWrap}><View style={[styles.statusDot, { backgroundColor: colors.positive }]} /></View>
        <Text style={[styles.statusText, { color: colors.mutedForeground }]}>Upbit 실시간 · 15초마다 갱신</Text>
      </View>
      <Pressable testID="widget-launcher" onPress={() => router.push('/widgets')} style={({ pressed }) => [styles.widgetButton, { backgroundColor: colors.card, opacity: pressed ? 0.72 : 1 }]}>
        <Ionicons name="grid-outline" size={14} color={colors.primary} />
        <Text style={[styles.widgetButtonText, { color: colors.foreground }]}>위젯</Text>
      </Pressable>
    </View>
    {leadNews ? <Pressable testID="home-lead-news" onPress={() => router.push(`/news/${leadNews.id}`)} style={({ pressed }) => [styles.hero, { backgroundColor: colors.cardElevated, opacity: pressed ? 0.9 : 1 }]}>
      <View style={[styles.heroGlow, { backgroundColor: colors.primary }]} />
      <View style={styles.heroMeta}>
        <View style={[styles.heroBadge, { backgroundColor: 'rgba(76,141,255,0.16)' }]}>
          <View style={[styles.heroDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.heroKicker, { color: colors.primary }]}>지금 읽을 뉴스</Text>
        </View>
        <Text style={[styles.heroTime, { color: colors.mutedForeground }]}>{leadNews.relativeTime}</Text>
      </View>
      <Text style={[styles.heroTitle, { color: colors.foreground }]}>{leadNews.title}</Text>
      <View style={styles.heroFooter}>
        <Text style={[styles.heroSource, { color: colors.mutedForeground }]}>{leadNews.source} · {leadNews.relatedSymbols.join(' · ')}</Text>
        <View style={[styles.heroArrow, { backgroundColor: colors.primary }]}><Ionicons name="arrow-forward" size={14} color={colors.primaryForeground} /></View>
      </View>
    </Pressable> : <View style={[styles.hero, { backgroundColor: colors.cardElevated }]}><Text style={[styles.heroTitle, { color: colors.mutedForeground }]}>{newsQuery.isError ? '뉴스 연결을 확인하세요.' : '최신 뉴스를 불러오는 중…'}</Text></View>}
    <SectionHeading label="주요 뉴스" action="전체 보기" onAction={() => router.push('/news')} />
    {news.slice(1, 3).map((item) => <NewsRow key={item.id} item={item} />)}
    <SectionHeading label="시장 한눈에 보기" action="시장" onAction={() => router.push('/markets')} />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={styles.marketRow}>
      {(snapshot?.assets ?? []).slice(0, 4).map((asset) => <MarketCard key={asset.symbol} asset={asset} />)}
    </ScrollView>
    <SectionHeading label="뉴스 영향도" />
    {leadNews && <ImpactWidget item={leadNews} />}
    <SectionHeading label="시장 심리" />
    {snapshot && <SentimentCard score={snapshot.sentiment.score} label={snapshot.sentiment.label} change={snapshot.sentiment.change} />}
    <View style={[styles.marketTape, { borderTopColor: colors.border }]}>
      <Text style={[styles.tapeLabel, { color: colors.mutedForeground }]}>시장 요약</Text>
      <Text style={[styles.tapeValue, { color: colors.foreground }]}>거래량 {snapshot?.totalVolume ?? '불러오는 중'}</Text>
    </View>
  </Screen>;
}

const styles = StyleSheet.create({
  utilityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  status: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 11, paddingVertical: 8, borderRadius: 999, boxShadow: '0px 4px 10px rgba(0,0,0,0.28)' },
  pulseDotWrap: { width: 6, height: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: 'Inter_600SemiBold', fontSize: 10.5, letterSpacing: 0.2 },
  widgetButton: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, paddingHorizontal: 13, paddingVertical: 9, boxShadow: '0px 4px 10px rgba(0,0,0,0.28)' },
  widgetButtonText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  hero: { borderRadius: 24, padding: 20, marginBottom: 2, overflow: 'hidden', boxShadow: '0px 10px 28px rgba(0,0,0,0.35)' },
  heroGlow: { position: 'absolute', top: -60, right: -40, width: 160, height: 160, borderRadius: 80, opacity: 0.14 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  heroDot: { width: 6, height: 6, borderRadius: 999 },
  heroKicker: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.6 },
  heroTime: { fontFamily: 'Inter_500Medium', fontSize: 10, marginLeft: 'auto' },
  heroTitle: { fontFamily: 'Inter_700Bold', fontSize: 22, lineHeight: 30, letterSpacing: -0.8, marginTop: 15 },
  heroFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 },
  heroSource: { fontFamily: 'Inter_500Medium', fontSize: 11, flex: 1, paddingRight: 12 },
  heroArrow: { width: 30, height: 30, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  horizontalScroll: { marginRight: -18 },
  marketRow: { paddingRight: 18 },
  marketTape: { marginTop: 28, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', flexWrap: 'wrap', gap: 14, alignItems: 'center' },
  tapeLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.3 },
  tapeValue: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
});
