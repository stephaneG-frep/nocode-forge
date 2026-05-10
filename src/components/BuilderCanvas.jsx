import { useState } from 'react';
import RenderElement from './RenderElement';

export default function BuilderCanvas({
  elements,
  selectedId,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onDuplicateSelected,
  onSelect,
  onDeleteSelected,
  onReorder,
  onMoveSelectedUp,
  onMoveSelectedDown,
  onInlineEdit,
  previewMode,
}) {
  const [draggedId, setDraggedId] = useState(null);
  const [dropHint, setDropHint] = useState(null);

  const clearDragState = () => {
    setDraggedId(null);
    setDropHint(null);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Canvas</h2>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo || previewMode}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo || previewMode}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Redo
          </button>
          <button
            onClick={onDuplicateSelected}
            disabled={!selectedId || previewMode}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Duplicate
          </button>
          <button
            onClick={onMoveSelectedUp}
            disabled={!selectedId || previewMode}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Move up
          </button>
          <button
            onClick={onMoveSelectedDown}
            disabled={!selectedId || previewMode}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Move down
          </button>
          <button
            onClick={onDeleteSelected}
            disabled={!selectedId || previewMode}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Delete selected
          </button>
        </div>
      </div>

      <div
        onClick={() => !previewMode && onSelect(null)}
        onDragOver={(e) => {
          if (!previewMode) e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          clearDragState();
        }}
        className="min-h-[500px] rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 md:p-6"
      >
        {elements.length === 0 ? (
          <div className="grid min-h-[430px] place-items-center rounded-xl border border-dashed border-slate-300 bg-white/60 text-center text-slate-500">
            Add components to start building
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {elements.map((element) => {
              const showBefore = dropHint?.targetId === element.id && dropHint?.placement === 'before';
              const showAfter = dropHint?.targetId === element.id && dropHint?.placement === 'after';

              return (
                <div key={element.id} className="relative">
                  {showBefore ? <div className="mb-2 h-1 rounded-full bg-brand-500" /> : null}

                  <div
                    draggable={!previewMode}
                    onDragStart={() => setDraggedId(element.id)}
                    onDragOver={(e) => {
                      if (previewMode) return;
                      e.preventDefault();
                      const rect = e.currentTarget.getBoundingClientRect();
                      const midpoint = rect.top + rect.height / 2;
                      const placement = e.clientY < midpoint ? 'before' : 'after';
                      setDropHint({ targetId: element.id, placement });
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (!previewMode && draggedId && dropHint) {
                        onReorder(draggedId, dropHint.targetId, dropHint.placement);
                      }
                      clearDragState();
                    }}
                    onDragEnd={clearDragState}
                    className={draggedId === element.id ? 'opacity-60' : ''}
                  >
                    <RenderElement
                      element={element}
                      selected={selectedId === element.id}
                      onSelect={onSelect}
                      onInlineEdit={onInlineEdit}
                      previewMode={previewMode}
                    />
                  </div>

                  {showAfter ? <div className="mt-2 h-1 rounded-full bg-brand-500" /> : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
