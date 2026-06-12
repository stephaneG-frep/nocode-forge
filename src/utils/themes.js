export const themes = [
  {
    id: 'corporate',
    name: 'Corporate Slate',
    vars: {
      '--ncf-app-bg': '#e2e8f0',
      '--ncf-surface': '#ffffff',
      '--ncf-surface-soft': '#f8fafc',
      '--ncf-text': '#0f172a',
      '--ncf-muted': '#475569',
      '--ncf-accent': '#0f6cbd',
      '--ncf-accent-strong': '#0b4c84',
    },
  },
  {
    id: 'forest',
    name: 'Forest Mint',
    vars: {
      '--ncf-app-bg': '#dff2e9',
      '--ncf-surface': '#ffffff',
      '--ncf-surface-soft': '#effaf4',
      '--ncf-text': '#09231a',
      '--ncf-muted': '#365244',
      '--ncf-accent': '#0f9d74',
      '--ncf-accent-strong': '#0a6a4f',
    },
  },
  {
    id: 'sand',
    name: 'Sandstone',
    vars: {
      '--ncf-app-bg': '#f3eadf',
      '--ncf-surface': '#fffdf8',
      '--ncf-surface-soft': '#faf2e8',
      '--ncf-text': '#33221a',
      '--ncf-muted': '#5f4a3e',
      '--ncf-accent': '#c66b2f',
      '--ncf-accent-strong': '#9a4f21',
    },
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    vars: {
      '--ncf-app-bg': '#07111f',
      '--ncf-surface': '#0f1f33',
      '--ncf-surface-soft': '#132b46',
      '--ncf-text': '#e6f1ff',
      '--ncf-muted': '#9db4d3',
      '--ncf-accent': '#2f80ed',
      '--ncf-accent-strong': '#1b4f9c',
    },
  },
  {
    id: 'saas-light',
    name: 'SaaS clair',
    vars: {
      '--ncf-app-bg': '#eef4ff',
      '--ncf-surface': '#ffffff',
      '--ncf-surface-soft': '#f3f7ff',
      '--ncf-text': '#172033',
      '--ncf-muted': '#60708a',
      '--ncf-accent': '#2563eb',
      '--ncf-accent-strong': '#1d4ed8',
    },
  },
  {
    id: 'mobile-premium',
    name: 'Mobile premium',
    vars: {
      '--ncf-app-bg': '#dbeafe',
      '--ncf-surface': '#ffffff',
      '--ncf-surface-soft': '#eaf2ff',
      '--ncf-text': '#0b1220',
      '--ncf-muted': '#516179',
      '--ncf-accent': '#0ea5e9',
      '--ncf-accent-strong': '#075985',
    },
  },
];

export const defaultThemeId = themes[0].id;

export const getThemeById = (id) => themes.find((theme) => theme.id === id) || themes[0];
