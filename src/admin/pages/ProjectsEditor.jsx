import { Trash2 } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { uploadFile, uploadUrl } from '../api';
import { useToast } from '../components/Toast';
import { PageHeader, Card, Field, Row } from '../components/ui';
import { StringListEditor, ListItemBlock, AddItemButton } from '../components/editors';
import ImageUpload from '../components/ImageUpload';
import SaveBar from '../components/SaveBar';

export default function ProjectsEditor() {
  const { content, updateSection } = useContent();
  const projects = content.projects;
  const toast = useToast();
  const patch = (obj) => updateSection('projects', (prev) => ({ ...prev, ...obj }));

  const setItemImage = (i, image) =>
    patch({ items: projects.items.map((p, idx) => (idx === i ? { ...p, image } : p)) });
  const onItemImage = (i) => async (file) => {
    try {
      const filename = await uploadFile(file);
      setItemImage(i, filename);
      toast('Image uploaded — remember to Save.');
    } catch (e) {
      toast(e.message || 'Upload failed', true);
    }
  };

  const setStat = (i, k) => (e) =>
    patch({ stats: projects.stats.map((s, idx) => (idx === i ? { ...s, [k]: e.target.value } : s)) });

  const setItem = (i, k) => (e) =>
    patch({ items: projects.items.map((p, idx) => (idx === i ? { ...p, [k]: e.target.value } : p)) });
  const setItemTags = (i, tags) =>
    patch({ items: projects.items.map((p, idx) => (idx === i ? { ...p, tags } : p)) });
  const removeItem = (i) => patch({ items: projects.items.filter((_, idx) => idx !== i) });
  const addItem = () =>
    patch({
      items: [
        ...projects.items,
        {
          title: 'New Project',
          gradient: 'from-brand to-brand-dark',
          image: '',
          tags: [],
          description: '',
          caseStudy: '#',
          liveDemo: '#',
        },
      ],
    });

  return (
    <div className="space-y-6">
      <PageHeader title="Projects Page" subtitle="Header, stats and project cards" />

      <Card title="Intro">
        <div className="space-y-4">
          <Field label="Badge" value={projects.badge} onChange={(e) => patch({ badge: e.target.value })} />
          <Field as="textarea" label="Intro" value={projects.intro} onChange={(e) => patch({ intro: e.target.value })} />
        </div>
      </Card>

      <Card title="Stats">
        <div className="space-y-3">
          {projects.stats.map((s, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-3">
              <Field label="Value" value={s.value} onChange={setStat(i, 'value')} />
              <Field label="Label" value={s.label} onChange={setStat(i, 'label')} />
              <Field label="Icon (folder/code/users/calendar)" value={s.icon} onChange={setStat(i, 'icon')} />
            </div>
          ))}
        </div>
      </Card>

      <Card title="Project Cards">
        <div className="space-y-4">
          {projects.items.map((p, i) => (
            <ListItemBlock key={i} index={i} onRemove={() => removeItem(i)}>
              <div className="space-y-4">
                <div>
                  <ImageUpload
                    value={p.image ? uploadUrl(p.image) : ''}
                    onFile={onItemImage(i)}
                    shape="wide"
                    label="Upload Image"
                    hint="Project screenshot. Falls back to the gradient below if empty."
                  />
                  {p.image && (
                    <button
                      type="button"
                      onClick={() => {
                        setItemImage(i, '');
                        toast('Image removed — remember to Save.');
                      }}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      <Trash2 size={15} />
                      Remove Image
                    </button>
                  )}
                </div>
                <Field label="Title" value={p.title} onChange={setItem(i, 'title')} />
                <Field as="textarea" label="Description" value={p.description} onChange={setItem(i, 'description')} />
                <StringListEditor label="Tags" items={p.tags} onChange={(v) => setItemTags(i, v)} placeholder="React" />
                <Row>
                  <Field label="Case Study URL" value={p.caseStudy} onChange={setItem(i, 'caseStudy')} />
                  <Field label="Live Demo URL" value={p.liveDemo} onChange={setItem(i, 'liveDemo')} />
                </Row>
                <Field label="Thumbnail Gradient (Tailwind classes)" value={p.gradient} onChange={setItem(i, 'gradient')} placeholder="from-brand to-brand-dark" />
              </div>
            </ListItemBlock>
          ))}
        </div>
        <AddItemButton label="Add Project" onClick={addItem} />
      </Card>

      <SaveBar />
    </div>
  );
}
