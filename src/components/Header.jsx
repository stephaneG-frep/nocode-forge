export default function Header({
  onPreview,
  onExport,
  onClear,
  onOpenThemeEditor,
  onOpenHelp,
  previewMode,
  themeId,
  themes,
  onChangeTheme,
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
        <h1 className="text-lg font-semibold text-slate-900 md:text-xl">NoCode Forge</h1>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={themeId}
            onChange={(e) => onChangeTheme(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
          >
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenThemeEditor}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Theme editor
          </button>

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
          <button
            onClick={onOpenHelp}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Help
          </button>
        </div>
      </div>
    </header>
  );
}
