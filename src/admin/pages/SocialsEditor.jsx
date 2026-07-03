import { useContent } from '../../content/ContentContext';
import { PageHeader, Card, Field, Row } from '../components/ui';
import { ListItemBlock, AddItemButton } from '../components/editors';
import SaveBar from '../components/SaveBar';

export default function SocialsEditor() {
  const { content, updateSection } = useContent();
  const socials = content.socials;

  const setItem = (i, k) => (e) =>
    updateSection('socials', (prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [k]: e.target.value } : s)),
    );
  const remove = (i) =>
    updateSection('socials', (prev) => prev.filter((_, idx) => idx !== i));
  const add = () =>
    updateSection('socials', (prev) => [
      ...prev,
      { label: 'New', href: 'https://', icon: 'mail' },
    ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Social Links" subtitle="Shown on Home and Contact" />

      <Card title="Links">
        <div className="space-y-4">
          {socials.map((s, i) => (
            <ListItemBlock key={i} index={i} onRemove={() => remove(i)}>
              <div className="space-y-4">
                <Row>
                  <Field label="Label" value={s.label} onChange={setItem(i, 'label')} placeholder="GitHub" />
                  <Field
                    label="Icon (github / linkedin / mail)"
                    value={s.icon}
                    onChange={setItem(i, 'icon')}
                    placeholder="github"
                  />
                </Row>
                <Field label="URL" value={s.href} onChange={setItem(i, 'href')} placeholder="https://…" />
              </div>
            </ListItemBlock>
          ))}
        </div>
        <AddItemButton label="Add Social Link" onClick={add} />
      </Card>

      <SaveBar />
    </div>
  );
}
