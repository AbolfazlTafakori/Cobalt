// The portrait "unit" used across Home / About / Skills:
// a field of tiny blue dots framing the figure, a large blue glowing disc,
// and (optionally) the portrait photo on top. When no photo is set, only the
// disc + dots show. Everything scales with `widthClass`.
export default function ProfilePortrait({
  src,
  alt = '',
  widthClass = 'w-[300px] sm:w-[360px] lg:w-[420px]',
  float = false,
}) {
  return (
    <div className={`relative ${widthClass} ${src ? '' : 'aspect-square'}`}>
      {/* Dotted field — larger than the portrait, faded toward the edges */}
      <div
        className="dot-grid pointer-events-none absolute -inset-[28%] text-dot"
        style={{
          maskImage:
            'radial-gradient(circle at center, #000 38%, transparent 72%)',
          WebkitMaskImage:
            'radial-gradient(circle at center, #000 38%, transparent 72%)',
        }}
      />

      {/* Big glowing blue disc behind the figure */}
      <div className="absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-brand to-brand-dark shadow-glow" />

      {/* Portrait photo (only when one is set) */}
      {src && (
        <img
          src={src}
          alt={alt}
          draggable={false}
          className={`relative z-10 w-full select-none object-contain ${
            float ? 'animate-float' : ''
          }`}
        />
      )}
    </div>
  );
}
