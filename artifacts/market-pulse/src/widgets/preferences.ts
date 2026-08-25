import AsyncStorage from '@react-native-async-storage/async-storage';

export type WidgetKind = 'price' | 'news';
export type WidgetSize = 'small' | 'medium' | 'large';

export type WidgetPreferences = {
  kind: WidgetKind;
  size: WidgetSize;
  selectedSymbols: string[];
};

export const widgetPreferencesKey = 'market-pulse-widget-preferences';
export const defaultWidgetPreferences: WidgetPreferences = {
  kind: 'price',
  size: 'medium',
  selectedSymbols: ['BTC', 'ETH', 'SOL', 'XRP'],
};

export async function loadWidgetPreferences(): Promise<WidgetPreferences> {
  const raw = await AsyncStorage.getItem(widgetPreferencesKey);
  if (!raw) return defaultWidgetPreferences;
  try {
    const parsed = JSON.parse(raw) as Partial<WidgetPreferences>;
    return {
      kind: parsed.kind === 'news' ? 'news' : 'price',
      size: parsed.size === 'small' || parsed.size === 'large' ? parsed.size : 'medium',
      selectedSymbols: Array.isArray(parsed.selectedSymbols) && parsed.selectedSymbols.length > 0
        ? [...new Set(parsed.selectedSymbols.filter((symbol): symbol is string => typeof symbol === 'string' && symbol.length > 0))]
        : defaultWidgetPreferences.selectedSymbols,
    };
  } catch {
    return defaultWidgetPreferences;
  }
}