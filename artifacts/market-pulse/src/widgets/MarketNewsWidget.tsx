"use no memo";

import React from 'react';
import { FlexWidget, TextWidget, type WidgetInfo } from 'react-native-android-widget';
import type { WidgetNews } from '@/src/widgets/data';
import { widgetTheme } from '@/src/widgets/theme';

export function MarketNewsWidget({ items, widgetInfo }: { items: WidgetNews[]; widgetInfo: WidgetInfo }) {
  const count = widgetInfo.height >= 240 ? 4 : widgetInfo.width >= 300 ? 3 : 2;
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'market-pulse://widgets' }}
      accessibilityLabel="Market Pulse 최신 암호화폐 뉴스"
      style={{ backgroundColor: widgetTheme.background, borderRadius: 22, padding: 16, flexDirection: 'column', flexGap: 8 }}
    >
      <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextWidget text="MARKET PULSE NEWS" style={{ color: widgetTheme.foreground, fontSize: 13, fontWeight: '700' }} />
        <TextWidget text="블록미디어 RSS" style={{ color: widgetTheme.primary, fontSize: 10, fontWeight: '700' }} />
      </FlexWidget>
      {items.slice(0, count).map((item) => (
        <FlexWidget
          key={item.id}
          clickAction="OPEN_URI"
          clickActionData={{ uri: item.sourceUrl }}
          accessibilityLabel={`${item.title} 상세 보기`}
          style={{ borderBottomWidth: 1, borderBottomColor: widgetTheme.border, paddingBottom: 7, flexDirection: 'column', flexGap: 3 }}
        >
          <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextWidget text={item.importance === 'breaking' ? '속보' : item.relatedSymbols.join(' · ') || 'MARKET'} style={{ color: item.importance === 'breaking' ? widgetTheme.negative : widgetTheme.primary, fontSize: 10, fontWeight: '700' }} />
            <TextWidget text={item.relativeTime} style={{ color: widgetTheme.muted, fontSize: 10 }} />
          </FlexWidget>
          <TextWidget text={item.title} maxLines={2} truncate="END" style={{ color: widgetTheme.foreground, fontSize: 13, fontWeight: '700', lineHeight: 17 }} />
        </FlexWidget>
      ))}
      <TextWidget text="헤드라인을 탭하여 블록미디어 원문 열기" style={{ color: widgetTheme.muted, fontSize: 10 }} />
    </FlexWidget>
  );
}