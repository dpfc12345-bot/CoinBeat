"use no memo";

import React from 'react';
import { FlexWidget, TextWidget, type WidgetInfo } from 'react-native-android-widget';
import type { WidgetNews } from '@/src/widgets/data';
import { getWidgetThemeColors, scaleWidgetFont, type WidgetColorTheme, type WidgetFontSize, type WidgetThemeColors } from '@/src/widgets/theme';
import type { NewsWidgetDesign } from '@/src/widgets/designs';

type Bucket = 'small' | 'medium' | 'large';

function bucketOf(widgetInfo: WidgetInfo): Bucket {
  if (widgetInfo.height >= 240) return 'large';
  if (widgetInfo.width >= 300) return 'medium';
  return 'small';
}

function newsKicker(item: WidgetNews) {
  return item.importance === 'breaking' ? '속보' : (item.relatedSymbols.join(' · ') || 'MARKET');
}

function HeaderRow({ theme, f, eyebrow, kicker }: { theme: WidgetThemeColors; f: (base: number) => number; eyebrow: string; kicker: string }) {
  return (
    <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <TextWidget text={eyebrow} style={{ color: theme.foreground, fontSize: f(13), fontWeight: '700' }} />
      <TextWidget text={kicker} style={{ color: theme.primary, fontSize: f(10), fontWeight: '700' }} />
    </FlexWidget>
  );
}

function HeadlineDesign({ items, theme, f, bucket }: { items: WidgetNews[]; theme: WidgetThemeColors; f: (base: number) => number; bucket: Bucket }) {
  const lead = items[0];
  const rest = items.slice(1, bucket === 'large' ? 3 : bucket === 'medium' ? 2 : 1);
  return (
    <FlexWidget style={{ flexDirection: 'column', flexGap: 10 }}>
      <HeaderRow theme={theme} f={f} eyebrow="HEADLINE BEACON" kicker="LIVE" />
      <FlexWidget
        clickAction="OPEN_URI"
        clickActionData={{ uri: lead.sourceUrl }}
        style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 12, flexDirection: 'column', flexGap: 8 }}
      >
        <TextWidget text={newsKicker(lead)} style={{ color: lead.importance === 'breaking' ? theme.negative : theme.primary, fontSize: f(9), fontWeight: '700' }} />
        <TextWidget text={lead.title} maxLines={bucket === 'small' ? 2 : 3} truncate="END" style={{ color: theme.foreground, fontSize: f(bucket === 'large' ? 16 : 14), fontWeight: '700', lineHeight: f(20) }} />
        <TextWidget text={lead.relativeTime} style={{ color: theme.muted, fontSize: f(9) }} />
      </FlexWidget>
      {rest.length > 0 && rest.map((item) => (
        <FlexWidget key={item.id} clickAction="OPEN_URI" clickActionData={{ uri: item.sourceUrl }} style={{ flexDirection: 'row', justifyContent: 'space-between', flexGap: 8 }}>
          <FlexWidget style={{ flex: 1 }}>
            <TextWidget text={item.title} maxLines={1} truncate="END" style={{ color: theme.foreground, fontSize: f(11), fontWeight: '700' }} />
          </FlexWidget>
          <TextWidget text={item.relativeTime} style={{ color: theme.muted, fontSize: f(9) }} />
        </FlexWidget>
      ))}
    </FlexWidget>
  );
}

function RoomDesign({ items, theme, f, bucket }: { items: WidgetNews[]; theme: WidgetThemeColors; f: (base: number) => number; bucket: Bucket }) {
  const count = bucket === 'large' ? 4 : bucket === 'medium' ? 3 : 2;
  return (
    <FlexWidget style={{ flexDirection: 'column', flexGap: 8 }}>
      <HeaderRow theme={theme} f={f} eyebrow="NEWSROOM STACK" kicker="블록미디어 RSS" />
      {items.slice(0, count).map((item, index) => (
        <FlexWidget
          key={item.id}
          clickAction="OPEN_URI"
          clickActionData={{ uri: item.sourceUrl }}
          style={{ borderTopWidth: index === 0 ? 0 : 1, borderTopColor: theme.border, paddingTop: index === 0 ? 0 : 7, flexDirection: 'column', flexGap: 3 }}
        >
          <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextWidget text={newsKicker(item)} style={{ color: item.importance === 'breaking' ? theme.negative : theme.primary, fontSize: f(9), fontWeight: '700' }} />
            <TextWidget text={item.relativeTime} style={{ color: theme.muted, fontSize: f(9) }} />
          </FlexWidget>
          <TextWidget text={item.title} maxLines={2} truncate="END" style={{ color: theme.foreground, fontSize: f(12), fontWeight: '700', lineHeight: f(16) }} />
        </FlexWidget>
      ))}
      <TextWidget text="헤드라인을 탭하여 원문 열기" style={{ color: theme.muted, fontSize: f(10) }} />
    </FlexWidget>
  );
}

