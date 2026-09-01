import React, { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
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
  const appState = useRef<AppStateStatus>(AppState.currentState);

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

  useEffect(() => {
    // A widget added to the home screen while the app is backgrounded (the normal
    // Android "long-press home screen -> add widget" flow) never gets an initial
    // data push, since the mount-time refresh above only runs once at launch and
    // the app was already running by then. Re-running the refresh every time the
    // app comes back to the foreground closes that gap with default preferences
    // showing up as soon as the user returns to CoinBeat.
    const subscription = AppState.addEventListener('change', (nextState) => {
      const cameToForeground = appState.current.match(/inactive|background/) && nextState === 'active';
      appState.current = nextState;
      if (!cameToForeground) return;
      void refreshAndroidWidgets().catch(() => {
        // No widget may be on the Android home screen yet.
      });
    });
    return () => subscription.remove();
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