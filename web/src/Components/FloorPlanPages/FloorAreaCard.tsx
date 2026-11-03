import type { CSSProperties } from 'react';
import { floorAreaData } from '../../Data/FloorAreaData';

const fmt = (n: number) => new Intl.NumberFormat('en-IN').format(n);

// Area statement of the open floor, on the right edge above the 2D plan thumbnail.
// The whole card (box, text, spacing) scales with the screen width - like the floor callout
// cards do - so it stays readable on a tablet. All sizes inside are in em of --w / 13.
const style = {
  '--w': 'clamp(9.5rem, 14vw, 15rem)',
  width: 'var(--w)',
  fontSize: 'calc(var(--w) / 13)',
} as CSSProperties;

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
      style={style}
      className="absolute right-2 top-2 min-[1340px]:right-3 min-[1340px]:top-14 2xl:right-6 z-30 rounded-[0.9em] border border-[#B8A37E]/50 bg-[#04121f]/85 backdrop-blur-sm px-[1em] py-[0.8em] shadow-[0_8px_30px_rgba(0,0,0,0.6)] pointer-events-none"
    >
      <p className="mb-[0.5em] text-[0.8em] font-bold tracking-[0.2em] text-[#E6D7BA]">AREA (sq ft)</p>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-[0.5em] py-[0.35em] border-b border-white/10">
            <dt className="text-white/70">{k}</dt>
            <dd className="font-medium tabular-nums">{v}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-[0.5em] pt-[0.5em] text-[#E6D7BA]">
          <dt className="font-semibold">Leasable Area</dt>
          <dd className="font-bold tabular-nums">{fmt(a.leasable)}</dd>
        </div>
        <div className="flex justify-between gap-[0.5em] pt-[0.3em] text-[#E6D7BA]">
          <dt className="font-semibold">Efficiency</dt>
          <dd className="font-bold tabular-nums">{a.efficiency}%</dd>
        </div>
      </dl>
    </div>
  );
}
