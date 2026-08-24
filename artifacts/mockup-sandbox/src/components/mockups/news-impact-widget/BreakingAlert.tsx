import "./_group.css";
import { Bell, ChevronRight, Newspaper, Pause, X } from "lucide-react";
import { useState } from "react";

export function BreakingAlert() {
  const [muted, setMuted] = useState(false);
  const [opened, setOpened] = useState(false);

  return (
    <main className="mp-sans flex min-h-[320px] w-full items-start justify-center bg-[var(--mp-bg)] px-3 py-3 text-[var(--mp-text)]">
      <section
        aria-label="Market Pulse Android notification"
        className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[22px] border border-[#d7d8d1] bg-[#fbfbf8] shadow-[0_12px_30px_rgba(27,30,22,0.11)]"
      >
        <div className="flex items-center justify-between border-b border-[#e6e6e1] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--mp-text)] text-[var(--mp-lime)]">
              <Newspaper size={16} strokeWidth={2.4} />
            </span>
            <div className="leading-none">
              <p className="text-[13px] font-semibold tracking-[-0.02em]">Market Pulse</p>
              <p className="mt-1 text-[10px] text-[var(--mp-muted)]">Coinness · 방금 전</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[var(--mp-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--mp-lime)]" aria-label="실시간 알림" />
            <Bell size={15} strokeWidth={1.8} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpened(true)}
          aria-label="속보 기사 자세히 보기"
          className="group w-full border-b border-[#e6e6e1] px-4 pb-3.5 pt-4 text-left outline-none transition-colors hover:bg-[#f5f6ed] focus-visible:bg-[#f5f6ed] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--mp-lime)]"
        >
          <div className="flex items-center gap-2">
            <span className="rounded-[4px] bg-[var(--mp-red)] px-1.5 py-1 text-[9px] font-bold tracking-[0.02em] text-white">BREAKING</span>
            <span className="text-[10px] text-[var(--mp-muted)]">암호화폐 · 주요 소식</span>
          </div>
          <div className="mt-2.5 flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-[17px] font-semibold leading-[1.42] tracking-[-0.045em]">
                비트코인 현물 ETF, 3거래일 연속 순유입
              </h1>
              <p className="mt-1.5 text-[11px] leading-[1.45] text-[var(--mp-muted)]">
                기관 수요가 이어지며 시장의 관심이 다시 비트코인으로 모이고 있습니다.
              </p>
            </div>
            <ChevronRight className="mt-1 shrink-0 text-[#a1a39b] transition-transform group-hover:translate-x-0.5" size={18} />
          </div>
        </button>

        <div className="flex items-center justify-between px-3.5 py-2.5">
          <button
            type="button"
            onClick={() => setOpened(true)}
            className="flex min-h-8 items-center gap-1 rounded-[7px] px-2 text-[11px] font-medium text-[var(--mp-text)] outline-none hover:bg-[#eff1e6] focus-visible:ring-2 focus-visible:ring-[var(--mp-lime)]"
          >
            자세히 보기 <ChevronRight size={13} />
          </button>
          <button
            type="button"
            onClick={() => setMuted((value) => !value)}
            aria-pressed={muted}
            className="flex min-h-8 items-center gap-1 rounded-[7px] px-2 text-[11px] text-[var(--mp-muted)] outline-none hover:bg-[#f0f0eb] focus-visible:ring-2 focus-visible:ring-[var(--mp-lime)]"
          >
            {muted ? <X size={13} /> : <Pause size={13} />}
            {muted ? "알림 다시 켜기" : "1시간 동안 알림 끄기"}
          </button>
        </div>
        {opened && (
          <div role="status" className="border-t border-[#e6e6e1] bg-[#f5f6ed] px-4 py-2 text-[11px] text-[var(--mp-muted)]">
            Coinness 원문을 열 준비가 되었어요.
          </div>
        )}
      </section>
    </main>
  );
}