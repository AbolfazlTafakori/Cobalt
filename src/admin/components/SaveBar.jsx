import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { AuthError } from '../api';
import { useToast } from './Toast';

// Sticky bar with the single "Save Changes" action. All admin pages edit the
// shared content live; this persists the whole document to the backend.
export default function SaveBar() {
  const { save } = useContent();
  const toast = useToast();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await save();
      toast('Saved! Changes are now live on the site.');
    } catch (e) {
      if (e instanceof AuthError) navigate('/admin/login');
      else toast(e.message || 'Save failed', true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sticky bottom-0 z-30 mt-10 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-ink-800/90 px-5 py-4 backdrop-blur">
      <p className="text-sm text-slate-400">
        Edits apply live — click save to store them permanently.
      </p>
      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-brand-btn transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        <Save size={17} />
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  );
}
