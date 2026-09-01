import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Polyline, Stop } from 'react-native-svg';
import { useColors } from '@/hooks/useColors';
import { MarketAsset, NewsItem } from '@/src/models';
import { useWatchlist } from '@/src/context/WatchlistContext';
import { getTermOfTheDay } from '@/src/data/cryptoTerms';

export const formatPrice = (value: number) => `₩${Math.round(value).toLocaleString('ko-KR')}`;
export const formatPercent = (value: number) => (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
export const formatCategory = (category: string) => ({ MARKET: '시장', ETF: 'ETF', MACRO: '거시경제', DEFI: '디파이', ALTCOIN: '알트코인', EXCHANGE: '거래소', LISTING: '상장' }[category] ?? category);

const shadow = (color: string, opacity: number, radius: number, y: number) => ({ boxShadow: `0px ${y}px ${radius}px rgba(0,0,0,${opacity})`, elevation: Math.round(radius / 3) } as const);

/** Rising-bars + pulse mark shared by the header logo, app icon, and empty/loading states — CoinBeat's signature symbol. */
export function PulseMark({ color, accentColor, width = 22, height = 22 }: { color: string; accentColor?: string; width?: number; height?: number }) {
  const wave = accentColor ?? color;
  return (
    <Svg width={width} height={height} viewBox="0 0 34 32">
      <Defs>
        <LinearGradient id="pulseMarkBars" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor={color} stopOpacity={0.75} />
          <Stop offset="1" stopColor={color} />
        </LinearGradient>
      </Defs>
      <Path d="M3 24a2.5 2.5 0 0 1 2.5-2.5 2.5 2.5 0 0 1 2.5 2.5v3.5a2.5 2.5 0 0 1-2.5 2.5A2.5 2.5 0 0 1 3 27.5z" fill="url(#pulseMarkBars)" />
      <Path d="M11 17a2.5 2.5 0 0 1 2.5-2.5 2.5 2.5 0 0 1 2.5 2.5v10.5a2.5 2.5 0 0 1-2.5 2.5A2.5 2.5 0 0 1 11 27.5z" fill="url(#pulseMarkBars)" />
      <Path d="M19 10a2.5 2.5 0 0 1 2.5-2.5A2.5 2.5 0 0 1 24 10v17.5a2.5 2.5 0 0 1-2.5 2.5A2.5 2.5 0 0 1 19 27.5z" fill="url(#pulseMarkBars)" />
      <Path d="M18 15L22 7L26 21L30 11" fill="none" stroke={wave} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ScreenHeader({ eyebrow, title, onPress }: { eyebrow: string; title: string; onPress?: () => void }) {
  const colors = useColors();
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={[styles.brandMark, { backgroundColor: colors.secondary }]}><PulseMark color={colors.primary} accentColor={colors.accent} width={22} height={22} /></View>
        <View>
          <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>{eyebrow}</Text>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{title}</Text>
        </View>
      </View>
      {onPress && <Pressable testID="header-action" onPress={onPress} style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.card, opacity: pressed ? 0.7 : 1 }, shadow(colors.background, 0.3, 10, 4)]}><Ionicons name="notifications-outline" size={19} color={colors.foreground} /></Pressable>}
    </View>
  );
}

