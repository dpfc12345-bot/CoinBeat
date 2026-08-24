import { MarketAsset, MarketSnapshot, NewsItem } from '@/src/models';

const assets: MarketAsset[] = [
  { symbol: 'BTC', name: '비트코인', price: 113240.18, change24h: 3.82, volume24h: '$48.6B', marketCap: '$2.24T', high24h: 114120, low24h: 108940, accent: '#C9F64A', sparkline: [52, 48, 51, 47, 56, 54, 63, 59, 68, 72, 70, 81] },
  { symbol: 'SOL', name: '솔라나', price: 201.42, change24h: 4.21, volume24h: '$6.2B', marketCap: '$97.1B', high24h: 205.12, low24h: 190.84, accent: '#70E1D2', sparkline: [45, 53, 48, 57, 55, 61, 58, 68, 65, 75, 71, 82] },
  { symbol: 'ETH', name: '이더리움', price: 4182.64, change24h: 2.14, volume24h: '$25.8B', marketCap: '$504.2B', high24h: 4228, low24h: 4031, accent: '#A7B1FF', sparkline: [63, 60, 64, 58, 62, 69, 67, 71, 68, 75, 73, 78] },
  { symbol: 'XRP', name: 'XRP', price: 2.91, change24h: -0.72, volume24h: '$4.1B', marketCap: '$169.4B', high24h: 3.08, low24h: 2.84, accent: '#FFB86B', sparkline: [74, 78, 71, 75, 68, 70, 64, 69, 61, 66, 59, 57] },
  { symbol: 'DOGE', name: '도지코인', price: 0.2841, change24h: 5.12, volume24h: '$3.4B', marketCap: '$42.1B', high24h: 0.291, low24h: 0.262, accent: '#D7C17A', sparkline: [41, 44, 48, 45, 54, 52, 61, 59, 70, 66, 76, 84] },
  { symbol: 'ADA', name: '에이다', price: 0.84, change24h: -1.83, volume24h: '$1.1B', marketCap: '$29.8B', high24h: 0.87, low24h: 0.81, accent: '#7DB5FF', sparkline: [71, 68, 72, 64, 67, 62, 65, 58, 60, 54, 56, 51] },
];

export const mockNews: NewsItem[] = [
  { id: 'btc-etf-inflows', title: '비트코인 현물 ETF, 3거래일 연속 순유입', content: '미국 비트코인 현물 ETF에 3거래일 연속 자금이 유입되며 기관 수요가 회복되는 모습이다. 비트코인은 주요 저항선을 돌파했고 시장 전반의 투자 심리도 개선됐다.', source: '코인니스', publishedAt: '2026-08-24T09:57:00Z', relativeTime: '3분 전', categories: ['MARKET', 'ETF'], relatedSymbols: ['BTC'], importance: 'breaking', priceChange: 3.82, impactScore: 92, volumeChange: 126 },
  { id: 'sol-network-growth', title: '솔라나 온체인 거래량, 분기 최고치 경신', content: '솔라나 일일 활성 주소와 DEX 거래량이 이번 주 나란히 증가했다. 시장 폭이 넓어지며 고변동성 자산으로 자금이 이동하는 흐름이 나타났다.', source: '코인니스', publishedAt: '2026-08-24T09:34:00Z', relativeTime: '26분 전', categories: ['MARKET', 'ALTCOIN'], relatedSymbols: ['SOL'], importance: 'high', priceChange: 4.21, impactScore: 78, volumeChange: 84 },
  { id: 'fed-liquidity-watch', title: '미 연준 인사들, 금리 인하 시점 신중론 재차 강조', content: '위험자산이 월간 고점 부근을 유지하는 가운데 시장은 연준 인사들의 유동성 관련 발언을 주시하고 있다. 비트코인은 금리 경로 변화에 민감하게 반응하는 모습이다.', source: '코인니스', publishedAt: '2026-08-24T08:51:00Z', relativeTime: '1시간 전', categories: ['MACRO', 'MARKET'], relatedSymbols: ['BTC', 'ETH'], importance: 'high', priceChange: 1.64, impactScore: 71, volumeChange: 42 },
  { id: 'eth-staking-record', title: '이더리움 스테이킹 예치량 사상 최고치', content: '스테이킹 계약에 예치된 이더리움 물량이 이달 들어 다시 늘었다. 유통 물량이 줄어드는 가운데 네트워크의 다음 업데이트도 준비되고 있다.', source: '코인니스', publishedAt: '2026-08-24T07:42:00Z', relativeTime: '2시간 전', categories: ['MARKET', 'DEFI'], relatedSymbols: ['ETH'], importance: 'standard', priceChange: 2.14, impactScore: 64, volumeChange: 37 },
  { id: 'xrp-volatility', title: 'XRP 급등 이후 차익실현 매물 출회', content: 'XRP가 장중 고점에서 소폭 밀리며 단기 투자자들의 차익실현이 나타났다. 거래량은 여전히 높은 수준으로 새로운 지지선을 시험하고 있다.', source: '코인니스', publishedAt: '2026-08-24T06:55:00Z', relativeTime: '3시간 전', categories: ['MARKET', 'ALTCOIN'], relatedSymbols: ['XRP'], importance: 'standard', priceChange: -0.72, impactScore: 48, volumeChange: 19 },
  { id: 'exchange-listing', title: '주요 거래소, 레이어1 무기한 선물 거래쌍 확대', content: '대형 레이어1 자산의 거래 접근성이 넓어지면서 미국 거래 시간대 유동성이 늘어날 것으로 예상된다.', source: '코인니스', publishedAt: '2026-08-24T05:30:00Z', relativeTime: '4시간 전', categories: ['EXCHANGE', 'LISTING'], relatedSymbols: ['SOL', 'ADA'], importance: 'standard', priceChange: 1.12, impactScore: 55, volumeChange: 31 },
];

export function getMockSnapshot(tick = 0): MarketSnapshot {
  return {
    assets: assets.map((asset, index) => {
      const pulse = Math.sin((tick + index) * 0.8) * 0.06;
      return { ...asset, price: Number((asset.price * (1 + pulse / 100)).toFixed(asset.price < 10 ? 4 : 2)), change24h: Number((asset.change24h + pulse).toFixed(2)) };
    }),
    sentiment: { score: tick % 3 === 0 ? 78 : tick % 2 ? 79 : 77, label: 'GREED', change: 6.4 },
    totalMarketCap: '$3.18T',
    totalVolume: '$118.4B',
    btcDominance: '58.7%',
    updatedAt: '방금 전',
  };
}

export function getAsset(symbol: string, tick = 0) {
  return getMockSnapshot(tick).assets.find((asset) => asset.symbol === symbol) ?? getMockSnapshot(tick).assets[0];
}

export function getNews(id: string) {
  return mockNews.find((item) => item.id === id) ?? mockNews[0];
}