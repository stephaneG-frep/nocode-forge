import RenderElement from './RenderElement';

export default function PreviewModal({ open, onClose, elements }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/60 p-4">
      <div className="h-[90vh] w-full max-w-6xl overflow-auto rounded-3xl bg-white p-4 shadow-2xl md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Preview mode</h3>
          <button onClick={onClose} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Close</button>
        </div>

        <div className="min-h-[500px] rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 md:p-6">
          {elements.length === 0 ? (
            <div className="grid min-h-[430px] place-items-center rounded-xl border border-dashed border-slate-300 bg-white/60 text-center text-slate-500">Add components to start building</div>
          ) : (
            <div className="flex flex-col gap-4">
              {elements.map((element) => (
                <RenderElement key={element.id} element={element} selected={false} onSelect={() => {}} onInlineEdit={() => {}} previewMode />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
