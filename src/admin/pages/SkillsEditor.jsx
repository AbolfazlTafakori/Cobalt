import { Trash2, Plus } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { PageHeader, Card, Field, Row } from '../components/ui';
import { ListItemBlock, AddItemButton } from '../components/editors';
import SaveBar from '../components/SaveBar';

export default function SkillsEditor() {
  const { content, updateSection } = useContent();
  const skills = content.skills;
  const patch = (obj) => updateSection('skills', (prev) => ({ ...prev, ...obj }));

  const setCat = (ci, k) => (e) =>
    patch({
      categories: skills.categories.map((c, idx) =>
        idx === ci ? { ...c, [k]: e.target.value } : c,
      ),
    });
  const mutateCat = (ci, fn) =>
    patch({
      categories: skills.categories.map((c, idx) => (idx === ci ? fn(c) : c)),
    });

  const setItem = (ci, ii, k) => (e) =>
    mutateCat(ci, (c) => ({
      ...c,
      items: c.items.map((it, idx) =>
        idx === ii ? { ...it, [k]: k === 'level' ? Number(e.target.value) : e.target.value } : it,
      ),
    }));
  const removeItem = (ci, ii) =>
    mutateCat(ci, (c) => ({ ...c, items: c.items.filter((_, idx) => idx !== ii) }));
  const addItem = (ci) =>
    mutateCat(ci, (c) => ({ ...c, items: [...c.items, { name: '', level: 80 }] }));

  const removeCat = (ci) =>
    patch({ categories: skills.categories.filter((_, idx) => idx !== ci) });
  const addCat = () =>
    patch({
      categories: [
        ...skills.categories,
        { icon: 'code', title: '', description: '', items: [] },
      ],
    });

  // Tools
  const setTool = (i, k) => (e) =>
    patch({ tools: skills.tools.map((t, idx) => (idx === i ? { ...t, [k]: e.target.value } : t)) });
  const removeTool = (i) => patch({ tools: skills.tools.filter((_, idx) => idx !== i) });
  const addTool = () => patch({ tools: [...skills.tools, { name: '', icon: 'react' }] });

  return (
    <div className="space-y-6">
      <PageHeader title="Skills Page" subtitle="Skill categories with levels, and the tools row" />

      <Card title="Intro">
        <div className="space-y-4">
          <Field label="Badge" value={skills.badge} onChange={(e) => patch({ badge: e.target.value })} />
          <Field as="textarea" label="Intro" value={skills.intro} onChange={(e) => patch({ intro: e.target.value })} />
        </div>
      </Card>

      <Card title="Skill Categories">
        <div className="space-y-4">
          {skills.categories.map((cat, ci) => (
            <ListItemBlock key={ci} index={ci} onRemove={() => removeCat(ci)}>
              <div className="space-y-4">
                <Row>
                  <Field label="Title" value={cat.title} onChange={setCat(ci, 'title')} />
                  <Field label="Icon (code/design/responsive/version/performance)" value={cat.icon} onChange={setCat(ci, 'icon')} />
                </Row>
                <Field as="textarea" label="Description" value={cat.description} onChange={setCat(ci, 'description')} />

                <div>
                  <span className="mb-2 block text-sm font-medium text-slate-300">Skills (name + %)</span>
                  <div className="space-y-2">
                    {cat.items.map((it, ii) => (
                      <div key={ii} className="flex items-center gap-2">
                        <input
                          value={it.name}
                          onChange={setItem(ci, ii, 'name')}
                          placeholder="Skill name"
                          className="flex-1 rounded-lg border border-white/10 bg-ink-900/40 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                        />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={it.level}
                          onChange={setItem(ci, ii, 'level')}
                          className="w-20 rounded-lg border border-white/10 bg-ink-900/40 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                        />
                        <button
                          onClick={() => removeItem(ci, ii)}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addItem(ci)}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-brand/40 bg-brand/5 px-3 py-1.5 text-xs font-medium text-brand hover:bg-brand/10"
                  >
                    <Plus size={13} /> Add skill
                  </button>
                </div>
              </div>
            </ListItemBlock>
          ))}
        </div>
        <AddItemButton label="Add Category" onClick={addCat} />
      </Card>

      <Card title="Tools & Technologies">
        <div className="space-y-3">
          {skills.tools.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={t.name}
                onChange={setTool(i, 'name')}
                placeholder="Name"
                className="flex-1 rounded-lg border border-white/10 bg-ink-900/40 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
              />
              <input
                value={t.icon}
                onChange={setTool(i, 'icon')}
                placeholder="icon key (react, git…)"
                className="flex-1 rounded-lg border border-white/10 bg-ink-900/40 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
              />
              <button
                onClick={() => removeTool(i)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <AddItemButton label="Add Tool" onClick={addTool} />
        <p className="mt-3 text-xs text-slate-500">
          Icon keys: html5, css3, javascript, tailwind, react, git, github, vscode, figma, eslint, prettier, vite
        </p>
      </Card>

      <SaveBar />
    </div>
  );
}
