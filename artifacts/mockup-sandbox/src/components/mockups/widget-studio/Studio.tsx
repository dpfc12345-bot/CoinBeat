import "./_group.css";
import { Activity, ArrowUpRight, Check, Clock3, Newspaper, Radio, Sparkles } from "lucide-react";
import { useState } from "react";

type Intent = "price" | "news";
type Size = "small" | "medium" | "large";

const sizes: Record<Size, { label: string; dimensions: string; width: number; height: number }> = {
  small: { label: "작은", dimensions: "2 × 1", width: 248, height: 142 },
  medium: { label: "중간", dimensions: "4 × 2", width: 326, height: 194 },
  large: { label: "큰", dimensions: "4 × 4", width: 378, height: 284 },
};

const priceAssets = [
  { symbol: "BTC", price: "₩152.8M", change: "+3.82%" },
  { symbol: "ETH", price: "₩4.7M", change: "+2.41%" },
  { symbol: "SOL", price: "₩271K", change: "+6.17%" },
  { symbol: "XRP", price: "₩820", change: "-1.08%" },
];

function PriceWidget({ size, selected, onSelect }: { size: Size; selected: boolean; onSelect: () => void }) {
  const config = sizes[size];
  return (
    <button type="button" aria-label="여러 코인 가격 위젯 선택" aria-pressed={selected}
      onClick={onSelect} className={`studio-widget studio-widget-button ${selected ? "is-selected" : ""} studio-fade rounded-[18px] p-4 text-left`}
      style={{ width: `min(${config.width}px, 100%)`, height: config.height }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1d5fc0] text-[#b8d6ff]"><Activity size={14} strokeWidth={2.2} /></span>
          <span className="text-[12px] font-semibold tracking-[-.03em]">시장 가격</span>
          <span className="font-mono text-[9px] text-[#7891b9]">4종목</span>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-[#75d8b0]"><span className="h-1.5 w-1.5 rounded-full bg-[#63d2a7]" /> 거래중</span>
      </div>
      <div className={`mt-3 grid ${size === "small" ? "grid-cols-4 gap-1.5" : "grid-cols-2 gap-2"}`}>
        {priceAssets.map((asset) => (
          <div key={asset.symbol} className="rounded-[10px] border border-[#2a4167] bg-[#112343]/80 px-2 py-2">
            <p className="font-mono text-[9px] font-semibold text-[#9fb4d5]">{asset.symbol}</p>
            <p className={`${size === "small" ? "text-[10px]" : "text-[12px]"} mt-1 truncate font-mono font-bold tracking-[-.05em] text-[#f4f8ff]`}>{asset.price}</p>
            <p className={`mt-0.5 font-mono text-[8px] font-semibold ${asset.change.startsWith("-") ? "text-[#ff8097]" : "text-[#70d8a9]"}`}>{asset.change}</p>
          </div>
        ))}
      </div>
      {size !== "small" && <svg className="mt-3 h-[27px] w-full overflow-visible" viewBox="0 0 320 34" preserveAspectRatio="none" aria-label="시장 가격 추이">
        <path d="M0 27 C18 26, 22 22, 37 25 S61 20, 74 22 S92 17, 106 20 S126 12, 141 16 S161 12, 176 15 S195 8, 211 11 S230 10, 245 13 S263 3, 279 8 S302 1, 320 5" fill="none" stroke="#4d9cff" strokeWidth="1.5" />
        <path d="M0 27 C18 26, 22 22, 37 25 S61 20, 74 22 S92 17, 106 20 S126 12, 141 16 S161 12, 176 15 S195 8, 211 11 S230 10, 245 13 S263 3, 279 8 S302 1, 320 5 V34 H0Z" fill="url(#pulseFade)" opacity=".22" />
        <defs><linearGradient id="pulseFade" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#4d9cff" /><stop offset="1" stopColor="#4d9cff" stopOpacity="0" /></linearGradient></defs>
      </svg>}
      {size === "large" && <div className="mt-2 flex justify-between border-t border-[#2a4167] pt-2 text-[9px] text-[#7891b9]"><span>고가 ₩144,120,000</span><span>저가 ₩139,680,000</span></div>}
    </button>
  );
}

function NewsWidget({ size, selected, onSelect }: { size: Size; selected: boolean; onSelect: () => void }) {
  const config = sizes[size];
  return (
    <button type="button" aria-label="Coinness 뉴스 위젯 선택" aria-pressed={selected}
      onClick={onSelect} className={`studio-widget studio-widget-button ${selected ? "is-selected" : ""} studio-fade rounded-[18px] p-4 text-left`}
      style={{ width: `min(${config.width}px, 100%)`, height: config.height }}>
      <div className="flex items-center justify-between border-b border-[#2a4167] pb-3">
        <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1d5fc0] text-[#b8d6ff]"><Newspaper size={14} /></span><span className="text-[12px] font-semibold">Coinness 뉴스</span></div>
        <span className="text-[9px] text-[#7e98c2]">MARKET PULSE</span>
      </div>
      <div className="mt-3 flex h-[calc(100%-42px)] flex-col justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] text-[#73aaff]"><span className="rounded-sm bg-[#174e9e] px-1.5 py-0.5 font-semibold">주요 뉴스</span><span>비트코인</span></div>
          <p className={`font-semibold leading-[1.38] tracking-[-.055em] text-[#f3f7ff] ${size === "large" ? "text-[21px]" : size === "medium" ? "text-[17px]" : "text-[15px]"}`}>비트코인 현물 ETF, 3거래일 연속 순유입</p>
          {size !== "small" && <p className="mt-2 text-[10px] leading-[1.5] text-[#8fa2c0]">기관 자금이 다시 유입되며 시장의 위험 선호가 살아나는 분위기다.</p>}
        </div>
        <div className="flex items-center justify-between border-t border-[#2a4167] pt-2 text-[10px] text-[#8398ba]"><span className="font-semibold text-[#c6d4e9]">Coinness</span><span className="flex items-center gap-1"><Clock3 size={11} /> 18분 전</span></div>
      </div>
    </button>
  );
}

export function Studio() {
  const [intent, setIntent] = useState<Intent>("price");
  const [size, setSize] = useState<Size>("medium");
  const [selected, setSelected] = useState(false);
  const selectedLabel = `${intent === "price" ? "가격" : "뉴스"} 위젯 · ${sizes[size].label}`;

  const switchIntent = (next: Intent) => { setIntent(next); setSelected(false); };

  return (
    <main className="studio-root studio-surface flex min-h-[100dvh] w-full items-start justify-center p-4 sm:p-8">
      <section className="w-full max-w-[860px] overflow-hidden rounded-[28px] border border-[#263b61] bg-[#0d1b35]/95 shadow-[0_28px_90px_rgba(0,0,0,.35)]">
        <header className="border-b border-[#263b61] px-5 py-5 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div><p className="studio-kicker">market pulse / widget studio</p><h1 className="mt-2 text-[24px] font-bold tracking-[-.065em] text-[#f4f8ff]">한눈에 보는 시장</h1><p className="mt-1 text-[12px] text-[#879abc]">앱을 열기 전, 지금 필요한 한 장면을 고르세요.</p></div>
            <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#2f4b77] bg-[#14294d] text-[#72b1ff] sm:flex"><Sparkles size={17} /></div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="mb-2 text-[10px] font-semibold tracking-[.08em] text-[#758bb1]">위젯 의도</p><div className="flex gap-2">
              {([["price", "가격 위젯", Activity], ["news", "뉴스 위젯", Newspaper]] as const).map(([key, label, Icon]) => <button key={key} type="button" aria-pressed={intent === key} onClick={() => switchIntent(key)} className={`studio-control flex h-9 items-center gap-2 rounded-lg px-3 text-[11px] font-semibold ${intent === key ? "is-active" : ""}`}><Icon size={14} />{label}{intent === key && <Check size={12} />}</button>)}
            </div></div>
            <div><p className="mb-2 text-[10px] font-semibold tracking-[.08em] text-[#758bb1]">크기</p><div className="flex gap-1.5">{(Object.keys(sizes) as Size[]).map((key) => <button key={key} type="button" aria-pressed={size === key} onClick={() => { setSize(key); setSelected(false); }} className={`studio-control rounded-lg px-3 py-2 text-[11px] font-semibold ${size === key ? "is-active" : ""}`}>{sizes[key].label}<span className="ml-1 text-[9px] opacity-60">{sizes[key].dimensions}</span></button>)}</div></div>
          </div>
        </header>
        <div className="px-5 py-5 sm:px-8 sm:py-7">
          <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><Radio size={13} className="text-[#5da5ff]" /><span className="text-[11px] font-semibold text-[#bdcce2]">미리보기</span></div><span className="font-mono text-[9px] text-[#667c9f]">390 × 844 기준</span></div>
          <div className="studio-preview-well flex min-h-[330px] items-center justify-center rounded-2xl p-5 sm:min-h-[390px]">{intent === "price" ? <PriceWidget size={size} selected={selected} onSelect={() => setSelected((v) => !v)} /> : <NewsWidget size={size} selected={selected} onSelect={() => setSelected((v) => !v)} />}</div>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-[#263b61] bg-[#111f3b] px-3.5 py-3"><div><p className="text-[10px] text-[#6f87ad]">선택된 구성</p><p className="mt-1 text-[12px] font-semibold text-[#dce8f8]">{selectedLabel}</p></div><span className={`text-[10px] ${selected ? "text-[#72d6af]" : "text-[#7187a9]"}`}>{selected ? "선택됨" : "위젯을 눌러 선택"}</span></div>
        </div>
      </section>
    </main>
  );
}