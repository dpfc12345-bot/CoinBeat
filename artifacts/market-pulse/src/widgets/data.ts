import { getApiUrl } from '@/src/config/api';

export type WidgetAsset = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
};

export type WidgetNews = {
  id: string;
  title: string;
  relativeTime: string;
  relatedSymbols: string[];
  importance: 'breaking' | 'high' | 'standard';
};

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(getApiUrl(path), { headers: { Accept: 'application/json' } });
  if (response.ok) return response.json() as Promise<T>;

  const payload = await response.json().catch(() => null) as { message?: string } | null;
  throw new Error(payload?.message ?? `데이터 요청에 실패했습니다 (${response.status}).`);
}

export async function getWidgetData() {
  const [market, news] = await Promise.all([
    getJson<{ assets: WidgetAsset[] }>('/api/market/overview'),
    getJson<WidgetNews[]>('/api/news'),
  ]);
  return { assets: market.assets, news };
}