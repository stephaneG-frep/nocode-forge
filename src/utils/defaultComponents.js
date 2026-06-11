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
  visibleDesktop: true,
  visibleTablet: true,
  visibleMobile: true,
};

export const componentLibrary = [
  { type: 'appTopBar', label: 'Barre d app', description: 'Haut d ecran mobile', category: 'Application' },
  { type: 'appBottomNav', label: 'Navigation app', description: 'Menu bas mobile', category: 'Application' },
  { type: 'appListItem', label: 'Ligne app', description: 'Item de liste', category: 'Application' },
  { type: 'appActionCard', label: 'Carte action', description: 'Carte cliquable', category: 'Application' },
  { type: 'appSearch', label: 'Recherche app', description: 'Barre de recherche', category: 'Application' },
  { type: 'appFab', label: 'Bouton flottant', description: 'Action +', category: 'Application' },
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
  { type: 'email', label: 'Email', description: 'Champ email', category: 'Formulaire' },
  { type: 'phone', label: 'Telephone', description: 'Champ telephone', category: 'Formulaire' },
  { type: 'textarea', label: 'Grand champ', description: 'Message long', category: 'Formulaire' },
  { type: 'checkbox', label: 'Case a cocher', description: 'Choix oui/non', category: 'Formulaire' },
  { type: 'select', label: 'Liste choix', description: 'Menu deroulant', category: 'Formulaire' },
  { type: 'form', label: 'Formulaire complet', description: 'Contact pret', category: 'Formulaire' },
  { type: 'faq', label: 'FAQ', description: 'Questions reponses', category: 'Sections' },
  { type: 'gallery', label: 'Galerie', description: '3 images', category: 'Sections' },
  { type: 'team', label: 'Equipe', description: '3 profils', category: 'Sections' },
  { type: 'features', label: 'Avantages', description: '3 cartes utiles', category: 'Sections' },
  { type: 'cta', label: 'Appel a action', description: 'Bloc final', category: 'Sections' },
  { type: 'contact-block', label: 'Contact complet', description: 'Infos + bouton', category: 'Sections' },
  { type: 'divider', label: 'Separateur', description: 'Ligne de coupe', category: 'Mise en page' },
  { type: 'spacer', label: 'Espace', description: 'Respiration vide', category: 'Mise en page' },
  { type: 'section', label: 'Section', description: 'Conteneur simple', category: 'Mise en page' },
  { type: 'navbar', label: 'Menu', description: 'Navigation', category: 'Mise en page' },
  { type: 'footer', label: 'Pied de page', description: 'Bas de page', category: 'Mise en page' },
];

export const templateLibrary = [
  { id: 'landing', label: 'Landing page', description: 'Accueil + preuves + prix' },
  { id: 'dashboard-app', label: 'App tableau de bord', description: 'Ecran mobile complet' },
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
    case 'appTopBar':
      return {
        ...shared,
        content: 'Bonjour Alex\nTableau de bord',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-accent-strong)]',
          textColor: 'text-white',
          padding: 'px-6 py-4',
          radius: 'rounded-3xl',
        },
      };
    case 'appBottomNav':
      return {
        ...shared,
        content: 'Accueil\nStats\nMessages\nProfil',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'px-4 py-3',
          radius: 'rounded-3xl',
        },
      };
    case 'appListItem':
      return {
        ...shared,
        content: 'Commande #2048\nEn attente\n12 min',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'px-4 py-3',
          radius: 'rounded-2xl',
        },
      };
    case 'appActionCard':
      return {
        ...shared,
        content: 'Nouvelle reservation\nAjouter un client ou une commande rapidement.\nOuvrir',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-surface-soft)]',
          padding: 'p-5',
          radius: 'rounded-3xl',
        },
      };
    case 'appSearch':
      return {
        ...shared,
        content: 'Rechercher dans l app',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'px-4 py-3',
          radius: 'rounded-3xl',
        },
      };
    case 'appFab':
      return {
        ...shared,
        content: '+',
        props: {
          ...baseProps,
          textColor: 'text-white',
          backgroundColor: 'bg-[color:var(--ncf-accent)]',
          padding: 'p-4',
          radius: 'rounded-3xl',
          width: 56,
          height: 56,
        },
      };
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
        content: 'Nom',
        props: {
          ...baseProps,
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'px-4 py-3',
        },
      };
    case 'email':
      return { ...shared, content: 'Email', props: { ...baseProps, backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'px-4 py-3' } };
    case 'phone':
      return { ...shared, content: 'Telephone', props: { ...baseProps, backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'px-4 py-3' } };
    case 'textarea':
      return { ...shared, content: 'Votre message', props: { ...baseProps, backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'px-4 py-3', height: 120 } };
    case 'checkbox':
      return { ...shared, content: 'J accepte les conditions', props: { ...baseProps, backgroundColor: '', padding: 'p-2' } };
    case 'select':
      return { ...shared, content: 'Choisir une option\nOption 1\nOption 2\nOption 3', props: { ...baseProps, backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'px-4 py-3' } };
    case 'form':
      return { ...shared, content: 'Contactez-nous\nNom\nEmail\nMessage\nEnvoyer', props: { ...baseProps, backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'p-6', radius: 'rounded-3xl' } };
    case 'faq':
      return { ...shared, content: 'Question frequente ?\nReponse claire et courte.\nCombien ca coute ?\nTu peux modifier le prix dans le bloc.\nPuis-je exporter ?\nOui, en web et mobile.', props: { ...baseProps, backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'p-6', radius: 'rounded-2xl' } };
    case 'gallery':
      return { ...shared, content: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80\nhttps://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=700&q=80\nhttps://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=80', props: { ...baseProps, backgroundColor: '', padding: 'p-0', radius: 'rounded-2xl' } };
    case 'team':
      return { ...shared, content: 'Lea\nDesign\nNabil\nDev\nSofia\nProduit', props: { ...baseProps, backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'p-6', radius: 'rounded-2xl' } };
    case 'features':
      return { ...shared, content: 'Simple\nConstruis sans jargon.\nRapide\nTeste tes idees vite.\nExportable\nRecupere ton code.', props: { ...baseProps, backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'p-6', radius: 'rounded-2xl' } };
    case 'cta':
      return { ...shared, content: 'Pret a lancer ton projet ?\nAjoute tes blocs, ajuste le style, puis exporte.\nCommencer maintenant', props: { ...baseProps, textColor: 'text-white', backgroundColor: 'bg-[color:var(--ncf-accent-strong)]', padding: 'p-8', radius: 'rounded-3xl' } };
    case 'contact-block':
      return { ...shared, content: 'Contact\ncontact@exemple.fr\n06 00 00 00 00\nEnvoyer un message', props: { ...baseProps, backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'p-6', radius: 'rounded-2xl' } };
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
    case 'dashboard-app':
      return [
        withContent('appTopBar', 'Bonjour Alex\nTableau de bord'),
        withContent('appSearch', 'Rechercher une action'),
        withContent('stats', '24\nTaches\n8\nMessages\n92%\nObjectif'),
        withContent('appActionCard', 'Nouvelle action\nCree une tache, un client ou une reservation.\nAjouter'),
        withContent('appListItem', 'Commande #2048\nEn attente\n12 min'),
        withContent('appListItem', 'Client Marie\nRendez-vous confirme\n15h30'),
        withContent('appBottomNav', 'Accueil\nStats\nMessages\nProfil'),
      ];
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
