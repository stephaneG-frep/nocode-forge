const keys = [
  '--ncf-app-bg',
  '--ncf-surface',
  '--ncf-surface-soft',
  '--ncf-text',
  '--ncf-muted',
  '--ncf-accent',
  '--ncf-accent-strong',
];

const labels = {
  '--ncf-app-bg': 'App background',
  '--ncf-surface': 'Surface',
  '--ncf-surface-soft': 'Surface soft',
  '--ncf-text': 'Text',
  '--ncf-muted': 'Muted text',
  '--ncf-accent': 'Accent',
  '--ncf-accent-strong': 'Accent strong',
};

export default function ThemeEditorModal({
  open,
  draftName,
  draftVars,
  onNameChange,
  onVarChange,
  onClose,
  onSave,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Theme Editor</h3>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <label className="mb-4 block space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Theme name</span>
          <input
            value={draftName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="My Custom Theme"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800"
          />
        </label>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {keys.map((key) => (
            <label key={key} className="block rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                {labels[key]}
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draftVars[key] || '#000000'}
                  onChange={(e) => onVarChange(key, e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded border border-slate-300 bg-white"
                />
                <input
                  value={draftVars[key] || ''}
                  onChange={(e) => onVarChange(key, e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                />
              </div>
            </label>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onSave}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Save theme
          </button>
        </div>
      </div>
    </div>
  );
}
