import { MapPin } from 'lucide-react';

// Lightweight stylized map (no external embed). Swap for a real map later.
export default function MapPlaceholder() {
  return (
    <div className="relative h-40 w-full overflow-hidden rounded-xl bg-sunken">
      {/* street grid — drawn in the theme's edge color so the blocks read as
          streets on the dark page and on the light one */}
      <div
        className="absolute inset-0 text-edge opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* diagonal avenue */}
      <div className="absolute -inset-8 rotate-12 border-t-2 border-edge/25" />
      {/* centered pin */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-accent">
        <MapPin size={30} fill="currentColor" className="drop-shadow" />
      </div>
    </div>
  );
}
