import React, { useEffect, useState } from 'react';
import { Alert, Linking, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Screen } from '@/src/components/Screen';
import { ScreenHeader } from '@/src/components/MarketPulseUI';
import { disableLiveNotification, enableLiveNotification, isLiveNotificationEnabled } from '@/src/notifications/liveNotification';
export default function SettingsScreen() {
  const colors = useColors();
  const [alerts, setAlerts] = useState(false);
  const [compact, setCompact] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(true);

  useEffect(() => {
    isLiveNotificationEnabled().then((enabled) => {
      setAlerts(enabled);
      setNotificationLoading(false);
    });
  }, []);

  const changeAlerts = async (next: boolean) => {
    if (!next) {
      setAlerts(false);
      await disableLiveNotification();
      return;
    }
    setNotificationLoading(true);
    try {
      const result = await enableLiveNotification();
      if (result.status === 'enabled') {
        setAlerts(true);
      } else if (result.status === 'denied') {
        setAlerts(false);
        Alert.alert(
          '알림 권한이 필요합니다',
          'Android 설정에서 CoinBeat 알림을 허용하면 알림창에 시세와 뉴스를 고정할 수 있습니다.',
          [
            { text: '나중에', style: 'cancel' },
            { text: '설정 열기', onPress: () => void Linking.openSettings() },
          ],
        );
      } else {
        setAlerts(false);
        Alert.alert('Android 전용 기능', '알림창 고정은 Android APK에서 사용할 수 있습니다.');
      }
    } catch {
      setAlerts(false);
      Alert.alert('알림을 켤 수 없습니다', '잠시 후 다시 시도해 주세요.');
    } finally {
      setNotificationLoading(false);
    }
  };

  return <Screen>
    <ScreenHeader eyebrow="환경설정" title="설정" />
    <View style={[styles.modeCard, { backgroundColor: colors.cardElevated }]}>
      <View style={[styles.modeIcon, { backgroundColor: colors.primary }]}><Ionicons name="radio-outline" size={19} color={colors.primaryForeground} /></View>
      <View style={styles.modeCopy}><Text style={[styles.modeTitle, { color: colors.foreground }]}>실시간 데이터 모드</Text><Text style={[styles.modeText, { color: colors.mutedForeground }]}>실시간 거래소 시세와 뉴스를 사용합니다.</Text></View>
      <View style={[styles.liveBadge, { backgroundColor: 'rgba(76,141,255,0.16)' }]}><Text style={[styles.liveText, { color: colors.primary }]}>실시간</Text></View>
    </View>
    <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>앱 설정</Text>
    <SettingRow
      icon="notifications-outline"
      title="알림창에 시세·뉴스 고정"
      detail={Platform.OS === 'android' ? (alerts ? '상시 알림으로 표시 중' : 'Android 알림 권한 필요') : 'Android 전용 기능'}
      value={alerts}
      disabled={notificationLoading || Platform.OS !== 'android'}
      onChange={(value) => void changeAlerts(value)}
    />
    <SettingRow icon="list-outline" title="뉴스 목록 간결하게 보기" detail="한 화면에 더 많은 헤드라인 표시" value={compact} onChange={setCompact} />
    <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>데이터 출처</Text>
    <Source icon="checkmark-circle" dot="primary" title="실시간 시장 데이터" detail="실시간 거래소 시세" />
    <Source icon="checkmark-circle" dot="primary" title="실시간 뉴스" detail="최신 헤드라인" />
    <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>법적 고지</Text>
    <LegalRow icon="document-text-outline" title="이용약관" onPress={() => router.push('/legal/terms')} />
    <LegalRow icon="shield-checkmark-outline" title="개인정보처리방침" onPress={() => router.push('/legal/privacy')} />
    <Text style={[styles.contactHint, { color: colors.mutedForeground }]}>문의: support@coinbeat.app</Text>
  </Screen>;
}
function SettingRow({ icon, title, detail, value, disabled = false, onChange }: { icon: keyof typeof Ionicons.glyphMap; title: string; detail: string; value: boolean; disabled?: boolean; onChange: (value: boolean) => void }) { const colors = useColors(); return <View style={[styles.setting, { backgroundColor: colors.card, opacity: disabled ? 0.55 : 1 }]}><View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}><Ionicons name={icon} size={18} color={colors.primary} /></View><View style={styles.settingCopy}><Text style={[styles.settingTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.settingDetail, { color: colors.mutedForeground }]}>{detail}</Text></View><Switch testID={`setting-${title}`} disabled={disabled} value={value} onValueChange={onChange} trackColor={{ false: colors.secondary, true: colors.primary }} thumbColor={value ? colors.primaryForeground : colors.mutedForeground} /></View>; }
function Source({ icon, dot, title, detail }: { icon: keyof typeof Ionicons.glyphMap; dot: 'primary' | 'amber'; title: string; detail: string }) { const colors = useColors(); const tone = dot === 'primary' ? colors.primary : colors.amber; return <View style={[styles.sourceRow, { backgroundColor: colors.card }]}><View style={[styles.sourceDot, { backgroundColor: tone }]} /><View><Text style={[styles.sourceTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.sourceText, { color: colors.mutedForeground }]}>{detail}</Text></View><Ionicons name={icon} size={20} color={tone} style={styles.sourceCheck} /></View>; }
function LegalRow({ icon, title, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable testID={`legal-${title}`} onPress={onPress} style={({ pressed }) => [styles.legalRow, { backgroundColor: colors.card, opacity: pressed ? 0.72 : 1 }]}>
      <View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}><Ionicons name={icon} size={18} color={colors.primary} /></View>
      <Text style={[styles.legalTitle, { color: colors.foreground }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={17} color={colors.mutedForeground} />
    </Pressable>
  );
}
const styles = StyleSheet.create({ modeCard: { borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 30, boxShadow: '0px 8px 20px rgba(0,0,0,0.28)' }, modeIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 13 }, modeCopy: { flex: 1 }, modeTitle: { fontFamily: 'Inter_700Bold', fontSize: 14 }, modeText: { fontFamily: 'Inter_500Medium', fontSize: 11, lineHeight: 16, marginTop: 4 }, liveBadge: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 6, marginLeft: 8 }, liveText: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1 }, groupLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.4, marginBottom: 10, marginTop: 6 }, setting: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 18, paddingHorizontal: 14, marginBottom: 9, boxShadow: '0px 6px 16px rgba(0,0,0,0.22)' }, settingIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, settingCopy: { flex: 1 }, settingTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 }, settingDetail: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 3 }, sourceRow: { minHeight: 68, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 9, boxShadow: '0px 6px 16px rgba(0,0,0,0.22)' }, sourceDot: { width: 8, height: 8, borderRadius: 4, marginRight: 11 }, sourceTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13 }, sourceText: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 3 }, sourceCheck: { marginLeft: 'auto' }, legalRow: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, paddingHorizontal: 14, marginBottom: 9, boxShadow: '0px 6px 16px rgba(0,0,0,0.22)' }, legalTitle: { flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 13.5 }, contactHint: { fontFamily: 'Inter_500Medium', fontSize: 11, textAlign: 'center', marginTop: 12, marginBottom: 4 } });