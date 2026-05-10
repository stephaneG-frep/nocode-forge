const classesFromProps = (element) => {
  const p = element.props || {};
  return [
    p.textColor,
    p.backgroundColor,
    p.padding,
    p.radius,
    p.fontSize,
    element.className,
  ]
    .filter(Boolean)
    .join(' ');
};

const editableTypes = new Set(['text', 'button', 'section', 'navbar', 'footer']);

export default function RenderElement({
  element,
  selected,
  onSelect,
  onInlineEdit,
  previewMode,
}) {
  const selectedRing = selected && !previewMode ? 'ring-2 ring-brand-500 ring-offset-2' : '';
  const base = `${classesFromProps(element)} ${selectedRing}`.trim();

  const onContainerClick = (e) => {
    if (!previewMode) {
      e.stopPropagation();
      onSelect(element.id);
    }
  };

  const onInlineInput = (e) => {
    if (previewMode || !onInlineEdit) return;
    onInlineEdit(element.id, 'content', e.currentTarget.textContent || '');
  };

  const sharedProps = {
    className: base,
    onClick: onContainerClick,
  };

  switch (element.type) {
    case 'text':
      return (
        <p
          {...sharedProps}
          contentEditable={!previewMode && selected}
          suppressContentEditableWarning
          onInput={onInlineInput}
        >
          {element.content}
        </p>
      );
    case 'button':
      return (
        <button
          {...sharedProps}
          contentEditable={!previewMode && selected}
          suppressContentEditableWarning
          onInput={onInlineInput}
        >
          {element.content}
        </button>
      );
    case 'image':
      return <img {...sharedProps} src={element.content} alt="builder visual" />;
    case 'card': {
      const [title, description] = (element.content || '').split('\n');
      return (
        <div {...sharedProps}>
          <h3 className="text-lg font-semibold">{title || 'Card title'}</h3>
          <p className="mt-2 text-slate-600">{description || 'Card description'}</p>
          {!previewMode && selected ? (
            <p className="mt-3 text-xs text-slate-400">Edit title/description from Properties panel (line break for split).</p>
          ) : null}
        </div>
      );
    }
    case 'input':
      return (
        <input
          {...sharedProps}
          placeholder={element.content || 'Type here'}
          className={`${base} border border-slate-300`.trim()}
          onChange={(e) => onInlineEdit?.(element.id, 'content', e.target.value)}
          readOnly={previewMode || !selected}
          value={selected && !previewMode ? element.content : ''}
        />
      );
    case 'section':
      return (
        <section {...sharedProps}>
          <h2
            className="text-2xl font-bold"
            contentEditable={!previewMode && selected}
            suppressContentEditableWarning
            onInput={onInlineInput}
          >
            {element.content}
          </h2>
        </section>
      );
    case 'navbar':
      return (
        <nav
          {...sharedProps}
          contentEditable={!previewMode && selected}
          suppressContentEditableWarning
          onInput={onInlineInput}
        >
          {element.content}
        </nav>
      );
    case 'footer':
      return (
        <footer
          {...sharedProps}
          contentEditable={!previewMode && selected}
          suppressContentEditableWarning
          onInput={onInlineInput}
        >
          {element.content}
        </footer>
      );
    default:
      return (
        <div
          {...sharedProps}
          contentEditable={!previewMode && selected && editableTypes.has(element.type)}
          suppressContentEditableWarning
          onInput={onInlineInput}
        >
          {element.content}
        </div>
      );
  }
}
