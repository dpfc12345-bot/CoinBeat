import React, { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path, Polyline } from 'react-native-svg';
import { Screen } from '@/src/components/Screen';
import { formatPrice } from '@/src/components/MarketPulseUI';
import { getMockSnapshot, mockNews } from '@/src/data/mockData';
import { useColors } from '@/hooks/useColors';
import { MarketAsset, NewsItem } from '@/src/models';

type WidgetKind = 'price' | 'news';
type WidgetSize = 'small' | 'medium' | 'large';

const sizeLabels: Record<WidgetSize, string> = { small: '작은', medium: '중간', large: '큰' };

export default function WidgetsScreen() {
  const colors = useColors();
  const [kind, setKind] = useState<WidgetKind>('price');
  const [size, setSize] = useState<WidgetSize>('medium');
  const [saved, setSaved] = useState(false);
  const asset = useMemo(() => getMockSnapshot().assets[0], []);
  const item = mockNews[0];

  return <Screen>
    <View style={styles.header}>
      <Pressable testID="widget-back" onPress={() => router.back()} style={[styles.back, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Ionicons name="arrow-back" size={18} color={colors.foreground} />
      </Pressable>
      <View style={styles.headerCopy}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>MARKET PULSE WIDGETS</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>위젯 미리보기</Text>
      </View>
    </View>
    <Text style={[styles.intro, { color: colors.mutedForeground }]}>홈 화면에서 가장 먼저 보고 싶은 정보를 골라보세요.</Text>
    <Text style={[styles.label, { color: colors.mutedForeground }]}>위젯 종류</Text>
    <View style={styles.segmentRow}>
      <Segment icon="trending-up-outline" label="가격 위젯" active={kind === 'price'} onPress={() => { setKind('price'); setSaved(false); }} />
      <Segment icon="newspaper-outline" label="뉴스 위젯" active={kind === 'news'} onPress={() => { setKind('news'); setSaved(false); }} />
    </View>
    <Text style={[styles.label, { color: colors.mutedForeground }]}>크기</Text>
    <View style={styles.sizeRow}>
      {(['small', 'medium', 'large'] as WidgetSize[]).map((itemSize) => <Pressable key={itemSize} testID={`widget-size-${itemSize}`} onPress={() => { setSize(itemSize); setSaved(false); }} style={[styles.sizeControl, { borderColor: size === itemSize ? colors.primary : colors.border, backgroundColor: size === itemSize ? colors.secondary : colors.card }]}>
        <Text style={[styles.sizeText, { color: size === itemSize ? colors.foreground : colors.mutedForeground }]}>{sizeLabels[itemSize]}</Text>
        <Text style={[styles.sizeMeasure, { color: size === itemSize ? colors.primary : colors.mutedForeground }]}>{itemSize === 'small' ? '2 × 1' : itemSize === 'medium' ? '4 × 2' : '4 × 4'}</Text>
      </Pressable>)}
    </View>
    <Text style={[styles.label, { color: colors.mutedForeground }]}>미리보기</Text>
    <View style={[styles.previewWell, { borderColor: colors.border, backgroundColor: colors.muted }]}>
      {kind === 'price' ? <PriceWidget asset={asset} size={size} /> : <NewsWidget item={item} size={size} />}
    </View>
    <View style={[styles.summary, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <View>
        <Text style={[styles.summaryKicker, { color: colors.mutedForeground }]}>선택된 구성</Text>
        <Text style={[styles.summaryTitle, { color: colors.foreground }]}>{kind === 'price' ? '비트코인 가격' : '코인니스 주요 뉴스'} · {sizeLabels[size]} 위젯</Text>
      </View>
      <Ionicons name={saved ? 'checkmark-circle' : 'phone-portrait-outline'} size={22} color={saved ? colors.positive : colors.primary} />
    </View>
    <Pressable testID="save-widget-preview" onPress={() => setSaved(true)} style={({ pressed }) => [styles.saveButton, { backgroundColor: colors.primary, opacity: pressed ? 0.75 : 1 }]}>
      <Ionicons name={saved ? 'checkmark' : 'add'} size={18} color={colors.primaryForeground} />
      <Text style={[styles.saveText, { color: colors.primaryForeground }]}>{saved ? '위젯 구성을 저장했어요' : '이 구성으로 선택'}</Text>
    </Pressable>
    {saved && <Text style={[styles.savedNote, { color: colors.positive }]}>실제 홈 화면에 추가할 위젯 구성이 준비되었습니다.</Text>}
  </Screen>;
}

function Segment({ icon, label, active, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; active: boolean; onPress: () => void }) {
  const colors = useColors();
  return <Pressable testID={`widget-kind-${label}`} onPress={onPress} style={({ pressed }) => [styles.segment, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.secondary : colors.card, opacity: pressed ? 0.76 : 1 }]}>
    <Ionicons name={icon} size={18} color={active ? colors.primary : colors.mutedForeground} />
    <Text style={[styles.segmentText, { color: active ? colors.foreground : colors.mutedForeground }]}>{label}</Text>
    {active && <Ionicons name="checkmark" size={15} color={colors.primary} style={styles.segmentCheck} />}
  </Pressable>;
}

function PriceWidget({ asset, size }: { asset: MarketAsset; size: WidgetSize }) {
  const colors = useColors();
  const isLarge = size === 'large';
  return <View style={[styles.widgetCard, widgetSizes[size], { backgroundColor: colors.card, borderColor: colors.primary }]}>
    <View style={styles.widgetTop}>
      <View style={styles.assetLine}><View style={[styles.assetIcon, { backgroundColor: colors.secondary }]}><Ionicons name="trending-up" size={14} color={colors.primary} /></View><View><Text style={[styles.widgetName, { color: colors.foreground }]}>비트코인</Text><Text style={[styles.widgetSymbol, { color: colors.mutedForeground }]}>BTC/KRW</Text></View></View>
      <Text style={[styles.liveText, { color: colors.positive }]}>● 거래중</Text>
    </View>
    <Text style={[styles.krwPrice, { color: colors.foreground }]}>₩{Math.round(asset.price * 1350).toLocaleString('ko-KR')}</Text>
    <Text style={[styles.widgetChange, { color: colors.positive }]}>{asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}% <Text style={[styles.today, { color: colors.mutedForeground }]}>오늘</Text></Text>
    {size !== 'small' && <PriceLine color={colors.primary} fill={colors.secondary} />}
    {isLarge && <View style={[styles.priceFooter, { borderTopColor: colors.border }]}><Text style={[styles.footerMetric, { color: colors.mutedForeground }]}>고가 <Text style={{ color: colors.foreground }}>₩144,120,000</Text></Text><Text style={[styles.footerMetric, { color: colors.mutedForeground }]}>저가 <Text style={{ color: colors.foreground }}>₩139,680,000</Text></Text></View>}
  </View>;
}

function NewsWidget({ item, size }: { item: NewsItem; size: WidgetSize }) {
  const colors = useColors();
  return <View style={[styles.widgetCard, widgetSizes[size], { backgroundColor: colors.card, borderColor: colors.primary }]}>
    <View style={[styles.widgetTop, styles.newsTop, { borderBottomColor: colors.border }]}><View style={styles.assetLine}><View style={[styles.assetIcon, { backgroundColor: colors.secondary }]}><Ionicons name="newspaper-outline" size={14} color={colors.primary} /></View><Text style={[styles.widgetName, { color: colors.foreground }]}>Coinness 뉴스</Text></View><Text style={[styles.widgetSymbol, { color: colors.mutedForeground }]}>MARKET PULSE</Text></View>
    <View style={styles.newsContent}><View style={styles.newsKickerRow}><Text style={[styles.newsKicker, { color: colors.primary }]}>주요 뉴스</Text><Text style={[styles.widgetSymbol, { color: colors.mutedForeground }]}>비트코인</Text></View><Text numberOfLines={size === 'small' ? 2 : 3} style={[styles.widgetHeadline, { color: colors.foreground }, size === 'large' && styles.largeHeadline]}>{item.title}</Text>{size !== 'small' && <Text numberOfLines={2} style={[styles.widgetDescription, { color: colors.mutedForeground }]}>{item.content}</Text>}</View>
    <View style={[styles.newsFooter, { borderTopColor: colors.border }]}><Text style={[styles.source, { color: colors.secondaryForeground }]}>{item.source}</Text><Text style={[styles.widgetSymbol, { color: colors.mutedForeground }]}>{item.relativeTime}</Text></View>
  </View>;
}

function PriceLine({ color, fill }: { color: string; fill: string }) {
  return <Svg width="100%" height={40} viewBox="0 0 300 40" preserveAspectRatio="none" style={styles.priceLine}>
    <Path d="M0 38 L0 29 C20 28 25 21 40 25 S62 19 78 23 S105 15 120 20 S150 10 166 16 S190 12 204 15 S232 4 246 10 S275 2 300 7 L300 40 Z" fill={fill} opacity={0.75} />
    <Polyline points="0,29 24,27 40,25 62,19 78,23 105,15 120,20 150,10 166,16 190,12 204,15 232,4 246,10 275,2 300,7" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

const widgetSizes = StyleSheet.create({ small: { width: 250, minHeight: 148 }, medium: { width: 330, minHeight: 210 }, large: { width: 350, minHeight: 292 } });
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }, back: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 }, headerCopy: { flex: 1 }, eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.2 }, title: { fontFamily: 'Inter_700Bold', fontSize: 27, letterSpacing: -1.1, marginTop: 4 }, intro: { fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 19, marginBottom: 26 }, label: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.1, marginBottom: 9 }, segmentRow: { flexDirection: 'row', gap: 9, marginBottom: 24 }, segment: { flex: 1, minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 14, paddingHorizontal: 12 }, segmentText: { fontFamily: 'Inter_700Bold', fontSize: 12 }, segmentCheck: { marginLeft: 'auto' }, sizeRow: { flexDirection: 'row', gap: 8, marginBottom: 24 }, sizeControl: { flex: 1, alignItems: 'center', borderWidth: 1, borderRadius: 13, paddingVertical: 10 }, sizeText: { fontFamily: 'Inter_700Bold', fontSize: 12 }, sizeMeasure: { fontFamily: 'Inter_500Medium', fontSize: 9, marginTop: 3 }, previewWell: { minHeight: 340, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 20, padding: 18, marginBottom: 16 }, widgetCard: { borderWidth: 1, borderRadius: 20, padding: 16, justifyContent: 'space-between' }, widgetTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, assetLine: { flexDirection: 'row', alignItems: 'center', gap: 8 }, assetIcon: { width: 29, height: 29, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }, widgetName: { fontFamily: 'Inter_700Bold', fontSize: 12 }, widgetSymbol: { fontFamily: 'Inter_500Medium', fontSize: 9, letterSpacing: 0.3, marginTop: 2 }, liveText: { fontFamily: 'Inter_600SemiBold', fontSize: 9 }, krwPrice: { fontFamily: 'Inter_700Bold', fontSize: 25, letterSpacing: -1.1, marginTop: 11 }, widgetChange: { fontFamily: 'Inter_700Bold', fontSize: 11, marginTop: 4 }, today: { fontFamily: 'Inter_500Medium', fontSize: 10 }, priceLine: { marginTop: 12 }, priceFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 10, marginTop: 4 }, footerMetric: { fontFamily: 'Inter_500Medium', fontSize: 9 }, newsTop: { paddingBottom: 12, borderBottomWidth: 1 }, newsContent: { flex: 1, justifyContent: 'center', paddingVertical: 10 }, newsKickerRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8 }, newsKicker: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.4 }, widgetHeadline: { fontFamily: 'Inter_700Bold', fontSize: 17, lineHeight: 23, letterSpacing: -0.6 }, largeHeadline: { fontSize: 21, lineHeight: 28 }, widgetDescription: { fontFamily: 'Inter_500Medium', fontSize: 10, lineHeight: 15, marginTop: 8 }, newsFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 10 }, source: { fontFamily: 'Inter_700Bold', fontSize: 10 }, summary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 16, padding: 15, marginBottom: 12 }, summaryKicker: { fontFamily: 'Inter_500Medium', fontSize: 10 }, summaryTitle: { fontFamily: 'Inter_700Bold', fontSize: 13, marginTop: 5, letterSpacing: -0.3 }, saveButton: { minHeight: 52, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }, saveText: { fontFamily: 'Inter_700Bold', fontSize: 14 }, savedNote: { fontFamily: 'Inter_600SemiBold', fontSize: 11, textAlign: 'center', marginTop: 12 },
});