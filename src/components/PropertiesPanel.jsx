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

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function PropertiesPanel({ selectedElement, onUpdate }) {
  if (!selectedElement) {
    return (
      <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Reglages
        </h2>
        <p className="text-sm text-slate-500">Selectionne un element pour le modifier.</p>
      </aside>
    );
  }

  const { content, props, className } = selectedElement;

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Reglages</h2>
      <div className="space-y-3">
        <label className="block space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Texte / contenu</span>
          <textarea
            value={content}
            onChange={(e) => onUpdate('content', e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Largeur (px)</span>
          <input
            type="number"
            min="80"
            value={props.width ?? ''}
            onChange={(e) => onUpdate('props.width', e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800"
            placeholder="auto"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hauteur (px)</span>
          <input
            type="number"
            min="40"
            value={props.height ?? ''}
            onChange={(e) => onUpdate('props.height', e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800"
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

        <label className="block space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Classes Tailwind avancees
          </span>
          <input
            value={className}
            onChange={(e) => onUpdate('className', e.target.value)}
            placeholder="ex: shadow-lg border border-slate-200"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800"
          />
        </label>
      </div>
    </aside>
  );
}
