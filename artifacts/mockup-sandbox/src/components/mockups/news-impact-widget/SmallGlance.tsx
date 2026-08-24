import "./_group.css";

const markets = [
  { symbol: "ETH", price: "$3,486", move: "+2.41%", positive: true },
  { symbol: "SOL", price: "$184.22", move: "+6.17%", positive: true },
  { symbol: "XRP", price: "$0.612", move: "−1.08%", positive: false },
];

export function SmallGlance() {
  return (
    <main className="min-h-[240px] w-[260px] overflow-hidden bg-[#080a0b] p-2">
      <button
        type="button"
        aria-label="Open Market Pulse — Bitcoin is up 3.82 percent with a high news impact score"
        className="group relative flex h-[224px] w-[244px] flex-col overflow-hidden rounded-[18px] border border-[#26302e] bg-[linear-gradient(145deg,#151c1c_0%,#0e1313_58%,#111913_100%)] p-[15px] text-left text-[var(--mp-text)] shadow-[0_14px_34px_rgba(0,0,0,0.42)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mp-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080a0b] active:translate-y-0"
      >
        <span className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#c9f64a]/[0.06] blur-2xl" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[var(--mp-lime)] text-[12px] font-bold text-[#111817]">
              M
            </span>
            <span className="font-['Space_Grotesk'] text-[11px] font-bold tracking-[-0.01em]">
              Market Pulse
            </span>
          </div>
          <span className="flex items-center gap-1.5 font-['IBM_Plex_Mono'] text-[8px] font-semibold tracking-[0.1em] text-[var(--mp-lime)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--mp-lime)] shadow-[0_0_0_3px_rgba(201,246,74,0.12)]" />
            LIVE
          </span>
        </div>

        <div className="relative mt-3 flex items-end justify-between">
          <div>
            <p className="font-['IBM_Plex_Mono'] text-[9px] font-semibold tracking-[0.14em] text-white/45">
              BTC / USD
            </p>
            <p className="mt-0.5 font-['Space_Grotesk'] text-[30px] font-semibold leading-none tracking-[-0.065em]">
              $67,842
            </p>
            <p className="mt-1.5 font-['IBM_Plex_Mono'] text-[10px] font-semibold text-[var(--mp-lime)]">
              +3.82% <span className="ml-1 text-white/35">24H</span>
            </p>
          </div>

          <div className="relative mb-0.5 h-[62px] w-[76px]">
            <svg
              viewBox="0 0 76 48"
              className="absolute bottom-0 left-0 h-[48px] w-[76px]"
              aria-hidden="true"
            >
              <path
                d="M1 38.5C7 39 8 31 14 33s7 5 12 0c5-4 7-12 12-9s6 5 10 0c5-6 7-10 12-5 4 4 7-3 15-13"
                fill="none"
                stroke="#c9f64a"
                strokeLinecap="round"
                strokeWidth="2"
              />
              <path
                d="M1 38.5C7 39 8 31 14 33s7 5 12 0c5-4 7-12 12-9s6 5 10 0c5-6 7-10 12-5 4 4 7-3 15-13V48H1Z"
                fill="url(#small-glance-fill)"
                opacity="0.28"
              />
              <defs>
                <linearGradient id="small-glance-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop stopColor="#c9f64a" />
                  <stop offset="1" stopColor="#c9f64a" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute right-0 top-0 font-['IBM_Plex_Mono'] text-[8px] text-white/35">
              24H
            </span>
          </div>
        </div>

        <div className="relative mt-3 flex items-center justify-between rounded-[10px] border border-[#c9f64a]/25 bg-[#c9f64a]/[0.08] px-2.5 py-2">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--mp-lime)]/50 font-['IBM_Plex_Mono'] text-[9px] font-semibold text-[var(--mp-lime)]">
              9
            </span>
            <div>
              <p className="font-['IBM_Plex_Mono'] text-[8px] font-semibold tracking-[0.1em] text-[var(--mp-lime)]">
                NEWS IMPACT
              </p>
              <p className="mt-0.5 font-['Space_Grotesk'] text-[10px] font-semibold text-white/75">
                Elevated movement
              </p>
            </div>
          </div>
          <span className="font-['IBM_Plex_Mono'] text-[9px] font-semibold text-[var(--mp-lime)]">
            92
          </span>
        </div>

        <div className="relative mt-auto grid grid-cols-3 divide-x divide-[#26302e] border-t border-[#26302e] pt-2">
          {markets.map((market) => (
            <div key={market.symbol} className="min-w-0 px-2 first:pl-0 last:pr-0">
              <p className="font-['IBM_Plex_Mono'] text-[8px] font-semibold tracking-[0.08em] text-white/45">
                {market.symbol}
              </p>
              <p className="mt-0.5 truncate font-['Space_Grotesk'] text-[11px] font-semibold">
                {market.price}
              </p>
              <p
                className={`mt-0.5 font-['IBM_Plex_Mono'] text-[8px] font-semibold ${
                  market.positive ? "text-[var(--mp-lime)]" : "text-[var(--mp-red)]"
                }`}
              >
                {market.move}
              </p>
            </div>
          ))}
        </div>
      </button>
    </main>
  );
}