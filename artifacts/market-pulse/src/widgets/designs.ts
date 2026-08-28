export type PriceWidgetDesign = 'beacon' | 'desk' | 'stack' | 'ticker' | 'briefing' | 'elastic';
export type NewsWidgetDesign = 'headline' | 'room' | 'brief' | 'ticker';

export const priceWidgetDesignValues: PriceWidgetDesign[] = ['beacon', 'desk', 'stack', 'ticker', 'briefing', 'elastic'];
export const newsWidgetDesignValues: NewsWidgetDesign[] = ['headline', 'room', 'brief', 'ticker'];

export const priceWidgetDesignLabels: Record<PriceWidgetDesign, string> = {
  beacon: 'Pulse Beacon',
  desk: 'Night Desk',
  stack: 'Signal Stack',
  ticker: 'Ticker Window',
  briefing: 'Briefing Card',
  elastic: 'Elastic Grid',
};

export const priceWidgetDesignNotes: Record<PriceWidgetDesign, string> = {
  beacon: '대표 신호',
  desk: '트레이딩 보드',
  stack: '우선순위 목록',
  ticker: '파형 티커',
  briefing: '시장 브리핑',
  elastic: '크기 적응형',
};

export const newsWidgetDesignLabels: Record<NewsWidgetDesign, string> = {
  headline: 'Headline Beacon',
  room: 'Newsroom Stack',
  brief: 'Market Brief',
  ticker: 'News Ticker',
};

export const newsWidgetDesignNotes: Record<NewsWidgetDesign, string> = {
  headline: '대표 뉴스 강조',
  room: '뉴스룸 목록형',
  brief: '시장 브리핑형',
  ticker: '파형 헤드라인',
};
