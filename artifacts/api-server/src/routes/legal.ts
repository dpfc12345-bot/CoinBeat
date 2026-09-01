import { Router, type IRouter } from "express";

const router: IRouter = Router();

const EFFECTIVE_DATE = "2026년 8월 31일";

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "1. 수집하는 정보가 없습니다",
    body: "CoinBeat는 회원가입, 로그인, 결제 기능이 없으며 이름, 이메일, 전화번호 등 개인을 식별할 수 있는 정보를 수집하지 않습니다. 서버에는 이용자 계정이나 프로필이 존재하지 않습니다.",
  },
  {
    title: "2. 기기에 로컬로 저장되는 정보",
    body: "관심목록에 추가한 코인 목록, 홈 화면 위젯 설정(디자인·통화·테마·크기), 알림 사용 여부 등은 오직 이용자의 기기 안(로컬 저장소)에만 저장됩니다. 이 정보는 외부 서버로 전송되거나 운영자가 조회할 수 없으며, 앱을 삭제하면 함께 삭제됩니다.",
  },
  {
    title: "3. 시세·뉴스 데이터 통신",
    body: '실시간 시세, 급등락 순위, 뉴스를 보여주기 위해 앱은 자체 서버를 거쳐 공개된 거래소 API와 제휴 뉴스 피드에 접속합니다. 이 통신 과정에서 이용자를 특정할 수 있는 정보는 전송되지 않으며, 일반적인 네트워크 접속 기록(IP, 요청 시각 등) 수준의 정보만 서비스 운영 및 장애 대응 목적으로 짧은 기간 서버 로그에 남을 수 있습니다. "오늘의 코인 용어" 콘텐츠는 앱 안에 내장되어 있어 별도의 통신 없이 표시됩니다.',
  },
  {
    title: "4. 알림 권한 (Android)",
    body: 'Android 기기에서 "알림창에 시세·뉴스 고정" 기능을 켜면 시스템 알림 권한을 요청합니다. 이 권한은 알림에 최신 시세·뉴스를 표시하는 용도로만 사용되며, 언제든지 설정에서 끌 수 있습니다. 알림 내용 역시 기기 안에서 생성되며 별도로 수집되지 않습니다.',
  },
  {
    title: "5. 제3자 제공 및 광고",
    body: "서비스는 이용자 데이터를 제3자에게 판매하거나 공유하지 않습니다. 현재 광고, 분석(analytics), 추적 SDK를 사용하지 않습니다. 향후 변경 시 본 방침을 통해 사전에 고지합니다.",
  },
  {
    title: "6. 아동의 개인정보",
    body: "서비스는 만 14세 미만 아동으로부터 개인정보를 의도적으로 수집하지 않습니다.",
  },
  {
    title: "7. 문의",
    body: "개인정보 처리에 대해 궁금한 점은 설정 화면에 안내된 연락처로 문의해 주세요. 본 방침은 서비스 개선이나 법령 변경에 따라 수정될 수 있으며, 중요한 변경 시 앱 내 공지를 통해 안내합니다.",
  },
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderPrivacyPolicyHtml(): string {
  const sections = SECTIONS.map(
    (section) => `
      <section>
        <h2>${escapeHtml(section.title)}</h2>
        <p>${escapeHtml(section.body)}</p>
      </section>`,
  ).join("\n");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>CoinBeat 개인정보처리방침</title>
<style>
  :root { color-scheme: light dark; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
    max-width: 720px;
    margin: 0 auto;
    padding: 48px 24px 96px;
    line-height: 1.7;
    color: #1a1a1a;
    background: #ffffff;
  }
  h1 { font-size: 28px; margin-bottom: 4px; }
  .updated { color: #666; font-size: 13px; margin-bottom: 40px; }
  h2 { font-size: 17px; margin-bottom: 8px; margin-top: 0; }
  p { font-size: 15px; color: #333; margin-top: 0; }
  section { margin-bottom: 28px; }
  @media (prefers-color-scheme: dark) {
    body { background: #0f0f0f; color: #e8e8e8; }
    .updated { color: #999; }
    p { color: #c9c9c9; }
  }
</style>
</head>
<body>
  <h1>개인정보처리방침</h1>
  <p class="updated">시행일: ${escapeHtml(EFFECTIVE_DATE)}</p>
  ${sections}
</body>
</html>`;
}

router.get("/legal/privacy-policy", (_req, res) => {
  // Override helmet's default style-src 'self' so the inline <style> block
  // above renders; this route serves a public, standalone HTML page (not an
  // API JSON endpoint), so a scoped CSP override here is safe.
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
  );
  res.type("html").send(renderPrivacyPolicyHtml());
});

export default router;
