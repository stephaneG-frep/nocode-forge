import RenderElement from './RenderElement';
import { useEffect, useState } from 'react';

const previewFrames = {
  desktop: { label: 'Ordinateur', width: '100%', shell: 'bg-white', inner: 'min-h-[500px]' },
  phone: { label: 'Telephone', width: 390, shell: 'rounded-[2.2rem] border-[10px] border-slate-950 bg-slate-950 p-2 shadow-2xl', inner: 'min-h-[720px] rounded-[1.6rem] bg-white' },
  tablet: { label: 'Tablette', width: 760, shell: 'rounded-[1.4rem] border-[8px] border-slate-800 bg-slate-800 p-2 shadow-2xl', inner: 'min-h-[680px] rounded-xl bg-white' },
};

export default function PreviewModal({ open, onClose, elements, screens = [], activeScreenId }) {
  const [frameId, setFrameId] = useState('desktop');
  const [previewScreenId, setPreviewScreenId] = useState(activeScreenId);
  const frame = previewFrames[frameId] || previewFrames.desktop;
  const currentScreen = screens.find((screen) => screen.id === previewScreenId) || screens.find((screen) => screen.id === activeScreenId) || screens[0];
  const visibleElements = currentScreen?.elements || elements;

  useEffect(() => {
    if (open) setPreviewScreenId(activeScreenId);
  }, [open, activeScreenId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/60 p-4">
      <div className="h-[90vh] w-full max-w-6xl overflow-auto rounded-3xl bg-slate-100 p-4 shadow-2xl md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Apercu</h3>
            <p className="text-sm text-slate-500">Verifie ton projet sur ordinateur, telephone ou tablette.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {screens.length > 0 ? (
              <select
                value={currentScreen?.id || ''}
                onChange={(e) => setPreviewScreenId(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
              >
                {screens.map((screen) => (
                  <option key={screen.id} value={screen.id}>{screen.name}</option>
                ))}
              </select>
            ) : null}
            {Object.entries(previewFrames).map(([id, item]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFrameId(id)}
                className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                  frameId === id ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Fermer</button>
        </div>

        <div className="grid place-items-center rounded-3xl bg-slate-200/70 p-4 md:p-8">
          <div className={frame.shell} style={{ width: frame.width, maxWidth: '100%' }}>
            {frameId !== 'desktop' ? (
              <div className="mx-auto mb-2 h-1.5 w-20 rounded-full bg-slate-700" />
            ) : null}
            <div className={`${frame.inner} overflow-auto p-4 md:p-6`}>
              {visibleElements.length === 0 ? (
                <div className="grid min-h-[430px] place-items-center rounded-xl border border-dashed border-slate-300 bg-white/60 text-center text-slate-500">Ajoute un composant pour commencer</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {visibleElements.map((element) => (
                    <RenderElement
                      key={element.id}
                      element={element}
                      selected={false}
                      onSelect={() => {}}
                      onInlineEdit={() => {}}
                      onNavigate={setPreviewScreenId}
                      previewMode
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
