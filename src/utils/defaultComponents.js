const baseProps = {
  textColor: 'text-[color:var(--ncf-text)]',
  backgroundColor: 'bg-[color:var(--ncf-surface)]',
  padding: 'px-4 py-2',
  radius: 'rounded-xl',
  fontSize: 'text-base',
  width: null,
  height: null,
  x: null,
  y: null,
  locked: false,
  groupId: null,
};

export const componentLibrary = [
  { type: 'text', label: 'Texte', description: 'Petit paragraphe', category: 'Texte' },
  { type: 'hero', label: 'Grand titre', description: 'Bloc d accueil', category: 'Marketing' },
  { type: 'button', label: 'Bouton', description: 'Action principale', category: 'Texte' },
  { type: 'badge', label: 'Badge', description: 'Petite etiquette', category: 'Marketing' },
  { type: 'image', label: 'Image', description: 'Visuel ou photo', category: 'Media' },
  { type: 'card', label: 'Carte', description: 'Titre + description', category: 'Marketing' },
  { type: 'stats', label: 'Chiffres', description: '3 indicateurs', category: 'Marketing' },
  { type: 'testimonial', label: 'Avis client', description: 'Temoignage', category: 'Marketing' },
  { type: 'pricing', label: 'Prix', description: 'Offre tarifaire', category: 'Marketing' },
  { type: 'quote', label: 'Citation', description: 'Phrase mise en avant', category: 'Texte' },
  { type: 'list', label: 'Liste', description: 'Points cles', category: 'Texte' },
  { type: 'input', label: 'Champ', description: 'Saisie texte', category: 'Formulaire' },
  { type: 'divider', label: 'Separateur', description: 'Ligne de coupe', category: 'Mise en page' },
  { type: 'spacer', label: 'Espace', description: 'Respiration vide', category: 'Mise en page' },
  { type: 'section', label: 'Section', description: 'Conteneur simple', category: 'Mise en page' },
  { type: 'navbar', label: 'Menu', description: 'Navigation', category: 'Mise en page' },
  { type: 'footer', label: 'Pied de page', description: 'Bas de page', category: 'Mise en page' },
];

export const templateLibrary = [
  { id: 'landing', label: 'Landing page', description: 'Accueil + preuves + prix' },
  { id: 'restaurant', label: 'Restaurant', description: 'Menu simple et appel a reserver' },
  { id: 'portfolio', label: 'Portfolio', description: 'Presentation + projets + contact' },
  { id: 'mobile-app', label: 'App mobile', description: 'Ecran marketing pour une app' },
  { id: 'contact', label: 'Contact', description: 'Section contact prete' },
];

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const createDefaultElement = (type) => {
  const shared = {
    id: uid(),
    type,
    content: 'New element',
    props: { ...baseProps },
    className: '',
  };

  switch (type) {
    case 'text':
      return { ...shared, content: 'Texte modifiable' };
    case 'hero':
      return {
        ...shared,
        content: 'Construis ton app sans coder\nAjoute des blocs, modifie le style et exporte ton projet.',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-surface-soft)]',
          padding: 'p-8',
          radius: 'rounded-3xl',
          fontSize: 'text-2xl',
        },
      };
    case 'button':
      return {
        ...shared,
        content: 'Commencer',
        props: {
          ...baseProps,
          textColor: 'text-white',
          backgroundColor: 'bg-[color:var(--ncf-accent)]',
        },
      };
    case 'badge':
      return {
        ...shared,
        content: 'Nouveau',
        props: {
          ...baseProps,
          textColor: 'text-white',
          backgroundColor: 'bg-[color:var(--ncf-accent)]',
          padding: 'px-4 py-2',
          radius: 'rounded-3xl',
          fontSize: 'text-sm',
        },
      };
    case 'image':
      return {
        ...shared,
        content: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
        props: {
          ...baseProps,
          padding: 'p-0',
          radius: 'rounded-2xl',
        },
      };
    case 'card':
      return {
        ...shared,
        content: 'Titre de carte\nUne description courte pour presenter une idee.',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'p-6',
          radius: 'rounded-2xl',
        },
      };
    case 'stats':
      return {
        ...shared,
        content: '120+\nProjets crees\n98%\nClients satisfaits\n24h\nGain de temps',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'p-6',
          radius: 'rounded-2xl',
        },
      };
    case 'testimonial':
      return {
        ...shared,
        content: 'NoCode Forge m aide a creer mes maquettes beaucoup plus vite.\nAlex Martin\nFondateur',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'p-6',
          radius: 'rounded-2xl',
        },
      };
    case 'pricing':
      return {
        ...shared,
        content: 'Starter\n19 euros / mois\nPour lancer une premiere app\nCreer sans coder|Exporter le code|Support email',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'p-6',
          radius: 'rounded-3xl',
        },
      };
    case 'quote':
      return {
        ...shared,
        content: 'Les bonnes interfaces donnent confiance avant meme le premier clic.\nNoCode Forge',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-surface-soft)]',
          padding: 'p-6',
          radius: 'rounded-2xl',
          fontSize: 'text-lg',
        },
      };
    case 'list':
      return {
        ...shared,
        content: 'Interface simple\nMode libre\nExport web et mobile',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'p-6',
          radius: 'rounded-2xl',
        },
      };
    case 'input':
      return {
        ...shared,
        content: 'Type here...',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'px-4 py-3',
        },
      };
    case 'section':
      return {
        ...shared,
        content: 'Titre de section',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-surface-soft)]',
          padding: 'p-8',
          radius: 'rounded-3xl',
        },
      };
    case 'divider':
      return {
        ...shared,
        content: '',
        props: {
          ...baseProps,
          backgroundColor: 'bg-slate-100',
          padding: 'p-0',
          radius: 'rounded-none',
          height: 1,
        },
      };
    case 'spacer':
      return {
        ...shared,
        content: '',
        props: {
          ...baseProps,
          backgroundColor: '',
          padding: 'p-0',
          radius: 'rounded-none',
          height: 32,
        },
      };
    case 'navbar':
      return {
        ...shared,
        content: 'NoCode Forge | Home | Features | Pricing',
        props: {
          ...baseProps,
          textColor: 'text-white',
          backgroundColor: 'bg-[color:var(--ncf-accent-strong)]',
          padding: 'px-6 py-4',
          radius: 'rounded-2xl',
        },
      };
    case 'footer':
      return {
        ...shared,
        content: '© 2026 NoCode Forge. All rights reserved.',
        props: {
          ...baseProps,
          textColor: 'text-white',
          backgroundColor: 'bg-[color:var(--ncf-accent-strong)]',
          padding: 'px-6 py-5',
          radius: 'rounded-2xl',
          fontSize: 'text-sm',
        },
      };
    default:
      return shared;
  }
};

