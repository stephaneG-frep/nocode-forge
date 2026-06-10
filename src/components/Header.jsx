export default function Header({
  onPreview,
  onExport,
  onClear,
  onNewProject,
  onSaveProjectAs,
  onExportJson,
  onImportJson,
  onOpenThemeEditor,
  onDeleteTheme,
  onOpenHelp,
  previewMode,
  themeId,
  themes,
  onChangeTheme,
  projects,
  activeProjectId,
  onChangeProject,
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface)]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
        <h1 className="text-lg font-semibold text-[color:var(--ncf-text)] md:text-xl">NoCode Forge</h1>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={activeProjectId}
            onChange={(e) => onChangeProject(e.target.value)}
            className="rounded-xl border border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface-soft)] px-3 py-2 text-sm font-medium text-[color:var(--ncf-text)]"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <button onClick={onNewProject} className="rounded-xl border border-[color:var(--ncf-surface-soft)] px-3 py-2 text-sm font-medium text-[color:var(--ncf-text)] transition hover:bg-[color:var(--ncf-surface-soft)]">Nouveau projet</button>
          <button onClick={onSaveProjectAs} className="rounded-xl border border-[color:var(--ncf-surface-soft)] px-3 py-2 text-sm font-medium text-[color:var(--ncf-text)] transition hover:bg-[color:var(--ncf-surface-soft)]">Sauver sous</button>
          <button onClick={onExportJson} className="rounded-xl border border-[color:var(--ncf-surface-soft)] px-3 py-2 text-sm font-medium text-[color:var(--ncf-text)] transition hover:bg-[color:var(--ncf-surface-soft)]">Export JSON</button>
          <button onClick={onImportJson} className="rounded-xl border border-[color:var(--ncf-surface-soft)] px-3 py-2 text-sm font-medium text-[color:var(--ncf-text)] transition hover:bg-[color:var(--ncf-surface-soft)]">Import JSON</button>
          <select
            value={themeId}
            onChange={(e) => onChangeTheme(e.target.value)}
            className="rounded-xl border border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface-soft)] px-3 py-2 text-sm font-medium text-[color:var(--ncf-text)]"
          >
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>

          <button onClick={onOpenThemeEditor} className="rounded-xl border border-[color:var(--ncf-surface-soft)] px-3 py-2 text-sm font-medium text-[color:var(--ncf-text)] transition hover:bg-[color:var(--ncf-surface-soft)]">Themes</button>
          <button onClick={onDeleteTheme} className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100">Supprimer theme</button>
          <button onClick={onPreview} className="rounded-xl border border-[color:var(--ncf-surface-soft)] px-3 py-2 text-sm font-medium text-[color:var(--ncf-text)] transition hover:bg-[color:var(--ncf-surface-soft)]">{previewMode ? 'Quitter apercu' : 'Apercu'}</button>
          <button onClick={onExport} className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700">Exporter</button>
          <button onClick={onClear} className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100">Tout effacer</button>
          <button onClick={onOpenHelp} className="rounded-xl border border-[color:var(--ncf-surface-soft)] px-3 py-2 text-sm font-medium text-[color:var(--ncf-text)] transition hover:bg-[color:var(--ncf-surface-soft)]">Aide</button>
        </div>
      </div>
    </header>
  );
}
