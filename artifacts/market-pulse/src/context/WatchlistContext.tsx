import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'market-pulse-watchlist';
type WatchlistContextValue = { symbols: string[]; isLoading: boolean; toggle: (symbol: string) => void; contains: (symbol: string) => boolean };
const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: PropsWithChildren) {
  const [symbols, setSymbols] = useState<string[]>(['BTC', 'ETH', 'SOL']);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) { try { setSymbols(JSON.parse(stored) as string[]); } catch { /* defaults are valid */ } }
      setIsLoading(false);
    });
  }, []);
  const toggle = (symbol: string) => {
    setSymbols((current) => {
      const next = current.includes(symbol) ? current.filter((item) => item !== symbol) : [...current, symbol];
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      void Haptics.selectionAsync();
      return next;
    });
  };
  const value = useMemo(() => ({ symbols, isLoading, toggle, contains: (symbol: string) => symbols.includes(symbol) }), [symbols, isLoading]);
  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  const value = useContext(WatchlistContext);
  if (!value) throw new Error('useWatchlist must be used inside WatchlistProvider');
  return value;
}