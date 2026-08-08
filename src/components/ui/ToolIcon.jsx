import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiReact,
  SiNextdotjs,
  SiGit,
  SiGithub,
  SiFigma,
  SiEslint,
  SiPrettier,
  SiVite,
  SiSharp,
  SiDotnet,
  SiSqlite,
  SiPostgresql,
  SiNginx,
  SiLinux,
  SiUbuntu,
  SiGnubash,
  SiDocker,
  SiPostman,
  SiSwagger,
  SiJsonwebtokens,
  SiTelegram,
} from 'react-icons/si';
import { TbBrandVscode } from 'react-icons/tb';

// Brand logo + official brand color for each tool tile. A few brands are
// near-black (JWT, Next.js) or very dark (SQLite) and would disappear on the
// dark cards, so those use a lighter reading of the same mark.
const toolMap = {
  // ---- Backend / platform ----
  csharp: { Icon: SiSharp, color: '#8A5FD6' },
  dotnet: { Icon: SiDotnet, color: '#512BD4' },
  sqlite: { Icon: SiSqlite, color: '#0F80CC' },
  postgresql: { Icon: SiPostgresql, color: '#4169E1' },
  nginx: { Icon: SiNginx, color: '#009639' },
  linux: { Icon: SiLinux, color: '#FCC624' },
  ubuntu: { Icon: SiUbuntu, color: '#E95420' },
  bash: { Icon: SiGnubash, color: '#4EAA25' },
  docker: { Icon: SiDocker, color: '#2496ED' },
  postman: { Icon: SiPostman, color: '#FF6C37' },
  swagger: { Icon: SiSwagger, color: '#85EA2D' },
  jwt: { Icon: SiJsonwebtokens, color: '#FFFFFF' },
  telegram: { Icon: SiTelegram, color: '#26A5E4' },

  // ---- Frontend ----
  html5: { Icon: SiHtml5, color: '#E34F26' },
  css3: { Icon: SiCss, color: '#1572B6' },
  javascript: { Icon: SiJavascript, color: '#F7DF1E' },
  typescript: { Icon: SiTypescript, color: '#3178C6' },
  tailwind: { Icon: SiTailwindcss, color: '#38BDF8' },
  react: { Icon: SiReact, color: '#61DAFB' },
  nextjs: { Icon: SiNextdotjs, color: '#FFFFFF' },

  // ---- Tooling ----
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
