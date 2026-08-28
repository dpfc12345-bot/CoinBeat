"use no memo";

import React from 'react';
import type { WidgetInfo, WidgetTaskHandlerProps } from 'react-native-android-widget';
import { MarketNewsWidget } from '@/src/widgets/MarketNewsWidget';
import { MarketPriceWidget } from '@/src/widgets/MarketPriceWidget';
import { getNewsWidgetData, getPriceWidgetData } from '@/src/widgets/data';
import { defaultWidgetPreferences, loadWidgetPreferences, type WidgetPreferences } from '@/src/widgets/preferences';
import { getWidgetThemeColors, scaleWidgetFont, type WidgetColorTheme, type WidgetFontSize } from '@/src/widgets/theme';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

async function renderPriceWidget(widgetInfo: WidgetInfo, preferences: WidgetPreferences) {
  const assets = await getPriceWidgetData();
  const assetsBySymbol = new Map(assets.map((asset) => [asset.symbol, asset]));
  const selectedAssets = preferences.selectedSymbols
    .map((symbol) => assetsBySymbol.get(symbol))
    .filter((asset): asset is NonNullable<typeof asset> => Boolean(asset));
  if (assets.length === 0) throw new Error('표시할 가격 정보가 없습니다.');
  return (
    <MarketPriceWidget
      assets={selectedAssets.length > 0 ? selectedAssets : assets.slice(0, 4)}
      widgetInfo={widgetInfo}
      colorTheme={preferences.colorTheme}
      fontSize={preferences.fontSize}
    />
  );
}

async function renderNewsWidget(widgetInfo: WidgetInfo, preferences: WidgetPreferences) {
  const news = await getNewsWidgetData();
  if (news.length === 0) throw new Error('표시할 최신 뉴스가 없습니다.');
  return <MarketNewsWidget items={news} widgetInfo={widgetInfo} colorTheme={preferences.colorTheme} fontSize={preferences.fontSize} />;
}

function WidgetError({
  title = 'COINBEAT',
  message,
  colorTheme = 'midnight',
  fontSize = 'default',
}: {
  title?: string;
  message: string;
  colorTheme?: WidgetColorTheme;
  fontSize?: WidgetFontSize;
}) {
  const theme = getWidgetThemeColors(colorTheme);
  const f = (base: number) => scaleWidgetFont(base, fontSize);
  return (
    <FlexWidget clickAction="OPEN_URI" clickActionData={{ uri: 'market-pulse://widgets' }} style={{ backgroundColor: theme.background, borderRadius: 22, padding: 16, flexDirection: 'column', flexGap: 8 }}>
      <TextWidget text={title} style={{ color: theme.foreground, fontSize: f(13), fontWeight: '700' }} />
      <TextWidget text={message} maxLines={3} truncate="END" style={{ color: theme.muted, fontSize: f(12), lineHeight: f(16) }} />
      <TextWidget text="탭하여 앱에서 설정 확인" style={{ color: theme.primary, fontSize: f(11), fontWeight: '700' }} />
    </FlexWidget>
  );
}

export async function renderMarketPulseWidget(widgetName: string, widgetInfo: WidgetInfo) {
  const preferences = await loadWidgetPreferences().catch(() => defaultWidgetPreferences);
  try {
    if (widgetName === 'MarketPrice') return await renderPriceWidget(widgetInfo, preferences);
    if (widgetName === 'MarketNews') return await renderNewsWidget(widgetInfo, preferences);
    return <WidgetError title="COINBEAT" message="알 수 없는 위젯입니다. 탭하여 다시 설정하세요." colorTheme={preferences.colorTheme} fontSize={preferences.fontSize} />;
  } catch (error) {
    const label = widgetName === 'MarketNews' ? 'COINBEAT NEWS' : 'COINBEAT · KRW';
    const message = error instanceof Error ? error.message : '위젯을 불러오지 못했습니다.';
    return <WidgetError title={label} message={message} colorTheme={preferences.colorTheme} fontSize={preferences.fontSize} />;
  }
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
  if (props.widgetAction === 'WIDGET_DELETED') return;
  props.renderWidget(await renderMarketPulseWidget(props.widgetInfo.widgetName, props.widgetInfo));
}