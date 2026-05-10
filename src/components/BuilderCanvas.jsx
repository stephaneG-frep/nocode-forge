import { useState } from 'react';
import RenderElement from './RenderElement';

export default function BuilderCanvas({
  elements,
  selectedId,
  onSelect,
  onDeleteSelected,
  onReorder,
  onMoveSelectedUp,
  onMoveSelectedDown,
  onInlineEdit,
  previewMode,
}) {
  const [draggedId, setDraggedId] = useState(null);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Canvas</h2>
        <div className="flex items-center gap-2">
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
        className="min-h-[500px] rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 md:p-6"
      >
        {elements.length === 0 ? (
          <div className="grid min-h-[430px] place-items-center rounded-xl border border-dashed border-slate-300 bg-white/60 text-center text-slate-500">
            Add components to start building
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {elements.map((element) => (
              <div
                key={element.id}
                draggable={!previewMode}
                onDragStart={() => setDraggedId(element.id)}
                onDragOver={(e) => {
                  if (!previewMode) e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!previewMode && draggedId) {
                    onReorder(draggedId, element.id);
                  }
                  setDraggedId(null);
                }}
                onDragEnd={() => setDraggedId(null)}
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
