import React, { PropsWithChildren } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

export function Screen({ children }: PropsWithChildren) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 96 }]} showsVerticalScrollIndicator={false}><View>{children}</View></ScrollView>;
}
const styles = StyleSheet.create({ content: { paddingHorizontal: 18 } });