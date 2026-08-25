export function getApiBaseUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/+$/, '');

  const developmentDomain = process.env.EXPO_PUBLIC_DOMAIN?.trim();
  return developmentDomain ? `https://${developmentDomain}` : '';
}

export function getApiUrl(path: string) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error('Market Pulse API 주소가 설정되지 않았습니다.');
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}