import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getApiUrl } from '@/src/config/api';

const STORAGE_KEY = 'market-pulse-price-alerts';
const CHANNEL_ID = 'market-pulse-price-alerts';

export type PriceAlertDirection = 'above' | 'below';

export type PriceAlert = {
  id: string;
  symbol: string;
  targetPrice: number;
  direction: PriceAlertDirection;
  createdAt: string;
};

type MarketData = {
  assets: Array<{ symbol: string; price: number }>;
};

async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Market Pulse 가격 알림',
    description: '설정한 목표가에 도달하면 알려줍니다',
    importance: Notifications.AndroidImportance.HIGH,
  });
}

export async function loadPriceAlerts(): Promise<PriceAlert[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is PriceAlert =>
        item &&
        typeof item.id === 'string' &&
        typeof item.symbol === 'string' &&
        typeof item.targetPrice === 'number' &&
        (item.direction === 'above' || item.direction === 'below'),
    );
  } catch {
    return [];
  }
}

async function savePriceAlerts(alerts: PriceAlert[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

export async function addPriceAlert(symbol: string, targetPrice: number, direction: PriceAlertDirection): Promise<PriceAlert[]> {
  const alerts = await loadPriceAlerts();
  const next: PriceAlert = {
    id: `${symbol}-${direction}-${Date.now()}`,
    symbol: symbol.toUpperCase(),
    targetPrice,
    direction,
    createdAt: new Date().toISOString(),
  };
  const updated = [...alerts, next];
  await savePriceAlerts(updated);
  return updated;
}

export async function removePriceAlert(id: string): Promise<PriceAlert[]> {
  const alerts = await loadPriceAlerts();
  const updated = alerts.filter((alert) => alert.id !== id);
  await savePriceAlerts(updated);
  return updated;
}

async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  await ensureChannel();
  let permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) {
    permissions = await Notifications.requestPermissionsAsync();
  }
  return permissions.granted;
}

export async function addPriceAlertWithPermission(
  symbol: string,
  targetPrice: number,
  direction: PriceAlertDirection,
): Promise<{ status: 'added' | 'denied' | 'unsupported'; alerts: PriceAlert[] }> {
  if (Platform.OS === 'web') return { status: 'unsupported', alerts: await loadPriceAlerts() };
  const granted = await requestNotificationPermission();
  if (!granted) return { status: 'denied', alerts: await loadPriceAlerts() };
  const alerts = await addPriceAlert(symbol, targetPrice, direction);
  return { status: 'added', alerts };
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(getApiUrl(path), { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`데이터 요청에 실패했습니다 (${response.status}).`);
  return response.json() as Promise<T>;
}

function formatPrice(price: number) {
  return `₩${Math.round(price).toLocaleString('ko-KR')}`;
}

let checkPromise: Promise<void> | null = null;

/** Checks stored price alerts against the latest market data and fires a one-shot notification for any that have crossed their target. Triggered alerts are removed so the user is not spammed. */
export function checkPriceAlerts() {
  if (Platform.OS === 'web' || checkPromise) return checkPromise ?? Promise.resolve();
  checkPromise = (async () => {
    const alerts = await loadPriceAlerts();
    if (alerts.length === 0) return;
    const granted = (await Notifications.getPermissionsAsync()).granted;
    if (!granted) return;

    const market = await getJson<MarketData>('/api/market/overview');
    const priceBySymbol = new Map(market.assets.map((asset) => [asset.symbol, asset.price]));

    const remaining: PriceAlert[] = [];
    for (const alert of alerts) {
      const price = priceBySymbol.get(alert.symbol);
      const crossed =
        price !== undefined &&
        (alert.direction === 'above' ? price >= alert.targetPrice : price <= alert.targetPrice);
      if (crossed && price !== undefined) {
        await ensureChannel();
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${alert.symbol} 가격 알림`,
            body: `${alert.symbol}이(가) ${formatPrice(alert.targetPrice)} ${alert.direction === 'above' ? '이상' : '이하'}으로 ${alert.direction === 'above' ? '상승' : '하락'}했어요. 현재가 ${formatPrice(price)}`,
            sound: Platform.OS === 'android' ? undefined : true,
            data: { kind: 'market-pulse-price-alert', symbol: alert.symbol },
          },
          trigger: null,
        });
      } else {
        remaining.push(alert);
      }
    }
    if (remaining.length !== alerts.length) await savePriceAlerts(remaining);
  })().finally(() => {
    checkPromise = null;
  });
  return checkPromise;
}
