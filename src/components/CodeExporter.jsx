import { useMemo, useState } from 'react';

export default function CodeExporter({
  open,
  filesByTarget,
  onClose,
  onCopy,
  onDownloadZip,
}) {
  const [target, setTarget] = useState('web');
  const [activeFile, setActiveFile] = useState('src/App.jsx');

  const files = filesByTarget?.[target] || {};
  const fileNames = useMemo(() => Object.keys(files), [files]);
  const safeActiveFile = fileNames.includes(activeFile) ? activeFile : fileNames[0];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4">
      <div className="h-[85vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
          <h3 className="text-lg font-semibold text-slate-900">Code export</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTarget('web')}
              className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                target === 'web' ? 'bg-slate-900 text-white' : 'border border-slate-300 text-slate-700'
              }`}
            >
              Web (React + Tailwind)
            </button>
            <button
              onClick={() => setTarget('mobile')}
              className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                target === 'mobile'
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-300 text-slate-700'
              }`}
            >
              Mobile (Expo)
            </button>
            <button
              onClick={() => onCopy(target, safeActiveFile)}
              className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Copy file
            </button>
            <button
              onClick={() => onDownloadZip(target)}
              className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Download ZIP
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>

        <div className="grid h-[calc(85vh-72px)] grid-cols-1 md:grid-cols-[280px_1fr]">
          <aside className="border-r border-slate-200 bg-slate-50 p-2">
            {fileNames.map((file) => (
              <button
                key={file}
                onClick={() => setActiveFile(file)}
                className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm ${
                  safeActiveFile === file
                    ? 'bg-white font-semibold text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:bg-white'
                }`}
              >
                {file}
              </button>
            ))}
          </aside>

          <pre className="h-full overflow-auto bg-slate-900 p-4 text-sm text-slate-100">
            <code>{(files && files[safeActiveFile]) || ''}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