function BriefDesign({ items, theme, f, bucket }: { items: WidgetNews[]; theme: WidgetThemeColors; f: (base: number) => number; bucket: Bucket }) {
  const lead = items[0];
  const rest = items.slice(1, bucket === 'large' ? 3 : 1);
  return (
    <FlexWidget style={{ flexDirection: 'column', flexGap: 10 }}>
      <HeaderRow theme={theme} f={f} eyebrow="MARKET BRIEFING" kicker="요약" />
      <FlexWidget style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 12, flexDirection: 'column', flexGap: 8 }}>
        <TextWidget text={lead.title} maxLines={bucket === 'small' ? 2 : 3} truncate="END" style={{ color: theme.foreground, fontSize: f(bucket === 'large' ? 14 : 12), fontWeight: '700', lineHeight: f(18) }} />
        <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextWidget text="블록미디어" style={{ color: theme.muted, fontSize: f(9) }} />
          <TextWidget text={lead.relativeTime} style={{ color: theme.muted, fontSize: f(9) }} />
        </FlexWidget>
      </FlexWidget>
      {rest.length > 0 && (
        <FlexWidget style={{ borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 8, flexDirection: 'column', flexGap: 3 }}>
          {rest.map((item) => (
            <TextWidget key={item.id} text={item.title} maxLines={1} truncate="END" style={{ color: theme.foreground, fontSize: f(11), fontWeight: '700' }} />
          ))}
        </FlexWidget>
      )}
    </FlexWidget>
  );
}

function TickerDesign({ items, theme, f, bucket }: { items: WidgetNews[]; theme: WidgetThemeColors; f: (base: number) => number; bucket: Bucket }) {
  const count = bucket === 'large' ? 4 : bucket === 'medium' ? 3 : 2;
  return (
    <FlexWidget style={{ flexDirection: 'column', flexGap: 10 }}>
      <HeaderRow theme={theme} f={f} eyebrow="NEWS TICKER" kicker="실시간" />
      <FlexWidget style={{ borderRadius: 16, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.surface, flexDirection: 'column' }}>
        {items.slice(0, count).map((item, index) => (
          <FlexWidget
            key={item.id}
            clickAction="OPEN_URI"
            clickActionData={{ uri: item.sourceUrl }}
            style={{ flexDirection: 'row', alignItems: 'center', flexGap: 8, paddingVertical: 8, paddingHorizontal: 11, borderTopWidth: index === 0 ? 0 : 1, borderTopColor: theme.border }}
          >
            <TextWidget text={`0${index + 1}`} style={{ color: theme.muted, fontSize: f(9), width: 16 }} />
            <FlexWidget style={{ flex: 1 }}>
              <TextWidget text={item.title} maxLines={1} truncate="END" style={{ color: theme.foreground, fontSize: f(11), fontWeight: '700' }} />
            </FlexWidget>
            <TextWidget text={item.relativeTime} style={{ color: theme.muted, fontSize: f(9) }} />
          </FlexWidget>
        ))}
      </FlexWidget>
    </FlexWidget>
  );
}

export function MarketNewsWidget({
  items,
  widgetInfo,
  colorTheme = 'midnight',
  fontSize = 'default',
  design = 'room',
}: {
  items: WidgetNews[];
  widgetInfo: WidgetInfo;
  colorTheme?: WidgetColorTheme;
  fontSize?: WidgetFontSize;
  design?: NewsWidgetDesign;
}) {
  const theme: WidgetThemeColors = getWidgetThemeColors(colorTheme);
  const f = (base: number) => scaleWidgetFont(base, fontSize);
  const bucket = bucketOf(widgetInfo);

  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'market-pulse://widgets' }}
      accessibilityLabel="CoinBeat 최신 암호화폐 뉴스"
      style={{ backgroundColor: theme.background, borderRadius: 22, padding: 16, flexDirection: 'column' }}
    >
      {design === 'headline' && <HeadlineDesign items={items} theme={theme} f={f} bucket={bucket} />}
      {design === 'room' && <RoomDesign items={items} theme={theme} f={f} bucket={bucket} />}
      {design === 'brief' && <BriefDesign items={items} theme={theme} f={f} bucket={bucket} />}
      {design === 'ticker' && <TickerDesign items={items} theme={theme} f={f} bucket={bucket} />}
    </FlexWidget>
  );
}
