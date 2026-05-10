import BuilderCanvas from './BuilderCanvas';

export default function PreviewModal({ open, onClose, elements }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/60 p-4">
      <div className="h-[90vh] w-full max-w-6xl overflow-auto rounded-3xl bg-white p-4 shadow-2xl md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Preview mode</h3>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
        <BuilderCanvas
          elements={elements}
          selectedId={null}
          onSelect={() => {}}
          onDeleteSelected={() => {}}
          previewMode
        />
      </div>
    </div>
  );
}
