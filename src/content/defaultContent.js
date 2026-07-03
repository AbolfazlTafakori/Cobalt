// ============================================================
//  DEFAULT SITE CONTENT — the single source of truth for THIS site.
//  The admin panel edits this whole structure and saves it to the
//  backend (GET/PUT /api/content). On load the site deep-merges the
//  saved content over these defaults, so everything below is editable.
// ============================================================

export const defaultContent = {
  // ---- Theme colors (hex; drive the CSS variables in index.css) ----
  theme: {
    brand: '#2563eb',
    brandLight: '#3b82f6',
    brandDark: '#1d4ed8',
    ink900: '#080b16',
    ink800: '#0b1120',
    ink700: '#0f1729',
    ink600: '#131c31',
    dot: '#043ec3',
  },

  // ---- Identity (used across Home / About / Skills) ----
  profile: {
    firstName: 'Abolfazl',
    lastName: 'Tafakori',
    role: 'Frontend Developer',
    tagline:
      'I build responsive and user-friendly web applications with modern technologies.',
    greeting: "Hello, I'm",
    resumeUrl: '/cv.pdf',
    avatar: '', // uploaded filename; empty = use bundled placeholder
  },

  // ---- Navbar ----
  nav: {
    logo: 'AT',
    downloadLabel: 'Download CV',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About', to: '/about' },
      { label: 'Skills', to: '/skills' },
      { label: 'Projects', to: '/projects' },
      { label: 'Contact', to: '/contact' },
    ],
  },

  // ---- Social links (Home + Contact) ----
  socials: [
    { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
    { label: 'LinkedIn', href: 'https://linkedin.com/', icon: 'linkedin' },
    { label: 'Email', href: 'mailto:abolfazltafakori@outlook.com', icon: 'mail' },
  ],

  // ---- Home hero stats bar ----
  stats: [
    { value: '+2', label: 'Years Experience' },
    { value: '+10', label: 'Projects Completed' },
    { value: '+5', label: 'Technologies' },
    { value: '100%', label: 'Client Satisfaction' },
  ],

  // ---- About page ----
  about: {
    badge: 'About Me',
    paragraphs: [
      "I'm a passionate Frontend Developer who loves building clean, user-friendly, and high-performance web applications.",
      'I focus on writing clean code, crafting seamless user experiences, and turning ideas into reality using modern technologies.',
    ],
    journey: [
      {
        icon: 'briefcase',
        title: 'Frontend Developer (Freelance)',
        period: '2023 – Present',
        description:
          'Working with clients worldwide to build modern, responsive, and user-friendly web applications using React, Next.js, Tailwind CSS, and other modern tools.',
      },
      {
        icon: 'graduation',
        title: 'Frontend Developer Intern',
        period: '2022 – 2023',
        description:
          'Gained hands-on experience in building real-world projects, collaborating with teams, and improving my skills in frontend development.',
      },
    ],
    drives: [
      "I'm driven by curiosity and a passion for solving real-world problems through code. I love creating beautiful, functional, and accessible web experiences that make a difference.",
      "I'm always learning, exploring new technologies, and pushing my limits to grow as a developer and as a person.",
    ],
    tags: [
      'Clean Code',
      'User Experience',
      'Performance',
      'Problem Solving',
      'Continuous Learning',
    ],
  },

  // ---- Skills page ----
  skills: {
    badge: 'What I Do',
    intro:
      'I combine technical expertise with creative problem-solving to build efficient, scalable, and user-friendly web solutions.',
    categories: [
      {
        icon: 'code',
        title: 'Frontend Development',
        description:
          'Building interactive and performant web interfaces with modern technologies.',
        items: [
          { name: 'HTML5', level: 95 },
          { name: 'CSS3', level: 90 },
          { name: 'JavaScript (ES6+)', level: 90 },
          { name: 'React.js', level: 85 },
          { name: 'Tailwind CSS', level: 90 },
        ],
      },
      {
        icon: 'design',
        title: 'UI Design',
        description:
          'Designing clean, modern, and user-focused interfaces that enhance user experience.',
        items: [
          { name: 'Figma', level: 90 },
          { name: 'UI/UX Design', level: 85 },
          { name: 'Design Systems', level: 80 },
          { name: 'Typography', level: 85 },
          { name: 'Color Theory', level: 80 },
        ],
      },
      {
        icon: 'responsive',
        title: 'Responsive Design',
        description:
          'Creating fully responsive layouts that work seamlessly across all devices.',
        items: [
          { name: 'Mobile First', level: 95 },
          { name: 'Flexbox', level: 90 },
          { name: 'CSS Grid', level: 90 },
          { name: 'Responsive Images', level: 85 },
          { name: 'Media Queries', level: 90 },
        ],
      },
      {
        icon: 'version',
        title: 'Version Control',
        description:
          'Managing code efficiently and collaborating seamlessly in development workflows.',
        items: [
          { name: 'Git', level: 95 },
          { name: 'GitHub', level: 90 },
          { name: 'Branching', level: 85 },
          { name: 'Pull Requests', level: 90 },
          { name: 'CI/CD Basics', level: 75 },
        ],
      },
      {
        icon: 'performance',
        title: 'Performance & Problem Solving',
        description:
          'Optimizing performance and solving complex problems with efficient solutions.',
        items: [
          { name: 'Performance Optimization', level: 85 },
          { name: 'SEO Basics', level: 80 },
          { name: 'Debugging', level: 90 },
          { name: 'Problem Solving', level: 90 },
          { name: 'Clean Code', level: 85 },
        ],
      },
    ],
    tools: [
      { name: 'HTML5', icon: 'html5' },
      { name: 'CSS3', icon: 'css3' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'Tailwind CSS', icon: 'tailwind' },
      { name: 'React', icon: 'react' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
      { name: 'VS Code', icon: 'vscode' },
      { name: 'Figma', icon: 'figma' },
      { name: 'ESLint', icon: 'eslint' },
      { name: 'Prettier', icon: 'prettier' },
      { name: 'Vite', icon: 'vite' },
    ],
  },

  // ---- Projects page ----
  projects: {
    badge: 'My Work',
    intro:
      'A collection of projects that showcase my skills in building modern, responsive, and user-friendly web applications.',
    stats: [
      { icon: 'folder', value: '+10', label: 'Projects Completed' },
      { icon: 'code', value: '+15', label: 'Technologies' },
      { icon: 'users', value: '100%', label: 'Client Satisfaction' },
      { icon: 'calendar', value: '+2', label: 'Years Experience' },
    ],
    items: [
      {
        title: 'Analytics Dashboard',
        gradient: 'from-brand to-brand-dark',
        tags: ['React', 'Tailwind CSS', 'Chart.js'],
        description:
          'A comprehensive analytics dashboard with real-time data visualization and interactive charts.',
        caseStudy: '#',
        liveDemo: '#',
      },
      {
        title: 'E-Commerce Platform',
        gradient: 'from-slate-600 to-slate-800',
        tags: ['Next.js', 'Stripe', 'MongoDB'],
        description:
          'Full-featured e-commerce platform with product management, secure payments, and order tracking.',
        caseStudy: '#',
        liveDemo: '#',
      },
      {
        title: 'SaaS Landing Page',
        gradient: 'from-brand-dark to-ink-700',
        tags: ['HTML', 'Tailwind CSS', 'JavaScript'],
        description:
          'High-converting landing page for a SaaS product with modern design and smooth animations.',
        caseStudy: '#',
        liveDemo: '#',
      },
      {
        title: 'Task Management App',
        gradient: 'from-slate-700 to-ink-700',
        tags: ['React', 'Firebase', 'Tailwind CSS'],
        description:
          'Collaborative task management application with real-time updates and team collaboration.',
        caseStudy: '#',
        liveDemo: '#',
      },
      {
        title: 'Portfolio Website',
        gradient: 'from-brand to-ink-700',
        tags: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
        description:
          'Personal portfolio website showcasing skills, projects, and experience with modern animations.',
        caseStudy: '#',
        liveDemo: '#',
      },
      {
        title: 'Finance Tracker',
        gradient: 'from-slate-600 to-brand-dark',
        tags: ['React', 'Recharts', 'Node.js'],
        description:
          'Personal finance tracking application with expense categorization and budget management.',
        caseStudy: '#',
        liveDemo: '#',
      },
    ],
  },

  // ---- Contact page ----
  contact: {
    badge: 'Get In Touch',
    intro:
      "Have a project in mind or want to discuss opportunities? I'd love to hear from you. Let's create something amazing together.",
    info: [
      {
        icon: 'mail',
        label: 'Email',
        value: 'abolfazltafakori@outlook.com',
        href: 'mailto:abolfazltafakori@outlook.com',
      },
      {
        icon: 'phone',
        label: 'Phone',
        value: '+98 900 123 4567',
        href: 'tel:+989001234567',
      },
      { icon: 'location', label: 'Location', value: 'Tehran, Iran', href: '#' },
      {
        icon: 'availability',
        label: 'Availability',
        value: 'Open to new opportunities',
        href: '#',
      },
    ],
    location: 'Tehran, Iran',
    cta: {
      title: "Let's Build Something Amazing",
      text: "I'm always excited to work on innovative projects and bring ideas to life.",
      linkLabel: "Let's Connect",
    },
  },
};

// Theme keys → CSS variable names (see index.css).
export const themeVarMap = {
  brand: '--c-brand',
  brandLight: '--c-brand-light',
  brandDark: '--c-brand-dark',
  ink900: '--c-ink-900',
  ink800: '--c-ink-800',
  ink700: '--c-ink-700',
  ink600: '--c-ink-600',
  dot: '--c-dot',
};
