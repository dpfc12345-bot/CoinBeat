import "./_group.css";
import { ArrowUpRight, ChevronRight, Circle } from "lucide-react";
import { useState } from "react";

const stories = [
  {
    category: "시장",
    headline: "미 연준 인사들, 금리 인하 시점 신중론 재차 강조",
    source: "Coinness",
    time: "38분 전",
  },
  {
    category: "알트코인",
    headline: "솔라나 생태계 거래량 급증… 주요 알트코인 동반 상승",
    source: "Coinness",
    time: "1시간 전",
  },
];

export function LargeImpact() {
  const [opened, setOpened] = useState(false);

  return (
    <main className="mp-sans min-h-[390px] w-full bg-[var(--mp-bg)] p-3 text-[var(--mp-text)]">
      <button
        type="button"
        onClick={() => setOpened((value) => !value)}
        aria-label="Coinness Briefing 뉴스 전체 보기"
        className="mp-card group block h-full w-full rounded-[18px] p-[18px] text-left outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[var(--mp-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mp-bg)]"
      >
        <header className="flex items-start justify-between border-b border-[var(--mp-border)] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--mp-lime)]" />
              <span className="text-[11px] font-semibold tracking-[-0.01em]">Coinness Briefing</span>
            </div>
            <p className="mt-1.5 text-[10px] text-[var(--mp-muted)]">8월 24일 월요일 · 오늘의 뉴스</p>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-[var(--mp-muted)]">
            {opened ? "열림" : "더 보기"} <ArrowUpRight size={12} strokeWidth={1.8} />
          </span>
        </header>

        <article className="border-b border-[var(--mp-border)] py-4">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-medium text-[var(--mp-red)]">
            <span>주요 뉴스</span>
            <span className="h-px w-5 bg-[var(--mp-red)]/40" />
            <span className="font-normal text-[var(--mp-muted)]">12분 전</span>
          </div>
          <h1 className="max-w-[340px] text-[23px] font-bold leading-[1.27] tracking-[-0.065em]">
            비트코인 현물 ETF, 3거래일 연속 순유입
          </h1>
          <p className="mt-2.5 max-w-[330px] text-[12px] leading-[1.55] tracking-[-0.025em] text-[var(--mp-muted)]">
            기관 자금이 다시 유입되며 시장의 위험 선호가 살아나는 분위기다. 전문가들은 단기 변동성은 이어질 수 있다고 내다봤다.
          </p>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-[var(--mp-muted)]">
            <span className="font-semibold text-[var(--mp-text)]">Coinness</span>
            <span>·</span>
            <span>비트코인</span>
          </div>
        </article>

        <div className="divide-y divide-[var(--mp-border)]">
          {stories.map((story) => (
            <article key={story.headline} className="flex gap-3 py-3">
              <div className="pt-1 text-[var(--mp-muted)]">
                <Circle size={7} fill="currentColor" strokeWidth={0} />
              </div>
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2 text-[10px] text-[var(--mp-muted)]">
                  <span className="font-medium text-[var(--mp-text)]">{story.category}</span>
                  <span>·</span>
                  <span>{story.time}</span>
                </div>
                <h2 className="text-[13px] font-semibold leading-[1.38] tracking-[-0.04em]">{story.headline}</h2>
                <p className="mt-1 text-[10px] text-[var(--mp-muted)]">{story.source}</p>
              </div>
              <ChevronRight className="mt-5 shrink-0 text-[var(--mp-muted)] transition-transform group-hover:translate-x-0.5" size={14} strokeWidth={1.6} />
            </article>
          ))}
        </div>

        <footer className="mt-1 flex items-center gap-2">
          <span className="text-[10px] font-medium text-[var(--mp-muted)]">관련 코인</span>
          <span className="border border-[var(--mp-border)] bg-[var(--mp-card-raised)] px-2 py-1 text-[10px] text-[var(--mp-muted)]">BTC</span>
          <span className="border border-[var(--mp-border)] bg-[var(--mp-card-raised)] px-2 py-1 text-[10px] text-[var(--mp-muted)]">SOL</span>
          <span className="ml-auto text-[10px] text-[var(--mp-muted)]">Coinness 편집부</span>
        </footer>
      </button>
    </main>
  );
}