import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, RefreshCw } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { AuthError, ConflictError } from '../api';
import { useToast } from './Toast';

// Sticky bar with the single "Save Changes" action. All admin pages edit the
// shared content live; this persists the whole document to the backend.
export default function SaveBar() {
  const { save } = useContent();
  const toast = useToast();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [conflict, setConflict] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      await save();
      setConflict('');
      toast('Saved! Changes are now live on the site.');
    } catch (e) {
      if (e instanceof AuthError) navigate('/admin/login');
      else if (e instanceof ConflictError) {
        // Nothing was written — keep the edits on screen and let them reload
        // deliberately rather than silently overwriting the other save.
        setConflict(e.message);
        toast('Not saved — the content changed elsewhere.', true);
      } else toast(e.message || 'Save failed', true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sticky bottom-0 z-30 mt-10 flex flex-col gap-3 rounded-2xl border border-white/10 bg-ink-800/90 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      {conflict ? (
        <p className="text-sm text-amber-300">
          {conflict}{' '}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 font-semibold text-amber-200 underline underline-offset-4 hover:text-white"
          >
            <RefreshCw size={13} />
            Reload now
          </button>
        </p>
      ) : (
        <p className="text-sm text-slate-400">
          Edits apply live — click save to store them permanently.
        </p>
      )}
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
