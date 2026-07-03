import { useContent } from '../../content/ContentContext';
import { PageHeader, Card, Field, Row } from '../components/ui';
import { ListItemBlock, AddItemButton } from '../components/editors';
import SaveBar from '../components/SaveBar';

export default function HomeStats() {
  const { content, updateSection } = useContent();
  const stats = content.stats;

  const setStat = (i, k) => (e) =>
    updateSection('stats', (prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [k]: e.target.value } : s)),
    );
  const remove = (i) =>
    updateSection('stats', (prev) => prev.filter((_, idx) => idx !== i));
  const add = () =>
    updateSection('stats', (prev) => [...prev, { value: '+0', label: 'New Stat' }]);

  return (
    <div className="space-y-6">
      <PageHeader title="Home — Stats Bar" subtitle="The numbers shown under the hero" />

      <Card title="Stats">
        <div className="space-y-4">
          {stats.map((s, i) => (
            <ListItemBlock key={i} index={i} onRemove={() => remove(i)}>
              <Row>
                <Field label="Value" value={s.value} onChange={setStat(i, 'value')} placeholder="+10" />
                <Field label="Label" value={s.label} onChange={setStat(i, 'label')} placeholder="Projects Completed" />
              </Row>
            </ListItemBlock>
          ))}
        </div>
        <AddItemButton label="Add Stat" onClick={add} />
      </Card>

      <SaveBar />
    </div>
  );
}
