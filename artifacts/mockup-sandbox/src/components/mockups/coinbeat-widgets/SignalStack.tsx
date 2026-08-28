import "./_group.css";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import { AssetLine, Change, Footer, NewsLine, Shell, Status, assets, news } from "./_shared";

export function SignalStack() {
  return (
    <Shell className="bg-[#05070e]">
      <div className="flex items-center justify-between"><div><div className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[#73a8ff]">SIGNAL STACK</div><div className="mt-1 text-[16px] font-extrabold tracking-[-.05em]">시장 신호</div></div><div className="flex items-center gap-2"><Status compact /><MoreHorizontal size={15} color="#8190a9" /></div></div>
      <div className="mt-4 space-y-1">
        {assets.slice(0, 4).map((asset, index) => (
          <div key={asset.symbol} className="relative flex items-center gap-3 overflow-hidden rounded-[13px] bg-[#0d1321] px-3 py-2.5">
            <div className="absolute left-0 top-0 h-full w-1" style={{ background: index === 0 ? "#4c8dff" : asset.change >= 0 ? "#77e5bc" : "#ff7185" }} />
            <div className="w-4 text-center mono text-[9px] text-[#8190a9]">0{index + 1}</div>
            <AssetLine asset={asset} showName />
            <div className="ml-auto text-right"><div className="mono text-[11px] font-medium">{asset.price}</div><Change value={asset.change} /></div>
            <ArrowUpRight size={13} color="#8190a9" />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between"><span className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[#8190a9]">뉴스 시그널</span><span className="text-[9px] font-bold text-[#73a8ff]">전체 보기</span></div>
      <NewsLine item={news[0]} />
      <NewsLine item={news[1]} />
      <Footer label="COINBEAT SIGNALS" />
    </Shell>
  );
}