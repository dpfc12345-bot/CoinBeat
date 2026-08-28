"use no memo";

import React from 'react';
import { FlexWidget, TextWidget, type WidgetInfo } from 'react-native-android-widget';
import type { WidgetAsset } from '@/src/widgets/data';
import { getWidgetThemeColors, scaleWidgetFont, type WidgetColorTheme, type WidgetFontSize, type WidgetThemeColors } from '@/src/widgets/theme';
import type { PriceWidgetDesign } from '@/src/widgets/designs';

function formatPrice(price: number) {
  return `₩${Math.round(price).toLocaleString('ko-KR')}`;
}

type Bucket = 'small' | 'medium' | 'large';

function bucketOf(widgetInfo: WidgetInfo): Bucket {
  if (widgetInfo.height >= 300) return 'large';
  if (widgetInfo.height >= 220) return 'medium';
  return 'small';
}

type AssetCardProps = {
  asset: WidgetAsset;
  theme: WidgetThemeColors;
  f: (base: number) => number;
  showName?: boolean;
};

function AssetChangeText({ asset, theme, f }: AssetCardProps) {
  return (
    <TextWidget
      text={`${asset.change24h >= 0 ? '+' : ''}${asset.change24h.toFixed(2)}%`}
      style={{ color: asset.change24h >= 0 ? theme.positive : theme.negative, fontSize: f(10), fontWeight: '700' }}
    />
  );
}

function AssetCard({ asset, theme, f, showName }: AssetCardProps) {
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: `market-pulse://coin/${asset.symbol}` }}
      style={{ flex: 1, backgroundColor: theme.surface, borderRadius: 13, padding: 10, flexDirection: 'column', flexGap: 4 }}
    >
      <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextWidget text={asset.symbol} style={{ color: theme.foreground, fontSize: f(12), fontWeight: '700' }} />
        <AssetChangeText asset={asset} theme={theme} f={f} />
      </FlexWidget>
      {showName && <TextWidget text={asset.name} style={{ color: theme.muted, fontSize: f(9) }} />}
      <TextWidget text={formatPrice(asset.price)} style={{ color: theme.foreground, fontSize: f(13), fontWeight: '700' }} />
    </FlexWidget>
  );
}

function HeaderRow({ theme, f, eyebrow, kicker }: { theme: WidgetThemeColors; f: (base: number) => number; eyebrow: string; kicker?: string }) {
  return (
    <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <TextWidget text={eyebrow} style={{ color: theme.foreground, fontSize: f(13), fontWeight: '700' }} />
      <TextWidget text={kicker ?? '실시간'} style={{ color: theme.positive, fontSize: f(11), fontWeight: '700' }} />
    </FlexWidget>
  );
}

function BeaconDesign({ assets, theme, f, bucket }: { assets: WidgetAsset[]; theme: WidgetThemeColors; f: (base: number) => number; bucket: Bucket }) {
  const lead = assets[0];
  const rest = assets.slice(1, bucket === 'large' ? 4 : 3);
  return (
    <FlexWidget style={{ flexDirection: 'column', flexGap: 10 }}>
      <HeaderRow theme={theme} f={f} eyebrow="PULSE BEACON" />
      <FlexWidget
        clickAction="OPEN_URI"
        clickActionData={{ uri: `market-pulse://coin/${lead.symbol}` }}
        style={{ backgroundColor: theme.surface, borderRadius: 18, borderWidth: 1, borderColor: theme.border, padding: 14, flexDirection: 'column', flexGap: 6 }}
      >
        <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextWidget text={`${lead.symbol} · ${lead.name}`} style={{ color: theme.muted, fontSize: f(10), fontWeight: '700' }} />
          <AssetChangeText asset={lead} theme={theme} f={f} />
        </FlexWidget>
        <TextWidget text={formatPrice(lead.price)} style={{ color: theme.foreground, fontSize: f(24), fontWeight: '700' }} />
      </FlexWidget>
      {bucket !== 'small' && rest.length > 0 && (
        <FlexWidget style={{ flexDirection: 'row', flexGap: 8 }}>
          {rest.map((asset) => <AssetCard key={asset.symbol} asset={asset} theme={theme} f={f} />)}
        </FlexWidget>
      )}
      <TextWidget text="탭하여 앱에서 더 보기" style={{ color: theme.muted, fontSize: f(10) }} />
    </FlexWidget>
  );
}

