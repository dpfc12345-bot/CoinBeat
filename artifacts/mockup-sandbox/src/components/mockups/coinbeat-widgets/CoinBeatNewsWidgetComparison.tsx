import { ArrowUpRight, BarChart3, Check, ChevronDown, Clock3, GripVertical, Layers3, LineChart, Newspaper, Radio, Rss, SlidersHorizontal, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

type WidgetSize = "small" | "medium" | "large";
type NewsVariant = "headline" | "room" | "brief" | "ticker";

const stories = [
  { time: "09:42", tag: "MARKET", title: "비트코인, 6만 8천 달러선 회복…기관 매수세 유입", source: "CoinBeat Desk", tone: "blue" },
  { time: "09:18", tag: "REGULATION", title: "미국 현물 ETF, 4거래일 연속 순유입 기록", source: "CoinBeat Wire", tone: "mint" },
  { time: "08:56", tag: "ALTCOIN", title: "이더리움 현물 ETF 기대감에 ETH 거래량 급증", source: "Market Brief", tone: "amber" },
  { time: "08:31", tag: "ON-CHAIN", title: "고래 지갑, 거래소에서 1.2만 BTC 추가 인출", source: "Chain Signal", tone: "pink" },
];

const variants: { id: NewsVariant; name: string; eyebrow: string; description: string; accent: string }[] = [
  { id: "headline", name: "Headline Beacon", eyebrow: "대표 뉴스 강조", description: "한 문장에 집중하는 대표 헤드라인", accent: "#6ba6ff" },
  { id: "room", name: "Newsroom Stack", eyebrow: "뉴스룸 목록형", description: "시간순으로 훑는 오늘의 뉴스룸", accent: "#79e0c0" },
  { id: "brief", name: "Market Brief", eyebrow: "시장 브리핑형", description: "가격 변화와 뉴스를 한 장에", accent: "#ffb778" },
  { id: "ticker", name: "News Ticker", eyebrow: "파형 헤드라인", description: "스크롤 없이 읽는 실시간 헤드라인", accent: "#77e3ff" },
];

function StoryMark({ tone }: { tone: string }) {
  const colors: Record<string, string> = { blue: "#6ba6ff", mint: "#79e0c0", amber: "#ffb778", pink: "#ff7892" };
  return <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: colors[tone] }} />;
}

