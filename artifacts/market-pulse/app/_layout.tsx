import React, { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { setBaseUrl } from '@workspace/api-client-react';
import { WatchlistProvider } from '@/src/context/WatchlistContext';
import { WidgetPreferencesProvider } from '@/src/context/WidgetPreferencesContext';
import { refreshAndroidWidgets } from '@/src/widgets/refresh';
import { getApiBaseUrl, MARKET_REFRESH_INTERVAL_MS } from '@/src/config/api';
import { LIVE_NOTIFICATION_REFRESH_INTERVAL_MS, isLiveNotificationEnabled, refreshLiveNotification } from '@/src/notifications/liveNotification';
import { checkPriceAlerts } from '@/src/notifications/priceAlerts';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const apiBaseUrl = getApiBaseUrl();
if (apiBaseUrl) setBaseUrl(apiBaseUrl);

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="news/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="coin/[symbol]" options={{ headerShown: false }} />
        <Stack.Screen name="legal/terms" options={{ headerShown: false }} />
        <Stack.Screen name="legal/privacy" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const syncWidgets = async () => {
      try {
        await refreshAndroidWidgets();
      } catch {
        // The widget may not be installed yet, or Android may still be starting it.
      }
    };
    const syncLiveNotification = async () => {
      try {
        if (await isLiveNotificationEnabled()) await refreshLiveNotification();
      } catch {
        // Keep the last notification visible if the latest refresh fails.
      }
    };
    const syncPriceAlerts = async () => {
      try {
        await checkPriceAlerts();
      } catch {
        // Skip this cycle and retry on the next refresh tick.
      }
    };
    void syncWidgets();
    void syncLiveNotification();
    void syncPriceAlerts();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void syncWidgets();
        void syncLiveNotification();
        void syncPriceAlerts();
      }
    });
    const widgetInterval = setInterval(() => void syncWidgets(), MARKET_REFRESH_INTERVAL_MS);
    const notificationInterval = setInterval(() => void syncLiveNotification(), LIVE_NOTIFICATION_REFRESH_INTERVAL_MS);
    const priceAlertInterval = setInterval(() => void syncPriceAlerts(), MARKET_REFRESH_INTERVAL_MS);
    return () => {
      subscription.remove();
      clearInterval(widgetInterval);
      clearInterval(notificationInterval);
      clearInterval(priceAlertInterval);
    };
  }, []);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <WidgetPreferencesProvider>
            <WatchlistProvider>
              <GestureHandlerRootView>
                <KeyboardProvider>
                  <RootLayoutNav />
                </KeyboardProvider>
              </GestureHandlerRootView>
            </WatchlistProvider>
          </WidgetPreferencesProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
