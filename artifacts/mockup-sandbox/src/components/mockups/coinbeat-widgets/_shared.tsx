import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, Clock3, Newspaper, Radio, TrendingUp, Wifi, Zap } from "lucide-react";

export type Asset = {
  symbol: string;
  name: string;
  price: string;
  change: number;
  tone: string;
};

export type News = {
  title: string;
  time: string;
  tags: string;
  breaking?: boolean;
};

export const assets: Asset[] = [
  { symbol: "BTC", name: "비트코인", price: "₩110,524,000", change: -0.43, tone: "#b6f34c" },
  { symbol: "ETH", name: "이더리움", price: "₩3,459,000", change: -0.35, tone: "#b3b8ff" },
  { symbol: "XRP", name: "엑스알피", price: "₩1,973", change: -1.84, tone: "#ffbf72" },
  { symbol: "TRUMP", name: "오피셜트럼프", price: "₩3,905", change: 10.94, tone: "#b6f34c" },
  { symbol: "SOL", name: "솔라나", price: "₩148,900", change: -1.26, tone: "#79e4d5" },
  { symbol: "PROM", name: "프롬", price: "₩6,820", change: 0.22, tone: "#db9cff" },
];

export const news: News[] = [
  { title: "슈퍼폰, 코인베이스 토큰화 주식 지원…NVDA 활용 수익 상품 선봬", time: "36분 전", tags: "속보 · NVDA", breaking: true },
  { title: "원키, 레저 지갑 취약점 재현…화면과 다른 거래에 서명", time: "51분 전", tags: "ETH · 보안" },
  { title: "이지랩스, 팀엑스에 전략적 투자…온체인 채권 인프라 발표", time: "1시간 전", tags: "시장 · 투자" },
  { title: "[펀드플로우] 비트코인·이더리움 현물 ETF 9일째 순유입", time: "2시간 전", tags: "BTC · ETF" },
];

export function Mark({ color = "#4c8dff", size = 30 }: { color?: string; size?: number }) {
  return (
    <span className="inline-flex items-center justify-center rounded-[11px]" style={{ width: size, height: size, background: `${color}22`, color }}>
      <Activity size={size * .56} strokeWidth={2.4} />
    </span>
  );
}

export function Status({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[.12em] text-[#77e5bc]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#77e5bc] shadow-[0_0_8px_#77e5bc]" />
      {compact ? "LIVE" : "UPBIT · LIVE"}
    </span>
  );
}

export function Change({ value, large = false }: { value: number; large?: boolean }) {
  const positive = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-1 font-bold ${large ? "text-[12px]" : "text-[10px]"}`} style={{ color: positive ? "#77e5bc" : "#ff7185", background: positive ? "#77e5bc19" : "#ff718519" }}>
      {positive ? <ArrowUpRight size={large ? 14 : 11} /> : <ArrowDownRight size={large ? 14 : 11} />}
      {positive ? "+" : ""}{value.toFixed(2)}%
    </span>
  );
}

export function Spark({ positive = false, height = 28 }: { positive?: boolean; height?: number }) {
  const color = positive ? "#77e5bc" : "#ff7185";
  return (
    <svg viewBox="0 0 120 32" width="100%" height={height} preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${positive ? "up" : "down"}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".27" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={positive ? "M0 25 L13 23 L23 25 L34 15 L47 18 L59 10 L70 14 L80 7 L92 11 L104 5 L120 2 V32 H0Z" : "M0 8 L12 10 L24 6 L35 15 L47 11 L59 17 L72 14 L84 24 L96 19 L107 27 L120 24 V32 H0Z"} fill={`url(#spark-${positive ? "up" : "down"})`} />
      <path d={positive ? "M0 25 L13 23 L23 25 L34 15 L47 18 L59 10 L70 14 L80 7 L92 11 L104 5 L120 2" : "M0 8 L12 10 L24 6 L35 15 L47 11 L59 17 L72 14 L84 24 L96 19 L107 27 L120 24"} fill="none" stroke={color} strokeWidth="1.7" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Shell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`coinbeat-preview ${className}`}>{children}</div>;
}

export function Topline({ eyebrow = "COINBEAT", right = <Status compact /> }: { eyebrow?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Mark />
        <div>
          <div className="text-[12px] font-extrabold tracking-[-.02em]">CoinBeat</div>
          <div className="mono mt-0.5 text-[8px] tracking-[.08em] text-[#8190a9]">{eyebrow}</div>
        </div>
      </div>
      {right}
    </div>
  );
}

export function AssetLine({ asset, showName = false }: { asset: Asset; showName?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: asset.tone, boxShadow: `0 0 8px ${asset.tone}` }} />
      <div className="min-w-0">
        <div className="text-[12px] font-extrabold">{asset.symbol}</div>
        {showName && <div className="truncate text-[9px] text-[#8190a9]">{asset.name}</div>}
      </div>
    </div>
  );
}

export function NewsLine({ item, featured = false }: { item: News; featured?: boolean }) {
  return (
    <div className={`min-w-0 ${featured ? "py-2" : "border-t border-white/[.07] py-2.5"}`}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className={`text-[8px] font-extrabold uppercase tracking-[.12em] ${item.breaking ? "text-[#ff7185]" : "text-[#73a8ff]"}`}>{item.tags}</span>
        <span className="shrink-0 text-[8px] text-[#8190a9]">{item.time}</span>
      </div>
      <div className={`${featured ? "text-[13px] leading-[1.35]" : "text-[11px] leading-[1.35]"} font-bold tracking-[-.03em]`}>{item.title}</div>
    </div>
  );
}

export function Footer({ label = "UPBIT · KRW" }: { label?: string }) {
  return <div className="flex items-center justify-between border-t border-white/[.08] pt-2.5 text-[8px] text-[#8190a9]"><span className="font-bold text-[#73a8ff]">{label}</span><span className="inline-flex items-center gap-1"><Clock3 size={10} /> 방금 업데이트</span></div>;
}

export const icons = { Newspaper, Radio, TrendingUp, BarChart3, Wifi, Zap };