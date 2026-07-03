import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

// Image picker with instant local preview.
// Calls onFile(File) when a file is chosen; parent decides when to upload.
export default function ImageUpload({
  value, // current image URL to preview
  onFile,
  shape = 'circle', // 'circle' | 'square' | 'wide'
  hint,
  label = 'Upload Image',
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    onFile(file);
  };

  const src = preview || value || '';
  const shapeCls =
    shape === 'circle'
      ? 'h-20 w-20 rounded-full'
      : shape === 'wide'
        ? 'h-16 w-24 rounded-lg'
        : 'h-16 w-16 rounded-lg';

  return (
    <div className="flex items-center gap-4">
      <div
        className={`grid shrink-0 place-items-center overflow-hidden border border-white/10 bg-ink-700 ${shapeCls}`}
      >
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <Upload size={20} className="text-slate-500" />
        )}
      </div>
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-brand/40 hover:bg-brand/10"
        >
          {label}
        </button>
        {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
      </div>
    </div>
  );
}
