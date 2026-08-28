export const MARKET_REFRESH_INTERVAL_MS = 15_000;

export function getApiBaseUrl() {
  const developmentDomain = process.env.EXPO_PUBLIC_DOMAIN?.trim();
  if (__DEV__ && developmentDomain) return `https://${developmentDomain}`;

  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/+$/, '');

  return developmentDomain ? `https://${developmentDomain}` : '';
}

export function getApiUrl(path: string) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error('CoinBeat API 주소가 설정되지 않았습니다.');
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}