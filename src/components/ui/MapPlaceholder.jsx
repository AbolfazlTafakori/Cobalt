import { MapPin } from 'lucide-react';

// Lightweight stylized map (no external embed). Swap for a real map later.
export default function MapPlaceholder() {
  return (
    <div className="relative h-40 w-full overflow-hidden rounded-xl bg-ink-700">
      {/* street grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* diagonal avenue */}
      <div className="absolute -inset-8 rotate-12 border-t-2 border-slate-600/40" />
      {/* centered pin */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-brand">
        <MapPin size={30} fill="currentColor" className="drop-shadow" />
      </div>
    </div>
  );
}
