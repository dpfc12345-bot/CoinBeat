import "./_group.css";
import { Activity, ArrowUpRight, BarChart3, ChevronRight, Radio, Signal } from "lucide-react";
import { useState } from "react";

const assets = [
  { symbol: "BTC", price: "$67,842", move: "+3.82%" },
  { symbol: "ETH", price: "$3,482", move: "+2.41%" },
  { symbol: "SOL", price: "$184.26", move: "+6.17%" },
  { symbol: "XRP", price: "$0.612", move: "−1.08%" },
];

const chartPoints = "0,67 16,64 31,70 47,56 62,61 78,43 94,48 110,30 127,35 143,20 160,25 178,9";

export function LargeImpact() {
  const [opened, setOpened] = useState(false);

  return (
    <main className="min-h-screen w-full overflow-hidden bg-[var(--mp-bg)] p-3 text-[var(--mp-text)]">
      <button
        type="button"
        onClick={() => setOpened((value) => !value)}
        aria-label="Open Market Pulse market intelligence"
        className="group relative mx-auto flex min-h-[364px] w-full max-w-[420px] flex-col overflow-hidden rounded-[24px] border border-[var(--mp-border)] bg-[linear-gradient(145deg,#151b1b_0%,#101515_56%,#0d1211_100%)] p-5 text-left shadow-[0_20px_55px_rgba(0,0,0,0.36)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[var(--mp-lime)]/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-44 w-44 rounded-full bg-[#67755d]/[0.09] blur-3xl" />

        <header className="relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--mp-lime)] text-[#111817]">
              <Activity size={16} strokeWidth={2.8} />
            </span>
            <div>
              <p className="font-['Space_Grotesk'] text-[14px] font-bold leading-none tracking-[-0.02em]">Market Pulse</p>
              <p className="mt-1 font-['IBM_Plex_Mono'] text-[8px] font-medium tracking-[0.1em] text-[var(--mp-muted)]">LIVE MARKET INTELLIGENCE</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 font-['IBM_Plex_Mono'] text-[9px] font-semibold tracking-[0.08em] text-[var(--mp-lime)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--mp-lime)] opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--mp-lime)]" />
            </span>
            LIVE
          </span>
        </header>

        <section className="relative mt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2 font-['IBM_Plex_Mono'] text-[8px] font-semibold tracking-[0.14em] text-[var(--mp-amber)]">
                <Radio size={11} strokeWidth={2.4} />
                BREAKING · 8 MIN AGO
              </div>
              <h1 className="max-w-[265px] font-['Space_Grotesk'] text-[21px] font-bold leading-[1.08] tracking-[-0.035em]">
                ETF inflows push BTC through $67K
              </h1>
            </div>
            <div className="shrink-0 border-l border-[var(--mp-border)] pl-4 text-right">
              <p className="font-['IBM_Plex_Mono'] text-[8px] font-semibold tracking-[0.12em] text-[var(--mp-muted)]">IMPACT</p>
              <p className="mt-0.5 font-['Space_Grotesk'] text-[34px] font-bold leading-none tracking-[-0.08em] text-[var(--mp-lime)]">92</p>
              <p className="mt-1 font-['IBM_Plex_Mono'] text-[8px] text-[var(--mp-muted)]">VERY HIGH</p>
            </div>
          </div>
          <p className="mt-3 max-w-[326px] font-['IBM_Plex_Mono'] text-[9px] leading-[1.45] text-[var(--mp-muted)]">
            Spot ETF desks posted their strongest net inflow since July. Risk appetite is spreading into majors.
          </p>
        </section>

        <section className="relative mt-4 grid grid-cols-[1fr_1.15fr] gap-4 border-y border-[var(--mp-border)] py-3.5">
          <div>
            <div className="flex items-center gap-1.5 font-['IBM_Plex_Mono'] text-[8px] font-semibold tracking-[0.1em] text-[var(--mp-muted)]">
              <Signal size={11} /> BTC / 24H
            </div>
            <div className="mt-1 flex items-end gap-2">
              <span className="font-['Space_Grotesk'] text-[24px] font-semibold leading-none tracking-[-0.055em]">$67,842</span>
              <span className="mb-0.5 font-['IBM_Plex_Mono'] text-[9px] font-semibold text-[var(--mp-lime)]">+3.82%</span>
            </div>
          </div>
          <div className="flex min-w-0 items-end">
            <svg viewBox="0 0 178 78" className="h-[52px] w-full overflow-visible" role="img" aria-label="Bitcoin rising intraday trend">
              <defs>
                <linearGradient id="pulse-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#c9f64a" stopOpacity="0.25" />
                  <stop offset="1" stopColor="#c9f64a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`M ${chartPoints} L 178,78 L 0,78 Z`} fill="url(#pulse-fill)" />
              <polyline points={chartPoints} fill="none" stroke="#c9f64a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="178" cy="9" r="3.5" fill="#c9f64a" />
            </svg>
          </div>
        </section>

        <section className="relative mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-[12px] bg-[#1b2321] px-3 py-2.5">
            <p className="font-['IBM_Plex_Mono'] text-[8px] tracking-[0.08em] text-[var(--mp-muted)]">VOLUME</p>
            <p className="mt-1 font-['Space_Grotesk'] text-[16px] font-semibold leading-none">+126%</p>
          </div>
          <div className="rounded-[12px] bg-[#1b2321] px-3 py-2.5">
            <p className="font-['IBM_Plex_Mono'] text-[8px] tracking-[0.08em] text-[var(--mp-muted)]">HEADLINES</p>
            <p className="mt-1 font-['Space_Grotesk'] text-[16px] font-semibold leading-none">17 <span className="font-['IBM_Plex_Mono'] text-[9px] text-[var(--mp-lime)]">+9</span></p>
          </div>
          <div className="rounded-[12px] bg-[#1b2321] px-3 py-2.5">
            <p className="font-['IBM_Plex_Mono'] text-[8px] tracking-[0.08em] text-[var(--mp-muted)]">BREADTH</p>
            <p className="mt-1 font-['Space_Grotesk'] text-[16px] font-semibold leading-none">78%</p>
          </div>
        </section>

        <section className="relative mt-3 grid grid-cols-4 gap-2">
          {assets.map((asset) => (
            <div key={asset.symbol} className="min-w-0">
              <p className="font-['IBM_Plex_Mono'] text-[9px] font-semibold text-[var(--mp-muted)]">{asset.symbol}</p>
              <p className="mt-1 truncate font-['Space_Grotesk'] text-[13px] font-semibold">{asset.price}</p>
              <p className={`mt-0.5 font-['IBM_Plex_Mono'] text-[8px] font-semibold ${asset.move.startsWith("−") ? "text-[var(--mp-red)]" : "text-[var(--mp-lime)]"}`}>{asset.move}</p>
            </div>
          ))}
        </section>

        <footer className="relative mt-auto flex items-center justify-between pt-3 font-['IBM_Plex_Mono'] text-[8px] text-[var(--mp-muted)]">
          <span className="flex items-center gap-1.5"><BarChart3 size={11} /> MARKET REGIME: RISK-ON</span>
          <span className="flex items-center gap-1 font-semibold text-[var(--mp-lime)] transition-transform group-hover:translate-x-0.5">
            {opened ? "OPENING PULSE" : "VIEW IMPACT"} <ChevronRight size={12} />
          </span>
        </footer>
        {opened && <ArrowUpRight className="sr-only" aria-hidden="true" />}
      </button>
    </main>
  );
}