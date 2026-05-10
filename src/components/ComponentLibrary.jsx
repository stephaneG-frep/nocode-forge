import { componentLibrary } from '../utils/defaultComponents';

export default function ComponentLibrary({ onAdd }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Component library
      </h2>
      <div className="space-y-3">
        {componentLibrary.map((item) => (
          <div
            key={item.type}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <span className="font-medium text-slate-800">{item.label}</span>
            <button
              onClick={() => onAdd(item.type)}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
