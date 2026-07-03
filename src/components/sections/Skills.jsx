import { Code2, PenTool, Monitor, GitBranch, Zap } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { uploadUrl } from '../../admin/api';
import SkillBar from '../ui/SkillBar';
import ToolIcon from '../ui/ToolIcon';
import ProfilePortrait from '../ui/ProfilePortrait';

const categoryIcons = {
  code: Code2,
  design: PenTool,
  responsive: Monitor,
  version: GitBranch,
  performance: Zap,
};

export default function Skills() {
  const { content } = useContent();
  const { profile, skills } = content;
  const avatar = profile.avatar ? uploadUrl(profile.avatar) : undefined;
  return (
    <section
      id="skills"
      className="relative overflow-hidden bg-ink-800 pb-20 pt-28 text-white lg:pb-28 lg:pt-32"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-4 h-[500px] w-[500px] rounded-full bg-brand/15 blur-[120px]" />
        <div className="dot-grid absolute bottom-24 left-0 h-44 w-40 text-dot" />
      </div>

      <div className="container-page relative">
        {/* ---- Header row ---- */}
        <div className="grid items-start gap-2 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="text-center lg:text-left">
            <span className="inline-block rounded-full border border-brand/40 bg-brand/10 px-5 py-2 text-sm font-medium text-brand">
              {skills.badge}
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              My <span className="text-brand">Skills</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 lg:mx-0 lg:text-lg">
              {skills.intro}
            </p>
          </div>

          <div className="flex justify-center [clip-path:inset(-45%_-45%_32px_-45%)] lg:translate-x-6 lg:[clip-path:inset(-45%_-45%_52px_-45%)]">
            <ProfilePortrait
              src={avatar}
              alt={`${profile.firstName} ${profile.lastName}`}
              widthClass="w-[220px] sm:w-[250px] lg:w-[280px]"
            />
          </div>
        </div>

        {/* ---- Skill category cards ---- */}
        <div className="relative z-20 -mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 lg:-mt-[52px]">
          {skills.categories.map((cat) => {
            const Icon = categoryIcons[cat.icon] ?? Code2;
            return (
              <div
                key={cat.title}
                className="rounded-2xl border border-white/10 bg-ink-700 p-6 transition-colors hover:border-brand/30"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-brand/40 bg-brand/10 text-brand">
                    <Icon size={20} />
                  </span>
                  <h3 className="text-[15px] font-semibold leading-tight">
                    {cat.title}
                  </h3>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  {cat.description}
                </p>

                <div className="mt-6 space-y-4">
                  {cat.items.map((item) => (
                    <SkillBar key={item.name} {...item} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ---- Tools & Technologies ---- */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold sm:text-3xl">Tools &amp; Technologies</h2>
          <div className="mt-8 grid grid-cols-3 gap-5 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12">
            {skills.tools.map((tool) => (
              <div
                key={tool.name}
                className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-6 transition-all hover:-translate-y-1 hover:border-brand/30"
              >
                <ToolIcon icon={tool.icon} />
                <span className="text-center text-xs font-medium text-slate-300">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
