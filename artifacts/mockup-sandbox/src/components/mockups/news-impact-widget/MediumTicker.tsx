import "./_group.css";
import { ChevronRight, Newspaper } from "lucide-react";
import { useState } from "react";

const stories = [
  {
    category: "비트코인",
    headline: "비트코인 현물 ETF, 3거래일 연속 순유입",
    source: "Coinness",
    time: "18분 전",
    breaking: true,
    asset: "BTC",
  },
  {
    category: "글로벌",
    headline: "미 연준 인사들, 금리 인하 시점 신중론 재차 강조",
    source: "Coinness",
    time: "42분 전",
    asset: "Macro",
  },
  {
    category: "알트코인",
    headline: "솔라나 생태계 거래량 급증… 주요 알트코인 동반 상승",
    source: "Coinness",
    time: "1시간 전",
    asset: "SOL",
  },
];

export function MediumTicker() {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <main className="mp-sans min-h-[100dvh] w-full bg-[var(--mp-bg)] p-2.5 text-[var(--mp-text)]">
      <button
        type="button"
        onClick={() => setIsSelected((value) => !value)}
        className={`group relative mx-auto flex h-[260px] w-full max-w-[420px] flex-col overflow-hidden rounded-[18px] border bg-[var(--mp-card)] p-[18px] text-left shadow-[0_8px_24px_rgba(27,30,22,0.06)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:shadow-[0_12px_30px_rgba(27,30,22,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mp-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mp-bg)] ${
          isSelected ? "border-[#b8ca2e] shadow-[0_10px_28px_rgba(27,30,22,0.11)]" : "border-[var(--mp-border)]"
        }`}
        aria-label="오늘의 크립토 뉴스 열기"
        aria-pressed={isSelected}
      >
        <header className="relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#eef0e7] text-[var(--mp-text)]">
              <Newspaper size={15} strokeWidth={2.1} />
            </span>
            <h1 className="text-[16px] font-semibold leading-none tracking-[-0.04em]">오늘의 크립토 뉴스</h1>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--mp-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--mp-lime)]" />
            <span>실시간</span>
          </div>
        </header>

        <div className="relative mt-3 flex min-h-0 flex-1 flex-col">
          {stories.map((story, index) => (
            <article
              key={story.headline}
              className={`flex min-h-0 flex-1 items-center gap-2.5 py-2 ${
                index > 0 ? "border-t border-[var(--mp-border)]" : ""
              }`}
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-[1px] ${
                  story.breaking ? "bg-[var(--mp-red)]" : "bg-[#b9beb4]"
                }`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-1.5 text-[10px] leading-none text-[var(--mp-muted)]">
                  {story.breaking && <span className="font-semibold text-[var(--mp-red)]">속보</span>}
                  <span>{story.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{story.asset}</span>
                </div>
                <p className="truncate text-[13px] font-semibold leading-[1.35] tracking-[-0.035em] text-[var(--mp-text)]">
                  {story.headline}
                </p>
                <p className="mt-1 text-[10px] leading-none text-[var(--mp-muted)]">
                  {story.source} <span className="px-0.5 text-[#b9beb4]">·</span> {story.time}
                </p>
              </div>
            </article>
          ))}
        </div>

        <footer className="relative mt-1 flex items-center justify-between border-t border-[var(--mp-border)] pt-2.5 text-[10px] text-[var(--mp-muted)]">
          <span>Coinness 편집부 · 지금 가장 많이 읽는 뉴스</span>
          <span className="flex shrink-0 items-center gap-0.5 font-medium text-[var(--mp-text)] transition-colors group-hover:text-[#74851b]">
            전체 보기 <ChevronRight size={12} />
          </span>
        </footer>
      </button>
    </main>
  );
}