function DeskDesign({ assets, widgetInfo, theme, f, bucket }: { assets: WidgetAsset[]; widgetInfo: WidgetInfo; theme: WidgetThemeColors; f: (base: number) => number; bucket: Bucket }) {
  const columns = widgetInfo.width >= 300 ? 2 : 1;
  const visibleAssetCount = bucket === 'large' ? 8 : bucket === 'medium' ? 4 : columns === 2 ? 2 : 1;
  const visibleAssets = assets.slice(0, visibleAssetCount);
  const rows = Array.from({ length: Math.ceil(visibleAssets.length / columns) }, (_, index) => visibleAssets.slice(index * columns, (index + 1) * columns));
  return (
    <FlexWidget style={{ flexDirection: 'column', flexGap: 8 }}>
      <HeaderRow theme={theme} f={f} eyebrow="NIGHT DESK" />
      <FlexWidget style={{ flexDirection: 'column', flexGap: 8 }}>
        {rows.map((row, index) => (
          <FlexWidget key={`${index}-${row[0]?.symbol ?? 'row'}`} style={{ flexDirection: columns === 2 ? 'row' : 'column', flexGap: 8 }}>
            {Array.from({ length: columns }, (_, slot) => row[slot]).map((asset, slot) => asset
              ? <AssetCard key={asset.symbol} asset={asset} theme={theme} f={f} />
              : <FlexWidget key={`empty-${slot}`} style={{ flex: 1 }} />)}
          </FlexWidget>
        ))}
      </FlexWidget>
      <TextWidget text="탭하여 앱에서 더 보기" style={{ color: theme.muted, fontSize: f(10) }} />
    </FlexWidget>
  );
}

function StackDesign({ assets, theme, f, bucket }: { assets: WidgetAsset[]; theme: WidgetThemeColors; f: (base: number) => number; bucket: Bucket }) {
  const count = bucket === 'large' ? 6 : bucket === 'medium' ? 4 : 2;
  return (
    <FlexWidget style={{ flexDirection: 'column', flexGap: 8 }}>
      <HeaderRow theme={theme} f={f} eyebrow="SIGNAL STACK" kicker="우선순위" />
      <FlexWidget style={{ flexDirection: 'column', flexGap: 4 }}>
        {assets.slice(0, count).map((asset, index) => (
          <FlexWidget
            key={asset.symbol}
            clickAction="OPEN_URI"
            clickActionData={{ uri: `market-pulse://coin/${asset.symbol}` }}
            style={{ flexDirection: 'row', alignItems: 'center', flexGap: 8, backgroundColor: theme.surface, borderRadius: 12, borderLeftWidth: 3, borderLeftColor: asset.change24h >= 0 ? theme.positive : theme.negative, paddingVertical: 8, paddingHorizontal: 10 }}
          >
            <TextWidget text={`0${index + 1}`} style={{ color: theme.muted, fontSize: f(9), width: 16 }} />
            <FlexWidget style={{ flex: 1 }}>
              <TextWidget text={asset.symbol} style={{ color: theme.foreground, fontSize: f(12), fontWeight: '700' }} />
            </FlexWidget>
            <TextWidget text={formatPrice(asset.price)} style={{ color: theme.foreground, fontSize: f(11), fontWeight: '700' }} />
            <AssetChangeText asset={asset} theme={theme} f={f} />
          </FlexWidget>
        ))}
      </FlexWidget>
    </FlexWidget>
  );
}

function TickerDesign({ assets, theme, f, bucket }: { assets: WidgetAsset[]; theme: WidgetThemeColors; f: (base: number) => number; bucket: Bucket }) {
  const count = bucket === 'large' ? 6 : bucket === 'medium' ? 4 : 2;
  return (
    <FlexWidget style={{ flexDirection: 'column', flexGap: 10 }}>
      <HeaderRow theme={theme} f={f} eyebrow="TICKER WINDOW" kicker="LIVE" />
      <FlexWidget style={{ borderRadius: 16, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.surface, flexDirection: 'column' }}>
        {assets.slice(0, count).map((asset, index) => (
          <FlexWidget
            key={asset.symbol}
            clickAction="OPEN_URI"
            clickActionData={{ uri: `market-pulse://coin/${asset.symbol}` }}
            style={{ flexDirection: 'row', alignItems: 'center', flexGap: 8, paddingVertical: 9, paddingHorizontal: 12, borderTopWidth: index === 0 ? 0 : 1, borderTopColor: theme.border }}
          >
            <TextWidget text={asset.symbol} style={{ color: theme.foreground, fontSize: f(12), fontWeight: '700', width: 44 }} />
            <FlexWidget style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
            <TextWidget text={formatPrice(asset.price)} style={{ color: theme.foreground, fontSize: f(11), fontWeight: '700' }} />
            <AssetChangeText asset={asset} theme={theme} f={f} />
          </FlexWidget>
        ))}
      </FlexWidget>
    </FlexWidget>
  );
}

