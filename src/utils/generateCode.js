const classFromProps = (item) => {
  const p = item.props || {};
  return [
    p.textColor,
    p.backgroundColor,
    p.padding,
    p.radius,
    p.fontSize,
    item.className,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();
};

export const generateProjectFiles = (elements, theme) => {
  const serialized = JSON.stringify(elements, null, 2);
  const serializedThemeVars = JSON.stringify(theme?.vars || {}, null, 2);

  return {
    'src/App.jsx': `import React from 'react';
import { elements } from './data/elements';
import { RenderElement } from './components/RenderElement';
import { themeVars } from './theme';

export default function App() {
  return (
    <main className=\"min-h-screen p-6\" style={{ backgroundColor: 'var(--ncf-app-bg)', ...themeVars }}>
      <div className=\"mx-auto flex w-full max-w-5xl flex-col gap-4\">
        {elements.length === 0 ? (
          <p className=\"text-[color:var(--ncf-muted)]\">Canvas is empty</p>
        ) : (
          elements.map((item) => <RenderElement key={item.id} item={item} />)
        )}
      </div>
    </main>
  );
}
`,
    'src/components/RenderElement.jsx': `import React from 'react';

const getClasses = (item) => {
  const p = item.props || {};
  return [p.textColor, p.backgroundColor, p.padding, p.radius, p.fontSize, item.className]
    .filter(Boolean)
    .join(' ')
    .trim();
};

const parseSize = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const numeric = Number.parseInt(value, 10);
    return Number.isFinite(numeric) ? numeric : null;
  }
  return null;
};

export function RenderElement({ item }) {
  const className = getClasses(item);
  const content = item.content || '';
  const width = parseSize(item.props?.width);
  const height = parseSize(item.props?.height);
  const boxStyle = {
    width: width ? width + 'px' : undefined,
    height: height ? height + 'px' : undefined,
  };

  switch (item.type) {
    case 'text':
      return <p style={boxStyle} className={className}>{content}</p>;
    case 'button':
      return <button style={boxStyle} className={className}>{content}</button>;
    case 'image':
      return <img style={boxStyle} src={content} alt={item.type} className={className} />;
    case 'card': {
      const [title, description] = content.split('\\n');
      return (
        <div style={boxStyle} className={className + ' shadow-sm'}>
          <h3 className=\"text-lg font-semibold\">{title || 'Card title'}</h3>
          <p className=\"mt-2 text-slate-600\">{description || 'Card description'}</p>
        </div>
      );
    }
    case 'input':
      return <input style={boxStyle} placeholder={content} className={className + ' border border-slate-300'} readOnly />;
    case 'section':
      return (
        <section style={boxStyle} className={className}>
          <h2 className=\"text-2xl font-bold\">{content}</h2>
        </section>
      );
    case 'navbar':
      return <nav style={boxStyle} className={className}>{content}</nav>;
    case 'footer':
      return <footer style={boxStyle} className={className}>{content}</footer>;
    default:
      return <div style={boxStyle} className={className}>{content}</div>;
  }
}
`,
    'src/data/elements.js': `export const elements = ${serialized};\n`,
    'src/theme.js': `export const themeVars = ${serializedThemeVars};\n`,
    'README.md': `# Generated NoCode Forge Export\n\nThis export contains a React + Tailwind page generated from NoCode Forge.\n\n## Files\n- src/App.jsx\n- src/components/RenderElement.jsx\n- src/data/elements.js\n- src/theme.js\n`,
  };
};
