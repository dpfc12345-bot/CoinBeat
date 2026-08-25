import React from 'react';
import type { WidgetInfo, WidgetTaskHandlerProps } from 'react-native-android-widget';
import { MarketNewsWidget } from '@/src/widgets/MarketNewsWidget';
import { MarketPriceWidget } from '@/src/widgets/MarketPriceWidget';
import { getNewsWidgetData, getPriceWidgetData } from '@/src/widgets/data';
import { loadWidgetPreferences } from '@/src/widgets/preferences';
import { widgetTheme } from '@/src/widgets/theme';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

async function renderPriceWidget(widgetInfo: WidgetInfo) {
  const [assets, preferences] = await Promise.all([getPriceWidgetData(), loadWidgetPreferences()]);
  const selectedAssets = assets.filter((asset) => preferences.selectedSymbols.includes(asset.symbol));
  if (assets.length === 0) throw new Error('표시할 가격 정보가 없습니다.');
  return <MarketPriceWidget assets={selectedAssets.length > 0 ? selectedAssets : assets.slice(0, 4)} widgetInfo={widgetInfo} />;
}

async function renderNewsWidget(widgetInfo: WidgetInfo) {
  const news = await getNewsWidgetData();
  if (news.length === 0) throw new Error('표시할 최신 뉴스가 없습니다.');
  return <MarketNewsWidget items={news} widgetInfo={widgetInfo} />;
}

function WidgetError({ title = 'MARKET PULSE', message }: { title?: string; message: string }) {
  return (
    <FlexWidget clickAction="OPEN_URI" clickActionData={{ uri: 'market-pulse://widgets' }} style={{ backgroundColor: widgetTheme.background, borderRadius: 22, padding: 16, flexDirection: 'column', flexGap: 8 }}>
      <TextWidget text={title} style={{ color: widgetTheme.foreground, fontSize: 13, fontWeight: '700' }} />
      <TextWidget text={message} maxLines={3} truncate="END" style={{ color: widgetTheme.muted, fontSize: 12, lineHeight: 16 }} />
      <TextWidget text="탭하여 앱에서 설정 확인" style={{ color: widgetTheme.primary, fontSize: 11, fontWeight: '700' }} />
    </FlexWidget>
  );
}

export async function renderMarketPulseWidget(widgetName: string, widgetInfo: WidgetInfo) {
  try {
    if (widgetName === 'MarketPrice') return await renderPriceWidget(widgetInfo);
    if (widgetName === 'MarketNews') return await renderNewsWidget(widgetInfo);
    return <WidgetError title="MARKET PULSE" message="알 수 없는 위젯입니다. 탭하여 다시 설정하세요." />;
  } catch (error) {
    const label = widgetName === 'MarketNews' ? 'MARKET PULSE NEWS' : 'MARKET PULSE · KRW';
    const message = error instanceof Error ? error.message : '위젯을 불러오지 못했습니다.';
    return <WidgetError title={label} message={message} />;
  }
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
  if (props.widgetAction === 'WIDGET_DELETED') return;
  props.renderWidget(await renderMarketPulseWidget(props.widgetInfo.widgetName, props.widgetInfo));
}