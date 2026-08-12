import { useEffect, useRef, useState } from 'react';

// Paragraph cut off at three lines, with a "See more" trigger that only shows
// up when the text is actually clipped — short descriptions stay untouched.
export default function ClampedText({ text, onExpand, label = 'See more' }) {
  const ref = useRef(null);
  const [clipped, setClipped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let alive = true;
    const measure = () => alive && setClipped(el.scrollHeight - el.clientHeight > 1);

    measure();
    // The line count changes when the card is reflowed and again once webfonts
    // land (Poppins swapping in re-wraps the text without resizing the box).
    // ResizeObserver catches container-only reflows; the resize listener is the
    // fallback for the common case, since observer delivery is tied to frame
    // production and is suspended while the tab is hidden.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);

    return () => {
      alive = false;
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [text]);

  return (
    <>
      <p
        ref={ref}
        className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-fg-muted"
      >
        {text}
      </p>
      {clipped && (
        <button
          type="button"
          onClick={onExpand}
          className="mt-2 self-start text-xs font-medium text-accent underline decoration-brand/40 underline-offset-4 transition-colors hover:text-accent hover:decoration-brand"
        >
          {label}
        </button>
      )}
    </>
  );
}
