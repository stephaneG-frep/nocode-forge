const textColorOptions = [
  'text-[color:var(--ncf-text)]',
  'text-[color:var(--ncf-muted)]',
  'text-white',
  'text-slate-900',
  'text-slate-500',
];
const backgroundOptions = [
  'bg-[color:var(--ncf-surface)]',
  'bg-[color:var(--ncf-surface-soft)]',
  'bg-[color:var(--ncf-accent)]',
  'bg-[color:var(--ncf-accent-strong)]',
  'bg-white',
  'bg-slate-100',
  'bg-slate-900',
];
const fontSizeOptions = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'];
const paddingOptions = ['p-0', 'p-2', 'p-4', 'p-6', 'px-4 py-2', 'px-6 py-3'];
const radiusOptions = ['rounded-none', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl'];

const optionLabels = {
  'text-[color:var(--ncf-text)]': 'Texte normal',
  'text-[color:var(--ncf-muted)]': 'Texte discret',
  'text-white': 'Blanc',
  'text-slate-900': 'Tres fonce',
  'text-slate-500': 'Gris',
  'bg-[color:var(--ncf-surface)]': 'Fond principal',
  'bg-[color:var(--ncf-surface-soft)]': 'Fond doux',
  'bg-[color:var(--ncf-accent)]': 'Couleur du theme',
  'bg-[color:var(--ncf-accent-strong)]': 'Couleur forte',
  'bg-white': 'Blanc',
  'bg-slate-100': 'Gris clair',
  'bg-slate-900': 'Tres fonce',
  'text-sm': 'Petit',
  'text-base': 'Normal',
  'text-lg': 'Grand',
  'text-xl': 'Tres grand',
  'text-2xl': 'Titre',
  'p-0': 'Aucun',
  'p-2': 'Petit',
  'p-4': 'Normal',
  'p-6': 'Grand',
  'px-4 py-2': 'Bouton normal',
  'px-6 py-3': 'Bouton large',
  'rounded-none': 'Carre',
  'rounded-lg': 'Leger',
  'rounded-xl': 'Normal',
  'rounded-2xl': 'Grand',
  'rounded-3xl': 'Tres rond',
};

const contentHelp = {
  appTopBar: 'Ligne 1 = salutation, ligne 2 = titre de l ecran.',
  appBottomNav: 'Une entree de navigation par ligne.',
  appListItem: 'Ligne 1 = titre, ligne 2 = statut, ligne 3 = info courte.',
  appActionCard: 'Ligne 1 = titre, ligne 2 = texte, ligne 3 = bouton.',
  appSearch: 'Texte affiche dans la recherche.',
  appFab: 'Texte du bouton flottant, souvent +.',
  hero: 'Ligne 1 = grand titre, ligne 2 = sous-titre.',
  card: 'Ligne 1 = titre, ligne 2 = description.',
  stats: 'Une valeur puis son texte, a repeter 3 fois.',
  testimonial: 'Ligne 1 = avis, ligne 2 = nom, ligne 3 = role.',
  pricing: 'Ligne 1 = offre, ligne 2 = prix, ligne 3 = description, ligne 4 = avantages separes par |.',
  quote: 'Ligne 1 = citation, ligne 2 = auteur.',
  list: 'Une ligne par point de liste.',
  select: 'Ligne 1 = texte affiche, puis une option par ligne.',
  form: 'Titre, nom, email, message, bouton : une ligne chacun.',
  faq: 'Question puis reponse, a repeter 3 fois.',
  gallery: 'Une adresse image par ligne.',
  team: 'Nom puis role, a repeter 3 fois.',
  features: 'Titre puis description, a repeter 3 fois.',
  cta: 'Ligne 1 = titre, ligne 2 = texte, ligne 3 = bouton.',
  'contact-block': 'Titre, email, telephone, bouton : une ligne chacun.',
};

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--ncf-muted)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface-soft)] px-3 py-2 text-sm text-[color:var(--ncf-text)]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabels[option] || option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function PropertiesPanel({ selectedElement, onUpdate }) {
  if (!selectedElement) {
    return (
      <aside className="rounded-2xl border border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface)] p-4 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[color:var(--ncf-muted)]">
          Reglages
        </h2>
        <p className="text-sm text-[color:var(--ncf-muted)]">Selectionne un element pour le modifier.</p>
      </aside>
    );
  }

  const { content, props, className } = selectedElement;

  return (
    <aside className="rounded-2xl border border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface)] p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[color:var(--ncf-muted)]">Reglages</h2>
      <div className="space-y-3">
        <label className="block space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--ncf-muted)]">Texte / contenu</span>
          <textarea
            value={content}
            onChange={(e) => onUpdate('content', e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface-soft)] px-3 py-2 text-sm text-[color:var(--ncf-text)]"
          />
          {contentHelp[selectedElement.type] ? (
            <span className="block text-xs leading-5 text-[color:var(--ncf-muted)]">{contentHelp[selectedElement.type]}</span>
          ) : null}
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--ncf-muted)]">Largeur</span>
          <input
            type="number"
            min="80"
            value={props.width ?? ''}
            onChange={(e) => onUpdate('props.width', e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-xl border border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface-soft)] px-3 py-2 text-sm text-[color:var(--ncf-text)]"
            placeholder="auto"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--ncf-muted)]">Hauteur</span>
          <input
            type="number"
            min="40"
            value={props.height ?? ''}
            onChange={(e) => onUpdate('props.height', e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-xl border border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface-soft)] px-3 py-2 text-sm text-[color:var(--ncf-text)]"
            placeholder="auto"
          />
        </label>

        <SelectField
          label="Couleur du texte"
          value={props.textColor}
          options={textColorOptions}
          onChange={(value) => onUpdate('props.textColor', value)}
        />

        <SelectField
          label="Couleur du fond"
          value={props.backgroundColor}
          options={backgroundOptions}
          onChange={(value) => onUpdate('props.backgroundColor', value)}
        />

        <SelectField
          label="Taille du texte"
          value={props.fontSize}
          options={fontSizeOptions}
          onChange={(value) => onUpdate('props.fontSize', value)}
        />

        <SelectField
          label="Espace interieur"
          value={props.padding}
          options={paddingOptions}
          onChange={(value) => onUpdate('props.padding', value)}
        />

        <SelectField
          label="Coins arrondis"
          value={props.radius}
          options={radiusOptions}
          onChange={(value) => onUpdate('props.radius', value)}
        />

        <div className="rounded-2xl border border-[color:var(--ncf-surface-soft)] p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--ncf-muted)]">Afficher sur</p>
          <label className="mb-2 flex items-center gap-2 text-sm text-[color:var(--ncf-text)]">
            <input type="checkbox" checked={props.visibleDesktop !== false} onChange={(e) => onUpdate('props.visibleDesktop', e.target.checked)} />
            Ordinateur
          </label>
          <label className="mb-2 flex items-center gap-2 text-sm text-[color:var(--ncf-text)]">
            <input type="checkbox" checked={props.visibleTablet !== false} onChange={(e) => onUpdate('props.visibleTablet', e.target.checked)} />
            Tablette
          </label>
          <label className="flex items-center gap-2 text-sm text-[color:var(--ncf-text)]">
            <input type="checkbox" checked={props.visibleMobile !== false} onChange={(e) => onUpdate('props.visibleMobile', e.target.checked)} />
            Telephone
          </label>
        </div>

        <details className="rounded-2xl border border-[color:var(--ncf-surface-soft)] p-3">
          <summary className="cursor-pointer text-sm font-semibold text-[color:var(--ncf-text)]">Avance</summary>
          <label className="mt-3 block space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--ncf-muted)]">
              Classes Tailwind
            </span>
            <input
              value={className}
              onChange={(e) => onUpdate('className', e.target.value)}
              placeholder="ex: shadow-lg border border-slate-200"
              className="w-full rounded-xl border border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface-soft)] px-3 py-2 text-sm text-[color:var(--ncf-text)]"
            />
            <span className="block text-xs text-[color:var(--ncf-muted)]">A utiliser seulement si tu connais Tailwind.</span>
          </label>
        </details>
      </div>
    </aside>
  );
}
