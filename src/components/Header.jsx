export default function Header({ onPreview, onExport, onClear, previewMode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 py-3 md:px-6">
        <h1 className="text-lg font-semibold text-slate-900 md:text-xl">NoCode Forge</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onPreview}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            {previewMode ? 'Exit preview' : 'Preview'}
          </button>
          <button
            onClick={onExport}
            className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Export code
          </button>
          <button
            onClick={onClear}
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
          >
            Clear canvas
          </button>
        </div>
      </div>
    </header>
  );
}
