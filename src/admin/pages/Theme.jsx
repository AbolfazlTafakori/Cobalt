import { useContent } from '../../content/ContentContext';
import { PageHeader, Card, ColorField } from '../components/ui';
import SaveBar from '../components/SaveBar';

const COLORS = [
  { key: 'brand', label: 'Brand / Accent', hint: 'Buttons, highlights, links' },
  { key: 'brandLight', label: 'Brand Light', hint: 'Gradients, secondary accent' },
  { key: 'brandDark', label: 'Brand Dark', hint: 'Button hover' },
  { key: 'dot', label: 'Dot Pattern', hint: 'The decorative blue dots' },
  { key: 'ink800', label: 'Background (base)', hint: 'Main page background' },
  { key: 'ink900', label: 'Background (deep)', hint: 'Navbar, deepest areas' },
  { key: 'ink700', label: 'Surface / Cards', hint: 'Raised panels' },
  { key: 'ink600', label: 'Surface (light)', hint: 'Elevated cards' },
];

export default function Theme() {
  const { content, updateSection } = useContent();
  const theme = content.theme;

  const set = (key) => (v) =>
    updateSection('theme', (prev) => ({ ...prev, [key]: v }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Theme & Colors"
        subtitle="Recolor the entire site — changes preview instantly"
      />

      <Card title="Palette">
        <div className="grid gap-6 sm:grid-cols-2">
          {COLORS.map((c) => (
            <ColorField
              key={c.key}
              label={c.label}
              hint={c.hint}
              value={theme[c.key]}
              onChange={set(c.key)}
            />
          ))}
        </div>
      </Card>

      <SaveBar />
    </div>
  );
}
