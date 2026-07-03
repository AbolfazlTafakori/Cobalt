import { useRef } from 'react';
import { FileText, Upload, Trash2 } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { uploadFile, uploadUrl } from '../api';
import { useToast } from '../components/Toast';
import { PageHeader, Card, Field, Row } from '../components/ui';
import ImageUpload from '../components/ImageUpload';
import SaveBar from '../components/SaveBar';

export default function Identity() {
  const { content, updateSection } = useContent();
  const p = content.profile;
  const toast = useToast();
  const cvRef = useRef(null);

  const set = (k) => (e) =>
    updateSection('profile', (prev) => ({ ...prev, [k]: e.target.value }));

  const onAvatar = async (file) => {
    try {
      const filename = await uploadFile(file);
      updateSection('profile', (prev) => ({ ...prev, avatar: filename }));
      toast('Avatar uploaded — remember to Save.');
    } catch (e) {
      toast(e.message || 'Upload failed', true);
    }
  };

  const onCv = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const filename = await uploadFile(file);
      // Point the Download button at the served file URL.
      updateSection('profile', (prev) => ({ ...prev, resumeUrl: uploadUrl(filename) }));
      toast('CV uploaded — remember to Save.');
    } catch (err) {
      toast(err.message || 'Upload failed', true);
    }
  };

  const cvName = p.resumeUrl && p.resumeUrl.includes('/uploads/')
    ? p.resumeUrl.split('/uploads/')[1]
    : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Identity" subtitle="Your name, role and intro shown across the site" />

      <Card title="Profile Photo">
        <ImageUpload
          value={uploadUrl(p.avatar)}
          onFile={onAvatar}
          hint="Shown on Home, About and Skills. Transparent PNG recommended."
        />
        {p.avatar && (
          <button
            type="button"
            onClick={() => {
              updateSection('profile', (prev) => ({ ...prev, avatar: '' }));
              toast('Photo removed — remember to Save.');
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
          >
            <Trash2 size={15} />
            Remove Photo
          </button>
        )}
      </Card>

      <Card title="Basic Info">
        <div className="space-y-4">
          <Row>
            <Field label="First Name" value={p.firstName} onChange={set('firstName')} />
            <Field label="Last Name" value={p.lastName} onChange={set('lastName')} />
          </Row>
          <Row>
            <Field label="Role" value={p.role} onChange={set('role')} placeholder="Frontend Developer" />
            <Field label="Greeting" value={p.greeting} onChange={set('greeting')} placeholder="Hello, I'm" />
          </Row>
          <Field as="textarea" label="Tagline" value={p.tagline} onChange={set('tagline')} />
        </div>
      </Card>

      <Card title="CV / Resume">
        <p className="mb-4 text-sm text-slate-400">
          Upload a PDF (used by the “Download CV” button), or paste an external link.
        </p>

        <input
          ref={cvRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={onCv}
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => cvRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-brand/40 hover:bg-brand/10"
          >
            <Upload size={16} />
            Upload CV (PDF)
          </button>
          {cvName && (
            <span className="inline-flex items-center gap-1.5 text-sm text-brand">
              <FileText size={15} /> {cvName}
            </span>
          )}
        </div>

        <div className="mt-5">
          <Field
            label="Or CV link (URL)"
            value={p.resumeUrl}
            onChange={set('resumeUrl')}
            placeholder="/cv.pdf or https://…"
          />
        </div>
      </Card>

      <SaveBar />
    </div>
  );
}
