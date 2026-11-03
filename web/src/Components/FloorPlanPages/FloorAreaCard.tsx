import { floorAreaData } from '../../Data/FloorAreaData';

const fmt = (n: number) => new Intl.NumberFormat('en-IN').format(n);

// Area statement of the open floor, on the right edge above the 2D plan thumbnail. Its top is the
// lowest spot (per screen width) that stays clear of the floor callout cards on every floor (checked on all floors).
export default function FloorAreaCard({ floorId }: { floorId: string | number }) {
  const a = floorAreaData[String(floorId)];
  if (!a) return null;

  const rows: [string, string][] = [
    ['Carpet Area', fmt(a.carpet)],
    ["Toi & AHU's", fmt(a.toiAhu)],
    ['Balcony Area', fmt(a.balcony)],
    ['Common Area', fmt(a.common)],
  ];

  return (
    <div
      className="absolute right-2 2xl:right-6 z-30 w-[9.5rem] min-[1340px]:w-44 2xl:w-56 top-2 min-[1340px]:top-14 rounded-xl border border-[#B8A37E]/50 bg-[#04121f]/85 backdrop-blur-sm px-2.5 min-[1340px]:px-3 2xl:px-4 py-2 min-[1340px]:py-2.5 2xl:py-4 shadow-[0_8px_30px_rgba(0,0,0,0.6)] pointer-events-none"
    >
      <p className="mb-1.5 2xl:mb-2.5 text-[10px] 2xl:text-xs font-bold tracking-[0.2em] text-[#E6D7BA]">AREA (sq ft)</p>
      <dl className="text-[11px] min-[1340px]:text-xs 2xl:text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-2 py-0.5 min-[1340px]:py-1 2xl:py-1.5 border-b border-white/10">
            <dt className="text-white/70">{k}</dt>
            <dd className="font-medium tabular-nums">{v}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-2 pt-1.5 2xl:pt-2 text-[#E6D7BA]">
          <dt className="font-semibold">Leasable Area</dt>
          <dd className="font-bold tabular-nums">{fmt(a.leasable)}</dd>
        </div>
        <div className="flex justify-between gap-2 pt-1 2xl:pt-1.5 text-[#E6D7BA]">
          <dt className="font-semibold">Efficiency</dt>
          <dd className="font-bold tabular-nums">{a.efficiency}%</dd>
        </div>
      </dl>
    </div>
  );
}
