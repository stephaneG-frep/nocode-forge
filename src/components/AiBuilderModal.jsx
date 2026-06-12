import { useState } from 'react';

const examples = [
  'Je veux une appli de liste de courses',
  'Cree une app de taches avec planning',
  'Je veux une app boutique avec panier',
  'Fais une app client avec commandes et profil',
];

export default function AiBuilderModal({ open, onClose, onGenerate }) {
  const [prompt, setPrompt] = useState('Je veux une appli de liste de courses');
  const [mode, setMode] = useState('append');

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    if (!prompt.trim()) return;
    onGenerate(prompt.trim(), mode);
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/70 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-900">Creer avec IA locale</h3>
              <p className="mt-1 text-sm text-slate-600">
                Decris ton app. NoCode Forge fabrique les ecrans avec les composants existants.
              </p>
            </div>
            <button onClick={onClose} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white">
              Fermer
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 p-5">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-800">Ton idee</span>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              placeholder="Ex: Je veux une appli de liste de courses avec categories et ajout d article"
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

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Ou mettre le resultat ?</p>
            <label className="mb-2 flex items-center gap-2 text-sm text-slate-700">
              <input type="radio" name="ai-mode" checked={mode === 'append'} onChange={() => setMode('append')} />
              Ajouter les ecrans a ce projet
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="radio" name="ai-mode" checked={mode === 'replace'} onChange={() => setMode('replace')} />
              Remplacer les ecrans du projet actuel
            </label>
          </div>

          <div className="rounded-2xl bg-blue-50 p-3 text-sm text-blue-900">
            Cette IA est locale : pas de cle API, pas d internet, pas de cout. Elle reconnait surtout les idees comme courses,
            taches, boutique, client et restaurant.
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Annuler
            </button>
            <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
              Generer l app
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
