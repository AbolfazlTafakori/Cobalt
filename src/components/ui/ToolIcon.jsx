import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTailwindcss,
  SiReact,
  SiGit,
  SiGithub,
  SiFigma,
  SiEslint,
  SiPrettier,
  SiVite,
} from 'react-icons/si';
import { TbBrandVscode } from 'react-icons/tb';

// Brand logo + official brand color for each tool tile.
const toolMap = {
  html5: { Icon: SiHtml5, color: '#E34F26' },
  css3: { Icon: SiCss, color: '#1572B6' },
  javascript: { Icon: SiJavascript, color: '#F7DF1E' },
  tailwind: { Icon: SiTailwindcss, color: '#38BDF8' },
  react: { Icon: SiReact, color: '#61DAFB' },
  git: { Icon: SiGit, color: '#F05032' },
  github: { Icon: SiGithub, color: '#FFFFFF' },
  vscode: { Icon: TbBrandVscode, color: '#22A7F2' },
  figma: { Icon: SiFigma, color: '#F24E1E' },
  eslint: { Icon: SiEslint, color: '#4B32C3' },
  prettier: { Icon: SiPrettier, color: '#F7B93E' },
  vite: { Icon: SiVite, color: '#646CFF' },
};

export default function ToolIcon({ icon, size = 34 }) {
  const entry = toolMap[icon];
  if (!entry) return null;
  const { Icon, color } = entry;
  return <Icon size={size} color={color} />;
}
