import AsyncStorage from '@react-native-async-storage/async-storage';
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
  sourceUrl: string;
  relativeTime: string;
  relatedSymbols: string[];
  importance: 'breaking' | 'high' | 'standard';
};

// Background widget updates (WorkManager / just-after-boot) can fire before the
// device has a working network connection. A single failed fetch used to throw
// straight through to the widget renderer, which permanently swaps the widget
// for an error placeholder until the app is opened and refreshes it. To avoid
// that, we retry with a short backoff and fall back to the last-known-good
// payload cached from the most recent successful fetch (foreground or background).
const FETCH_TIMEOUT_MS = 8_000;
const RETRY_DELAYS_MS = [500, 1_500];
const priceCacheKey = 'market-pulse-widget-cache-price';
const newsCacheKey = 'market-pulse-widget-cache-news';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchJsonWithRetry<T>(path: string): Promise<T> {
  const url = getApiUrl(path);
  let lastError: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url, FETCH_TIMEOUT_MS);
      if (response.ok) return await (response.json() as Promise<T>);
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      lastError = new Error(payload?.message ?? `데이터 요청에 실패했습니다 (${response.status}).`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < RETRY_DELAYS_MS.length) await wait(RETRY_DELAYS_MS[attempt]);
  }
  throw lastError instanceof Error ? lastError : new Error('데이터 요청에 실패했습니다.');
}

async function getWithCache<T>(path: string, cacheKey: string): Promise<T> {
  try {
    const data = await fetchJsonWithRetry<T>(path);
    AsyncStorage.setItem(cacheKey, JSON.stringify(data)).catch(() => undefined);
    return data;
  } catch (error) {
    const cached = await AsyncStorage.getItem(cacheKey).catch(() => null);
    if (cached) {
      try {
        return JSON.parse(cached) as T;
      } catch {
        // fall through to rethrow below
      }
    }
    throw error;
  }
}

export async function getPriceWidgetData() {
  const market = await getWithCache<{ assets: WidgetAsset[] }>('/api/market/overview', priceCacheKey);
  return market.assets;
}

export async function getNewsWidgetData() {
  return getWithCache<WidgetNews[]>('/api/news', newsCacheKey);
}