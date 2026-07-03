import { Link } from 'react-router-dom';
import { User, FolderOpen, Send, Briefcase, GraduationCap, Heart } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { uploadUrl } from '../../admin/api';
import StatsBar from '../ui/StatsBar';
import ProfilePortrait from '../ui/ProfilePortrait';

const journeyIcons = {
  briefcase: Briefcase,
  graduation: GraduationCap,
};

export default function About() {
  const { content } = useContent();
  const { profile, about } = content;
  const avatar = profile.avatar ? uploadUrl(profile.avatar) : undefined;
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-ink-800 pb-20 pt-28 text-white lg:pb-28 lg:pt-32"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-brand/15 blur-[120px]" />
        <div className="dot-grid absolute bottom-24 left-0 h-44 w-40 text-dot" />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-6 sm:px-10">
        {/* ---- Intro row ---- */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* Left copy */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-5 py-2 text-sm font-medium text-brand">
              <User size={15} />
              {about.badge}
            </span>

            <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              About <span className="text-brand">{profile.firstName} {profile.lastName}</span>
            </h2>

            <div className="mx-auto mt-6 max-w-xl space-y-3 text-base leading-relaxed text-slate-400 lg:mx-0 lg:text-lg">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-9 flex flex-col items-stretch justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-brand px-7 py-4 text-base font-semibold text-white shadow-brand-btn transition-transform hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                <FolderOpen size={20} />
                View My Work
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/15 px-7 py-4 text-base font-semibold text-white transition-colors hover:border-white/35 hover:bg-white/5"
              >
                <Send size={19} />
                Contact Me
              </Link>
            </div>
          </div>

          {/* Right portrait */}
          <div className="flex justify-center lg:justify-end">
            <ProfilePortrait
              src={avatar}
              alt={`${profile.firstName} ${profile.lastName}`}
              widthClass="w-[300px] sm:w-[360px] lg:w-[400px]"
            />
          </div>
        </div>

        {/* ---- Stats ---- */}
        <StatsBar className="mt-16 lg:mt-20" />

        {/* ---- Journey + Drives cards ---- */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* My Journey */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <h3 className="text-2xl font-bold">My Journey</h3>

            <ol className="mt-8 space-y-8">
              {about.journey.map((item, i) => {
                const Icon = journeyIcons[item.icon] ?? Briefcase;
                const isLast = i === about.journey.length - 1;
                return (
                  <li key={item.title} className="relative flex gap-5">
                    {/* icon + connector */}
                    <div className="relative flex flex-col items-center">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-brand/40 bg-brand/10 text-brand">
                        <Icon size={22} />
                      </span>
                      {!isLast && (
                        <span className="mt-2 w-px flex-1 border-l border-dashed border-white/15" />
                      )}
                    </div>

                    <div className="pb-1">
                      <h4 className="text-lg font-semibold">{item.title}</h4>
                      <p className="mt-1 text-sm font-medium text-brand">
                        {item.period}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* What Drives Me */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <div className="flex items-start justify-between">
              <h3 className="text-2xl font-bold">What Drives Me</h3>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-brand/40 bg-brand/10 text-brand">
                <Heart size={19} />
              </span>
            </div>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-400">
              {about.drives.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {about.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-brand/30 bg-brand/[0.07] px-4 py-2 text-sm font-medium text-brand"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
