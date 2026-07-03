import { useContent } from '../../content/ContentContext';
import { PageHeader, Card, Field, Row } from '../components/ui';
import SaveBar from '../components/SaveBar';

export default function NavbarEditor() {
  const { content, updateSection } = useContent();
  const nav = content.nav;

  const setField = (k) => (e) =>
    updateSection('nav', (prev) => ({ ...prev, [k]: e.target.value }));

  const setLinkLabel = (i) => (e) =>
    updateSection('nav', (prev) => ({
      ...prev,
      links: prev.links.map((l, idx) =>
        idx === i ? { ...l, label: e.target.value } : l,
      ),
    }));

  return (
    <div className="space-y-6">
      <PageHeader title="Navbar" subtitle="Logo, button and navigation labels" />

      <Card title="Brand & Button">
        <Row>
          <Field label="Logo Text" value={nav.logo} onChange={setField('logo')} placeholder="AT" />
          <Field label="Download Button Label" value={nav.downloadLabel} onChange={setField('downloadLabel')} placeholder="Download CV" />
        </Row>
      </Card>

      <Card title="Menu Labels">
        <div className="space-y-4">
          {nav.links.map((link, i) => (
            <Field
              key={link.to}
              label={`Link ${i + 1} (${link.to})`}
              value={link.label}
              onChange={setLinkLabel(i)}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Only the labels are editable — the page routes stay fixed.
        </p>
      </Card>

      <SaveBar />
    </div>
  );
}
