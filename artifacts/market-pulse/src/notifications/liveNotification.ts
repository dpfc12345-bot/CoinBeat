import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import {
  AndroidImportance,
  AndroidNotificationVisibility,
} from 'expo-notifications';
import { Platform } from 'react-native';
import { getApiUrl } from '@/src/config/api';

const ENABLED_KEY = 'market-pulse-live-notification-enabled';
const CHANNEL_ID = 'market-pulse-live';
const NOTIFICATION_KIND = 'market-pulse-live';
export const LIVE_NOTIFICATION_REFRESH_INTERVAL_MS = 60_000;

if (Platform.OS === 'android') {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => ({
      // This notification is replaced periodically. Keep it in the shade
      // without repeatedly interrupting the user with heads-up banners.
      shouldShowBanner: notification.request.content.data?.kind !== NOTIFICATION_KIND,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

type MarketData = {
  assets: Array<{
    symbol: string;
    name: string;
    price: number;
    change24h: number;
  }>;
};

type NewsData = Array<{
  title: string;
}>;

type LiveNotificationResult =
  | { status: 'enabled' }
  | { status: 'denied' }
  | { status: 'unsupported' };

async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Market Pulse 실시간 알림',
    description: '시세와 최신 뉴스가 표시되는 고정 알림',
    importance: AndroidImportance.DEFAULT,
    lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
    showBadge: false,
    sound: null,
    vibrationPattern: [0, 0],
  });
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(getApiUrl(path), {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`데이터 요청에 실패했습니다 (${response.status}).`);
  return response.json() as Promise<T>;
}

function formatPrice(price: number) {
  return `₩${Math.round(price).toLocaleString('ko-KR')}`;
}

async function getLiveCopy() {
  const [market, news] = await Promise.all([
    getJson<MarketData>('/api/market/overview'),
    getJson<NewsData>('/api/news'),
  ]);
  const tracked = market.assets.filter((asset) => ['BTC', 'ETH', 'SOL'].includes(asset.symbol));
  const prices = tracked
    .map((asset) => `${asset.symbol} ${formatPrice(asset.price)} ${asset.change24h >= 0 ? '+' : ''}${asset.change24h.toFixed(2)}%`)
    .join('  ·  ');
  const headline = news[0]?.title ?? '새로운 뉴스가 없습니다.';
  return {
    title: 'Market Pulse · 실시간',
    body: `${prices || '시세를 불러오는 중입니다.'}\n${headline}`,
  };
}

function isLiveData(data: Record<string, unknown> | null | undefined) {
  return data?.kind === NOTIFICATION_KIND;
}

async function clearLiveNotification() {
  if (Platform.OS !== 'android') return;
  const [presented, scheduled] = await Promise.all([
    Notifications.getPresentedNotificationsAsync(),
    Notifications.getAllScheduledNotificationsAsync(),
  ]);
  const identifiers = new Set([
    ...presented.filter((item) => isLiveData(item.request.content.data)).map((item) => item.request.identifier),
    ...scheduled.filter((item) => isLiveData(item.content.data)).map((item) => item.identifier),
  ]);
  await Promise.all(
    [...identifiers].flatMap((identifier) => [
      Notifications.dismissNotificationAsync(identifier).catch(() => undefined),
      Notifications.cancelScheduledNotificationAsync(identifier).catch(() => undefined),
    ]),
  );
}

async function showLiveNotification(title: string, body: string) {
  await ensureChannel();
  await clearLiveNotification();
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { kind: NOTIFICATION_KIND },
      sticky: true,
      autoDismiss: false,
      sound: false,
      priority: 'default',
      color: '#1677FF',
    },
    trigger: null,
  });
}

export async function isLiveNotificationEnabled() {
  return (await AsyncStorage.getItem(ENABLED_KEY)) === 'true';
}

export async function enableLiveNotification(): Promise<LiveNotificationResult> {
  if (Platform.OS !== 'android') return { status: 'unsupported' };

  await ensureChannel();
  let permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) {
    permissions = await Notifications.requestPermissionsAsync();
  }
  if (!permissions.granted) return { status: 'denied' };

  await AsyncStorage.setItem(ENABLED_KEY, 'true');
  try {
    const copy = await getLiveCopy();
    await showLiveNotification(copy.title, copy.body);
  } catch {
    await showLiveNotification(
      'Market Pulse',
      '알림이 켜졌습니다. 앱을 열면 최신 시세와 뉴스를 확인할 수 있습니다.',
    );
  }
  return { status: 'enabled' };
}

export async function disableLiveNotification() {
  if (Platform.OS === 'android') await clearLiveNotification();
  await AsyncStorage.setItem(ENABLED_KEY, 'false');
}

let refreshPromise: Promise<void> | null = null;

export function refreshLiveNotification() {
  if (Platform.OS !== 'android' || refreshPromise) return refreshPromise ?? Promise.resolve();
  refreshPromise = (async () => {
    if (!(await isLiveNotificationEnabled())) return;
    try {
      const copy = await getLiveCopy();
      await showLiveNotification(copy.title, copy.body);
    } catch {
      // Keep the last successful snapshot visible when the network is unavailable.
    }
  })().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}