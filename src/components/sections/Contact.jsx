import { useState } from 'react';
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  User,
  Tag,
  MessageSquare,
  Trophy,
} from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import SocialButton from '../ui/SocialButton';
import MapPlaceholder from '../ui/MapPlaceholder';

const infoIcons = {
  mail: Mail,
  phone: Phone,
  location: MapPin,
  availability: Clock,
};

export default function Contact() {
  const { content } = useContent();
  const { contact, socials } = content;
  const [sent, setSent] = useState(false);

  // Demo-only handler — wire up to an email service / backend later.
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    e.target.reset();
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-ink-800 pb-20 pt-28 text-white lg:pb-28 lg:pt-32"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-4 h-[480px] w-[480px] rounded-full bg-brand/12 blur-[120px]" />
        <div className="dot-grid absolute bottom-1/3 left-0 h-40 w-36 text-dot" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1440px] gap-12 px-6 sm:px-10 lg:grid-cols-2 lg:gap-16">
        {/* ---- Left column ---- */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-5 py-2 text-sm font-medium text-brand">
            <Send size={15} />
            {contact.badge}
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Let&apos;s Work <span className="text-brand">Together</span>
          </h1>
          <span className="mt-5 block h-1 w-24 rounded-full bg-gradient-to-r from-brand to-brand-light" />

          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-400 lg:text-lg">
            {contact.intro}
          </p>

          {/* Info cards */}
          <div className="mt-8 space-y-4">
            {contact.info.map((item) => {
              const Icon = infoIcons[item.icon] ?? Mail;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-brand/30"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand">
                    <Icon size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{item.label}</p>
                    <p className="truncate text-sm text-brand">{item.value}</p>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-slate-500 transition-transform group-hover:translate-x-1"
                  />
                </a>
              );
            })}
          </div>

          {/* Socials */}
          <div className="mt-10">
            <h3 className="text-sm font-semibold">Connect With Me</h3>
            <div className="mt-4 flex items-center gap-4">
              {socials.map((s) => (
                <SocialButton key={s.label} {...s} />
              ))}
            </div>
          </div>
        </div>

        {/* ---- Right column ---- */}
        <div className="space-y-8">
          {/* Message form */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Send Me a Message</h2>
            <p className="mt-2 text-sm text-slate-400">
              Fill out the form below and I&apos;ll get back to you as soon as
              possible.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field icon={User} name="name" placeholder="Your Name" required />
                <Field
                  icon={Mail}
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  required
                />
              </div>
              <Field icon={Tag} name="subject" placeholder="Subject" required />

              <div className="relative">
                <MessageSquare
                  size={18}
                  className="pointer-events-none absolute left-4 top-4 text-slate-500"
                />
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="Your Message"
                  className="w-full resize-y rounded-xl border border-white/10 bg-ink-900/40 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-4 text-base font-semibold text-white shadow-brand-btn transition-colors hover:bg-brand-dark"
              >
                <Send size={18} />
                {sent ? 'Message Sent!' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Location + CTA cards */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-brand" />
                <div>
                  <p className="text-sm font-semibold">My Location</p>
                  <p className="text-xs text-slate-400">{contact.location}</p>
                </div>
              </div>
              <div className="mt-4">
                <MapPlaceholder />
              </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/15 text-brand">
                <Trophy size={22} />
              </span>
              <h3 className="mt-4 text-lg font-bold">{contact.cta.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                {contact.cta.text}
              </p>
              <a
                href="#contact"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:gap-2"
              >
                {contact.cta.linkLabel}
                <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Icon-prefixed text input used by the contact form.
function Field({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
      />
      <input
        {...props}
        className="w-full rounded-xl border border-white/10 bg-ink-900/40 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      />
    </div>
  );
}