const withContent = (type, content, props = {}, className = '') => {
  const element = createDefaultElement(type);
  return {
    ...element,
    content,
    className,
    props: {
      ...element.props,
      ...props,
    },
  };
};

export const createTemplateElements = (templateId) => {
  switch (templateId) {
    case 'landing':
      return [
        withContent('navbar', 'NoCode Forge | Accueil | Avantages | Prix'),
        withContent('hero', 'Lance ton projet plus vite\nUne page claire, moderne et prete a exporter en web ou mobile.'),
        withContent('stats', '3x\nPlus rapide\n0\nCode obligatoire\n24h\nPrototype pret'),
        withContent('card', 'Pourquoi ca marche\nTu poses des blocs, tu ajustes le style, puis tu exportes ton projet.'),
        withContent('testimonial', 'Simple, rapide, et beaucoup moins intimidant qu un outil classique.\nCamille Durand\nEntrepreneuse'),
        withContent('pricing', 'Starter\n19 euros / mois\nPour creer une premiere version rapidement\nPages illimitees|Export web|Export mobile'),
        withContent('footer', 'NoCode Forge - Cree sans coder'),
      ];
    case 'restaurant':
      return [
        withContent('navbar', 'Maison Bleue | Menu | Reservation | Contact'),
        withContent('hero', 'Cuisine maison, ambiance douce\nReserve une table et decouvre nos plats de saison.'),
        withContent('image', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'),
        withContent('list', 'Menu du midi\nPlats de saison\nReservation rapide'),
        withContent('button', 'Reserver une table'),
        withContent('footer', 'Maison Bleue - Ouvert du mardi au dimanche'),
      ];
    case 'portfolio':
      return [
        withContent('hero', 'Designer frontend freelance\nJe cree des interfaces simples, propres et faciles a utiliser.'),
        withContent('card', 'Projet recent\nRefonte d une page SaaS avec une meilleure conversion.'),
        withContent('card', 'Expertise\nReact, design system, no-code, integration responsive.'),
        withContent('quote', 'Le bon design rend le produit evident.\nPortfolio'),
        withContent('button', 'Me contacter'),
      ];
    case 'mobile-app':
      return [
        withContent('badge', 'Nouvelle app'),
        withContent('hero', 'Ton coach dans la poche\nSuis tes objectifs, recois des rappels et garde le cap chaque jour.'),
        withContent('stats', '10k+\nUtilisateurs\n4.8/5\nNote moyenne\n7j\nPour demarrer'),
        withContent('pricing', 'Premium\n6 euros / mois\nPour garder tes habitudes au quotidien\nRappels intelligents|Statistiques|Mode hors ligne'),
        withContent('button', 'Telecharger'),
      ];
    case 'contact':
      return [
        withContent('section', 'Parlons de ton projet'),
        withContent('text', 'Explique ton besoin en quelques mots, puis ajoute tes coordonnees.'),
        withContent('input', 'Nom'),
        withContent('input', 'Email'),
        withContent('input', 'Message'),
        withContent('button', 'Envoyer'),
      ];
    default:
      return [];
  }
};
