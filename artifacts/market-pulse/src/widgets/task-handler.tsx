import React from 'react';
import type { WidgetInfo, WidgetTaskHandlerProps } from 'react-native-android-widget';
import { MarketNewsWidget } from '@/src/widgets/MarketNewsWidget';
import { MarketPriceWidget } from '@/src/widgets/MarketPriceWidget';
import { getWidgetData } from '@/src/widgets/data';
import { loadWidgetPreferences } from '@/src/widgets/preferences';
import { widgetTheme } from '@/src/widgets/theme';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

async function renderPriceWidget(widgetInfo: WidgetInfo) {
  try {
    const [{ assets }, preferences] = await Promise.all([getWidgetData(), loadWidgetPreferences()]);
    const selectedAssets = assets.filter((asset) => preferences.selectedSymbols.includes(asset.symbol));
    return <MarketPriceWidget assets={selectedAssets.length > 0 ? selectedAssets : assets.slice(0, 4)} widgetInfo={widgetInfo} />;
  } catch (error) {
    return <WidgetError message={error instanceof Error ? error.message : '가격을 불러오지 못했습니다.'} />;
  }
}

async function renderNewsWidget(widgetInfo: WidgetInfo) {
  try {
    const [{ news }] = await Promise.all([getWidgetData(), loadWidgetPreferences()]);
    return <MarketNewsWidget items={news} widgetInfo={widgetInfo} />;
  } catch (error) {
    return <WidgetError message={error instanceof Error ? error.message : '뉴스를 불러오지 못했습니다.'} />;
  }
}

function WidgetError({ message }: { message: string }) {
  return (
    <FlexWidget clickAction="OPEN_URI" clickActionData={{ uri: 'market-pulse://widgets' }} style={{ backgroundColor: widgetTheme.background, borderRadius: 22, padding: 16, flexDirection: 'column', flexGap: 8 }}>
      <TextWidget text="MARKET PULSE" style={{ color: widgetTheme.foreground, fontSize: 13, fontWeight: '700' }} />
      <TextWidget text={message} maxLines={3} truncate="END" style={{ color: widgetTheme.muted, fontSize: 12, lineHeight: 16 }} />
      <TextWidget text="탭하여 앱에서 설정 확인" style={{ color: widgetTheme.primary, fontSize: 11, fontWeight: '700' }} />
    </FlexWidget>
  );
}

export async function renderMarketPulseWidget(widgetName: string, widgetInfo: WidgetInfo) {
  return widgetName === 'MarketNews' ? renderNewsWidget(widgetInfo) : renderPriceWidget(widgetInfo);
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
  if (props.widgetAction === 'WIDGET_DELETED') return;
  props.renderWidget(await renderMarketPulseWidget(props.widgetInfo.widgetName, props.widgetInfo));
}