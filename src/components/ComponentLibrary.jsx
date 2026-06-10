import { useMemo, useState } from 'react';
import { componentLibrary, templateLibrary } from '../utils/defaultComponents';

const allCategory = 'Tout';

export default function ComponentLibrary({ onAdd, onAddTemplate }) {
  const [activeCategory, setActiveCategory] = useState(allCategory);

  const categories = useMemo(
    () => [allCategory, ...Array.from(new Set(componentLibrary.map((item) => item.category)))],
    []
  );
  const visibleItems = activeCategory === allCategory
    ? componentLibrary
    : componentLibrary.filter((item) => item.category === activeCategory);

  return (
    <aside className="max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface)] p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[color:var(--ncf-muted)]">
        Bibliotheque
      </h2>

      <div className="mb-5 rounded-2xl border border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface-soft)] p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--ncf-muted)]">Modeles rapides</p>
        <div className="space-y-2">
          {templateLibrary.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onAddTemplate?.(template.id)}
              className="w-full rounded-xl border border-[color:var(--ncf-surface)] bg-[color:var(--ncf-surface)] px-3 py-2 text-left transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <span className="block text-sm font-semibold text-[color:var(--ncf-text)]">{template.label}</span>
              <span className="block text-xs text-[color:var(--ncf-muted)]">{template.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
              activeCategory === category
                ? 'bg-[color:var(--ncf-accent)] text-white'
                : 'border border-[color:var(--ncf-surface-soft)] text-[color:var(--ncf-muted)]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {visibleItems.map((item) => (
          <div
            key={item.type}
            className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface-soft)] px-3 py-2"
          >
            <div className="min-w-0">
              <p className="font-medium text-[color:var(--ncf-text)]">{item.label}</p>
              <p className="text-xs text-[color:var(--ncf-muted)]">{item.description}</p>
            </div>
            <button
              onClick={() => onAdd(item.type)}
              className="shrink-0 rounded-lg bg-[color:var(--ncf-accent)] px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
            >
              Ajouter
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
