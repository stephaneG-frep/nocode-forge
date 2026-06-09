import { componentLibrary } from '../utils/defaultComponents';

export default function ComponentLibrary({ onAdd }) {
  return (
    <aside className="rounded-2xl border border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface)] p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[color:var(--ncf-muted)]">
        Bibliotheque
      </h2>
      <div className="space-y-3">
        {componentLibrary.map((item) => (
          <div
            key={item.type}
            className="flex items-center justify-between rounded-xl border border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface-soft)] px-3 py-2"
          >
            <span className="font-medium text-[color:var(--ncf-text)]">{item.label}</span>
            <button
              onClick={() => onAdd(item.type)}
              className="rounded-lg bg-[color:var(--ncf-accent)] px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
            >
              Ajouter
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
