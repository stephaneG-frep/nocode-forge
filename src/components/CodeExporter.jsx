export default function CodeExporter({ open, code, onClose, onCopy }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4">
      <div className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h3 className="text-lg font-semibold text-slate-900">Generated React + Tailwind code</h3>
          <div className="flex gap-2">
            <button
              onClick={onCopy}
              className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Copy code
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>
        <pre className="max-h-[70vh] overflow-auto bg-slate-900 p-4 text-sm text-slate-100">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
