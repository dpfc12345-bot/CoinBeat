import "./_group.css";
import { Check, ChevronDown, GripVertical, LayoutGrid, Newspaper, Settings2, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { AssetLine, Change, Footer, Mark, NewsLine, Shell, Spark, Status, assets, news } from "./_shared";

type Design = "beacon" | "desk" | "stack" | "ticker" | "briefing" | "elastic";
type Kind = "price" | "news";
type Size = "small" | "medium" | "large";
type FontSize = "small" | "default" | "large";
type NewsDesign = "headline" | "room" | "brief" | "ticker";

const designs: { id: Design; label: string; note: string }[] = [
  { id: "beacon", label: "Pulse Beacon", note: "대표 신호" },
  { id: "desk", label: "Night Desk", note: "트레이딩 보드" },
  { id: "stack", label: "Signal Stack", note: "우선순위" },
  { id: "ticker", label: "Ticker Window", note: "파형 티커" },
  { id: "briefing", label: "Briefing Card", note: "시장 브리핑" },
  { id: "elastic", label: "Elastic Grid", note: "크기 적응형" },
];

const fontScale: Record<FontSize, number> = { small: 0.88, default: 1, large: 1.14 };
const sizeLabels: Record<Size, string> = { small: "작게", medium: "중간", large: "크게" };
const newsDesigns: { id: NewsDesign; label: string; note: string }[] = [
  { id: "headline", label: "Headline Beacon", note: "대표 뉴스 강조" },
  { id: "room", label: "Newsroom Stack", note: "뉴스룸 목록형" },
  { id: "brief", label: "Market Brief", note: "시장 브리핑형" },
  { id: "ticker", label: "News Ticker", note: "파형 헤드라인" },
];

export function WidgetConfigurator() {
  const [design, setDesign] = useState<Design>("ticker");
  const [kind, setKind] = useState<Kind>("price");
  const [size, setSize] = useState<Size>("medium");
  const [fontSize, setFontSize] = useState<FontSize>("default");
  const [newsDesign, setNewsDesign] = useState<NewsDesign>("headline");
  const scale = fontScale[fontSize];
  const selected = useMemo(() => designs.find((item) => item.id === design) ?? designs[3], [design]);

  return (
    <Shell className="bg-[#05070e]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Mark />
          <div><div className="text-[12px] font-extrabold">CoinBeat</div><div className="mono mt-0.5 text-[8px] tracking-[.12em] text-[#8190a9]">WIDGET STUDIO</div></div>
        </div>
        <div className="flex items-center gap-2 text-[#8190a9]"><Status compact /><Settings2 size={14} /></div>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div><div className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[#73a8ff]">HOME SCREEN SETUP</div><div className="mt-1 text-[18px] font-extrabold tracking-[-.06em]">위젯을 골라보세요</div></div>
        <div className="rounded-full bg-[#111a2e] px-2.5 py-1 text-[8px] font-bold text-[#73a8ff]">자동 반영</div>
      </div>

      <div className="mt-4 rounded-[20px] bg-[#0d1323] p-3.5 shadow-[0_12px_30px_rgba(0,0,0,.25)]">
        <div className="mb-2.5 flex items-center justify-between"><span className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[.13em] text-[#8190a9]"><Sparkles size={12} color="#73a8ff" /> 디자인 선택</span><span className="text-[9px] text-[#73a8ff]">{selected.label}</span></div>
        <div className="grid grid-cols-3 gap-1.5">
          {designs.map((item) => <button key={item.id} onClick={() => setDesign(item.id)} className={`relative rounded-[11px] px-2 py-2.5 text-left transition ${design === item.id ? "bg-[#1e376c] text-[#f4f7ff] shadow-[0_0_0_1px_#4c8dff]" : "bg-[#121a2b] text-[#8190a9]"}`}><div className="truncate text-[9px] font-extrabold">{item.label}</div><div className="mt-1 truncate text-[8px] opacity-70">{item.note}</div>{design === item.id && <Check size={11} className="absolute right-1.5 top-1.5 text-[#9ac2ff]" />}</button>)}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button onClick={() => setKind("price")} className={`flex flex-1 items-center justify-center gap-2 rounded-[13px] py-2.5 text-[10px] font-extrabold ${kind === "price" ? "bg-[#4c8dff] text-white" : "bg-[#101727] text-[#8190a9]"}`}><LayoutGrid size={13} /> 가격 위젯</button>
        <button onClick={() => setKind("news")} className={`flex flex-1 items-center justify-center gap-2 rounded-[13px] py-2.5 text-[10px] font-extrabold ${kind === "news" ? "bg-[#4c8dff] text-white" : "bg-[#101727] text-[#8190a9]"}`}><Newspaper size={13} /> 뉴스 위젯</button>
      </div>

      {kind === "news" && <div className="mt-3 rounded-[16px] bg-[#0d1323] p-3.5">
        <div className="mb-2.5 flex items-center justify-between"><span className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[.13em] text-[#8190a9]"><Newspaper size={12} /> 뉴스 위젯 디자인</span><span className="text-[9px] text-[#73a8ff]">{newsDesigns.find((item) => item.id === newsDesign)?.label}</span></div>
        <div className="grid grid-cols-2 gap-1.5">
          {newsDesigns.map((item) => <button key={item.id} onClick={() => setNewsDesign(item.id)} className={`relative rounded-[11px] px-2.5 py-2.5 text-left transition ${newsDesign === item.id ? "bg-[#1e376c] text-[#f4f7ff] shadow-[0_0_0_1px_#4c8dff]" : "bg-[#121a2b] text-[#8190a9]"}`}><div className="truncate text-[9px] font-extrabold">{item.label}</div><div className="mt-1 truncate text-[8px] opacity-70">{item.note}</div>{newsDesign === item.id && <Check size={11} className="absolute right-1.5 top-1.5 text-[#9ac2ff]" />}</button>)}
        </div>
      </div>}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-[14px] bg-[#0d1323] p-3"><div className="mb-2 flex items-center gap-1.5 text-[8px] font-extrabold uppercase tracking-[.13em] text-[#8190a9]"><SlidersHorizontal size={11} /> 글자 크기</div><div className="flex gap-1">{(["small", "default", "large"] as FontSize[]).map((item) => <button key={item} onClick={() => setFontSize(item)} className={`flex-1 rounded-[8px] py-1.5 text-[9px] font-bold ${fontSize === item ? "bg-[#273e72] text-[#f4f7ff]" : "bg-[#151d2d] text-[#8190a9]"}`}>{item === "small" ? "작게" : item === "default" ? "기본" : "크게"}</button>)}</div></div>
        <div className="rounded-[14px] bg-[#0d1323] p-3"><div className="mb-2 flex items-center gap-1.5 text-[8px] font-extrabold uppercase tracking-[.13em] text-[#8190a9]"><GripVertical size={11} /> 위젯 크기</div><div className="flex gap-1">{(["small", "medium", "large"] as Size[]).map((item) => <button key={item} onClick={() => setSize(item)} className={`flex-1 rounded-[8px] py-1.5 text-[9px] font-bold ${size === item ? "bg-[#273e72] text-[#f4f7ff]" : "bg-[#151d2d] text-[#8190a9]"}`}>{sizeLabels[item]}</button>)}</div></div>
      </div>

      <div className="mt-3 rounded-[22px] bg-[#080d18] p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)]">
        <div className="mb-2 flex items-center justify-between"><span className="text-[8px] font-extrabold uppercase tracking-[.14em] text-[#8190a9]">LIVE PREVIEW</span><span className="mono text-[8px] text-[#73a8ff]">{size.toUpperCase()} · {fontSize.toUpperCase()}</span></div>
       <Preview design={design} kind={kind} size={size} scale={scale} newsDesign={newsDesign} />
      </div>
      <div className="mt-3 flex items-center justify-between rounded-[14px] bg-[#12203b] px-3 py-2.5"><span className="text-[9px] font-bold text-[#a9c9ff]">홈 화면에서 크기를 조절하면 자동으로 재구성됩니다</span><ChevronDown size={13} className="rotate-[-90deg] text-[#73a8ff]" /></div>
    </Shell>
  );
}

function Preview({ design, kind, size, scale, newsDesign }: { design: Design; kind: Kind; size: Size; scale: number; newsDesign: NewsDesign }) {
  const compact = size === "small";
  const wide = size === "large";
  const font = (base: number) => ({ fontSize: `${base * scale}px` });
  if (kind === "news") {
    const palette = newsDesign === "brief" ? { bg: "bg-[#20151a]", accent: "#ffad78", title: "오늘의 시장 브리핑" } : newsDesign === "ticker" ? { bg: "bg-[#0b1b2a]", accent: "#7fe3ff", title: "NEWS TICKER" } : { bg: "bg-[#10182b]", accent: "#73a8ff", title: newsDesign === "room" ? "BLOCKMEDIA NEWSROOM" : "블록미디어 뉴스" };
    if (newsDesign === "headline") return <div className={`overflow-hidden rounded-[17px] ${palette.bg} p-3`} style={{ minHeight: compact ? 104 : wide ? 176 : 136 }}>
      <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><Mark color={palette.accent} size={22} /><span className="font-extrabold" style={font(11)}>{palette.title}</span></div><Status compact /></div>
      <div className="mt-2 rounded-[11px] bg-black/20 p-2.5"><div className="mb-1 text-[8px] font-extrabold uppercase tracking-[.13em]" style={{ color: palette.accent }}>{news[0].tags}</div><div className="font-extrabold leading-[1.35]" style={font(wide ? 14 : 12)}>{news[0].title}</div><div className="mt-2 text-[8px] text-[#8190a9]">{news[0].time} · 블록미디어</div></div>
      {wide && <div className="mt-1"><NewsLine item={news[1]} /></div>}
    </div>;
    if (newsDesign === "brief") return <div className={`overflow-hidden rounded-[17px] ${palette.bg} p-3`} style={{ minHeight: compact ? 104 : wide ? 176 : 136 }}>
      <div className="text-[8px] font-extrabold uppercase tracking-[.16em]" style={{ color: palette.accent }}>MARKET BRIEFING</div><div className="mt-2 font-extrabold leading-[1.35]" style={font(wide ? 14 : 12)}>{news[0].title}</div><div className="mt-2 flex items-center justify-between text-[8px] text-[#b7928b]"><span>블록미디어 · {news[0].time}</span><span style={{ color: palette.accent }}>읽기</span></div>
      {!compact && <div className="mt-2 border-t border-white/[.08] pt-2"><NewsLine item={news[1]} /></div>}
    </div>;
    if (newsDesign === "ticker") return <div className={`overflow-hidden rounded-[17px] border border-[#7fe3ff33] ${palette.bg}`} style={{ minHeight: compact ? 104 : wide ? 176 : 136 }}>
      <div className="flex items-center gap-1.5 border-b border-[#7fe3ff22] px-3 py-2"><span className="h-1.5 w-1.5 rounded-full bg-[#7fe3ff]" /><span className="mono text-[8px] tracking-[.12em] text-[#7fe3ff]">BLOCKMEDIA NEWS TICKER</span></div>
      {news.slice(0, compact ? 1 : wide ? 3 : 2).map((item) => <div key={item.title} className="flex items-start gap-2 border-b border-[#7fe3ff18] px-3 py-2 last:border-0"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7fe3ff]" /><div className="min-w-0 flex-1"><div className="truncate text-[8px] text-[#8190a9]">{item.tags} · {item.time}</div><div className="mt-0.5 font-bold leading-[1.3]" style={font(11)}>{item.title}</div></div></div>)}
    </div>;
    return <div className={`overflow-hidden rounded-[17px] ${palette.bg} p-3`} style={{ minHeight: compact ? 104 : wide ? 176 : 136 }}>
      <div className="flex items-center justify-between border-b border-white/[.08] pb-2"><div className="flex items-center gap-1.5"><Mark color={palette.accent} size={22} /><span className="font-extrabold" style={font(11)}>{palette.title}</span></div><Status compact /></div>
      <div className="mt-1">{news.slice(0, compact ? 1 : wide ? 4 : 3).map((item) => <NewsLine key={item.title} item={item} />)}</div>
      {wide && <Footer label="BLOCKMEDIA RSS" />}
    </div>;
  }
  if (design === "beacon") {
    return <div className="rounded-[17px] bg-[#101a35] p-3.5 shadow-[0_10px_24px_rgba(0,0,0,.3)]"><div className="flex items-center justify-between"><AssetLine asset={assets[0]} showName /><Change value={assets[0].change} large /></div><div className="mono mt-2" style={font(wide ? 24 : 19)}>{assets[0].price}</div><div className="mt-2"><Spark height={compact ? 24 : 32} /></div>{!compact && <div className="mt-2 grid grid-cols-2 gap-1.5">{assets.slice(1, wide ? 3 : 2).map((asset) => <div key={asset.symbol} className="rounded-[9px] bg-[#0c1428] px-2 py-1.5"><AssetLine asset={asset} /><div className="mono mt-1 text-[9px]">{asset.price}</div></div>)}</div>}</div>;
  }
  if (design === "stack") return <div className="space-y-1">{assets.slice(0, compact ? 2 : wide ? 5 : 3).map((asset, index) => <div key={asset.symbol} className="relative flex items-center gap-2 overflow-hidden rounded-[10px] bg-[#0d1321] px-2.5 py-2"><div className="absolute left-0 top-0 h-full w-0.5" style={{ background: asset.change >= 0 ? "#77e5bc" : index === 0 ? "#4c8dff" : "#ff7185" }} /><span className="mono w-4 text-[8px] text-[#8190a9]">0{index + 1}</span><AssetLine asset={asset} /><span className="mono ml-auto text-[9px]" style={font(9)}>{asset.price}</span><Change value={asset.change} /></div>)}</div>;
  if (design === "briefing") return <div className="rounded-[17px] bg-[#20151a] p-3.5"><div className="text-[8px] font-extrabold uppercase tracking-[.16em] text-[#ffad78]">MARKET BRIEFING</div><div className="mt-2 font-extrabold leading-[1.3]" style={font(wide ? 14 : 12)}>{news[0].title}</div><div className="mt-2 flex items-center justify-between"><AssetLine asset={assets[3]} /><Change value={assets[3].change} /></div></div>;
  if (design === "elastic") return <div className="grid grid-cols-2 gap-1.5">{assets.slice(0, compact ? 2 : wide ? 6 : 4).map((asset) => <div key={asset.symbol} className="rounded-[10px] bg-[#17203b] p-2"><div className="flex items-center justify-between"><AssetLine asset={asset} /><Change value={asset.change} /></div><div className="mono mt-1.5 truncate" style={font(9)}>{asset.price}</div></div>)}</div>;
  return <div className="overflow-hidden rounded-[17px] border border-[#7fe3ff33] bg-[#0b1b2a]"><div className="flex items-center gap-1.5 border-b border-[#7fe3ff22] px-2.5 py-2"><span className="h-1.5 w-1.5 rounded-full bg-[#7fe3ff]" /><span className="mono text-[8px] tracking-[.12em] text-[#7fe3ff]">UPBIT KRW TICKER</span></div>{assets.slice(0, compact ? 2 : wide ? 5 : 3).map((asset) => <div key={asset.symbol} className="flex items-center gap-2 border-b border-[#7fe3ff18] px-2.5 py-2 last:border-0"><span className="w-8 text-[9px] font-extrabold">{asset.symbol}</span><div className="h-px flex-1 bg-gradient-to-r from-[#7fe3ff99] to-transparent" /><span className="mono text-[9px]">{asset.price}</span><Change value={asset.change} /></div>)}</div>;
}