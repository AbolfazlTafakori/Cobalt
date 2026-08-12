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
      className="relative overflow-hidden bg-page pb-20 pt-28 text-fg lg:pb-28 lg:pt-32"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-4 h-[480px] w-[480px] rounded-full bg-brand/12 blur-[120px]" />
        <div className="dot-grid absolute bottom-1/3 left-0 h-40 w-36 text-dot" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1440px] gap-12 px-6 sm:px-10 lg:grid-cols-2 lg:gap-16">
        {/* ---- Left column ---- */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-5 py-2 text-sm font-medium text-accent">
            <Send size={15} />
            {contact.badge}
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Let&apos;s Work <span className="text-accent">Together</span>
          </h1>
          <span className="mt-5 block h-1 w-24 rounded-full bg-gradient-to-r from-brand to-brand-light" />

          <p className="mt-6 max-w-lg text-base leading-relaxed text-fg-muted lg:text-lg">
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
                  className="group flex items-center gap-4 rounded-xl border border-edge/10 bg-edge/[0.03] p-4 transition-colors hover:border-brand/30"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand/15 text-accent">
                    <Icon size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{item.label}</p>
                    <p className="truncate text-sm text-accent">{item.value}</p>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-fg-subtle transition-transform group-hover:translate-x-1"
                  />
                </a>
              );
            })}
          </div>

          {/* Socials */}
          <div className="mt-10">
            <h3 className="text-sm font-semibold">Connect With Me</h3>
            <div className="mt-4 flex items-center gap-4">
              {socials.map((s, i) => (
                <SocialButton key={i} {...s} />
              ))}
            </div>
          </div>
        </div>

        {/* ---- Right column ---- */}
        <div className="space-y-8">
          {/* Message form */}
          <div className="rounded-2xl border border-edge/10 bg-edge/[0.03] p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Send Me a Message</h2>
            <p className="mt-2 text-sm text-fg-muted">
              Fill out the form below and I&apos;ll get back to you as soon as
              possible.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field icon={User} name="name" label="Your name" autoComplete="name" required />
                <Field
                  icon={Mail}
                  name="email"
                  type="email"
                  label="Your email"
                  autoComplete="email"
                  required
                />
              </div>
              <Field icon={Tag} name="subject" label="Subject" required />

              <div className="relative">
                <label htmlFor="contact-message" className="sr-only">
                  Your message
                </label>
                <MessageSquare
                  size={18}
                  className="pointer-events-none absolute left-4 top-4 text-fg-subtle"
                />
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Your Message"
                  className="w-full resize-y rounded-xl border border-edge/10 bg-sunken py-3.5 pl-11 pr-4 text-sm text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-4 text-base font-semibold text-white shadow-brand-btn transition-colors hover:bg-brand-dark"
              >
                <Send size={18} />
                Send Message
              </button>

              {/* Always in the tree so the confirmation is announced when it
                  appears, rather than swapping the button's own label. */}
              <p role="status" aria-live="polite" className="min-h-[1.25rem] text-sm text-accent">
                {sent && 'Thanks — your message is on its way.'}
              </p>
            </form>
          </div>

          {/* Location + CTA cards */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-edge/10 bg-edge/[0.03] p-5">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-accent" />
                <div>
                  <p className="text-sm font-semibold">My Location</p>
                  <p className="text-xs text-fg-muted">{contact.location}</p>
                </div>
              </div>
              <div className="mt-4">
                <MapPlaceholder />
              </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-edge/10 bg-edge/[0.03] p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/15 text-accent">
                <Trophy size={22} />
              </span>
              <h3 className="mt-4 text-lg font-bold">{contact.cta.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
                {contact.cta.text}
              </p>
              <a
                href="#contact"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:gap-2"
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

// Icon-prefixed text input used by the contact form. The label is visually
// hidden — the design places the hint inside the field — but it still names the
// input for screen readers, which a placeholder alone does not do.
function Field({ icon: Icon, name, label, ...props }) {
  const id = `contact-${name}`;
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Icon
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle"
      />
      <input
        {...props}
        id={id}
        name={name}
        placeholder={label}
        className="w-full rounded-xl border border-edge/10 bg-sunken py-3.5 pl-11 pr-4 text-sm text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      />
    </div>
  );
}
