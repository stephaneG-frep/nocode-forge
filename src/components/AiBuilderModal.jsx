import { useEffect, useState } from 'react';

const examples = [
  'Je veux une appli de liste de courses',
  'Cree une app de taches avec planning',
  'Je veux une app sport avec entrainements',
  'Cree une app budget personnel',
  'Fais une app de recettes de cuisine',
  'Je veux une app immobilier',
];

const styleOptions = [
  { id: 'corporate', label: 'Sobre bleu', description: 'Simple, propre, professionnel.' },
  { id: 'midnight-blue', label: 'Sombre bleu', description: 'Fond sombre, style app moderne.' },
  { id: 'saas-light', label: 'Clair SaaS', description: 'Lumineux, doux, produit web.' },
  { id: 'mobile-premium', label: 'Mobile premium', description: 'Bleu frais, cartes nettes.' },
];

export default function AiBuilderModal({ open, onClose, onGenerate, onPrepare }) {
  const [prompt, setPrompt] = useState('Je veux une appli de liste de courses');
  const [mode, setMode] = useState('append');
  const [styleId, setStyleId] = useState('mobile-premium');
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    if (open) setPlan(null);
  }, [open]);

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    if (!prompt.trim()) return;
    if (!plan) {
      setPlan(onPrepare(prompt.trim()));
      return;
    }
    onGenerate(prompt.trim(), mode, styleId);
  };

  const resetPlan = (nextPrompt = prompt) => {
    setPrompt(nextPrompt);
    setPlan(null);
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/70 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="shrink-0 border-b border-slate-200 bg-slate-50 px-5 py-4">
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

        <form onSubmit={submit} className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-800">Ton idee</span>
            <textarea
              value={prompt}
              onChange={(event) => resetPlan(event.target.value)}
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
                  onClick={() => resetPlan(example)}
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

          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Style de l app</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {styleOptions.map((style) => (
                <label
                  key={style.id}
                  className={`rounded-xl border p-3 text-sm ${
                    styleId === style.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="ai-style"
                    checked={styleId === style.id}
                    onChange={() => setStyleId(style.id)}
                    className="mr-2"
                  />
                  <span className="font-semibold">{style.label}</span>
                  <span className={`mt-1 block text-xs ${styleId === style.id ? 'text-slate-200' : 'text-slate-500'}`}>
                    {style.description}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {plan ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
              <p className="font-black">Plan propose : {plan.name}</p>
              <p className="mt-1">{plan.summary}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-emerald-700">Ecrans crees</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {plan.screens.map((screen) => (
                  <span key={screen.name} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-800">
                    {screen.name} ({screen.count})
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-emerald-800">
                Si le plan te convient, clique sur Generer l app. Sinon modifie ton idee.
              </p>
            </div>
          ) : null}

          <div className="rounded-2xl bg-blue-50 p-3 text-sm text-blue-900">
            Cette IA est locale : pas de cle API, pas d internet, pas de cout. Elle reconnait surtout les idees comme courses,
            taches, boutique, client, restaurant, sport, budget, recettes, reservation, formation, sante et immobilier.
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Annuler
            </button>
            <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
              {plan ? 'Generer l app' : 'Preparer le plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
