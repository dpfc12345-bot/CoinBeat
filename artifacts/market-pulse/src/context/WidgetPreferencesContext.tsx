import React, { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { defaultWidgetPreferences, loadWidgetPreferences, type WidgetPreferences, widgetPreferencesKey } from '@/src/widgets/preferences';
import { refreshAndroidWidgets } from '@/src/widgets/refresh';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WidgetPreferencesContextValue = {
  preferences: WidgetPreferences;
  isLoading: boolean;
  savePreferences: (next: WidgetPreferences) => Promise<void>;
};

const WidgetPreferencesContext = createContext<WidgetPreferencesContextValue | null>(null);

export function WidgetPreferencesProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState<WidgetPreferences>(defaultWidgetPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const hydratePreferences = async () => {
      try {
        const stored = await loadWidgetPreferences();
        if (active) setPreferences(stored);
      } finally {
        if (active) setIsLoading(false);
      }

      try {
        await refreshAndroidWidgets();
      } catch {
        // The widget may not be installed yet, or Android may still be starting it.
      }
    };

    void hydratePreferences();
    return () => {
      active = false;
    };
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