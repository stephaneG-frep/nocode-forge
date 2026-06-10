import { useRef } from 'react';

const classesFromProps = (element) => {
  const p = element.props || {};
  return [p.textColor, p.backgroundColor, p.padding, p.radius, p.fontSize, element.className]
    .filter(Boolean)
    .join(' ');
};

const parseSize = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const numeric = Number.parseInt(value, 10);
    return Number.isFinite(numeric) ? numeric : null;
  }
  return null;
};

export default function RenderElement({ element, selected, onSelect, onInlineEdit, previewMode }) {
  const rootRef = useRef(null);
  const selectedRing = selected && !previewMode ? 'ring-2 ring-brand-500 ring-offset-2' : '';
  const base = `${classesFromProps(element)} ${selectedRing}`.trim();

  const width = parseSize(element.props?.width);
  const height = parseSize(element.props?.height);

  const boxStyle = {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
  };

  const onContainerClick = (e) => {
    if (!previewMode) {
      e.stopPropagation();
      onSelect(element.id, e.shiftKey);
    }
  };

  const onInlineInput = (e) => {
    if (previewMode || !onInlineEdit) return;
    onInlineEdit(element.id, 'content', e.currentTarget.textContent || '', { coalesceKey: `content:${element.id}` });
  };

  const startResize = (event) => {
    if (previewMode || !selected || !rootRef.current || !onInlineEdit) return;
    event.stopPropagation();
    event.preventDefault();

    const box = rootRef.current.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = box.width;
    const startHeight = box.height;

    const onMouseMove = (moveEvent) => {
      const nextWidth = Math.max(80, Math.round(startWidth + (moveEvent.clientX - startX)));
      const nextHeight = Math.max(40, Math.round(startHeight + (moveEvent.clientY - startY)));
      onInlineEdit(element.id, 'props.width', nextWidth, { coalesceKey: `resize:${element.id}` });
      onInlineEdit(element.id, 'props.height', nextHeight, { coalesceKey: `resize:${element.id}` });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const sharedProps = { className: base, onClick: onContainerClick };

  const renderNode = () => {
    switch (element.type) {
      case 'text':
        return <p {...sharedProps} contentEditable={!previewMode && selected} suppressContentEditableWarning onInput={onInlineInput}>{element.content}</p>;
      case 'hero': {
        const [title, subtitle] = (element.content || '').split('\n');
        return (
          <section {...sharedProps}>
            <p className="mb-3 inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-[color:var(--ncf-accent-strong)]">Pret a publier</p>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-[color:var(--ncf-text)] md:text-5xl">{title || 'Grand titre'}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--ncf-muted)] md:text-lg">{subtitle || 'Sous-titre de presentation'}</p>
          </section>
        );
      }
      case 'button':
        return <button {...sharedProps} contentEditable={!previewMode && selected} suppressContentEditableWarning onInput={onInlineInput}>{element.content}</button>;
      case 'badge':
        return <span {...sharedProps} contentEditable={!previewMode && selected} suppressContentEditableWarning onInput={onInlineInput}>{element.content}</span>;
      case 'image':
        return <img {...sharedProps} src={element.content} alt="builder visual" />;
      case 'card': {
        const [title, description] = (element.content || '').split('\n');
        return (
          <div {...sharedProps}>
            <h3 className="text-lg font-semibold">{title || 'Card title'}</h3>
            <p className="mt-2 text-slate-600">{description || 'Card description'}</p>
          </div>
        );
      }
      case 'stats': {
        const lines = (element.content || '').split('\n').filter(Boolean);
        const items = [0, 2, 4].map((start) => ({
          value: lines[start] || '0',
          label: lines[start + 1] || 'Description',
        }));
        return (
          <div {...sharedProps}>
            <div className="grid gap-4 sm:grid-cols-3">
              {items.map((item, index) => (
                <div key={`${item.value}-${index}`} className="rounded-2xl bg-[color:var(--ncf-surface-soft)] p-4 text-center">
                  <p className="text-3xl font-black text-[color:var(--ncf-accent-strong)]">{item.value}</p>
                  <p className="mt-1 text-sm text-[color:var(--ncf-muted)]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'testimonial': {
        const [quote, name, role] = (element.content || '').split('\n');
        return (
          <figure {...sharedProps}>
            <p className="text-lg font-medium leading-8 text-[color:var(--ncf-text)]">"{quote || 'Avis client'}"</p>
            <figcaption className="mt-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--ncf-accent)] font-bold text-white">{(name || 'A').slice(0, 1)}</div>
              <div>
                <p className="font-semibold text-[color:var(--ncf-text)]">{name || 'Nom du client'}</p>
                <p className="text-sm text-[color:var(--ncf-muted)]">{role || 'Role'}</p>
              </div>
            </figcaption>
          </figure>
        );
      }
      case 'pricing': {
        const [name, price, description, features = ''] = (element.content || '').split('\n');
        return (
          <div {...sharedProps} className={`${base} border border-[color:var(--ncf-surface-soft)] shadow-sm`.trim()}>
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--ncf-accent-strong)]">{name || 'Offre'}</p>
            <p className="mt-3 text-4xl font-black text-[color:var(--ncf-text)]">{price || 'Prix'}</p>
            <p className="mt-2 text-sm text-[color:var(--ncf-muted)]">{description || 'Description'}</p>
            <ul className="mt-5 space-y-2 text-sm text-[color:var(--ncf-text)]">
              {features.split('|').filter(Boolean).map((feature) => <li key={feature}>+ {feature}</li>)}
            </ul>
          </div>
        );
      }
      case 'quote': {
        const [quote, author] = (element.content || '').split('\n');
        return (
          <blockquote {...sharedProps}>
            <p className="leading-8">"{quote || 'Citation'}"</p>
            <footer className="mt-3 text-sm font-semibold text-[color:var(--ncf-muted)]">{author || 'Auteur'}</footer>
          </blockquote>
        );
      }
      case 'list':
        return (
          <ul {...sharedProps} className={`${base} space-y-2`.trim()}>
            {(element.content || '').split('\n').filter(Boolean).map((item) => <li key={item} className="flex gap-2"><span className="font-bold text-[color:var(--ncf-accent)]">+</span><span>{item}</span></li>)}
          </ul>
        );
      case 'input':
        return (
          <input
            {...sharedProps}
            placeholder={element.content || 'Type here'}
            className={`${base} border border-slate-300`.trim()}
            onChange={(e) => onInlineEdit?.(element.id, 'content', e.target.value, { coalesceKey: `content:${element.id}` })}
            readOnly={previewMode || !selected}
            value={selected && !previewMode ? element.content : ''}
          />
        );
      case 'section':
        return <section {...sharedProps}><h2 className="text-2xl font-bold" contentEditable={!previewMode && selected} suppressContentEditableWarning onInput={onInlineInput}>{element.content}</h2></section>;
      case 'divider':
        return <div {...sharedProps} aria-hidden="true" />;
      case 'spacer':
        return <div {...sharedProps} aria-hidden="true" />;
      case 'navbar':
        return <nav {...sharedProps} contentEditable={!previewMode && selected} suppressContentEditableWarning onInput={onInlineInput}>{element.content}</nav>;
      case 'footer':
        return <footer {...sharedProps} contentEditable={!previewMode && selected} suppressContentEditableWarning onInput={onInlineInput}>{element.content}</footer>;
      default:
        return <div {...sharedProps}>{element.content}</div>;
    }
  };

  return (
    <div ref={rootRef} style={boxStyle} className="group relative inline-block max-w-full align-top">
      {renderNode()}
      {selected && !previewMode ? (
        <button type="button" data-ncf-control data-ncf-resize aria-label="Resize" onMouseDown={startResize} className="absolute -bottom-2 -right-2 h-4 w-4 cursor-se-resize rounded-sm border border-brand-700 bg-brand-500" />
      ) : null}
    </div>
  );
}
