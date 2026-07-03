import { useContent } from '../../content/ContentContext';
import { PageHeader, Card, Field, Row } from '../components/ui';
import { ListItemBlock, AddItemButton } from '../components/editors';
import SaveBar from '../components/SaveBar';

export default function ContactEditor() {
  const { content, updateSection } = useContent();
  const contact = content.contact;
  const patch = (obj) => updateSection('contact', (prev) => ({ ...prev, ...obj }));

  const setInfo = (i, k) => (e) =>
    patch({ info: contact.info.map((it, idx) => (idx === i ? { ...it, [k]: e.target.value } : it)) });
  const removeInfo = (i) => patch({ info: contact.info.filter((_, idx) => idx !== i) });
  const addInfo = () =>
    patch({ info: [...contact.info, { icon: 'mail', label: '', value: '', href: '#' }] });

  const setCta = (k) => (e) => patch({ cta: { ...contact.cta, [k]: e.target.value } });

  return (
    <div className="space-y-6">
      <PageHeader title="Contact Page" subtitle="Intro, contact details and call-to-action" />

      <Card title="Intro">
        <div className="space-y-4">
          <Field label="Badge" value={contact.badge} onChange={(e) => patch({ badge: e.target.value })} />
          <Field as="textarea" label="Intro" value={contact.intro} onChange={(e) => patch({ intro: e.target.value })} />
          <Field label="Map Location Label" value={contact.location} onChange={(e) => patch({ location: e.target.value })} placeholder="Tehran, Iran" />
        </div>
      </Card>

      <Card title="Contact Info">
        <div className="space-y-4">
          {contact.info.map((it, i) => (
            <ListItemBlock key={i} index={i} onRemove={() => removeInfo(i)}>
              <div className="space-y-4">
                <Row>
                  <Field label="Label" value={it.label} onChange={setInfo(i, 'label')} placeholder="Email" />
                  <Field label="Icon (mail/phone/location/availability)" value={it.icon} onChange={setInfo(i, 'icon')} />
                </Row>
                <Row>
                  <Field label="Value" value={it.value} onChange={setInfo(i, 'value')} />
                  <Field label="Link (mailto:/tel:/#)" value={it.href} onChange={setInfo(i, 'href')} />
                </Row>
              </div>
            </ListItemBlock>
          ))}
        </div>
        <AddItemButton label="Add Contact Item" onClick={addInfo} />
      </Card>

      <Card title="Call To Action">
        <div className="space-y-4">
          <Field label="Title" value={contact.cta.title} onChange={setCta('title')} />
          <Field as="textarea" label="Text" value={contact.cta.text} onChange={setCta('text')} />
          <Field label="Link Label" value={contact.cta.linkLabel} onChange={setCta('linkLabel')} />
        </div>
      </Card>

      <SaveBar />
    </div>
  );
}
