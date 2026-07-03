import { useState } from 'react';
import { changePassword } from '../api';
import { useAction } from '../useLoad';
import { useToast } from '../components/Toast';
import { PageHeader, Card, Field, Row, Button } from '../components/ui';

export default function Password() {
  const toast = useToast();
  const run = useAction(toast);
  const [cur, setCur] = useState('');
  const [nw, setNw] = useState('');
  const [cnf, setCnf] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!cur || !nw) return toast('All password fields are required', true);
    if (nw.length < 8) return toast('New password must be at least 8 characters', true);
    if (nw !== cnf) return toast('Passwords do not match', true);
    setSaving(true);
    const ok = await run(() => changePassword(cur, nw), 'Password changed successfully!');
    setSaving(false);
    if (ok) { setCur(''); setNw(''); setCnf(''); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Change Password" subtitle="Update your admin panel password" />
      <Card title="Password">
        <div className="space-y-4">
          <Field label="Current Password" type="password" value={cur} onChange={(e) => setCur(e.target.value)} />
          <Row>
            <Field label="New Password" type="password" value={nw} onChange={(e) => setNw(e.target.value)} />
            <Field label="Confirm New Password" type="password" value={cnf} onChange={(e) => setCnf(e.target.value)} />
          </Row>
        </div>
      </Card>
      <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Update Password'}</Button>
    </div>
  );
}
