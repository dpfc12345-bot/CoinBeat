import React, { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { getGetMarketOverviewQueryKey, useGetMarketOverview, useGetNews, type NewsItem as ApiNewsItem } from '@workspace/api-client-react';
import { Screen } from '@/src/components/Screen';
import { useColors } from '@/hooks/useColors';
import { MarketAsset } from '@/src/models';
import { useWidgetPreferences } from '@/src/context/WidgetPreferencesContext';
import { MARKET_REFRESH_INTERVAL_MS } from '@/src/config/api';
import {
  getWidgetThemeColors,
  scaleWidgetFont,
  widgetColorThemeLabels,
  widgetColorThemeValues,
  widgetFontSizeLabels,
  widgetFontSizeValues,
  type WidgetColorTheme,
  type WidgetFontSize,
  type WidgetThemeColors,
} from '@/src/widgets/theme';
import {
  newsWidgetDesignLabels,
  newsWidgetDesignNotes,
  newsWidgetDesignValues,
  priceWidgetDesignLabels,
  priceWidgetDesignNotes,
  priceWidgetDesignValues,
  type NewsWidgetDesign,
  type PriceWidgetDesign,
} from '@/src/widgets/designs';

type WidgetKind = 'price' | 'news';
type WidgetSize = 'small' | 'medium' | 'large';

const sizeLabels: Record<WidgetSize, string> = { small: '작은', medium: '중간', large: '큰' };

export default function WidgetsScreen() {
  const colors = useColors();
  const [saved, setSaved] = useState(false);
  const [previewKind, setPreviewKind] = useState<WidgetKind>('price');
  const [previewSize, setPreviewSize] = useState<WidgetSize>('medium');
  const [coinSearch, setCoinSearch] = useState('');
  const [coinPickerOpen, setCoinPickerOpen] = useState(false);
  const { preferences, isLoading: preferencesLoading, savePreferences } = useWidgetPreferences();
  const kind = previewKind;
  const size = previewSize;
  const selectedSymbols = preferences.selectedSymbols;
  const marketQuery = useGetMarketOverview({
    request: { cache: 'no-store' },
    query: {
      queryKey: getGetMarketOverviewQueryKey(),
      refetchInterval: MARKET_REFRESH_INTERVAL_MS,
      staleTime: MARKET_REFRESH_INTERVAL_MS - 2_000,
    },
  });
  const allAssets = marketQuery.data?.assets ?? [];
  const coinOptions = useMemo(() => {
    const normalizedSearch = coinSearch.trim().toLowerCase();
    const matches = normalizedSearch
      ? allAssets.filter((asset) => `${asset.symbol} ${asset.name}`.toLowerCase().includes(normalizedSearch))
      : allAssets;
    return matches.slice(0, 36);
  }, [allAssets, coinSearch]);
  const selectedAssets = useMemo(() => {
    const assetsBySymbol = new Map(allAssets.map((asset) => [asset.symbol, asset]));
    return selectedSymbols
      .map((symbol) => assetsBySymbol.get(symbol))
      .filter((asset): asset is MarketAsset => Boolean(asset));
  }, [allAssets, selectedSymbols]);
  const newsQuery = useGetNews();

  const changeKind = (nextKind: WidgetKind) => {
    setPreviewKind(nextKind);
    setSaved(false);
  };

  const coinPickerSummary = selectedAssets.length === 0
    ? '코인을 선택하세요'
    : selectedAssets.map((asset) => asset.symbol).join(', ');

  const toggleAsset = (symbol: string) => {
    const nextSymbols = selectedSymbols.includes(symbol)
      ? selectedSymbols.length === 1 ? selectedSymbols : selectedSymbols.filter((item) => item !== symbol)
      : [...selectedSymbols, symbol];
    void savePreferences({ ...preferences, selectedSymbols: nextSymbols }).then(() => setSaved(true));
  };

  const chooseColorTheme = (colorTheme: WidgetColorTheme) => {
    void savePreferences({ ...preferences, colorTheme }).then(() => setSaved(true));
  };

  const chooseFontSize = (fontSize: WidgetFontSize) => {
    void savePreferences({ ...preferences, fontSize }).then(() => setSaved(true));
  };

  const choosePriceDesign = (priceDesign: PriceWidgetDesign) => {
    void savePreferences({ ...preferences, priceDesign }).then(() => setSaved(true));
  };

  const chooseNewsDesign = (newsDesign: NewsWidgetDesign) => {
    void savePreferences({ ...preferences, newsDesign }).then(() => setSaved(true));
  };

  const selectedLabel = selectedAssets.length === 1
    ? `${selectedAssets[0]?.name ?? selectedSymbols[0]} 가격`
    : `${selectedSymbols.length}개 코인 가격`;

  return <Screen>
    <View style={styles.header}>
      <Pressable testID="widget-back" onPress={() => { if (router.canGoBack()) router.back(); else router.replace('/'); }} style={[styles.back, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Ionicons name="arrow-back" size={18} color={colors.foreground} />
      </Pressable>
      <View style={styles.headerCopy}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>COINBEAT WIDGETS</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>홈 화면 위젯</Text>
      </View>
    </View>
    <Text style={[styles.intro, { color: colors.mutedForeground }]}>가격 위젯에 표시할 코인, 색상 테마, 글자 크기를 고르고 모양을 미리보세요. 실제 홈 화면에서는 가격·뉴스 위젯과 크기를 직접 선택합니다.</Text>

    <Text style={[styles.label, { color: colors.mutedForeground }]}>미리보기 위젯 종류</Text>
    <View style={styles.segmentRow}>
      <Segment icon="trending-up-outline" label="가격 위젯" active={kind === 'price'} onPress={() => changeKind('price')} />
      <Segment icon="newspaper-outline" label="뉴스 위젯" active={kind === 'news'} onPress={() => changeKind('news')} />
    </View>

    {kind === 'price' && <>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>가격 위젯 디자인</Text>
      <View style={styles.designGrid}>
        {priceWidgetDesignValues.map((designId) => {
          const active = preferences.priceDesign === designId;
          return <Pressable
            key={designId}
            testID={`widget-price-design-${designId}`}
            onPress={() => choosePriceDesign(designId)}
            style={({ pressed }) => [styles.designChip, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.secondary : colors.card, opacity: pressed ? 0.76 : 1 }]}
          >
            <Text style={[styles.designChipText, { color: active ? colors.foreground : colors.mutedForeground }]}>{priceWidgetDesignLabels[designId]}</Text>
            <Text style={[styles.designChipNote, { color: colors.mutedForeground }]}>{priceWidgetDesignNotes[designId]}</Text>
            {active && <Ionicons name="checkmark-circle" size={14} color={colors.primary} style={styles.designCheck} />}
          </Pressable>;
        })}
      </View>

      <Text style={[styles.label, { color: colors.mutedForeground }]}>가격 위젯에 표시할 코인</Text>
      <Pressable
        testID="widget-coin-dropdown-toggle"
        onPress={() => setCoinPickerOpen((open) => !open)}
        style={({ pressed }) => [styles.dropdownTrigger, { borderColor: coinPickerOpen ? colors.primary : colors.border, backgroundColor: colors.card, opacity: pressed ? 0.85 : 1 }]}
      >
        <Text numberOfLines={1} style={[styles.dropdownTriggerText, { color: selectedAssets.length === 0 ? colors.mutedForeground : colors.foreground }]}>{coinPickerSummary}</Text>
        <Ionicons name={coinPickerOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.mutedForeground} />
      </Pressable>
      <Text style={[styles.coinHint, { color: colors.mutedForeground }]}>선택 {selectedSymbols.length}개 · 작은 위젯은 2개, 중간은 4개, 큰 위젯은 최대 8개를 표시합니다.</Text>

      {coinPickerOpen && <View style={[styles.dropdownPanel, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <View style={[styles.searchBox, { borderColor: colors.border, backgroundColor: colors.muted }]}>
          <Ionicons name="search" size={17} color={colors.mutedForeground} />
          <TextInput
            testID="widget-coin-search"
            value={coinSearch}
            onChangeText={setCoinSearch}
            placeholder="코인 이름 또는 심볼 검색"
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="characters"
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {coinSearch.length > 0 && <Pressable testID="widget-coin-search-clear" onPress={() => setCoinSearch('')} hitSlop={8}><Ionicons name="close-circle" size={17} color={colors.mutedForeground} /></Pressable>}
        </View>
        <View style={styles.coinPicker}>
          {coinOptions.map((asset) => {
            const selected = selectedSymbols.includes(asset.symbol);
            return <Pressable
              key={asset.symbol}
              testID={`widget-coin-${asset.symbol}`}
              onPress={() => toggleAsset(asset.symbol)}
              style={({ pressed }) => [styles.coinChip, { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.secondary : colors.muted, opacity: pressed ? 0.72 : 1 }]}
            >
              <View style={[styles.coinDot, { backgroundColor: asset.accent }]} />
              <Text style={[styles.coinChipText, { color: selected ? colors.foreground : colors.mutedForeground }]}>{asset.symbol}</Text>
              {selected && <Ionicons name="checkmark" size={14} color={colors.primary} />}
            </Pressable>;
          })}
        </View>
        {marketQuery.isError && <Text style={[styles.noResults, { color: colors.negative }]}>전체 코인 목록을 불러오지 못했습니다. 잠시 후 다시 시도하세요.</Text>}
        {!marketQuery.isLoading && !marketQuery.isError && coinOptions.length === 0 && <Text style={[styles.noResults, { color: colors.mutedForeground }]}>일치하는 코인이 없습니다.</Text>}
        <Pressable testID="widget-coin-dropdown-close" onPress={() => setCoinPickerOpen(false)} style={({ pressed }) => [styles.dropdownCloseButton, { borderColor: colors.border, opacity: pressed ? 0.72 : 1 }]}>
          <Text style={[styles.dropdownCloseText, { color: colors.primary }]}>선택 완료</Text>
        </Pressable>
      </View>}
    </>}

    {kind === 'news' && <>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>뉴스 위젯 디자인</Text>
      <View style={styles.designGrid}>
        {newsWidgetDesignValues.map((designId) => {
          const active = preferences.newsDesign === designId;
          return <Pressable
            key={designId}
            testID={`widget-news-design-${designId}`}
            onPress={() => chooseNewsDesign(designId)}
            style={({ pressed }) => [styles.designChip, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.secondary : colors.card, opacity: pressed ? 0.76 : 1 }]}
          >
            <Text style={[styles.designChipText, { color: active ? colors.foreground : colors.mutedForeground }]}>{newsWidgetDesignLabels[designId]}</Text>
            <Text style={[styles.designChipNote, { color: colors.mutedForeground }]}>{newsWidgetDesignNotes[designId]}</Text>
            {active && <Ionicons name="checkmark-circle" size={14} color={colors.primary} style={styles.designCheck} />}
          </Pressable>;
        })}
      </View>
    </>}

    <Text style={[styles.label, { color: colors.mutedForeground }]}>색상 테마</Text>
    <View style={styles.themePicker}>
      {widgetColorThemeValues.map((themeId) => {
        const themeColors = getWidgetThemeColors(themeId);
        const active = preferences.colorTheme === themeId;
        return <Pressable
          key={themeId}
          testID={`widget-theme-${themeId}`}
          onPress={() => chooseColorTheme(themeId)}
          style={({ pressed }) => [styles.themeChip, { borderColor: active ? colors.primary : colors.border, backgroundColor: colors.card, opacity: pressed ? 0.76 : 1 }]}
        >
          <View style={styles.themeSwatchRow}>
            <View style={[styles.themeSwatch, { backgroundColor: themeColors.background, borderColor: themeColors.border }]} />
            <View style={[styles.themeSwatch, { backgroundColor: themeColors.primary }]} />
            <View style={[styles.themeSwatch, { backgroundColor: themeColors.positive }]} />
          </View>
          <Text style={[styles.themeChipText, { color: active ? colors.foreground : colors.mutedForeground }]}>{widgetColorThemeLabels[themeId]}</Text>
          {active && <Ionicons name="checkmark-circle" size={16} color={colors.primary} style={styles.themeCheck} />}
        </Pressable>;
      })}
    </View>

    <Text style={[styles.label, { color: colors.mutedForeground }]}>글자 크기</Text>
    <View style={styles.sizeRow}>
      {widgetFontSizeValues.map((fontSizeOption) => <Pressable
        key={fontSizeOption}
        testID={`widget-font-size-${fontSizeOption}`}
        onPress={() => chooseFontSize(fontSizeOption)}
        style={[styles.sizeControl, { borderColor: preferences.fontSize === fontSizeOption ? colors.primary : colors.border, backgroundColor: preferences.fontSize === fontSizeOption ? colors.secondary : colors.card }]}
      >
        <Text style={[styles.sizeText, { color: preferences.fontSize === fontSizeOption ? colors.foreground : colors.mutedForeground, fontSize: fontSizeOption === 'large' ? 14 : fontSizeOption === 'small' ? 11 : 12 }]}>{widgetFontSizeLabels[fontSizeOption]}</Text>
        <Text style={[styles.sizeMeasure, { color: preferences.fontSize === fontSizeOption ? colors.primary : colors.mutedForeground }]}>Aa</Text>
      </Pressable>)}
    </View>

    <Text style={[styles.label, { color: colors.mutedForeground }]}>미리보기 크기 (참고용)</Text>
    <View style={styles.sizeRow}>
      {(['small', 'medium', 'large'] as WidgetSize[]).map((itemSize) => <Pressable key={itemSize} testID={`widget-size-${itemSize}`} onPress={() => { setPreviewSize(itemSize); setSaved(false); }} style={[styles.sizeControl, { borderColor: size === itemSize ? colors.primary : colors.border, backgroundColor: size === itemSize ? colors.secondary : colors.card }]}>
        <Text style={[styles.sizeText, { color: size === itemSize ? colors.foreground : colors.mutedForeground }]}>{sizeLabels[itemSize]}</Text>
        <Text style={[styles.sizeMeasure, { color: size === itemSize ? colors.primary : colors.mutedForeground }]}>{itemSize === 'small' ? '2 × 1' : itemSize === 'medium' ? '4 × 2' : '4 × 4'}</Text>
      </Pressable>)}
    </View>
    <Text style={[styles.coinHint, { color: colors.mutedForeground, marginTop: -14 }]}>실제 홈 화면 위젯의 크기는 안드로이드 정책상 앱에서 바꿀 수 없어요. 홈 화면에서 위젯을 길게 눌러 모서리를 드래그하면 크기가 바뀌고, 내용은 그 크기에 맞춰 자동으로 조정돼요.</Text>

    <Text style={[styles.label, { color: colors.mutedForeground }]}>미리보기</Text>
    <View style={[styles.previewWell, { borderColor: colors.border, backgroundColor: colors.muted }]}>
      {kind === 'price'
        ? <PriceWidget assets={selectedAssets} size={size} colorTheme={preferences.colorTheme} fontSize={preferences.fontSize} design={preferences.priceDesign} />
        : <NewsWidget items={newsQuery.data ?? []} size={size} isLoading={newsQuery.isLoading} isError={newsQuery.isError} colorTheme={preferences.colorTheme} fontSize={preferences.fontSize} design={preferences.newsDesign} />}
    </View>

    <View style={[styles.summary, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <View style={styles.summaryCopy}>
        <Text style={[styles.summaryKicker, { color: colors.mutedForeground }]}>미리보기 구성</Text>
        <Text style={[styles.summaryTitle, { color: colors.foreground }]}>{kind === 'price' ? selectedLabel : '블록미디어 주요 뉴스'} · {sizeLabels[size]} 위젯 · {widgetColorThemeLabels[preferences.colorTheme]} · 글자 {widgetFontSizeLabels[preferences.fontSize]}</Text>
      </View>
      <Ionicons name={saved ? 'checkmark-circle' : 'phone-portrait-outline'} size={22} color={saved ? colors.positive : colors.primary} />
    </View>
    <Pressable testID="save-widget-preview" disabled={preferencesLoading} onPress={() => { void savePreferences(preferences).then(() => setSaved(true)); }} style={({ pressed }) => [styles.saveButton, { backgroundColor: colors.primary, opacity: pressed || preferencesLoading ? 0.6 : 1 }]}>
      <Ionicons name={saved ? 'checkmark' : 'add'} size={18} color={colors.primaryForeground} />
      <Text style={[styles.saveText, { color: colors.primaryForeground }]}>{saved ? '홈 화면 위젯을 새로고침했어요' : '홈 화면 위젯 새로고침'}</Text>
    </Pressable>
    {saved && <Text style={[styles.savedNote, { color: colors.positive }]}>홈 화면을 길게 누른 뒤 위젯에서 CoinBeat를 선택해 추가하세요. 앱이 열려 있을 때는 15초마다 갱신되며, Android의 백그라운드 자동 갱신은 최소 30분입니다.</Text>}
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

function WidgetHeader({ theme, f, eyebrow, kicker }: { theme: WidgetThemeColors; f: (base: number) => number; eyebrow: string; kicker: string }) {
  return <View style={styles.widgetTop}>
    <Text style={[styles.widgetName, { color: theme.foreground, fontSize: f(12) }]}>{eyebrow}</Text>
    <Text style={[styles.liveText, { color: theme.positive, fontSize: f(9) }]}>{kicker}</Text>
  </View>;
}

function PriceAssetCard({ asset, theme, f, showName }: { asset: MarketAsset; theme: WidgetThemeColors; f: (base: number) => number; showName?: boolean }) {
  return <View style={[styles.priceCell, { backgroundColor: theme.surface, borderColor: theme.border, width: '100%' }]}>
    <View style={styles.priceCellTop}><Text style={[styles.priceSymbol, { color: theme.foreground, fontSize: f(11) }]}>{asset.symbol}</Text><Text style={[styles.priceChange, { color: asset.change24h >= 0 ? theme.positive : theme.negative, fontSize: f(8) }]}>{asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%</Text></View>
    {showName && <Text numberOfLines={1} style={[styles.widgetSymbol, { color: theme.muted, fontSize: f(9) }]}>{asset.name}</Text>}
    <Text numberOfLines={1} style={[styles.widgetPrice, { color: theme.foreground, fontSize: f(12) }]}>{formatKrwPrice(asset.price)}</Text>
  </View>;
}

/** Mirrors the real Android widget's own theme/font handling, so this preview matches the home screen result exactly. */
function PriceWidget({ assets, size, colorTheme, fontSize, design }: { assets: MarketAsset[]; size: WidgetSize; colorTheme: WidgetColorTheme; fontSize: WidgetFontSize; design: PriceWidgetDesign }) {
  const theme: WidgetThemeColors = getWidgetThemeColors(colorTheme);
  const f = (base: number) => scaleWidgetFont(base, fontSize);

  if (design === 'beacon') {
    const lead = assets[0];
    const rest = assets.slice(1, size === 'large' ? 4 : 3);
    return <View style={[styles.widgetCard, widgetSizes[size], { backgroundColor: theme.background, borderColor: theme.border }]}>
      <WidgetHeader theme={theme} f={f} eyebrow="PULSE BEACON" kicker="실시간" />
      {lead && <View style={[styles.beaconHero, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.priceCellTop}><Text style={[styles.widgetSymbol, { color: theme.muted, fontSize: f(10) }]}>{lead.symbol} · {lead.name}</Text><Text style={[styles.priceChange, { color: lead.change24h >= 0 ? theme.positive : theme.negative, fontSize: f(10) }]}>{lead.change24h >= 0 ? '+' : ''}{lead.change24h.toFixed(2)}%</Text></View>
        <Text style={[styles.beaconPrice, { color: theme.foreground, fontSize: f(24) }]}>{formatKrwPrice(lead.price)}</Text>
      </View>}
      {size !== 'small' && rest.length > 0 && <View style={styles.priceGrid}>{rest.map((asset) => <View key={asset.symbol} style={styles.gridHalf}><PriceAssetCard asset={asset} theme={theme} f={f} /></View>)}</View>}
    </View>;
  }

  if (design === 'stack') {
    const count = size === 'large' ? 6 : size === 'medium' ? 4 : 2;
    return <View style={[styles.widgetCard, widgetSizes[size], { backgroundColor: theme.background, borderColor: theme.border }]}>
      <WidgetHeader theme={theme} f={f} eyebrow="SIGNAL STACK" kicker="우선순위" />
      <View style={styles.stackList}>
        {assets.slice(0, count).map((asset, index) => <View key={asset.symbol} style={[styles.stackRow, { backgroundColor: theme.surface, borderLeftColor: asset.change24h >= 0 ? theme.positive : theme.negative }]}>
          <Text style={[styles.stackRank, { color: theme.muted, fontSize: f(9) }]}>0{index + 1}</Text>
          <Text style={[styles.priceSymbol, { color: theme.foreground, fontSize: f(12), flex: 1 }]}>{asset.symbol}</Text>
          <Text style={[styles.widgetPrice, { color: theme.foreground, fontSize: f(11), marginTop: 0 }]}>{formatKrwPrice(asset.price)}</Text>
          <Text style={[styles.priceChange, { color: asset.change24h >= 0 ? theme.positive : theme.negative, fontSize: f(9) }]}>{asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%</Text>
        </View>)}
      </View>
    </View>;
  }

  if (design === 'ticker') {
    const count = size === 'large' ? 6 : size === 'medium' ? 4 : 2;
    return <View style={[styles.widgetCard, widgetSizes[size], { backgroundColor: theme.background, borderColor: theme.border }]}>
      <WidgetHeader theme={theme} f={f} eyebrow="TICKER WINDOW" kicker="LIVE" />
      <View style={[styles.tickerBox, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        {assets.slice(0, count).map((asset, index) => <View key={asset.symbol} style={[styles.tickerRow, { borderTopColor: theme.border, borderTopWidth: index === 0 ? 0 : 1 }]}>
          <Text style={[styles.priceSymbol, { color: theme.foreground, fontSize: f(12), width: 44 }]}>{asset.symbol}</Text>
          <View style={[styles.tickerLine, { backgroundColor: theme.border }]} />
          <Text style={[styles.widgetPrice, { color: theme.foreground, fontSize: f(11), marginTop: 0 }]}>{formatKrwPrice(asset.price)}</Text>
          <Text style={[styles.priceChange, { color: asset.change24h >= 0 ? theme.positive : theme.negative, fontSize: f(9) }]}>{asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%</Text>
        </View>)}
      </View>
    </View>;
  }

  if (design === 'briefing') {
    const topMover = assets.reduce((best, asset) => (Math.abs(asset.change24h) > Math.abs(best.change24h) ? asset : best), assets[0]);
    const grid = assets.filter((asset) => asset.symbol !== topMover?.symbol).slice(0, size === 'large' ? 4 : 2);
    return <View style={[styles.widgetCard, widgetSizes[size], { backgroundColor: theme.background, borderColor: theme.border }]}>
      <WidgetHeader theme={theme} f={f} eyebrow="DAILY BRIEFING" kicker="시장 요약" />
      {topMover && <View style={[styles.briefingHero, { backgroundColor: theme.surface }]}>
        <Text style={[styles.widgetSymbol, { color: theme.muted, fontSize: f(9) }]}>오늘의 최대 변동 코인</Text>
        <View style={styles.priceCellTop}><Text style={[styles.priceSymbol, { color: theme.foreground, fontSize: f(13) }]}>{topMover.symbol} · {formatKrwPrice(topMover.price)}</Text><Text style={[styles.priceChange, { color: topMover.change24h >= 0 ? theme.positive : theme.negative, fontSize: f(10) }]}>{topMover.change24h >= 0 ? '+' : ''}{topMover.change24h.toFixed(2)}%</Text></View>
      </View>}
      {size !== 'small' && grid.length > 0 && <View style={styles.priceGrid}>{grid.map((asset) => <View key={asset.symbol} style={styles.gridHalf}><PriceAssetCard asset={asset} theme={theme} f={f} /></View>)}</View>}
    </View>;
  }

  if (design === 'elastic') {
    if (size === 'small') {
      const lead = assets[0];
      return <View style={[styles.widgetCard, widgetSizes[size], { backgroundColor: theme.background, borderColor: theme.border }]}>
        <WidgetHeader theme={theme} f={f} eyebrow="ELASTIC GRID" kicker="자동 조정" />
        {lead && <View style={styles.gridHalf}><PriceAssetCard asset={lead} theme={theme} f={f} showName /></View>}
      </View>;
    }
    const count = size === 'large' ? 8 : 4;
    return <View style={[styles.widgetCard, widgetSizes[size], { backgroundColor: theme.background, borderColor: theme.border }]}>
      <WidgetHeader theme={theme} f={f} eyebrow="ELASTIC GRID" kicker="자동 조정" />
      <View style={styles.priceGrid}>{assets.slice(0, count).map((asset) => <View key={asset.symbol} style={styles.gridHalf}><PriceAssetCard asset={asset} theme={theme} f={f} /></View>)}</View>
      <Text style={[styles.widgetSymbol, { color: theme.muted, fontSize: f(10), marginTop: 8 }]}>화면 크기에 맞춰 자동 조정</Text>
    </View>;
  }

  // desk (default grid)
  const visibleAssets = assets.slice(0, size === 'small' ? 2 : size === 'medium' ? 4 : 8);
  return <View style={[styles.widgetCard, widgetSizes[size], { backgroundColor: theme.background, borderColor: theme.border }]}>
    <WidgetHeader theme={theme} f={f} eyebrow="NIGHT DESK" kicker="실시간" />
    <View style={styles.priceGrid}>
       {visibleAssets.map((asset) => <View key={asset.symbol} style={styles.gridHalf}><PriceAssetCard asset={asset} theme={theme} f={f} /></View>)}
    </View>
     {size === 'large' && <View style={[styles.priceFooter, { borderTopColor: theme.border }]}><Text style={[styles.footerMetric, { color: theme.muted, fontSize: f(9) }]}>선택 코인 <Text style={{ color: theme.foreground }}>{assets.length}개</Text></Text><Text style={[styles.footerMetric, { color: theme.muted, fontSize: f(9) }]}>업데이트 <Text style={{ color: theme.foreground }}>방금 전</Text></Text></View>}
  </View>;
}

function newsKickerLabel(item: ApiNewsItem) {
  return item.importance === 'breaking' ? '속보' : (item.relatedSymbols.join(' · ') || 'MARKET');
}

/** Mirrors the real Android widget's own theme/font handling, so this preview matches the home screen result exactly. */
function NewsWidget({ items, size, isLoading, isError, colorTheme, fontSize, design }: { items: ApiNewsItem[]; size: WidgetSize; isLoading: boolean; isError: boolean; colorTheme: WidgetColorTheme; fontSize: WidgetFontSize; design: NewsWidgetDesign }) {
  const theme: WidgetThemeColors = getWidgetThemeColors(colorTheme);
  const f = (base: number) => scaleWidgetFont(base, fontSize);

  if (isLoading || isError || items.length === 0) {
    return <View style={[styles.widgetCard, widgetSizes[size], { backgroundColor: theme.background, borderColor: theme.border }]}>
      <WidgetHeader theme={theme} f={f} eyebrow="COINBEAT NEWS" kicker="실시간" />
      <View style={styles.widgetState}><Text style={[styles.widgetStateText, { color: isError ? theme.negative : theme.muted, fontSize: f(11) }]}>{isLoading ? '최신 뉴스를 불러오는 중이에요.' : isError ? '뉴스를 불러오지 못했어요.' : '표시할 뉴스가 없어요.'}</Text></View>
    </View>;
  }

  if (design === 'headline') {
    const lead = items[0];
    const rest = items.slice(1, size === 'large' ? 3 : size === 'medium' ? 2 : 1);
    return <View style={[styles.widgetCard, widgetSizes[size], { backgroundColor: theme.background, borderColor: theme.border }]}>
      <WidgetHeader theme={theme} f={f} eyebrow="HEADLINE BEACON" kicker="LIVE" />
      <Pressable testID={`widget-news-${lead.id}`} onPress={() => { void Linking.openURL(lead.sourceUrl); }} style={[styles.headlineHero, { backgroundColor: theme.surface }]}>
        <Text style={[styles.newsKicker, { color: lead.importance === 'breaking' ? theme.negative : theme.primary, fontSize: f(9) }]}>{newsKickerLabel(lead)}</Text>
        <Text numberOfLines={size === 'small' ? 2 : 3} style={[styles.widgetHeadline, { color: theme.foreground, fontSize: f(size === 'large' ? 16 : 14), lineHeight: f(20) }]}>{lead.title}</Text>
        <Text style={[styles.widgetSymbol, { color: theme.muted, fontSize: f(9) }]}>{lead.relativeTime}</Text>
      </Pressable>
      {rest.map((item) => <Pressable key={item.id} testID={`widget-news-${item.id}`} onPress={() => { void Linking.openURL(item.sourceUrl); }} style={styles.headlineSecondaryRow}>
        <Text numberOfLines={1} style={[styles.priceSymbol, { color: theme.foreground, fontSize: f(11), flex: 1 }]}>{item.title}</Text>
        <Text style={[styles.widgetSymbol, { color: theme.muted, fontSize: f(9) }]}>{item.relativeTime}</Text>
      </Pressable>)}
    </View>;
  }

  if (design === 'brief') {
    const lead = items[0];
    const rest = items.slice(1, size === 'large' ? 3 : 1);
    return <View style={[styles.widgetCard, widgetSizes[size], { backgroundColor: theme.background, borderColor: theme.border }]}>
      <WidgetHeader theme={theme} f={f} eyebrow="MARKET BRIEFING" kicker="요약" />
      <Pressable testID={`widget-news-${lead.id}`} onPress={() => { void Linking.openURL(lead.sourceUrl); }} style={[styles.headlineHero, { backgroundColor: theme.surface }]}>
        <Text numberOfLines={size === 'small' ? 2 : 3} style={[styles.widgetHeadline, { color: theme.foreground, fontSize: f(size === 'large' ? 14 : 12), lineHeight: f(18) }]}>{lead.title}</Text>
        <View style={styles.priceCellTop}><Text style={[styles.widgetSymbol, { color: theme.muted, fontSize: f(9) }]}>블록미디어</Text><Text style={[styles.widgetSymbol, { color: theme.muted, fontSize: f(9) }]}>{lead.relativeTime}</Text></View>
      </Pressable>
      {rest.length > 0 && <View style={[styles.newsList, { borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 8 }]}>
        {rest.map((item) => <Text key={item.id} numberOfLines={1} style={[styles.priceSymbol, { color: theme.foreground, fontSize: f(11) }]}>{item.title}</Text>)}
      </View>}
    </View>;
  }

  if (design === 'ticker') {
    const count = size === 'large' ? 4 : size === 'medium' ? 3 : 2;
    return <View style={[styles.widgetCard, widgetSizes[size], { backgroundColor: theme.background, borderColor: theme.border }]}>
      <WidgetHeader theme={theme} f={f} eyebrow="NEWS TICKER" kicker="실시간" />
      <View style={[styles.tickerBox, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        {items.slice(0, count).map((item, index) => <Pressable key={item.id} testID={`widget-news-${item.id}`} onPress={() => { void Linking.openURL(item.sourceUrl); }} style={[styles.tickerRow, { borderTopColor: theme.border, borderTopWidth: index === 0 ? 0 : 1 }]}>
          <Text style={[styles.stackRank, { color: theme.muted, fontSize: f(9) }]}>0{index + 1}</Text>
          <Text numberOfLines={1} style={[styles.priceSymbol, { color: theme.foreground, fontSize: f(11), flex: 1 }]}>{item.title}</Text>
          <Text style={[styles.widgetSymbol, { color: theme.muted, fontSize: f(9) }]}>{item.relativeTime}</Text>
        </Pressable>)}
      </View>
    </View>;
  }

  // room (newsroom stack, default)
  const count = size === 'small' ? 2 : size === 'medium' ? 3 : 4;
  return <View style={[styles.widgetCard, widgetSizes[size], { backgroundColor: theme.background, borderColor: theme.border }]}>
    <WidgetHeader theme={theme} f={f} eyebrow="NEWSROOM STACK" kicker="실시간" />
    <View style={styles.newsList}>
      {items.slice(0, count).map((item) => <Pressable key={item.id} testID={`widget-news-${item.id}`} onPress={() => { void Linking.openURL(item.sourceUrl); }} style={({ pressed }) => [styles.widgetNewsRow, { borderBottomColor: theme.border, opacity: pressed ? 0.68 : 1 }]}>
        <View style={styles.newsKickerRow}><Text style={[styles.newsKicker, { color: item.importance === 'breaking' ? theme.negative : theme.primary, fontSize: f(9) }]}>{newsKickerLabel(item)}</Text><Text style={[styles.widgetSymbol, { color: theme.muted, fontSize: f(9) }]}>{item.relativeTime}</Text></View>
        <Text numberOfLines={size === 'small' ? 1 : 2} style={[styles.widgetHeadline, { color: theme.foreground, fontSize: f(size === 'large' ? 14 : 13), lineHeight: f(size === 'large' ? 19 : 18) }]}>{item.title}</Text>
      </Pressable>)}
    </View>
    <View style={[styles.newsFooter, { borderTopColor: theme.border }]}><Text style={[styles.source, { color: theme.primary, fontSize: f(10) }]}>블록미디어 RSS</Text><Text style={[styles.widgetSymbol, { color: theme.muted, fontSize: f(9) }]}>헤드라인을 누르면 원문 열기</Text></View>
  </View>;
}

function formatKrwPrice(price: number) {
  return `₩${Math.round(price).toLocaleString('ko-KR')}`;
}

const widgetSizes = StyleSheet.create({
  small: { width: 250, minHeight: 184 },
  medium: { width: '100%', minHeight: 232 },
  large: { width: '100%', minHeight: 292 },
});

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  back: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerCopy: { flex: 1 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.2 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 27, letterSpacing: -1.1, marginTop: 4 },
  intro: { fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 19, marginBottom: 26 },
  label: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.1, marginBottom: 9 },
  segmentRow: { flexDirection: 'row', gap: 9, marginBottom: 24 },
  segment: { flex: 1, minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 14, paddingHorizontal: 12 },
  segmentText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  segmentCheck: { marginLeft: 'auto' },
  dropdownTrigger: { minHeight: 47, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 9, borderWidth: 1, borderRadius: 13, paddingHorizontal: 13, marginBottom: 8 },
  dropdownTriggerText: { flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  dropdownPanel: { borderWidth: 1, borderRadius: 16, padding: 12, marginBottom: 24 },
  dropdownCloseButton: { alignItems: 'center', borderTopWidth: 1, paddingTop: 12, marginTop: 4 },
  dropdownCloseText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  coinPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  coinChip: { minWidth: 74, minHeight: 38, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderRadius: 12, paddingHorizontal: 10 },
  coinDot: { width: 7, height: 7, borderRadius: 4 },
  coinChipText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  searchBox: { minHeight: 47, flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderRadius: 13, paddingHorizontal: 13, marginBottom: 10 },
  searchInput: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13, paddingVertical: 10 },
  coinHint: { fontFamily: 'Inter_500Medium', fontSize: 10, lineHeight: 15, marginBottom: 10 },
  noResults: { fontFamily: 'Inter_500Medium', fontSize: 12, marginBottom: 8 },
  themePicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  themeChip: { minWidth: 92, alignItems: 'center', gap: 7, borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10 },
  themeSwatchRow: { flexDirection: 'row', gap: 4 },
  themeSwatch: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: 'transparent' },
  themeChipText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  themeCheck: { position: 'absolute', top: 6, right: 6 },
  sizeRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  sizeControl: { flex: 1, alignItems: 'center', borderWidth: 1, borderRadius: 13, paddingVertical: 10 },
  sizeText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  sizeMeasure: { fontFamily: 'Inter_500Medium', fontSize: 9, marginTop: 3 },
  previewWell: { minHeight: 340, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 20, padding: 18, marginBottom: 16 },
  widgetCard: { borderWidth: 1, borderRadius: 20, padding: 15, justifyContent: 'space-between', alignSelf: 'center' },
  widgetTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  assetLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  assetIcon: { width: 29, height: 29, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  widgetName: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  widgetSymbol: { fontFamily: 'Inter_500Medium', fontSize: 9, letterSpacing: 0.3, marginTop: 2 },
  liveText: { fontFamily: 'Inter_600SemiBold', fontSize: 9 },
  priceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  priceCell: { width: '47%', borderWidth: 1, borderRadius: 11, padding: 9 },
  priceCellTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4 },
  priceSymbol: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  priceChange: { fontFamily: 'Inter_700Bold', fontSize: 8 },
  widgetPrice: { fontFamily: 'Inter_700Bold', fontSize: 12, marginTop: 7, letterSpacing: -0.35 },
  priceFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 10, marginTop: 12 },
  footerMetric: { fontFamily: 'Inter_500Medium', fontSize: 9 },
  newsTop: { paddingBottom: 12, borderBottomWidth: 1 },
  newsList: { flex: 1, justifyContent: 'center' },
  widgetNewsRow: { paddingVertical: 9, borderBottomWidth: 1 },
  newsKickerRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 4 },
  newsKicker: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.4 },
  widgetHeadline: { fontFamily: 'Inter_700Bold', fontSize: 13, lineHeight: 18, letterSpacing: -0.35 },
  widgetState: { flex: 1, minHeight: 95, alignItems: 'center', justifyContent: 'center' },
  widgetStateText: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  newsFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 10 },
  source: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  summary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 16, padding: 15, marginBottom: 12, gap: 12 },
  summaryCopy: { flex: 1 },
  summaryKicker: { fontFamily: 'Inter_500Medium', fontSize: 10 },
  summaryTitle: { fontFamily: 'Inter_700Bold', fontSize: 13, marginTop: 5, letterSpacing: -0.3 },
  saveButton: { minHeight: 52, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  saveText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  savedNote: { fontFamily: 'Inter_600SemiBold', fontSize: 11, textAlign: 'center', marginTop: 12 },
  designGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  designChip: { minWidth: '31%', flexGrow: 1, borderWidth: 1, borderRadius: 13, paddingVertical: 10, paddingHorizontal: 11 },
  designChipText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  designChipNote: { fontFamily: 'Inter_500Medium', fontSize: 9, marginTop: 3 },
  designCheck: { position: 'absolute', top: 8, right: 8 },
  gridHalf: { width: '47%' },
  beaconHero: { borderWidth: 1, borderRadius: 16, padding: 12, marginTop: 12, gap: 6 },
  beaconPrice: { fontFamily: 'Inter_700Bold', letterSpacing: -0.6, marginTop: 4 },
  stackList: { gap: 5, marginTop: 12 },
  stackRow: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 11, borderLeftWidth: 3, paddingVertical: 8, paddingHorizontal: 10 },
  stackRank: { fontFamily: 'Inter_600SemiBold', width: 16 },
  tickerBox: { borderWidth: 1, borderRadius: 15, marginTop: 12 },
  tickerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 11 },
  tickerLine: { flex: 1, height: 1 },
  briefingHero: { borderRadius: 15, padding: 12, marginTop: 12, gap: 6 },
  headlineHero: { borderRadius: 15, padding: 12, marginTop: 12, gap: 6 },
  headlineSecondaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
});
