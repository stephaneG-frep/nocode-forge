export default function ScreensPanel({
  screens,
  activeScreenId,
  onSelectScreen,
  onAddScreen,
  onRenameScreen,
  onDuplicateScreen,
  onDeleteScreen,
}) {
  return (
    <aside className="rounded-2xl border border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface)] p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--ncf-muted)]">Ecrans</h2>
        <button
          type="button"
          onClick={onAddScreen}
          className="rounded-lg bg-[color:var(--ncf-accent)] px-3 py-1.5 text-xs font-semibold text-white"
        >
          Ajouter
        </button>
      </div>

      <div className="space-y-2">
        {screens.map((screen) => {
          const active = screen.id === activeScreenId;
          return (
            <div
              key={screen.id}
              className={`rounded-xl border p-2 ${
                active
                  ? 'border-[color:var(--ncf-accent)] bg-[color:var(--ncf-surface-soft)]'
                  : 'border-[color:var(--ncf-surface-soft)]'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectScreen(screen.id)}
                className="w-full text-left text-sm font-semibold text-[color:var(--ncf-text)]"
              >
                {screen.name}
              </button>
              <p className="text-xs text-[color:var(--ncf-muted)]">{screen.elements?.length || 0} element(s)</p>
              {active ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  <button type="button" onClick={() => onRenameScreen(screen.id)} className="rounded-md border border-[color:var(--ncf-surface-soft)] px-2 py-1 text-[11px] font-semibold text-[color:var(--ncf-muted)]">Renommer</button>
                  <button type="button" onClick={() => onDuplicateScreen(screen.id)} className="rounded-md border border-[color:var(--ncf-surface-soft)] px-2 py-1 text-[11px] font-semibold text-[color:var(--ncf-muted)]">Copier</button>
                  <button type="button" onClick={() => onDeleteScreen(screen.id)} className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-700">Suppr.</button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
