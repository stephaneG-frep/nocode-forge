import { useRef } from 'react';

const classesFromProps = (element) => {
  const p = element.props || {};
  const visibility = [
    p.visibleMobile === false ? 'max-sm:hidden' : '',
    p.visibleTablet === false ? 'sm:max-lg:hidden' : '',
    p.visibleDesktop === false ? 'lg:hidden' : '',
  ];
  return [p.textColor, p.backgroundColor, p.padding, p.radius, p.fontSize, ...visibility, element.className]
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
  const base = `${classesFromProps(element)} min-w-0 max-w-full break-words ${selectedRing}`.trim();

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
      case 'appTopBar': {
        const [hello, title] = (element.content || '').split('\n');
        return (
          <header {...sharedProps} className={`${base} flex items-center justify-between shadow-sm`.trim()}>
            <div className="min-w-0">
              <p className="text-sm opacity-80">{hello || 'Bonjour'}</p>
              <h2 className="break-words text-xl font-black">{title || 'Ecran'}</h2>
            </div>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/20 font-bold">A</div>
          </header>
        );
      }
      case 'appBottomNav': {
        const items = (element.content || '').split('\n').filter(Boolean).slice(0, 5);
        return (
          <nav {...sharedProps} className={`${base} border border-[color:var(--ncf-surface-soft)] shadow-sm`.trim()}>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(items.length, 1)}, minmax(0, 1fr))` }}>
              {items.map((item, index) => (
                <div key={item} className={`min-w-0 rounded-2xl px-2 py-2 text-center text-xs font-semibold ${index === 0 ? 'bg-[color:var(--ncf-accent)] text-white' : 'text-[color:var(--ncf-muted)]'}`}>
                  <span className="mx-auto mb-1 block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                  <span className="block truncate">{item}</span>
                </div>
              ))}
            </div>
          </nav>
        );
      }
      case 'appListItem': {
        const [title, status, meta] = (element.content || '').split('\n');
        return (
          <div {...sharedProps} className={`${base} flex items-center gap-3 border border-[color:var(--ncf-surface-soft)] shadow-sm`.trim()}>
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[color:var(--ncf-surface-soft)] font-bold text-[color:var(--ncf-accent)]">{(title || 'A').slice(0, 1)}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{title || 'Element'}</p>
              <p className="truncate text-sm text-[color:var(--ncf-muted)]">{status || 'Statut'}</p>
            </div>
            <span className="shrink-0 rounded-full bg-[color:var(--ncf-surface-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--ncf-muted)]">{meta || 'Info'}</span>
          </div>
        );
      }
      case 'appActionCard': {
        const [title, text, action] = (element.content || '').split('\n');
        return (
          <div {...sharedProps} className={`${base} border border-[color:var(--ncf-surface-soft)] shadow-sm`.trim()}>
            <p className="text-lg font-black">{title || 'Action'}</p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--ncf-muted)]">{text || 'Description'}</p>
            <button type="button" className="mt-4 rounded-2xl bg-[color:var(--ncf-accent)] px-4 py-2 text-sm font-semibold text-white">{action || 'Ouvrir'}</button>
          </div>
        );
      }
      case 'appSearch':
        return (
          <div {...sharedProps} className={`${base} flex items-center gap-3 border border-[color:var(--ncf-surface-soft)] text-[color:var(--ncf-muted)] shadow-sm`.trim()}>
            <span className="text-lg">⌕</span>
            <span className="truncate">{element.content || 'Rechercher'}</span>
          </div>
        );
      case 'appFab':
        return <button {...sharedProps} className={`${base} grid place-items-center text-2xl font-black shadow-xl`.trim()}>{element.content || '+'}</button>;
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
            <h3 className="min-w-0 break-words text-lg font-semibold">{title || 'Card title'}</h3>
            <p className="mt-2 min-w-0 break-words text-slate-600">{description || 'Card description'}</p>
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
                <div key={`${item.value}-${index}`} className="min-w-0 rounded-2xl bg-[color:var(--ncf-surface-soft)] p-4 text-center">
                  <p className="break-words text-3xl font-black text-[color:var(--ncf-accent-strong)]">{item.value}</p>
                  <p className="mt-1 break-words text-sm text-[color:var(--ncf-muted)]">{item.label}</p>
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
            <p className="break-words text-lg font-medium leading-8 text-[color:var(--ncf-text)]">"{quote || 'Avis client'}"</p>
            <figcaption className="mt-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--ncf-accent)] font-bold text-white">{(name || 'A').slice(0, 1)}</div>
              <div className="min-w-0">
                <p className="font-semibold text-[color:var(--ncf-text)]">{name || 'Nom du client'}</p>
                <p className="break-words text-sm text-[color:var(--ncf-muted)]">{role || 'Role'}</p>
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
            {(element.content || '').split('\n').filter(Boolean).map((item) => <li key={item} className="flex min-w-0 gap-2"><span className="shrink-0 font-bold text-[color:var(--ncf-accent)]">+</span><span className="min-w-0 break-words">{item}</span></li>)}
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
      case 'email':
      case 'phone':
        return <input {...sharedProps} type={element.type === 'email' ? 'email' : 'tel'} placeholder={element.content} className={`${base} border border-slate-300`.trim()} readOnly />;
      case 'textarea':
        return <textarea {...sharedProps} placeholder={element.content} className={`${base} border border-slate-300`.trim()} readOnly />;
      case 'checkbox':
        return <label {...sharedProps} className={`${base} flex items-center gap-3`.trim()}><input type="checkbox" readOnly /><span>{element.content}</span></label>;
      case 'select': {
        const [placeholder, ...options] = (element.content || '').split('\n').filter(Boolean);
        return <select {...sharedProps} className={`${base} border border-slate-300`.trim()} value="" onChange={() => {}}><option value="">{placeholder || 'Choisir'}</option>{options.map((option) => <option key={option}>{option}</option>)}</select>;
      }
      case 'form': {
        const [title, name, email, message, button] = (element.content || '').split('\n');
        return (
          <form {...sharedProps} className={`${base} space-y-3`.trim()}>
            <h3 className="text-xl font-bold">{title || 'Contact'}</h3>
            <input className="w-full rounded-xl border border-slate-300 px-4 py-3" placeholder={name || 'Nom'} readOnly />
            <input className="w-full rounded-xl border border-slate-300 px-4 py-3" placeholder={email || 'Email'} readOnly />
            <textarea className="h-28 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder={message || 'Message'} readOnly />
            <button type="button" className="rounded-xl bg-[color:var(--ncf-accent)] px-4 py-3 font-semibold text-white">{button || 'Envoyer'}</button>
          </form>
        );
      }
      case 'faq': {
        const lines = (element.content || '').split('\n').filter(Boolean);
        const items = [0, 2, 4].map((start) => ({ q: lines[start], a: lines[start + 1] }));
        return <div {...sharedProps} className={`${base} space-y-3`.trim()}>{items.map((item, index) => <details key={index} className="rounded-xl bg-[color:var(--ncf-surface-soft)] p-4" open={index === 0}><summary className="cursor-pointer font-semibold">{item.q || 'Question'}</summary><p className="mt-2 text-sm text-[color:var(--ncf-muted)]">{item.a || 'Reponse'}</p></details>)}</div>;
      }
      case 'gallery': {
        const images = (element.content || '').split('\n').filter(Boolean);
        return <div {...sharedProps} className={`${base} grid gap-3 sm:grid-cols-3`.trim()}>{images.slice(0, 3).map((src) => <img key={src} src={src} alt="gallery" className="h-36 w-full rounded-2xl object-cover" />)}</div>;
      }
      case 'team': {
        const lines = (element.content || '').split('\n').filter(Boolean);
        const people = [0, 2, 4].map((start) => ({ name: lines[start], role: lines[start + 1] }));
        return <div {...sharedProps}><div className="grid gap-4 sm:grid-cols-3">{people.map((person, index) => <div key={index} className="min-w-0 rounded-2xl bg-[color:var(--ncf-surface-soft)] p-4 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[color:var(--ncf-accent)] font-bold text-white">{(person.name || 'A').slice(0, 1)}</div><p className="mt-3 break-words font-semibold">{person.name || 'Nom'}</p><p className="break-words text-sm text-[color:var(--ncf-muted)]">{person.role || 'Role'}</p></div>)}</div></div>;
      }
      case 'features': {
        const lines = (element.content || '').split('\n').filter(Boolean);
        const items = [0, 2, 4].map((start) => ({ title: lines[start], text: lines[start + 1] }));
        return <div {...sharedProps}><div className="grid gap-4 md:grid-cols-3">{items.map((item, index) => <div key={index} className="min-w-0 rounded-2xl bg-[color:var(--ncf-surface-soft)] p-4"><p className="break-words font-bold">{item.title || 'Avantage'}</p><p className="mt-2 break-words text-sm text-[color:var(--ncf-muted)]">{item.text || 'Description'}</p></div>)}</div></div>;
      }
      case 'cta': {
        const [title, text, button] = (element.content || '').split('\n');
        return <section {...sharedProps} className={`${base} text-center`.trim()}><h2 className="text-3xl font-black">{title || 'Titre'}</h2><p className="mx-auto mt-3 max-w-xl opacity-85">{text || 'Description'}</p><button className="mt-5 rounded-xl bg-white px-5 py-3 font-semibold text-[color:var(--ncf-accent-strong)]">{button || 'Commencer'}</button></section>;
      }
      case 'contact-block': {
        const [title, email, phone, button] = (element.content || '').split('\n');
        return <div {...sharedProps}><h3 className="text-2xl font-bold">{title || 'Contact'}</h3><p className="mt-3 text-[color:var(--ncf-muted)]">{email || 'email'}</p><p className="text-[color:var(--ncf-muted)]">{phone || 'telephone'}</p><button className="mt-5 rounded-xl bg-[color:var(--ncf-accent)] px-4 py-3 font-semibold text-white">{button || 'Envoyer'}</button></div>;
      }
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
    <div ref={rootRef} style={boxStyle} className="group relative block w-full min-w-0 max-w-full align-top">
      {renderNode()}
      {selected && !previewMode ? (
        <button type="button" data-ncf-control data-ncf-resize aria-label="Resize" onMouseDown={startResize} className="absolute -bottom-2 -right-2 h-4 w-4 cursor-se-resize rounded-sm border border-brand-700 bg-brand-500" />
      ) : null}
    </div>
  );
}
