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
      case 'button':
        return <button {...sharedProps} contentEditable={!previewMode && selected} suppressContentEditableWarning onInput={onInlineInput}>{element.content}</button>;
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
        <button type="button" aria-label="Resize" onMouseDown={startResize} className="absolute -bottom-2 -right-2 h-4 w-4 cursor-se-resize rounded-sm border border-brand-700 bg-brand-500" />
      ) : null}
    </div>
  );
}
