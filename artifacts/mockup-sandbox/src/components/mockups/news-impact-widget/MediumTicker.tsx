import "./_group.css";
import { ArrowUpRight, BarChart3, ChevronRight } from "lucide-react";

const assets = [
  { symbol: "BTC", name: "Bitcoin", price: "$67,842", change: "+3.82%", score: 82, tone: "strong" },
  { symbol: "ETH", name: "Ethereum", price: "$3,482.16", change: "+2.41%", score: 64, tone: "steady" },
  { symbol: "SOL", name: "Solana", price: "$184.72", change: "+6.17%", score: 93, tone: "strong" },
  { symbol: "XRP", name: "XRP", price: "$0.6118", change: "−1.08%", score: 28, tone: "down" },
];

function AssetCell({
  symbol,
  name,
  price,
  change,
  score,
  tone,
}: (typeof assets)[number]) {
  const isDown = tone === "down";

  return (
    <div className="relative min-w-0 overflow-hidden rounded-[13px] border border-[#293431] bg-[#131918] px-3 py-2.5">
      <div
        className={`absolute inset-x-0 bottom-0 h-[2px] ${
          isDown ? "bg-[#ff7a80]/75" : tone === "strong" ? "bg-[#c9f64a]" : "bg-[#9aad75]"
        }`}
        style={{ width: `${score}%` }}
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="font-['Space_Grotesk'] text-[13px] font-bold tracking-[0.02em] text-[#f4f7f1]">{symbol}</p>
          <p className="mt-0.5 truncate font-['IBM_Plex_Mono'] text-[8px] tracking-[-0.02em] text-[#81908b]">{name}</p>
        </div>
        <span className={`mt-0.5 font-['IBM_Plex_Mono'] text-[9px] font-semibold ${isDown ? "text-[#ff7a80]" : "text-[#c9f64a]"}`}>
          {change}
        </span>
      </div>
      <p className="mt-3 truncate font-['IBM_Plex_Mono'] text-[14px] font-medium tracking-[-0.06em] text-[#f4f7f1]">{price}</p>
    </div>
  );
}

export function MediumTicker() {
  return (
    <main className="min-h-[100dvh] w-full bg-[#080a0b] p-2.5 text-[#f4f7f1]">
      <button
        type="button"
        className="group relative flex h-[240px] w-full flex-col overflow-hidden rounded-[22px] border border-[#2d3935] bg-[radial-gradient(circle_at_92%_0%,rgba(201,246,74,0.10),transparent_33%),linear-gradient(145deg,#151d1b_0%,#0d1211_66%,#111716_100%)] p-4 text-left shadow-[0_18px_40px_rgba(0,0,0,0.32)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9f64a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080a0b]"
        aria-label="Open Market Pulse. Compare live moves for Bitcoin, Ethereum, Solana and XRP."
      >
        <div className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-[#c9f64a]/[0.04] blur-2xl" />

        <header className="relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#c9f64a] text-[#111817]">
              <BarChart3 size={15} strokeWidth={2.6} />
            </span>
            <div>
              <p className="font-['Space_Grotesk'] text-[13px] font-bold leading-none tracking-[-0.02em]">Market Pulse</p>
              <p className="mt-1 font-['IBM_Plex_Mono'] text-[8px] font-medium tracking-[0.14em] text-[#81908b]">MAJOR ASSETS</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-[#c9f64a]/20 bg-[#c9f64a]/[0.07] px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c9f64a] shadow-[0_0_0_3px_rgba(201,246,74,0.10)]" />
            <span className="font-['IBM_Plex_Mono'] text-[8px] font-semibold tracking-[0.12em] text-[#c9f64a]">LIVE</span>
          </div>
        </header>

        <div className="relative mt-4 grid min-h-0 flex-1 grid-cols-2 gap-2">
          {assets.map((asset) => (
            <AssetCell key={asset.symbol} {...asset} />
          ))}
        </div>

        <footer className="relative mt-3 flex items-center justify-between border-t border-[#293431] pt-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="font-['IBM_Plex_Mono'] text-[8px] font-semibold tracking-[0.12em] text-[#81908b]">MARKET BREADTH</span>
            <span className="font-['IBM_Plex_Mono'] text-[10px] font-semibold text-[#c9f64a]">3 / 4 UP</span>
            <span className="text-[#81908b]">·</span>
            <span className="font-['IBM_Plex_Mono'] text-[8px] text-[#81908b]">24H</span>
          </div>
          <span className="flex shrink-0 items-center gap-1 font-['IBM_Plex_Mono'] text-[8px] font-semibold tracking-[0.08em] text-[#f4f7f1]/60 transition-colors group-hover:text-[#c9f64a]">
            VIEW PULSE <ChevronRight size={11} />
          </span>
        </footer>

        <span className="sr-only">
          Last updated 2 minutes ago. Solana is leading with a 6.17 percent gain.
          <ArrowUpRight aria-hidden="true" />
        </span>
      </button>
    </main>
  );
}