function BriefingDesign({ assets, theme, f, bucket }: { assets: WidgetAsset[]; theme: WidgetThemeColors; f: (base: number) => number; bucket: Bucket }) {
  const topMover = assets.reduce((best, asset) => (Math.abs(asset.change24h) > Math.abs(best.change24h) ? asset : best), assets[0]);
  const grid = assets.filter((asset) => asset.symbol !== topMover.symbol).slice(0, bucket === 'large' ? 4 : 2);
  return (
    <FlexWidget style={{ flexDirection: 'column', flexGap: 10 }}>
      <HeaderRow theme={theme} f={f} eyebrow="DAILY BRIEFING" kicker="시장 요약" />
      <FlexWidget style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 12, flexDirection: 'column', flexGap: 6 }}>
        <TextWidget text="오늘의 최대 변동 코인" style={{ color: theme.muted, fontSize: f(9), fontWeight: '700' }} />
        <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextWidget text={`${topMover.symbol} · ${formatPrice(topMover.price)}`} style={{ color: theme.foreground, fontSize: f(13), fontWeight: '700' }} />
          <AssetChangeText asset={topMover} theme={theme} f={f} />
        </FlexWidget>
      </FlexWidget>
      {bucket !== 'small' && grid.length > 0 && (
        <FlexWidget style={{ flexDirection: 'row', flexGap: 8 }}>
          {grid.map((asset) => <AssetCard key={asset.symbol} asset={asset} theme={theme} f={f} />)}
        </FlexWidget>
      )}
    </FlexWidget>
  );
}

function ElasticDesign({ assets, widgetInfo, theme, f, bucket }: { assets: WidgetAsset[]; widgetInfo: WidgetInfo; theme: WidgetThemeColors; f: (base: number) => number; bucket: Bucket }) {
  if (bucket === 'small') {
    const lead = assets[0];
    return (
      <FlexWidget style={{ flexDirection: 'column', flexGap: 10 }}>
        <HeaderRow theme={theme} f={f} eyebrow="ELASTIC GRID" kicker="자동 조정" />
        <AssetCard asset={lead} theme={theme} f={f} showName />
      </FlexWidget>
    );
  }
  const columns = widgetInfo.width >= 300 ? 2 : 1;
  const count = bucket === 'large' ? 8 : 4;
  const visible = assets.slice(0, count);
  const rows = Array.from({ length: Math.ceil(visible.length / columns) }, (_, index) => visible.slice(index * columns, (index + 1) * columns));
  return (
    <FlexWidget style={{ flexDirection: 'column', flexGap: 8 }}>
      <HeaderRow theme={theme} f={f} eyebrow="ELASTIC GRID" kicker="자동 조정" />
      <FlexWidget style={{ flexDirection: 'column', flexGap: 8 }}>
        {rows.map((row, index) => (
          <FlexWidget key={`${index}-${row[0]?.symbol ?? 'row'}`} style={{ flexDirection: columns === 2 ? 'row' : 'column', flexGap: 8 }}>
            {Array.from({ length: columns }, (_, slot) => row[slot]).map((asset, slot) => asset
              ? <AssetCard key={asset.symbol} asset={asset} theme={theme} f={f} />
              : <FlexWidget key={`empty-${slot}`} style={{ flex: 1 }} />)}
          </FlexWidget>
        ))}
      </FlexWidget>
      <TextWidget text="화면 크기에 맞춰 자동 조정" style={{ color: theme.muted, fontSize: f(10) }} />
    </FlexWidget>
  );
}

export function MarketPriceWidget({
  assets,
  widgetInfo,
  colorTheme = 'midnight',
  fontSize = 'default',
  design = 'desk',
}: {
  assets: WidgetAsset[];
  widgetInfo: WidgetInfo;
  colorTheme?: WidgetColorTheme;
  fontSize?: WidgetFontSize;
  design?: PriceWidgetDesign;
}) {
  const theme: WidgetThemeColors = getWidgetThemeColors(colorTheme);
  const f = (base: number) => scaleWidgetFont(base, fontSize);
  const bucket = bucketOf(widgetInfo);

  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'market-pulse://widgets' }}
      accessibilityLabel="CoinBeat 실시간 KRW 가격"
      style={{ backgroundColor: theme.background, borderRadius: 22, padding: 16, flexDirection: 'column' }}
    >
      {design === 'beacon' && <BeaconDesign assets={assets} theme={theme} f={f} bucket={bucket} />}
      {design === 'desk' && <DeskDesign assets={assets} widgetInfo={widgetInfo} theme={theme} f={f} bucket={bucket} />}
      {design === 'stack' && <StackDesign assets={assets} theme={theme} f={f} bucket={bucket} />}
      {design === 'ticker' && <TickerDesign assets={assets} theme={theme} f={f} bucket={bucket} />}
      {design === 'briefing' && <BriefingDesign assets={assets} theme={theme} f={f} bucket={bucket} />}
      {design === 'elastic' && <ElasticDesign assets={assets} widgetInfo={widgetInfo} theme={theme} f={f} bucket={bucket} />}
    </FlexWidget>
  );
}
