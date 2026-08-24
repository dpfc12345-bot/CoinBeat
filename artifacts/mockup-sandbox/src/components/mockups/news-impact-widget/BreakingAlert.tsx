import "./_group.css";
import { ArrowUpRight, BellRing, ChevronRight, RadioTower, Zap } from "lucide-react";

const assets = [
  { symbol: "BTC", price: "$67,842", move: "+5.72%" },
  { symbol: "ETH", price: "$3,486", move: "+4.18%" },
  { symbol: "SOL", price: "$184.21", move: "+8.06%" },
  { symbol: "XRP", price: "$0.612", move: "+2.31%" },
];

export function BreakingAlert() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#080a0b] p-3 text-[var(--mp-text)]">
      <button
        type="button"
        aria-label="Open Market Pulse: breaking Bitcoin ETF inflow alert"
        className="group relative flex h-[294px] w-full max-w-[420px] flex-col overflow-hidden rounded-[22px] border border-[#53621e]/70 bg-[linear-gradient(135deg,#1a2116_0%,#101615_46%,#0c1010_100%)] p-[18px] text-left shadow-[0_20px_55px_rgba(0,0,0,.42)] transition duration-300 hover:border-[var(--mp-lime)]/80 hover:shadow-[0_24px_65px_rgba(159,196,41,.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mp-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080a0b]"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#b6dd38]/10 blur-3xl transition duration-500 group-hover:bg-[#b6dd38]/20" />
        <div className="pointer-events-none absolute -bottom-24 left-20 h-40 w-56 rounded-full bg-[#365126]/20 blur-3xl" />

        <header className="relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--mp-lime)] text-[#10150d] shadow-[0_0_0_4px_rgba(201,246,74,.08)]">
              <RadioTower size={16} strokeWidth={2.4} />
            </span>
            <div>
              <p className="font-['Space_Grotesk'] text-[13px] font-bold leading-none tracking-[-0.02em]">Market Pulse</p>
              <p className="mt-1 font-['IBM_Plex_Mono'] text-[8px] font-medium tracking-[0.12em] text-white/45">LIVE MARKET INTELLIGENCE</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 font-['IBM_Plex_Mono'] text-[8px] font-semibold tracking-[0.12em] text-[var(--mp-lime)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--mp-lime)] opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--mp-lime)]" />
            </span>
            LIVE
          </span>
        </header>

        <div className="relative mt-5 flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-[#f0b267]/35 bg-[#f0b267]/10 px-2.5 py-1.5 text-[#ffc783]">
            <BellRing size={12} strokeWidth={2.6} />
            <span className="font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.14em]">BREAKING</span>
          </div>
          <span className="font-['IBM_Plex_Mono'] text-[8px] tracking-[0.12em] text-white/40">2 MIN AGO · GLOBAL</span>
        </div>

        <section className="relative mt-3 min-w-0">
          <h1 className="font-['Space_Grotesk'] text-[23px] font-bold leading-[1.08] tracking-[-0.04em] text-white">
            Spot ETF inflows hit<br />
            <span className="text-[var(--mp-lime)]">a new daily high.</span>
          </h1>
          <p className="mt-2 max-w-[330px] truncate font-['IBM_Plex_Mono'] text-[10px] leading-relaxed text-white/55">
            $1.18B entered BTC funds before the U.S. close.
          </p>
        </section>

        <div className="relative mt-auto flex items-end justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.16em] text-white/55">BTC</span>
              <span className="font-['Space_Grotesk'] text-[26px] font-bold leading-none tracking-[-0.05em]">$67,842</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <ArrowUpRight size={14} className="text-[var(--mp-lime)]" strokeWidth={2.6} />
              <span className="font-['IBM_Plex_Mono'] text-[11px] font-semibold text-[var(--mp-lime)]">+5.72% today</span>
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--mp-lime)] px-3 py-2 font-['IBM_Plex_Mono'] text-[9px] font-semibold tracking-[0.08em] text-[#10150d] transition group-hover:bg-[#dbff73]">
            VIEW IMPACT <ChevronRight size={13} strokeWidth={2.8} />
          </span>
        </div>

        <div className="relative mt-4 grid grid-cols-4 gap-2 border-t border-white/10 pt-3">
          {assets.map((asset) => (
            <div key={asset.symbol} className="min-w-0">
              <p className="font-['IBM_Plex_Mono'] text-[8px] font-semibold tracking-[0.12em] text-white/45">{asset.symbol}</p>
              <p className="mt-1 truncate font-['Space_Grotesk'] text-[12px] font-semibold text-white/90">{asset.price}</p>
              <p className="mt-0.5 font-['IBM_Plex_Mono'] text-[8px] font-semibold text-[var(--mp-lime)]">{asset.move}</p>
            </div>
          ))}
          <div className="absolute -top-[1px] left-0 h-px w-[31%] bg-[var(--mp-lime)]" />
        </div>

        <footer className="relative mt-2 flex items-center justify-between font-['IBM_Plex_Mono'] text-[8px] tracking-[0.08em] text-white/35">
          <span className="flex items-center gap-1"><Zap size={10} className="text-[#ffc783]" /> HIGH IMPACT · 94/100</span>
          <span>Tap to open full brief</span>
        </footer>
      </button>
    </main>
  );
}