export type NewsCategory = 'MARKET' | 'ETF' | 'REGULATION' | 'EXCHANGE' | 'DEFI' | 'ALTCOIN' | 'MACRO' | 'SECURITY' | 'LISTING' | 'WHALE';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  publishedAt: string;
  relativeTime: string;
  categories: string[];
  relatedSymbols: string[];
  importance: 'breaking' | 'high' | 'standard';
  priceChange: number;
  impactScore: number;
  volumeChange: number;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: string;
  marketCap: string;
  high24h: number;
  low24h: number;
  sparkline: number[];
  accent: string;
}

export interface MarketSnapshot {
  assets: MarketAsset[];
  sentiment: { score: number; label: 'GREED' | 'FEAR' | 'NEUTRAL'; change: number };
  totalMarketCap: string;
  totalVolume: string;
  btcDominance: string;
  updatedAt: string;
}