import {
  IdCard,
  Menu,
  Palette,
  BarChart3,
  Share2,
  UserRound,
  Layers,
  LayoutGrid,
  Mail,
  KeyRound,
} from 'lucide-react';

// Sidebar structure — built around THIS site's actual content.
export const navGroups = [
  {
    label: 'Site',
    emoji: '⚙️',
    items: [
      { to: '/admin/identity', label: 'Identity', icon: IdCard },
      { to: '/admin/navbar', label: 'Navbar', icon: Menu },
      { to: '/admin/theme', label: 'Theme & Colors', icon: Palette },
    ],
  },
  {
    label: 'Pages',
    emoji: '📄',
    items: [
      { to: '/admin/home', label: 'Home (Stats)', icon: BarChart3 },
      { to: '/admin/about', label: 'About', icon: UserRound },
      { to: '/admin/skills', label: 'Skills', icon: Layers },
      { to: '/admin/projects', label: 'Projects', icon: LayoutGrid },
      { to: '/admin/contact', label: 'Contact', icon: Mail },
    ],
  },
  {
    label: 'Links & Account',
    emoji: '🔗',
    items: [
      { to: '/admin/socials', label: 'Social Links', icon: Share2 },
      { to: '/admin/password', label: 'Change Password', icon: KeyRound },
    ],
  },
];
