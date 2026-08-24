import "./_group.css";
import { ArrowUpRight, BarChart3, Bell, ChevronRight, Newspaper, Zap } from "lucide-react";
import { useState } from "react";

const metrics = [
  { label: "24H MOVE", value: "+3.82%", tone: "lime" },
  { label: "VOLUME", value: "+126%", tone: "amber" },
  { label: "NEWS", value: "17", tone: "white" },
];

export function Current() {
  const [expanded, setExpanded] = useState(false);

  return (
    <main className="min-h-screen w-full bg-[var(--mp-bg)] p-6 text-[var(--mp-text)]">
      <section className="mx-auto max-w-[430px]">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.18em] text-[var(--mp-muted)]">
            MARKET PULSE / WIDGET PREVIEW
          </p>
          <span className="flex items-center gap-1.5 font-['IBM_Plex_Mono'] text-[10px] text-[var(--mp-lime)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--mp-lime)]" />
            LIVE
          </span>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="group w-full rounded-[14px] border border-[var(--mp-border)] bg-[var(--mp-card)] p-5 text-left transition hover:border-[#45514b] hover:bg-[var(--mp-card-raised)]"
          aria-expanded={expanded}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--mp-lime)] text-[var(--mp-bg)]">
              <Zap size={16} strokeWidth={2.5} />
            </span>
            <span className="font-['IBM_Plex_Mono'] text-[11px] font-semibold tracking-[0.18em]">NEWS IMPACT</span>
            <span className="ml-auto flex items-center gap-1 font-['IBM_Plex_Mono'] text-[10px] text-[var(--mp-muted)] transition group-hover:text-[var(--mp-text)]">
              {expanded ? "HIDE" : "DETAILS"} <ChevronRight size={14} className={expanded ? "rotate-90 transition" : "transition"} />
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="font-['Space_Grotesk'] text-[28px] font-bold tracking-[-0.04em]">BTC</p>
              <p className="mt-1 font-['IBM_Plex_Mono'] text-[11px] text-[var(--mp-muted)]">ETF inflows &amp; price action</p>
            </div>
            <div className="text-right">
              <p className="font-['IBM_Plex_Mono'] text-[10px] tracking-[0.16em] text-[var(--mp-muted)]">IMPACT</p>
              <p className="font-['Space_Grotesk'] text-[30px] font-bold leading-none text-[var(--mp-lime)]">92<span className="ml-1 text-[14px] text-[var(--mp-muted)]">/100</span></p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 divide-x divide-[var(--mp-border)] border-t border-[var(--mp-border)] pt-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="px-3 first:pl-0 last:pr-0">
                <p className="font-['IBM_Plex_Mono'] text-[9px] tracking-[0.12em] text-[var(--mp-muted)]">{metric.label}</p>
                <p className={`mt-1 font-['Space_Grotesk'] text-[17px] font-semibold ${metric.tone === "lime" ? "text-[var(--mp-lime)]" : metric.tone === "amber" ? "text-[var(--mp-amber)]" : "text-[var(--mp-text)]"}`}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-[var(--mp-bg)] px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Newspaper size={14} className="text-[var(--mp-muted)]" />
              <span className="font-['IBM_Plex_Mono'] text-[10px] text-[var(--mp-muted)]">17 headlines tracking BTC</span>
            </div>
            <ArrowUpRight size={15} className="text-[var(--mp-lime)]" />
          </div>

          {expanded && (
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[var(--mp-border)] pt-4">
              <div className="rounded-lg border border-[var(--mp-border)] p-3">
                <p className="font-['IBM_Plex_Mono'] text-[9px] tracking-[0.1em] text-[var(--mp-muted)]">SIGNAL</p>
                <p className="mt-1 font-['Space_Grotesk'] text-[15px] font-semibold text-[var(--mp-lime)]">ETF momentum</p>
              </div>
              <div className="rounded-lg border border-[var(--mp-border)] p-3">
                <p className="font-['IBM_Plex_Mono'] text-[9px] tracking-[0.1em] text-[var(--mp-muted)]">UPDATED</p>
                <p className="mt-1 font-['Space_Grotesk'] text-[15px] font-semibold">3 min ago</p>
              </div>
            </div>
          )}
        </button>

        <div className="mt-4 flex items-center justify-between px-1 font-['IBM_Plex_Mono'] text-[10px] text-[var(--mp-muted)]">
          <span className="flex items-center gap-1.5"><BarChart3 size={13} /> Price + volume reaction</span>
          <span className="flex items-center gap-1.5"><Bell size={13} /> Tap to open story</span>
        </div>
      </section>
    </main>
  );
}