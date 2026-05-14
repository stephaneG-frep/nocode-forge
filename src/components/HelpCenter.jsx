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
          <p>1. Ajoute des composants avec Add.</p>
          <p>2. Clique pour sélectionner un composant, Shift+clic pour multi-sélection.</p>
          <p>3. Modifie les propriétés dans le panneau de droite (appliquées à toute la sélection).</p>
          <p>4. Réordonne par drag-and-drop (mono sélection) ou Move up/down.</p>
          <p>5. Utilise la poignée pour redimensionner.</p>
          <p>6. Theme editor pour créer ou éditer des thèmes custom.</p>
          <p>7. Export Web ou Mobile (Expo) en ZIP.</p>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Raccourcis clavier</p>
          <div className="grid grid-cols-1 gap-2 text-sm text-slate-700 md:grid-cols-2">
            <p><kbd>Ctrl/Cmd + Z</kbd> Undo</p>
            <p><kbd>Ctrl/Cmd + Shift + Z</kbd> Redo</p>
            <p><kbd>Ctrl/Cmd + D</kbd> Dupliquer sélection</p>
            <p><kbd>Delete / Backspace</kbd> Supprimer sélection</p>
            <p><kbd>?</kbd> Ouvrir ce mode d'emploi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
