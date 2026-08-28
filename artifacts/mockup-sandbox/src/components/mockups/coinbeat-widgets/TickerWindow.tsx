import "./_group.css";
import { ArrowRight, RadioTower } from "lucide-react";
import { Change, Footer, Mark, Shell, Status, assets } from "./_shared";

export function TickerWindow() {
  return (
    <Shell className="noise bg-[#07101b]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Mark color="#7fe3ff" /><div><div className="text-[12px] font-extrabold">CoinBeat</div><div className="mono text-[8px] tracking-[.16em] text-[#7fe3ff]">TICKER WINDOW</div></div></div>
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#7fe3ff]"><RadioTower size={12} /> LIVE</div>
      </div>
      <div className="mt-4 overflow-hidden rounded-[18px] border border-[#7fe3ff33] bg-[#0b1b2a] shadow-[0_0_30px_rgba(73,196,255,.12)]">
        <div className="flex items-center gap-2 border-b border-[#7fe3ff22] px-3 py-2"><span className="h-1.5 w-1.5 rounded-full bg-[#7fe3ff]" /><span className="mono text-[8px] tracking-[.14em] text-[#7fe3ff]">UPBIT KRW TICKER</span><span className="ml-auto text-[8px] text-[#8190a9]">24H</span></div>
        {assets.slice(0, 3).map((asset, index) => <div key={asset.symbol} className="relative flex items-center gap-3 border-b border-[#7fe3ff18] px-3 py-3 last:border-0"><div className="w-[36px] text-[12px] font-extrabold">{asset.symbol}</div><div className="h-px flex-1 bg-gradient-to-r from-[#7fe3ff99] via-[#7fe3ff22] to-transparent" /><div className="mono text-[12px] font-medium">{asset.price}</div><Change value={asset.change} /></div>)}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-[15px] bg-[#0b1825] px-3 py-3"><div><div className="mono text-[8px] tracking-[.14em] text-[#8190a9]">NEXT SIGNAL</div><div className="mt-1 max-w-[275px] truncate text-[11px] font-bold">슈퍼폰, 코인베이스 토큰화 주식 지원…</div></div><ArrowRight size={17} color="#7fe3ff" /></div>
      <div className="mt-4"><Footer label="WAVEFORM MARKET" /></div>
    </Shell>
  );
}