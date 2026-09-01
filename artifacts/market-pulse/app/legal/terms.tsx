import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const EFFECTIVE_DATE = '2026년 8월 31일';

export default function TermsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 48 }]}>
    <BackButton />
    <Text style={[styles.title, { color: colors.foreground }]}>이용약관</Text>
    <Text style={[styles.updated, { color: colors.mutedForeground }]}>시행일: {EFFECTIVE_DATE}</Text>

    <Section colors={colors} n="1" title="서비스 개요">
      CoinBeat(이하 "서비스")는 공개된 거래소 시세 데이터와 제휴 매체의 뉴스 콘텐츠를 정보 제공 목적으로 보여주는 애플리케이션입니다. 서비스는 암호화폐의 매수, 매도, 보관, 송금 등 거래소 기능을 제공하지 않으며, 자체적으로 어떠한 금융 상품도 취급하지 않습니다.
    </Section>

    <Section colors={colors} n="2" title="투자 조언이 아님">
      서비스에서 제공하는 시세, 등락률, 급등락 순위, 뉴스, 코인 용어 설명, 위젯 등 모든 콘텐츠는 정보 제공 목적으로만 제공되며 투자 자문이나 권유가 아닙니다. 표시되는 가격은 지연되거나 실제 거래소 가격과 차이가 있을 수 있으며, 원화(KRW) 이외 통화(예: 달러)로 환산된 가격은 참고용 근사치입니다. 코인 용어 설명은 일반적인 이해를 돕기 위한 참고 자료일 뿐 투자 판단의 근거가 될 수 없습니다. 투자로 인한 모든 손익과 판단의 책임은 이용자 본인에게 있습니다.
    </Section>

    <Section colors={colors} n="3" title="데이터 출처 및 제3자 상표">
      서비스에 표시되는 시세는 공개된 거래소 API를, 뉴스 콘텐츠는 제휴·공개된 뉴스 피드를 통해 수집합니다. 뉴스 제공사는 서비스 운영 상황에 따라 변경될 수 있습니다. 서비스는 데이터 및 콘텐츠를 제공하는 거래소·매체와 제휴하거나 이들의 공식 애플리케이션이 아니며, 해당 상표와 콘텐츠에 대한 권리는 각 권리자에게 있습니다.
    </Section>

    <Section colors={colors} n="4" title="계정 및 로컬 데이터">
      서비스는 회원가입이나 로그인을 요구하지 않습니다. 관심목록, 위젯 설정과 같은 개인화 정보는 이용자의 기기에만 저장되며, 서비스를 삭제하면 함께 삭제됩니다. 자세한 내용은 개인정보처리방침을 참고하세요.
    </Section>

    <Section colors={colors} n="5" title="이용자의 의무">
      이용자는 서비스를 관련 법령과 공서양속에 반하지 않는 범위에서 이용해야 하며, 서비스의 정상적인 운영을 방해하는 행위(비정상적인 API 호출, 리버스 엔지니어링 등)를 해서는 안 됩니다.
    </Section>

    <Section colors={colors} n="6" title="면책 및 서비스 변경">
      서비스는 데이터 제공사의 사정, 네트워크 오류 등으로 인해 일시적으로 중단되거나 데이터가 지연·누락될 수 있습니다. 운영자는 관련 법령이 허용하는 범위 내에서 서비스 이용으로 발생한 손해에 대해 책임을 지지 않습니다. 서비스의 내용과 본 약관은 사전 고지 후 변경될 수 있습니다.
    </Section>

    <Section colors={colors} n="7" title="문의">
      약관에 대한 문의는 설정 화면에 안내된 연락처로 문의해 주세요.
    </Section>
  </ScrollView>;
}

function Section({ colors, n, title, children }: { colors: ReturnType<typeof useColors>; n: string; title: string; children: React.ReactNode }) {
  return <View style={styles.section}>
    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{n}. {title}</Text>
    <Text style={[styles.sectionBody, { color: colors.secondaryForeground }]}>{children}</Text>
  </View>;
}

function BackButton() {
  const colors = useColors();
  return <Pressable testID="terms-back" onPress={() => { if (router.canGoBack()) router.back(); else router.replace('/settings'); }} style={styles.back}>
    <Ionicons name="arrow-back" size={20} color={colors.foreground} />
    <Text style={[styles.backText, { color: colors.foreground }]}>설정으로 돌아가기</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, flexGrow: 1 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 28 },
  backText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 27, letterSpacing: -1 },
  updated: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 8, marginBottom: 26 },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, marginBottom: 8 },
  sectionBody: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 21 },
});
