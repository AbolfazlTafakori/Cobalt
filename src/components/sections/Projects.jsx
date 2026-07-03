import {
  FileText,
  ExternalLink,
  FolderKanban,
  Code2,
  Users,
  Calendar,
} from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import ProjectThumb from '../ui/ProjectThumb';

const statIcons = {
  folder: FolderKanban,
  code: Code2,
  users: Users,
  calendar: Calendar,
};

export default function Projects() {
  const { content } = useContent();
  const { projects } = content;
  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-ink-800 pb-20 pt-28 text-white lg:pb-28 lg:pt-32"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-4 h-[480px] w-[480px] rounded-full bg-brand/12 blur-[120px]" />
        <div className="dot-grid absolute bottom-24 left-0 h-44 w-40 text-dot" />
      </div>

      <div className="container-page relative">
        {/* ---- Header row ---- */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div className="text-center lg:text-left">
            <span className="inline-block rounded-full border border-brand/40 bg-brand/10 px-5 py-2 text-sm font-medium text-brand">
              {projects.badge}
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Featured <span className="text-brand">Projects</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 lg:mx-0 lg:text-lg">
              {projects.intro}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-4">
            {projects.stats.map((stat) => {
              const Icon = statIcons[stat.icon] ?? FolderKanban;
              return (
                <div key={stat.label} className="text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/10 text-slate-200">
                    <Icon size={22} />
                  </span>
                  <p className="mt-3 text-2xl font-bold text-brand sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- Project cards ---- */}
        <div className="mt-14 grid gap-7 md:grid-cols-2 xl:grid-cols-3 lg:mt-16">
          {projects.items.map((project) => (
            <article
              key={project.title}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-brand/30"
            >
              <div className="flex flex-1 flex-col gap-5 sm:flex-row">
                {/* thumbnail */}
                <div className="sm:w-2/5">
                  <ProjectThumb title={project.title} gradient={project.gradient} />
                </div>

                {/* content */}
                <div className="flex flex-1 flex-col">
                  <h3 className="text-lg font-bold">{project.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* buttons */}
              <div className="mt-5 flex gap-3">
                <a
                  href={project.caseStudy}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                >
                  <FileText size={16} />
                  View Case Study
                </a>
                <a
                  href={project.liveDemo}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-white/35 hover:bg-white/5"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
