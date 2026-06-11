export default function HelpCenter({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/60 p-4">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">Mode d'emploi NoCode Forge</h3>
          <button onClick={onClose} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Fermer</button>
        </div>

        <div className="space-y-3 text-sm text-slate-700">
          <p>1. Commence avec un modele d'app ou ajoute des composants avec Ajouter.</p>
          <p>2. Clique pour sélectionner un composant, Shift+clic pour multi-sélection.</p>
          <p>3. Modifie les propriétés dans le panneau de droite (appliquées à toute la sélection).</p>
          <p>4. Utilise la categorie Application pour creer une barre d'app, une navigation basse, des listes et des actions.</p>
          <p>5. En mode Libre, clique et glisse directement un element pour le deplacer.</p>
          <p>6. Utilise la poignée dans le coin pour redimensionner.</p>
          <p>7. Apercu permet de tester le rendu telephone, tablette ou ordinateur.</p>
          <p>8. Exporter permet de recuperer le code Web ou Mobile.</p>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Raccourcis clavier</p>
          <div className="grid grid-cols-1 gap-2 text-sm text-slate-700 md:grid-cols-2">
            <p><kbd>Ctrl/Cmd + Z</kbd> Annuler</p>
            <p><kbd>Ctrl/Cmd + Shift + Z</kbd> Retablir</p>
            <p><kbd>Ctrl/Cmd + D</kbd> Dupliquer sélection</p>
            <p><kbd>Suppr / Retour</kbd> Supprimer selection</p>
            <p><kbd>Fleches</kbd> Deplacer en mode Libre</p>
            <p><kbd>Shift + fleches</kbd> Deplacer plus vite</p>
            <p><kbd>?</kbd> Ouvrir ce mode d'emploi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
