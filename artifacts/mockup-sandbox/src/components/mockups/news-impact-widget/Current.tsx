import "./_group.css";
import { Activity, ArrowUpRight, Bell, ChartNoAxesCombined, CloudSun, Droplets, Newspaper, Settings, ShieldCheck, Wallet } from "lucide-react";
import { useState } from "react";

const apps = [
  { label: "지갑", icon: Wallet, color: "#72d4ff" },
  { label: "뉴스", icon: Newspaper, color: "#7faeff" },
  { label: "시장", icon: ChartNoAxesCombined, color: "#9ac5ff" },
  { label: "설정", icon: Settings, color: "#8b9ab7" },
];

export function Current() {
  const [compact, setCompact] = useState(false);

  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#07101f] text-white">
      <div className="relative mx-auto min-h-screen max-w-[390px] overflow-hidden bg-[radial-gradient(circle_at_15%_8%,#1b3760_0%,transparent_34%),radial-gradient(circle_at_88%_35%,#173c58_0%,transparent_32%),linear-gradient(145deg,#101f36_0%,#07101f_58%,#0b1b25_100%)] px-5 pb-6 pt-4">
        <div className="pointer-events-none absolute -left-16 top-44 h-56 w-56 rounded-full bg-[#2b6fc4]/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-40 h-64 w-64 rounded-full bg-[#28789b]/12 blur-3xl" />

        <header className="relative flex items-center justify-between font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.12em] text-white/80">
          <span>월요일, 8월 24일</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1"><CloudSun size={13} /> 23°</span>
            <span className="flex items-center gap-1"><Droplets size={12} /> 58%</span>
          </div>
        </header>

        <section className="relative mt-8 text-center">
          <p className="font-['IBM_Plex_Mono'] text-[10px] tracking-[0.18em] text-white/55">서울 · 화요일</p>
          <h1 className="mt-1 font-['Space_Grotesk'] text-[68px] font-light leading-none tracking-[-0.08em]">09:41</h1>
        </section>

        <section className="relative mt-8">
          <div className="mb-2 flex items-center justify-between px-1 font-['IBM_Plex_Mono'] text-[9px] font-semibold tracking-[0.14em] text-white/50">
            <span>홈 화면 위젯</span>
            <span className="text-[#76b4ff]">MARKET PULSE</span>
          </div>
          <button
            type="button"
            onClick={() => setCompact((value) => !value)}
            className="w-full rounded-[20px] border border-white/15 bg-[#111718]/90 p-4 text-left shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:border-white/25"
            aria-label="Market Pulse 가격과 뉴스 위젯 열기"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#4d9cff] text-[#07101f]">
                <Activity size={16} strokeWidth={2.7} />
              </span>
              <div>
                <p className="font-['Space_Grotesk'] text-[14px] font-bold">Market Pulse</p>
                <p className="font-['IBM_Plex_Mono'] text-[8px] text-white/45">가격 + 뉴스 한눈에</p>
              </div>
              <span className="ml-auto flex items-center gap-1 font-['IBM_Plex_Mono'] text-[9px] text-[#72d4ff]"><span className="h-1.5 w-1.5 rounded-full bg-[#72d4ff]" /> 실시간</span>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 border-y border-white/10 py-3">
              {[
                ["BTC", "₩152.8M", "+3.82%"],
                ["ETH", "₩4.7M", "+2.41%"],
                ["SOL", "₩271K", "+6.17%"],
                ["XRP", "₩820", "-1.08%"],
              ].map(([symbol, price, change]) => (
                <div key={symbol} className="min-w-0">
                  <p className="font-['IBM_Plex_Mono'] text-[9px] font-semibold text-white/65">{symbol}</p>
                  <p className="mt-1 truncate font-['Space_Grotesk'] text-[13px] font-semibold">{price}</p>
                  <p className={`mt-0.5 font-['IBM_Plex_Mono'] text-[8px] font-semibold ${change.startsWith("-") ? "text-[#ff8097]" : "text-[#72d4ff]"}`}>{change}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#173867] text-[#72d4ff]"><Newspaper size={13} /></span>
                <p className="truncate font-['IBM_Plex_Mono'] text-[9px] text-white/65">비트코인 현물 ETF, 3거래일 연속 순유입</p>
              </div>
              <span className="ml-2 flex shrink-0 items-center gap-1 font-['IBM_Plex_Mono'] text-[9px] font-semibold text-[#72d4ff]">영향도 92 <ArrowUpRight size={11} /></span>
            </div>
            {!compact && (
              <div className="mt-3 flex items-center justify-between font-['IBM_Plex_Mono'] text-[8px] text-white/40">
                <span>17개 헤드라인 · 거래량 +126%</span>
                <span>탭하여 열기</span>
              </div>
            )}
          </button>
          <p className="mt-2 text-center font-['IBM_Plex_Mono'] text-[8px] text-white/35">위젯을 탭하면 Market Pulse 앱이 열립니다</p>
        </section>

        <section className="relative mt-8">
          <div className="mb-3 flex items-center justify-between px-1">
            <p className="font-['IBM_Plex_Mono'] text-[9px] font-semibold tracking-[0.14em] text-white/50">내 앱</p>
            <Bell size={14} className="text-white/50" />
          </div>
          <div className="grid grid-cols-4 gap-5">
            {apps.map(({ label, icon: Icon, color }) => (
              <button key={label} className="flex flex-col items-center gap-1.5 text-white/70">
                <span className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-white/10 bg-white/10 shadow-lg backdrop-blur-md" style={{ color }}>
                  <Icon size={22} />
                </span>
                <span className="font-['IBM_Plex_Mono'] text-[9px]">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="relative mt-10 flex justify-center">
          <div className="h-1 w-28 rounded-full bg-white/65" />
        </div>
        <div className="relative mt-3 flex items-center justify-center gap-5 font-['IBM_Plex_Mono'] text-[8px] text-white/35">
          <span className="flex items-center gap-1"><ShieldCheck size={11} /> 비공개 미리보기</span>
          <span>목업 데이터</span>
        </div>
      </div>
    </main>
  );
}