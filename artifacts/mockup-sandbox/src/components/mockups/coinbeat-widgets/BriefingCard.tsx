import "./_group.css";
import { ArrowUpRight, BookOpen, ChevronRight } from "lucide-react";
import { AssetLine, Change, Footer, NewsLine, Shell, Status, assets, news } from "./_shared";

export function BriefingCard() {
  const lead = assets[3];
  return (
    <Shell className="bg-[#0a090d]">
      <div className="flex items-center justify-between"><div><div className="text-[9px] font-extrabold uppercase tracking-[.18em] text-[#ffad78]">DAILY BRIEFING</div><div className="mt-1 text-[16px] font-extrabold tracking-[-.06em]">오늘의 시장 브리핑</div></div><Status compact /></div>
      <div className="mt-4 rounded-[20px] bg-[#20151a] p-4 shadow-[0_12px_30px_rgba(0,0,0,.27)]">
        <div className="flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[.13em] text-[#ffad78]"><BookOpen size={12} /> LEAD STORY</div>
        <div className="mt-3 text-[15px] font-extrabold leading-[1.35] tracking-[-.04em]">{news[0].title}</div>
        <div className="mt-2 flex items-center justify-between text-[9px] text-[#b7928b]"><span>블록미디어 · {news[0].time}</span><ChevronRight size={14} /></div>
      </div>
      <div className="mt-3 flex items-center justify-between text-[9px] font-extrabold uppercase tracking-[.14em] text-[#8f7e86]"><span>MARKET SNAPSHOT</span><span className="text-[#ffad78]">UPBIT</span></div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {[lead, assets[0]].map((asset) => <div key={asset.symbol} className="rounded-[15px] bg-[#171217] p-3"><div className="flex items-center justify-between"><AssetLine asset={asset} /><Change value={asset.change} /></div><div className="mono mt-2 text-[13px] font-medium">{asset.price}</div></div>)}
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-[#ffad7822] pt-3"><ArrowUpRight size={14} color="#ffad78" /><span className="text-[10px] font-bold text-[#ffcab0]">브리핑 전체 읽기</span></div>
      <div className="mt-3"><Footer label="BLOCKMEDIA · NEWS + MARKET" /></div>
    </Shell>
  );
}