// A single labelled skill row with a percentage and a progress track.
export default function SkillBar({ name, level }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-fg-soft">{name}</span>
        <span className="font-semibold text-accent">{level}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-edge/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand to-brand-light"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}
