import React, { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { loadWidgetPreferences, type WidgetPreferences, widgetPreferencesKey } from '@/src/widgets/preferences';
import { renderMarketPulseWidget } from '@/src/widgets/task-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WidgetPreferencesContextValue = {
  preferences: WidgetPreferences;
  isLoading: boolean;
  savePreferences: (next: WidgetPreferences) => Promise<void>;
};

const WidgetPreferencesContext = createContext<WidgetPreferencesContextValue | null>(null);

async function refreshAndroidWidgets() {
  if (Platform.OS !== 'android') return;
  await Promise.all(['MarketPrice', 'MarketNews'].map((widgetName) => requestWidgetUpdate({
    widgetName,
    renderWidget: (widgetInfo) => renderMarketPulseWidget(widgetName, widgetInfo),
  })));
}

export function WidgetPreferencesProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState<WidgetPreferences>({ kind: 'price', size: 'medium', selectedSymbols: ['BTC', 'ETH', 'SOL', 'XRP'] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWidgetPreferences().then((stored) => {
      setPreferences(stored);
      setIsLoading(false);
    });
  }, []);

  const savePreferences = async (next: WidgetPreferences) => {
    setPreferences(next);
    await AsyncStorage.setItem(widgetPreferencesKey, JSON.stringify(next));
    try {
      await refreshAndroidWidgets();
    } catch {
      // No widget may be on the Android home screen yet.
    }
  };

  const value = useMemo(() => ({ preferences, isLoading, savePreferences }), [preferences, isLoading]);
  return <WidgetPreferencesContext.Provider value={value}>{children}</WidgetPreferencesContext.Provider>;
}

export function useWidgetPreferences() {
  const value = useContext(WidgetPreferencesContext);
  if (!value) throw new Error('useWidgetPreferences must be used inside WidgetPreferencesProvider');
  return value;
}