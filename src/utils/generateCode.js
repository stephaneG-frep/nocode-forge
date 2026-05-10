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

const elementToJsx = (item) => {
  const className = classFromProps(item);
  const content = item.content || '';

  switch (item.type) {
    case 'text':
      return `      <p className=\"${className}\">${content}</p>`;
    case 'button':
      return `      <button className=\"${className}\">${content}</button>`;
    case 'image':
      return `      <img src=\"${content}\" alt=\"${item.type}\" className=\"${className}\" />`;
    case 'card': {
      const [title, description] = content.split('\n');
      return [
        `      <div className=\"${className} shadow-sm\">`,
        `        <h3 className=\"text-lg font-semibold\">${title || 'Card title'}</h3>`,
        `        <p className=\"mt-2 text-slate-600\">${description || 'Card description'}</p>`,
        '      </div>',
      ].join('\n');
    }
    case 'input':
      return `      <input placeholder=\"${content}\" className=\"${className} border border-slate-300\" />`;
    case 'section':
      return [
        `      <section className=\"${className}\">`,
        `        <h2 className=\"text-2xl font-bold\">${content}</h2>`,
        '      </section>',
      ].join('\n');
    case 'navbar':
      return `      <nav className=\"${className}\">${content}</nav>`;
    case 'footer':
      return `      <footer className=\"${className}\">${content}</footer>`;
    default:
      return `      <div className=\"${className}\">${content}</div>`;
  }
};

export const generateCode = (elements) => {
  const jsxElements = elements.map(elementToJsx).join('\n\n');

  return `import React from 'react';

export default function GeneratedPage() {
  return (
    <main className=\"min-h-screen bg-slate-100 p-6\">
      <div className=\"mx-auto flex w-full max-w-5xl flex-col gap-4\">
${jsxElements || '        {/* Empty canvas */}'}
      </div>
    </main>
  );
}`;
};
