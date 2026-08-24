import "./_group.css";
import { Clock3, Newspaper } from "lucide-react";
import { useState } from "react";

const headline = {
  title: "비트코인 현물 ETF, 3거래일 연속 순유입",
  source: "Coinness",
  time: "18분 전",
  category: "속보",
  asset: "BTC",
};

export function SmallGlance() {
  const [selected, setSelected] = useState(false);

  return (
    <main className="mp-sans min-h-[240px] w-[260px] overflow-hidden bg-[var(--mp-bg)] p-2">
      <button
        type="button"
        aria-label={`Market Pulse 뉴스 열기: ${headline.title}`}
        aria-pressed={selected}
        onClick={() => setSelected((value) => !value)}
        className={`group relative flex h-[224px] w-[244px] flex-col overflow-hidden border bg-[var(--mp-card)] p-[16px] text-left text-[var(--mp-text)] shadow-[0_8px_24px_rgba(27,30,22,0.06)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mp-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mp-bg)] active:translate-y-0 ${
          selected ? "border-[var(--mp-lime)]" : "border-[var(--mp-border)]"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--mp-border)] pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center bg-[var(--mp-lime)] text-[var(--mp-text)]">
              <Newspaper size={13} strokeWidth={2.3} />
            </span>
            <span className="text-[11px] font-semibold tracking-[-0.02em]">
              Market Pulse
            </span>
          </div>
          <span className="text-[10px] font-medium text-[var(--mp-red)]">
            {headline.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-3">
          <p className="max-w-[205px] text-[22px] font-semibold leading-[1.3] tracking-[-0.065em]">
            {headline.title}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--mp-border)] pt-3">
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--mp-muted)]">
            <span className="font-semibold text-[var(--mp-text)]">{headline.source}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock3 size={11} strokeWidth={1.8} />
              {headline.time}
            </span>
          </div>
          <span className="border border-[var(--mp-border)] bg-[var(--mp-card-raised)] px-2 py-1 text-[9px] font-medium text-[var(--mp-muted)]">
            {headline.asset}
          </span>
        </div>
      </button>
    </main>
  );
}