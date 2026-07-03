import { useContent } from '../../content/ContentContext';
import { PageHeader, Card, Field, Row } from '../components/ui';
import { StringListEditor, ListItemBlock, AddItemButton } from '../components/editors';
import SaveBar from '../components/SaveBar';

export default function AboutEditor() {
  const { content, updateSection } = useContent();
  const about = content.about;
  const patch = (obj) => updateSection('about', (prev) => ({ ...prev, ...obj }));

  const setJourney = (i, k) => (e) =>
    patch({
      journey: about.journey.map((j, idx) =>
        idx === i ? { ...j, [k]: e.target.value } : j,
      ),
    });
  const removeJourney = (i) =>
    patch({ journey: about.journey.filter((_, idx) => idx !== i) });
  const addJourney = () =>
    patch({
      journey: [
        ...about.journey,
        { icon: 'briefcase', title: '', period: '', description: '' },
      ],
    });

  return (
    <div className="space-y-6">
      <PageHeader title="About Page" subtitle="Bio, journey timeline and what drives you" />

      <Card title="Intro">
        <div className="space-y-4">
          <Field label="Badge" value={about.badge} onChange={(e) => patch({ badge: e.target.value })} />
          <StringListEditor
            label="Paragraphs"
            items={about.paragraphs}
            onChange={(v) => patch({ paragraphs: v })}
            textarea
          />
        </div>
      </Card>

      <Card title="My Journey">
        <div className="space-y-4">
          {about.journey.map((j, i) => (
            <ListItemBlock key={i} index={i} onRemove={() => removeJourney(i)}>
              <div className="space-y-4">
                <Row>
                  <Field label="Title" value={j.title} onChange={setJourney(i, 'title')} />
                  <Field label="Period" value={j.period} onChange={setJourney(i, 'period')} placeholder="2023 – Present" />
                </Row>
                <Field label="Icon (briefcase / graduation)" value={j.icon} onChange={setJourney(i, 'icon')} />
                <Field as="textarea" label="Description" value={j.description} onChange={setJourney(i, 'description')} />
              </div>
            </ListItemBlock>
          ))}
        </div>
        <AddItemButton label="Add Journey Entry" onClick={addJourney} />
      </Card>

      <Card title="What Drives Me">
        <div className="space-y-5">
          <StringListEditor
            label="Paragraphs"
            items={about.drives}
            onChange={(v) => patch({ drives: v })}
            textarea
          />
          <StringListEditor
            label="Tags"
            items={about.tags}
            onChange={(v) => patch({ tags: v })}
            placeholder="Clean Code"
          />
        </div>
      </Card>

      <SaveBar />
    </div>
  );
}
