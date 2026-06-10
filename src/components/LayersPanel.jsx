const labels = {
  text: 'Texte',
  hero: 'Grand titre',
  button: 'Bouton',
  badge: 'Badge',
  image: 'Image',
  card: 'Carte',
  stats: 'Chiffres',
  testimonial: 'Avis client',
  pricing: 'Prix',
  quote: 'Citation',
  list: 'Liste',
  input: 'Champ',
  email: 'Email',
  phone: 'Telephone',
  textarea: 'Grand champ',
  checkbox: 'Case',
  select: 'Liste choix',
  form: 'Formulaire',
  faq: 'FAQ',
  gallery: 'Galerie',
  team: 'Equipe',
  features: 'Avantages',
  cta: 'Action',
  'contact-block': 'Contact',
  section: 'Section',
  navbar: 'Menu',
  footer: 'Pied de page',
};

export default function LayersPanel({ elements, selectedIds, onSelect }) {
  return (
    <aside className="rounded-2xl border border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface)] p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--ncf-muted)]">Elements</h2>
      {elements.length === 0 ? (
        <p className="text-sm text-[color:var(--ncf-muted)]">Aucun element pour le moment.</p>
      ) : (
        <div className="max-h-56 space-y-2 overflow-y-auto">
          {elements.map((element, index) => {
            const selected = selectedIds.includes(element.id);
            const title = (element.content || labels[element.type] || element.type).split('\n')[0];
            return (
              <button
                key={element.id}
                type="button"
                onClick={(event) => onSelect(element.id, event.shiftKey)}
                className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                  selected
                    ? 'border-[color:var(--ncf-accent)] bg-[color:var(--ncf-surface-soft)] text-[color:var(--ncf-text)]'
                    : 'border-[color:var(--ncf-surface-soft)] text-[color:var(--ncf-muted)] hover:bg-[color:var(--ncf-surface-soft)]'
                }`}
              >
                <span className="block font-semibold">{index + 1}. {labels[element.type] || element.type}</span>
                <span className="block truncate text-xs opacity-75">{title}</span>
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
}
