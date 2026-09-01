import AsyncStorage from '@react-native-async-storage/async-storage';
import { widgetColorThemeValues, widgetFontSizeValues, type WidgetColorTheme, type WidgetFontSize } from '@/src/widgets/theme';
import { priceWidgetDesignValues, newsWidgetDesignValues, type PriceWidgetDesign, type NewsWidgetDesign } from '@/src/widgets/designs';

export type WidgetKind = 'price' | 'news';
export type WidgetSize = 'small' | 'medium' | 'large';
export type WidgetCurrency = 'KRW' | 'USD';
export type { WidgetColorTheme, WidgetFontSize };
export type { PriceWidgetDesign, NewsWidgetDesign };

export const widgetCurrencyValues: WidgetCurrency[] = ['KRW', 'USD'];
export const widgetCurrencyLabels: Record<WidgetCurrency, string> = { KRW: '원화 (KRW)', USD: '달러 (USD)' };

export type WidgetPreferences = {
  kind: WidgetKind;
  size: WidgetSize;
  selectedSymbols: string[];
  colorTheme: WidgetColorTheme;
  fontSize: WidgetFontSize;
  priceDesign: PriceWidgetDesign;
  newsDesign: NewsWidgetDesign;
  currency: WidgetCurrency;
};

export const widgetPreferencesKey = 'market-pulse-widget-preferences';
export const defaultWidgetPreferences: WidgetPreferences = {
  kind: 'price',
  size: 'medium',
  selectedSymbols: ['BTC', 'ETH', 'SOL', 'XRP'],
  colorTheme: 'midnight',
  fontSize: 'default',
  priceDesign: 'desk',
  newsDesign: 'room',
  currency: 'KRW',
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
      colorTheme: widgetColorThemeValues.includes(parsed.colorTheme as WidgetColorTheme)
        ? (parsed.colorTheme as WidgetColorTheme)
        : defaultWidgetPreferences.colorTheme,
      fontSize: widgetFontSizeValues.includes(parsed.fontSize as WidgetFontSize)
        ? (parsed.fontSize as WidgetFontSize)
        : defaultWidgetPreferences.fontSize,
      priceDesign: priceWidgetDesignValues.includes(parsed.priceDesign as PriceWidgetDesign)
        ? (parsed.priceDesign as PriceWidgetDesign)
        : defaultWidgetPreferences.priceDesign,
      newsDesign: newsWidgetDesignValues.includes(parsed.newsDesign as NewsWidgetDesign)
        ? (parsed.newsDesign as NewsWidgetDesign)
        : defaultWidgetPreferences.newsDesign,
      currency: widgetCurrencyValues.includes(parsed.currency as WidgetCurrency)
        ? (parsed.currency as WidgetCurrency)
        : defaultWidgetPreferences.currency,
    };
  } catch {
    return defaultWidgetPreferences;
  }
}