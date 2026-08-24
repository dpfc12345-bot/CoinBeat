import { getMockSnapshot, mockNews } from '@/src/data/mockData';
import { MarketSnapshot, NewsItem } from '@/src/models';

export interface NewsProvider {
  list(): Promise<NewsItem[]>;
  getById(id: string): Promise<NewsItem | undefined>;
}

export interface MarketDataProvider {
  getOverview(tick?: number): Promise<MarketSnapshot>;
}

export const mockNewsProvider: NewsProvider = {
  async list() { return mockNews; },
  async getById(id) { return mockNews.find((item) => item.id === id); },
};

export const mockMarketProvider: MarketDataProvider = {
  async getOverview(tick = 0) { return getMockSnapshot(tick); },
};

// Coinness responses will be normalized into the same internal model here later.
export const coinnessNewsProvider: NewsProvider = mockNewsProvider;