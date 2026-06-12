import { useState } from 'react';

const examples = [
  'Ajoute une section statistiques',
  'Rends cet ecran plus professionnel',
  'Ajoute une barre de recherche',
  'Ajoute un formulaire de contact',
  'Ajoute une navigation basse',
  'Passe en theme sombre bleu',
];

export default function AiModifyModal({ open, onClose, onModify, screenName }) {
  const [prompt, setPrompt] = useState('Ajoute une section statistiques');

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    if (!prompt.trim()) return;
    onModify(prompt.trim());
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/70 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-900">Modifier avec IA locale</h3>
              <p className="mt-1 text-sm text-slate-600">
                L IA ajoute des blocs sur l ecran actuel : <span className="font-semibold">{screenName}</span>.
              </p>
            </div>
            <button onClick={onClose} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white">
              Fermer
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 p-5">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-800">Ce que tu veux changer</span>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              placeholder="Ex: Ajoute une section statistiques et rends l ecran plus professionnel"
            />
          </label>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Exemples rapides</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setPrompt(example)}
                  className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-blue-50 p-3 text-sm text-blue-900">
            Ce mode ne remplace pas ton app. Il ajoute des elements utiles sur l ecran ouvert.
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Annuler
            </button>
            <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
              Modifier l ecran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
