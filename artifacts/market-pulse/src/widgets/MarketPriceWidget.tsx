"use no memo";

import React from 'react';
import { FlexWidget, TextWidget, type WidgetInfo } from 'react-native-android-widget';
import type { WidgetAsset } from '@/src/widgets/data';
import { getWidgetThemeColors, scaleWidgetFont, type WidgetColorTheme, type WidgetFontSize, type WidgetThemeColors } from '@/src/widgets/theme';

function formatPrice(price: number) {
  return `₩${Math.round(price).toLocaleString('ko-KR')}`;
}

export function MarketPriceWidget({
  assets,
  widgetInfo,
  colorTheme = 'midnight',
  fontSize = 'default',
}: {
  assets: WidgetAsset[];
  widgetInfo: WidgetInfo;
  colorTheme?: WidgetColorTheme;
  fontSize?: WidgetFontSize;
}) {
  const theme: WidgetThemeColors = getWidgetThemeColors(colorTheme);
  const f = (base: number) => scaleWidgetFont(base, fontSize);
  const columns = widgetInfo.width >= 300 ? 2 : 1;
  const visibleAssetCount = widgetInfo.height >= 300 ? 8 : widgetInfo.height >= 220 ? 4 : columns === 2 ? 2 : 1;
  const visibleAssets = assets.slice(0, visibleAssetCount);
  const assetRows = Array.from({ length: Math.ceil(visibleAssets.length / columns) }, (_, index) => visibleAssets.slice(index * columns, (index + 1) * columns));
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'market-pulse://widgets' }}
      accessibilityLabel="Market Pulse 실시간 KRW 가격"
      style={{ backgroundColor: theme.background, borderRadius: 22, padding: 16, flexDirection: 'column', flexGap: 10 }}
    >
      <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextWidget text="MARKET PULSE · KRW" style={{ color: theme.foreground, fontSize: f(13), fontWeight: '700' }} />
        <TextWidget text="실시간" style={{ color: theme.positive, fontSize: f(11), fontWeight: '700' }} />
      </FlexWidget>
      <FlexWidget style={{ flexDirection: 'column', flexGap: 8 }}>
        {assetRows.map((row, index) => (
          <FlexWidget key={`${index}-${row[0]?.symbol ?? 'row'}`} style={{ flexDirection: columns === 2 ? 'row' : 'column', flexGap: 8 }}>
            {row.map((asset) => (
              <FlexWidget
                key={asset.symbol}
                clickAction="OPEN_URI"
                clickActionData={{ uri: `market-pulse://coin/${asset.symbol}` }}
                accessibilityLabel={`${asset.name} 상세 보기`}
                style={{ flex: 1, backgroundColor: theme.surface, borderRadius: 13, padding: 10, flexDirection: 'column', flexGap: 5 }}
              >
                <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TextWidget text={asset.symbol} style={{ color: theme.foreground, fontSize: f(13), fontWeight: '700' }} />
                  <TextWidget text={`${asset.change24h >= 0 ? '+' : ''}${asset.change24h.toFixed(2)}%`} style={{ color: asset.change24h >= 0 ? theme.positive : theme.negative, fontSize: f(10), fontWeight: '700' }} />
                </FlexWidget>
                <TextWidget text={formatPrice(asset.price)} style={{ color: theme.foreground, fontSize: f(16), fontWeight: '700' }} />
              </FlexWidget>
            ))}
          </FlexWidget>
        ))}
      </FlexWidget>
      <TextWidget text="탭하여 앱에서 더 보기" style={{ color: theme.muted, fontSize: f(10) }} />
    </FlexWidget>
  );
}