export function Sparkline({ points, color, width = 96, height = 40, strokeWidth = 2, fill = false }: { points: number[]; color: string; width?: number; height?: number; strokeWidth?: number; fill?: boolean }) {
  const min = Math.min(...points); const max = Math.max(...points); const range = max - min || 1;
  const coords = points.map((point, index) => [((index / (points.length - 1)) * width), (height - 4 - ((point - min) / range) * (height - 8))]);
  const linePoints = coords.map((c) => c.join(',')).join(' ');
  const gradId = `spark-${color.replace('#', '')}`;
  const areaPath = fill ? `M0,${height} L${coords.map((c) => c.join(',')).join(' L')} L${width},${height} Z` : undefined;
  return (
    <Svg width={width} height={height}>
      {fill && <Defs><LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={color} stopOpacity={0.35} /><Stop offset="1" stopColor={color} stopOpacity={0} /></LinearGradient></Defs>}
      {fill && areaPath && <Path d={areaPath} fill={`url(#${gradId})`} />}
      <Polyline points={linePoints} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function MarketCard({ asset, compact = false }: { asset: MarketAsset; compact?: boolean }) {
  const colors = useColors();
  const up = asset.change24h >= 0;
  const moveColor = up ? colors.positive : colors.negative;
  return (
    <Pressable testID={`market-card-${asset.symbol}`} onPress={() => router.push(`/coin/${asset.symbol}`)} style={({ pressed }) => [compact ? styles.marketCardCompact : styles.marketCard, { backgroundColor: colors.card, opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }, shadow(colors.background, 0.28, 16, 6)]}>
      <View style={styles.rowBetween}>
        <View style={styles.symbolPill}>
          <View style={[styles.coinDot, { backgroundColor: asset.accent }]} />
          <Text style={[styles.symbolText, { color: colors.foreground }]}>{asset.symbol}</Text>
        </View>
        <View style={[styles.changeBadge, { backgroundColor: up ? 'rgba(56,226,166,0.14)' : 'rgba(255,92,114,0.14)' }]}>
          <Text style={[styles.changeText, { color: moveColor }]}>{formatPercent(asset.change24h)}</Text>
        </View>
      </View>
      <Text style={[compact ? styles.compactPrice : styles.price, { color: colors.foreground }]}>{formatPrice(asset.price)}</Text>
      <View style={styles.rowBetween}>
        <Text style={[styles.mutedText, { color: colors.mutedForeground }]}>{asset.name}</Text>
        <Sparkline points={asset.sparkline} color={moveColor} width={compact ? 78 : 92} height={32} fill />
      </View>
    </Pressable>
  );
}

export function NewsRow({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
  const colors = useColors();
  const isBreaking = item.importance === 'breaking';
  const categoryLabel = isBreaking ? '속보' : item.categories.map(formatCategory).join(' · ');
  const accentColor = isBreaking ? colors.negative : colors.primary;
  return (
    <Pressable testID={`news-row-${item.id}`} onPress={() => router.push(`/news/${item.id}`)} style={({ pressed }) => [featured ? styles.breakingCard : styles.newsRow, { backgroundColor: featured ? colors.cardElevated : colors.card, opacity: pressed ? 0.85 : 1 }, shadow(colors.background, featured ? 0.32 : 0.22, featured ? 20 : 12, featured ? 8 : 4)]}>
      {featured && <View style={[styles.heroAccentBar, { backgroundColor: accentColor }]} />}
      <View style={styles.categoryLine}>
        <View style={[styles.categoryBadge, { backgroundColor: isBreaking ? 'rgba(255,92,114,0.14)' : 'rgba(76,141,255,0.14)' }]}>
          <View style={[styles.liveDot, { backgroundColor: accentColor }]} />
          <Text style={[styles.categoryText, { color: accentColor }]}>{categoryLabel}</Text>
        </View>
        <Text style={[styles.timeText, { color: colors.mutedForeground }]}>{item.relativeTime}</Text>
      </View>
      <Text numberOfLines={featured ? 3 : 2} style={[featured ? styles.breakingTitle : styles.newsTitle, { color: colors.foreground }]}>{item.title}</Text>
      <View style={styles.rowBetween}>
        <View style={styles.tagRow}>{item.relatedSymbols.map((symbol) => <View key={symbol} style={[styles.tinyTag, { borderColor: colors.border }]}><Text style={[styles.tinyTagText, { color: colors.secondaryForeground }]}>{symbol}</Text></View>)}</View>
        <Text style={[styles.sourceText, { color: colors.mutedForeground }]}>{item.source}</Text>
      </View>
    </Pressable>
  );
}

export function SectionHeading({ label, action, onAction }: { label: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionLeft}>
        <View style={[styles.sectionBar, { backgroundColor: colors.primary }]} />
        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>{label}</Text>
      </View>
      {action && <Pressable testID={`section-action-${label}`} onPress={onAction} hitSlop={8}><Text style={[styles.actionText, { color: colors.primary }]}>{action} ›</Text></Pressable>}
    </View>
  );
}

export function SentimentCard({ score, label, change }: { score: number; label: string; change: number }) {
  const colors = useColors(); const circumference = 2 * Math.PI * 41; const dash = circumference * (score / 100);
  const sentimentLabel = label === 'GREED' ? '탐욕' : label === 'FEAR' ? '공포' : '중립';
  const gaugeColor = label === 'GREED' ? colors.amber : label === 'FEAR' ? colors.teal : colors.primary;
  return (
    <View style={[styles.sentimentCard, { backgroundColor: colors.card }, shadow(colors.background, 0.28, 16, 6)]}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={[styles.cardKicker, { color: colors.mutedForeground }]}>시장 심리</Text>
          <Text style={[styles.sentimentLabel, { color: gaugeColor }]}>{sentimentLabel}</Text>
          <Text style={[styles.sentimentChange, { color: colors.mutedForeground }]}>+{change.toFixed(1)}점 · 이번 주</Text>
        </View>
        <View>
          <Svg width={102} height={102}>
            <Circle cx="51" cy="51" r="41" fill="none" stroke={colors.secondary} strokeWidth="8" />
            <Circle cx="51" cy="51" r="41" fill="none" stroke={gaugeColor} strokeWidth="8" strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round" transform="rotate(-90 51 51)" />
          </Svg>
          <Text style={[styles.gaugeNumber, { color: colors.foreground }]}>{score}</Text>
        </View>
      </View>
    </View>
  );
}

export function ImpactWidget({ item }: { item: NewsItem }) {
  const colors = useColors();
  return (
    <Pressable testID="impact-widget" onPress={() => router.push(`/news/${item.id}`)} style={({ pressed }) => [styles.impactCard, { backgroundColor: colors.card, opacity: pressed ? 0.85 : 1 }, shadow(colors.background, 0.28, 16, 6)]}>
      <View style={styles.impactHeader}>
        <View style={[styles.impactIcon, { backgroundColor: colors.primary }]}><Feather name="zap" size={14} color={colors.primaryForeground} /></View>
        <Text style={[styles.cardKicker, { color: colors.foreground }]}>뉴스 영향도</Text>
        <Text style={[styles.impactScore, { color: colors.primary }]}>{item.impactScore}</Text>
      </View>
      <View style={styles.rowBetween}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={[styles.impactSymbol, { color: colors.foreground }]}>{item.relatedSymbols[0]}</Text>
          <Text style={[styles.mutedText, { color: colors.mutedForeground }]}>주요 뉴스가 시장에 미친 영향</Text>
        </View>
        <Metric value={formatPercent(item.priceChange)} label="24시간" color={colors.positive} />
        <Metric value={`+${item.volumeChange}%`} label="거래량" color={colors.amber} />
      </View>
    </Pressable>
  );
}

function Metric({ value, label, color }: { value: string; label: string; color: string }) { const colors = useColors(); return <View style={styles.impactMetric}><Text style={[styles.impactMetricValue, { color }]}>{value}</Text><Text style={[styles.mutedText, { color: colors.mutedForeground }]}>{label}</Text></View>; }

export function TopMovers({ assets }: { assets: MarketAsset[] }) {
  const colors = useColors(); const gainers = [...assets].sort((a, b) => b.change24h - a.change24h).slice(0, 3); const losers = [...assets].sort((a, b) => a.change24h - b.change24h).slice(0, 3);
  return (
    <View style={styles.moversGrid}>
      <View style={[styles.moverColumn, { backgroundColor: colors.card }, shadow(colors.background, 0.24, 14, 5)]}><Text style={[styles.moverTitle, { color: colors.positive }]}>상승</Text>{gainers.map((asset) => <MoverRow key={asset.symbol} asset={asset} />)}</View>
      <View style={[styles.moverColumn, { backgroundColor: colors.card }, shadow(colors.background, 0.24, 14, 5)]}><Text style={[styles.moverTitle, { color: colors.negative }]}>하락</Text>{losers.map((asset) => <MoverRow key={asset.symbol} asset={asset} />)}</View>
    </View>
  );
}

function MoverRow({ asset }: { asset: MarketAsset }) { const colors = useColors(); return <Pressable testID={`mover-${asset.symbol}`} onPress={() => router.push(`/coin/${asset.symbol}`)} style={({ pressed }) => [styles.moverRow, { borderBottomColor: colors.border, opacity: pressed ? 0.65 : 1 }]}><Text style={[styles.symbolText, { color: colors.foreground }]}>{asset.symbol}</Text><Text style={[styles.moverChange, { color: asset.change24h >= 0 ? colors.positive : colors.negative }]}>{formatPercent(asset.change24h)}</Text><Ionicons name="chevron-forward" size={14} color={colors.mutedForeground} /></Pressable>; }

export function TermOfDayCard() {
  const colors = useColors();
  const term = getTermOfTheDay();
  return (
    <View style={[styles.termCard, { backgroundColor: colors.card }, shadow(colors.background, 0.28, 16, 6)]}>
      <View style={styles.impactHeader}>
        <View style={[styles.impactIcon, { backgroundColor: colors.amber }]}><Ionicons name="bulb-outline" size={14} color={colors.primaryForeground} /></View>
        <Text style={[styles.cardKicker, { color: colors.foreground }]}>오늘의 코인 용어</Text>
      </View>
      <Text style={[styles.termTitle, { color: colors.foreground }]}>{term.term}</Text>
      <Text style={[styles.termShort, { color: colors.primary }]}>{term.short}</Text>
      <Text style={[styles.termDetail, { color: colors.secondaryForeground }]}>{term.detail}</Text>
    </View>
  );
}

export function WatchlistToggle({ symbol }: { symbol: string }) { const colors = useColors(); const { contains, toggle } = useWatchlist(); const active = contains(symbol); return <Pressable testID={`watchlist-toggle-${symbol}`} onPress={() => toggle(symbol)} style={({ pressed }) => [styles.watchButton, { backgroundColor: active ? colors.primary : colors.card, opacity: pressed ? 0.7 : 1 }, shadow(colors.background, 0.24, 10, 4)]}><Ionicons name={active ? 'star' : 'star-outline'} size={16} color={active ? colors.primaryForeground : colors.primary} /></Pressable>; }

const styles = StyleSheet.create({
  header: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandMark: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 10.5, letterSpacing: 1.1, marginBottom: 3 },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 24, letterSpacing: -0.9 },
  iconButton: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  marketCard: { width: 186, minHeight: 138, padding: 16, borderRadius: 20, marginRight: 10, justifyContent: 'space-between' },
  marketCardCompact: { width: '100%', minHeight: 140, padding: 16, borderRadius: 20, justifyContent: 'space-between' },
  symbolPill: { flexDirection: 'row', alignItems: 'center', gap: 7 }, coinDot: { width: 7, height: 7, borderRadius: 4 },
  symbolText: { fontFamily: 'Inter_700Bold', fontSize: 14, letterSpacing: 0.3 },
  changeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  changeText: { fontFamily: 'Inter_700Bold', fontSize: 12, fontVariant: ['tabular-nums'] },
  price: { fontFamily: 'Inter_700Bold', fontSize: 20, letterSpacing: -0.6, marginTop: 12, fontVariant: ['tabular-nums'] },
  compactPrice: { fontFamily: 'Inter_700Bold', fontSize: 20, letterSpacing: -0.6, marginTop: 11, fontVariant: ['tabular-nums'] },
  mutedText: { fontFamily: 'Inter_500Medium', fontSize: 11 },

  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 13 },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionBar: { width: 3, height: 15, borderRadius: 2 },
  sectionLabel: { fontFamily: 'Inter_700Bold', fontSize: 17, letterSpacing: -0.4 },
  actionText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  breakingCard: { padding: 18, paddingLeft: 22, borderRadius: 22, gap: 13, overflow: 'hidden' },
  heroAccentBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  newsRow: { padding: 16, borderRadius: 18, gap: 11, marginBottom: 10 },
  categoryLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  liveDot: { width: 5, height: 5, borderRadius: 3 },
  categoryText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.5 },
  timeText: { fontFamily: 'Inter_500Medium', fontSize: 11, marginLeft: 'auto' },
  breakingTitle: { fontFamily: 'Inter_700Bold', fontSize: 21, lineHeight: 28, letterSpacing: -0.7 },
  newsTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, lineHeight: 21, letterSpacing: -0.3 },
  tagRow: { flexDirection: 'row', gap: 6 },
  tinyTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  tinyTagText: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  sourceText: { fontFamily: 'Inter_500Medium', fontSize: 10 },

  sentimentCard: { borderRadius: 20, padding: 18, minHeight: 140 },
  cardKicker: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1 },
  sentimentLabel: { fontFamily: 'Inter_700Bold', fontSize: 26, marginTop: 9, letterSpacing: -0.7 },
  sentimentChange: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 4 },
  gaugeNumber: { position: 'absolute', alignSelf: 'center', top: 38, fontFamily: 'Inter_700Bold', fontSize: 26, width: 102, textAlign: 'center' },
  impactCard: { borderRadius: 20, padding: 17, marginTop: 10, gap: 16 },
  impactHeader: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  impactIcon: { width: 24, height: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  impactScore: { fontFamily: 'Inter_700Bold', fontSize: 19, marginLeft: 'auto', fontVariant: ['tabular-nums'] },
  impactSymbol: { fontFamily: 'Inter_700Bold', fontSize: 22, letterSpacing: -0.5 },
  impactMetric: { alignItems: 'flex-end', gap: 4 },
  impactMetricValue: { fontFamily: 'Inter_700Bold', fontSize: 14, fontVariant: ['tabular-nums'] },

  termCard: { borderRadius: 20, padding: 17, marginTop: 10, gap: 8 },
  termTitle: { fontFamily: 'Inter_700Bold', fontSize: 22, letterSpacing: -0.5, marginTop: 2 },
  termShort: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  termDetail: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, marginTop: 2 },

  moversGrid: { flexDirection: 'row', gap: 10 },
  moverColumn: { flex: 1, paddingHorizontal: 14, paddingTop: 15, paddingBottom: 4, borderRadius: 18 },
  moverTitle: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1, marginBottom: 4 },
  moverRow: { minHeight: 40, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, gap: 7 },
  moverChange: { fontFamily: 'Inter_700Bold', fontSize: 12, marginLeft: 'auto', fontVariant: ['tabular-nums'] },
  watchButton: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