function NewsPreview({ variant, size }: { variant: NewsVariant; size: WidgetSize }) {
  const compact = size === "small";
  const wide = size === "large";
  const scale = compact ? 0.88 : wide ? 1.06 : 0.96;
  const font = (px: number) => ({ fontSize: `${px * scale}px` });
  const count = compact ? 1 : wide ? 4 : 3;

  if (variant === "headline") return (
    <div className="relative overflow-hidden rounded-[16px] bg-[#13264a] p-3.5" style={{ minHeight: compact ? 116 : wide ? 218 : 158 }}>
      <div className="absolute -right-9 -top-10 h-28 w-28 rounded-full bg-[#6ba6ff18] blur-2xl" />
      <div className="relative flex items-center justify-between text-[#a9c8ff]">
        <span className="flex items-center gap-1.5 text-[8px] font-extrabold tracking-[.14em]"><Radio size={11} /> HEADLINE BEACON</span>
        <span className="mono text-[8px]">LIVE</span>
      </div>
      <div className="relative mt-3 text-[#f4f7ff]" style={font(wide ? 17 : 14)}><span className="font-extrabold leading-[1.22]">{stories[0].title}</span></div>
      {!compact && <div className="relative mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[8px] text-[#91a9cd]"><span>{stories[0].source}</span><span>{stories[0].time} KST <ArrowUpRight size={10} className="ml-1 inline" /></span></div>}
    </div>
  );

  if (variant === "brief") return (
    <div className="overflow-hidden rounded-[16px] bg-[#2b1d19] p-3.5" style={{ minHeight: compact ? 116 : wide ? 218 : 158 }}>
      <div className="flex items-center justify-between text-[#ffbb88]"><span className="text-[8px] font-extrabold tracking-[.15em]">MARKET BRIEFING</span><BarChart3 size={13} /></div>
      <div className="mt-2 font-extrabold leading-[1.25] text-[#fff4e9]" style={font(wide ? 15 : 12)}>{stories[0].title}</div>
      <div className="mt-3 flex items-center justify-between rounded-[10px] bg-black/20 px-2.5 py-2">
        <div><div className="mono text-[8px] text-[#b59686]">BTC / KRW</div><div className="mono mt-1 font-bold text-[#fff4e9]" style={font(12)}>₩92,480,000</div></div>
        <span className="mono text-[9px] text-[#79e0c0]">+2.84%</span>
      </div>
      {!compact && <div className="mt-2 text-[8px] text-[#b59686]">CoinBeat Desk · 09:42 KST</div>}
    </div>
  );

  if (variant === "ticker") return (
    <div className="overflow-hidden rounded-[16px] border border-[#77e3ff2b] bg-[#0b202d]" style={{ minHeight: compact ? 116 : wide ? 218 : 158 }}>
      <div className="flex items-center gap-1.5 border-b border-[#77e3ff20] px-3 py-2"><span className="h-1.5 w-1.5 rounded-full bg-[#77e3ff]" /><span className="mono text-[8px] tracking-[.13em] text-[#77e3ff]">COINBEAT / NOW</span><span className="mono ml-auto text-[8px] text-[#6f99a9]">09:42:18</span></div>
      <div className="px-3 py-2">{stories.slice(0, count).map((story, i) => <div key={story.title} className="flex items-center gap-2 border-b border-[#77e3ff16] py-2 last:border-0"><span className="mono w-4 text-[8px] text-[#588397]">0{i + 1}</span><span className="h-px w-7 bg-gradient-to-r from-[#77e3ff] to-transparent" /><span className="min-w-0 flex-1 truncate font-bold text-[#e5f8ff]" style={font(10)}>{story.title}</span>{wide && <span className="mono text-[8px] text-[#6f99a9]">{story.time}</span>}</div>)}</div>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-[16px] bg-[#101c27] p-3" style={{ minHeight: compact ? 116 : wide ? 218 : 158 }}>
      <div className="flex items-center justify-between border-b border-white/[.09] pb-2"><span className="flex items-center gap-1.5 text-[8px] font-extrabold tracking-[.14em] text-[#86d6c0]"><Newspaper size={11} /> NEWSROOM STACK</span><span className="mono text-[8px] text-[#708b99]">4 STORIES</span></div>
      <div>{stories.slice(0, count).map((story) => <div key={story.title} className="flex gap-2 border-b border-white/[.06] py-2 last:border-0"><StoryMark tone={story.tone} /><div className="min-w-0"><div className="flex gap-1.5 text-[7px] font-bold tracking-[.1em] text-[#78919c]"><span>{story.tag}</span><span>·</span><span>{story.time}</span></div><div className="mt-0.5 truncate font-bold leading-[1.25] text-[#eef7f5]" style={font(wide ? 11 : 9)}>{story.title}</div></div></div>)}</div>
    </div>
  );
}

export function CoinBeatNewsWidgetComparison() {
  const [selected, setSelected] = useState<NewsVariant>("headline");
  const [previewSize, setPreviewSize] = useState<WidgetSize>("medium");
  return (
    <main className="min-h-[100dvh] bg-[#070b12] px-5 py-6 text-[#eef3fa] [font-family:ui-sans-serif,system-ui,sans-serif]">
      <div className="mx-auto max-w-[1200px]">
        <header className="flex items-center justify-between border-b border-white/[.09] pb-5">
          <div className="flex items-center gap-2.5"><div className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#203866] text-[#a9c8ff]"><Zap size={16} fill="currentColor" /></div><div><div className="text-[13px] font-extrabold tracking-[-.03em]">CoinBeat</div><div className="mono text-[8px] tracking-[.14em] text-[#71839d]">WIDGET STUDIO / NEWS SYSTEM</div></div></div>
          <div className="hidden items-center gap-2 text-[9px] text-[#8291a8] sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#79e0c0]" />SYNCED TO HOME SCREEN <SlidersHorizontal size={14} /></div>
        </header>
        <section className="flex flex-col justify-between gap-5 py-7 sm:flex-row sm:items-end">
          <div><div className="mb-2 flex items-center gap-2 text-[9px] font-extrabold tracking-[.18em] text-[#6ba6ff]"><Sparkles size={12} /> NEWS WIDGET LIBRARY</div><h1 className="text-[28px] font-extrabold tracking-[-.065em] text-[#f3f6fb] sm:text-[36px]">뉴스 위젯 네 가지,<br /><span className="text-[#8190a9]">한눈에 비교해보세요.</span></h1><p className="mt-3 max-w-[470px] text-[11px] leading-[1.6] text-[#8291a8]">홈 화면에서 시장의 온도를 읽는 방식. 같은 뉴스, 다른 리듬.</p></div>
          <div className="flex items-center gap-1 rounded-[12px] border border-white/[.1] bg-[#0e1522] p-1">{(["small", "medium", "large"] as WidgetSize[]).map((size) => <button key={size} onClick={() => setPreviewSize(size)} className={`rounded-[8px] px-3 py-2 text-[9px] font-bold transition ${previewSize === size ? "bg-[#263d6a] text-[#dce9ff]" : "text-[#78869a] hover:text-[#dce9ff]"}`}>{size === "small" ? "작게" : size === "medium" ? "중간" : "크게"}</button>)}</div>
        </section>
        <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{variants.map((variant) => <button key={variant.id} onClick={() => setSelected(variant.id)} className={`relative rounded-[13px] border p-3 text-left transition ${selected === variant.id ? "border-[#6ba6ff99] bg-[#152443]" : "border-white/[.08] bg-[#0d141f] hover:border-white/20"}`}><div className="flex items-center justify-between"><span className="text-[10px] font-extrabold">{variant.name}</span>{selected === variant.id && <Check size={12} className="text-[#9ec3ff]" />}</div><div className="mt-1 text-[8px] text-[#8190a9]">{variant.eyebrow}</div><div className="mt-2 h-0.5 w-8 rounded-full" style={{ backgroundColor: variant.accent }} /></button>)}</div>
        <section className="rounded-[20px] border border-white/[.09] bg-[#0d131e] p-4 shadow-[0_20px_50px_rgba(0,0,0,.18)] sm:p-5">
          <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2 text-[10px] font-extrabold tracking-[.12em] text-[#8291a8]"><Layers3 size={14} className="text-[#6ba6ff]" /> COMPARISON BOARD <span className="hidden text-[#516178] sm:inline">/ ALL FORM FACTORS</span></div><div className="mono hidden items-center gap-1 text-[8px] text-[#60728a] sm:flex"><GripVertical size={12} /> DRAG TO ARRANGE</div></div>
          <div className="grid gap-4 md:grid-cols-4">{variants.map((variant) => <article key={variant.id} className={`rounded-[16px] border p-3 transition ${selected === variant.id ? "border-[#6ba6ff66] bg-[#111c2c]" : "border-white/[.07] bg-[#0a1019]"}`}><div className="mb-3 flex items-start justify-between"><div><div className="text-[11px] font-extrabold">{variant.name}</div><div className="mt-1 text-[8px] text-[#718198]">{variant.description}</div></div><span className="mt-1 h-2 w-2 rounded-full" style={{ backgroundColor: variant.accent }} /></div><div className="space-y-2"><div><div className="mb-1.5 flex items-center justify-between"><span className="text-[8px] font-bold text-[#9aa8ba]">SMALL</span><span className="mono text-[7px] text-[#5f7187]">2×2</span></div><NewsPreview variant={variant.id} size="small" /></div><div><div className="mb-1.5 flex items-center justify-between"><span className="text-[8px] font-bold text-[#9aa8ba]">MEDIUM</span><span className="mono text-[7px] text-[#5f7187]">4×2</span></div><NewsPreview variant={variant.id} size="medium" /></div><div><div className="mb-1.5 flex items-center justify-between"><span className="text-[8px] font-bold text-[#9aa8ba]">LARGE</span><span className="mono text-[7px] text-[#5f7187]">4×4</span></div><NewsPreview variant={variant.id} size="large" /></div></div><button onClick={() => setSelected(variant.id)} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[9px] border border-white/[.1] bg-white/[.03] py-2 text-[9px] font-bold text-[#9aa8ba] hover:bg-white/[.07] hover:text-[#e7effc]">{selected === variant.id ? <Check size={11} className="text-[#79e0c0]" /> : <ChevronDown size={11} />} {selected === variant.id ? "선택됨" : "이 디자인 선택"}</button></article>)}</div>
        </section>
        <footer className="flex items-center justify-between px-1 py-5 text-[8px] text-[#59697e]"><span className="flex items-center gap-1.5"><Rss size={11} /> CoinBeat News System · Korean market feed</span><span className="flex items-center gap-1.5"><Clock3 size={11} /> UPDATED 09:42 KST</span></footer>
      </div>
    </main>
  );
}