// Project thumbnail: shows the uploaded screenshot when one is set,
// otherwise a gradient placeholder styled as a small app window.
export default function ProjectThumb({ title, gradient, image }) {
  if (image) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-top"
        />
      </div>
    );
  }
  return (
    <div
      className={`relative flex aspect-[16/9] w-full flex-col overflow-hidden rounded-xl bg-gradient-to-br ${gradient}`}
    >
      {/* window chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      </div>
      {/* label */}
      <div className="flex flex-1 items-center justify-center px-4 pb-4">
        <span className="text-center text-lg font-bold text-white/90">
          {title}
        </span>
      </div>
      {/* subtle sheen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
    </div>
  );
}
