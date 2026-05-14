const baseProps = {
  textColor: 'text-[color:var(--ncf-text)]',
  backgroundColor: 'bg-[color:var(--ncf-surface)]',
  padding: 'px-4 py-2',
  radius: 'rounded-xl',
  fontSize: 'text-base',
  width: null,
  height: null,
  x: null,
  y: null,
  locked: false,
  groupId: null,
};

export const componentLibrary = [
  { type: 'text', label: 'Text' },
  { type: 'button', label: 'Button' },
  { type: 'image', label: 'Image' },
  { type: 'card', label: 'Card' },
  { type: 'input', label: 'Input' },
  { type: 'section', label: 'Section' },
  { type: 'navbar', label: 'Navbar' },
  { type: 'footer', label: 'Footer' },
];

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const createDefaultElement = (type) => {
  const shared = {
    id: uid(),
    type,
    content: 'New element',
    props: { ...baseProps },
    className: '',
  };

  switch (type) {
    case 'text':
      return { ...shared, content: 'Editable text' };
    case 'button':
      return {
        ...shared,
        content: 'Click me',
        props: {
          ...baseProps,
          textColor: 'text-white',
          backgroundColor: 'bg-[color:var(--ncf-accent)]',
        },
      };
    case 'image':
      return {
        ...shared,
        content: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
        props: {
          ...baseProps,
          padding: 'p-0',
          radius: 'rounded-2xl',
        },
      };
    case 'card':
      return {
        ...shared,
        content: 'Card title\nCard description',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'p-6',
          radius: 'rounded-2xl',
        },
      };
    case 'input':
      return {
        ...shared,
        content: 'Type here...',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'px-4 py-3',
        },
      };
    case 'section':
      return {
        ...shared,
        content: 'Section title',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-surface-soft)]',
          padding: 'p-8',
          radius: 'rounded-3xl',
        },
      };
    case 'navbar':
      return {
        ...shared,
        content: 'NoCode Forge | Home | Features | Pricing',
        props: {
          ...baseProps,
          textColor: 'text-white',
          backgroundColor: 'bg-[color:var(--ncf-accent-strong)]',
          padding: 'px-6 py-4',
          radius: 'rounded-2xl',
        },
      };
    case 'footer':
      return {
        ...shared,
        content: '© 2026 NoCode Forge. All rights reserved.',
        props: {
          ...baseProps,
          textColor: 'text-white',
          backgroundColor: 'bg-[color:var(--ncf-accent-strong)]',
          padding: 'px-6 py-5',
          radius: 'rounded-2xl',
          fontSize: 'text-sm',
        },
      };
    default:
      return shared;
  }
};
