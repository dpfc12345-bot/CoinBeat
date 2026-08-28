import "./_group.css";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { AssetLine, Change, Footer, Mark, NewsLine, Shell, Spark, Status, Topline, assets, news } from "./_shared";

export function PulseBeacon() {
  const lead = assets[0];
  return (
    <Shell className="bg-[#05070e]">
      <div className="mb-3 flex items-center justify-between">
        <Topline eyebrow="PULSE BEACON" right={<Status />} />
      </div>
      <div className="relative overflow-hidden rounded-[22px] border border-[#4c8dff33] bg-[#101a35] p-4 shadow-[0_14px_35px_rgba(0,0,0,.35)]">
        <div className="absolute -right-12 -top-16 h-36 w-36 rounded-full bg-[#4c8dff2a] blur-2xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2"><AssetLine asset={lead} showName /><span className="text-[8px] font-bold uppercase tracking-[.1em] text-[#8190a9]">대표 신호</span></div>
            <div className="mono text-[26px] font-medium tracking-[-.08em]">{lead.price}</div>
            <div className="mt-1 flex items-center gap-2"><Change value={lead.change} large /><span className="text-[9px] text-[#8190a9]">24시간</span></div>
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4c8dff] text-white shadow-[0_0_20px_#4c8dff77]"><ArrowUpRight size={17} /></button>
        </div>
        <div className="mt-4"><Spark height={34} /></div>
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        {assets.slice(1, 3).map((asset) => <div key={asset.symbol} className="rounded-[15px] bg-[#0d1324] p-3"><div className="flex items-center justify-between"><AssetLine asset={asset} /><Change value={asset.change} /></div><div className="mono mt-2 text-[13px] font-medium">{asset.price}</div></div>)}
      </div>
      <div className="mt-3 flex items-center justify-between"><div className="text-[9px] font-extrabold uppercase tracking-[.12em] text-[#8190a9]">지금 읽을 뉴스</div><ChevronRight size={14} color="#73a8ff" /></div>
      <NewsLine item={news[0]} featured />
      <Footer />
    </Shell>
  );
}