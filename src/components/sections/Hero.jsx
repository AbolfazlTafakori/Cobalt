import { Link } from 'react-router-dom';
import { FolderOpen, Send } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { uploadUrl } from '../../admin/api';
import SocialButton from '../ui/SocialButton';
import StatsBar from '../ui/StatsBar';
import ProfilePortrait from '../ui/ProfilePortrait';

export default function Hero() {
  const { content } = useContent();
  const { profile, socials } = content;
  const avatar = profile.avatar ? uploadUrl(profile.avatar) : undefined;
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-ink-800 pt-[74px] text-white"
    >
      {/* Ambient background: radial glow + soft top-left gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 top-10 h-[560px] w-[560px] rounded-full bg-brand/20 blur-[120px]" />
        <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-brand/10 blur-[120px]" />
        {/* dotted grid: bottom-left near the stats (portrait has its own field) */}
        <div className="dot-grid absolute bottom-40 left-0 h-44 w-40 text-dot" />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* ---- Left: intro copy ---- */}
          <div className="animate-fade-up text-center lg:text-left">
            <span className="inline-block rounded-full border border-brand/40 bg-brand/10 px-5 py-2 text-sm font-medium text-brand">
              {profile.greeting}
            </span>

            <h1 className="mt-6 whitespace-nowrap text-[clamp(1.55rem,8.5vw,2.25rem)] font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {profile.firstName}{' '}
              <span className="text-brand">{profile.lastName}</span>
            </h1>

            <p className="mt-4 text-2xl font-semibold text-brand sm:text-3xl">
              {profile.role}
            </p>

            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-slate-400 lg:mx-0 lg:text-lg">
              {profile.tagline}
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col items-stretch justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-brand px-7 py-4 text-base font-semibold text-white shadow-brand-btn transition-transform hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                <FolderOpen size={20} />
                View Projects
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/15 px-7 py-4 text-base font-semibold text-white transition-colors hover:border-white/35 hover:bg-white/5"
              >
                <Send size={19} />
                Contact Me
              </Link>
            </div>

            {/* Socials */}
            <div className="mt-8 flex items-center justify-center gap-4 lg:justify-start">
              {socials.map((s) => (
                <SocialButton key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* ---- Right: portrait ---- */}
          <div className="animate-fade-up flex justify-center lg:justify-center [animation-delay:150ms]">
            <ProfilePortrait
              src={avatar}
              alt={`${profile.firstName} ${profile.lastName}`}
              widthClass="w-[320px] sm:w-[380px] lg:w-[440px]"
              float
            />
          </div>
        </div>

        {/* ---- Stats bar ---- */}
        <StatsBar className="animate-fade-up mt-16 [animation-delay:300ms] lg:mt-20" />
      </div>
    </section>
  );
}
