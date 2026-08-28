import "./_group.css";
import { Settings2 } from "lucide-react";
import { AssetLine, Change, Footer, Shell, Status, Topline, assets } from "./_shared";

export function NightDesk() {
  return (
    <Shell className="bg-[#080a0f]">
      <Topline eyebrow="NIGHT DESK · 02:14 KST" right={<div className="flex items-center gap-2"><Status compact /><Settings2 size={13} color="#8190a9" /></div>} />
      <div className="mt-5 flex items-end justify-between">
        <div><div className="text-[9px] font-bold uppercase tracking-[.16em] text-[#8190a9]">MARKET BOARD</div><div className="mt-1 text-[17px] font-extrabold tracking-[-.05em]">선택 코인 가격</div></div>
        <div className="mono text-[9px] text-[#8190a9]">KRW / 24H</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {assets.slice(0, 4).map((asset, index) => (
          <div key={asset.symbol} className={`rounded-[16px] p-3 ${index === 0 ? "bg-[#111c34]" : "bg-[#11151e]"}`}>
            <div className="flex items-center justify-between"><AssetLine asset={asset} /><Change value={asset.change} /></div>
            <div className="mono mt-3 text-[14px] font-medium tracking-[-.04em]">{asset.price}</div>
            <div className="mt-2 opacity-80"><div className="h-px w-full bg-white/[.06]" /><div className="mt-2"><div className="h-1 rounded-full" style={{ width: `${Math.min(90, 42 + index * 15)}%`, background: asset.change >= 0 ? "#77e5bc" : "#ff7185" }} /></div></div>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-[15px] bg-[#0f141e] px-3 py-2.5"><div className="flex items-center gap-2 text-[9px] font-bold text-[#8190a9]"><span className="h-1.5 w-1.5 rounded-full bg-[#4c8dff]" /> MARKET PULSE <span className="ml-auto text-[#f4f7ff]">₩1.99T 거래량</span></div></div>
      <div className="mt-4"><Footer label="UPBIT · KRW" /></div>
    </Shell>
  );
}