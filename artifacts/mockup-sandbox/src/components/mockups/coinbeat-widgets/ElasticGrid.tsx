import "./_group.css";
import { Maximize2, MoveDiagonal2 } from "lucide-react";
import { AssetLine, Change, Footer, Shell, Status, assets } from "./_shared";

export function ElasticGrid() {
  return (
    <Shell className="bg-[#060913]">
      <div className="flex items-center justify-between"><div><div className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#9eaaff]">ELASTIC GRID</div><div className="mt-1 text-[16px] font-extrabold tracking-[-.05em]">크기에 맞춰 변하는 위젯</div></div><div className="flex items-center gap-2"><Status compact /><Maximize2 size={13} color="#8190a9" /></div></div>
      <div className="mt-4 grid grid-cols-[.8fr_1.2fr] gap-2">
        <div className="rounded-[17px] bg-[#131a31] p-3">
          <div className="mono text-[8px] tracking-[.14em] text-[#9eaaff]">SMALL</div>
          <div className="mt-4"><AssetLine asset={assets[0]} showName /><div className="mono mt-3 text-[15px] font-medium">{assets[0].price}</div><div className="mt-1"><Change value={assets[0].change} /></div></div>
        </div>
        <div className="rounded-[17px] bg-[#10162a] p-3">
          <div className="flex items-center justify-between"><span className="mono text-[8px] tracking-[.14em] text-[#9eaaff]">MEDIUM</span><MoveDiagonal2 size={12} color="#8190a9" /></div>
          <div className="mt-3 grid grid-cols-2 gap-2">{assets.slice(0, 4).map((asset) => <div key={asset.symbol} className="rounded-[10px] bg-[#18213c] p-2"><div className="flex items-center justify-between"><span className="text-[9px] font-extrabold">{asset.symbol}</span><span className={asset.change >= 0 ? "text-[#77e5bc]" : "text-[#ff7185]"}>{asset.change >= 0 ? "+" : ""}{asset.change.toFixed(1)}%</span></div><div className="mono mt-1 truncate text-[9px]">{asset.price}</div></div>)}</div>
        </div>
      </div>
      <div className="mt-2 rounded-[17px] bg-[#0d1324] p-3"><div className="flex items-center justify-between"><span className="mono text-[8px] tracking-[.14em] text-[#9eaaff]">LARGE · FULL MARKET VIEW</span><span className="text-[8px] text-[#8190a9]">RESIZE READY</span></div><div className="mt-3 grid grid-cols-3 gap-x-3 gap-y-2">{assets.map((asset) => <div key={asset.symbol} className="flex items-center justify-between border-b border-white/[.06] pb-1.5"><AssetLine asset={asset} /><Change value={asset.change} /></div>)}</div></div>
      <div className="mt-3"><Footer label="ADAPTS TO YOUR HOME SCREEN" /></div>
    </Shell>
  );
}