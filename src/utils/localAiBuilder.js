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
  targetScreen: '',
};

const uid = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const element = (type, content, props = {}, className = '') => ({
  id: uid(type),
  type,
  content,
  className,
  props: {
    ...baseProps,
    ...props,
  },
});

const screen = (id, name, elements) => ({ id, name, elements });

const hasAny = (text, words) => words.some((word) => text.includes(word));

const groceryApp = () => {
  const home = uid('screen-courses');
  const add = uid('screen-ajouter');
  const categories = uid('screen-categories');
  const profile = uid('screen-profil');

  return {
    name: 'Liste de courses',
    summary: 'App de courses avec liste, ajout, categories et profil.',
    screens: [
      screen(home, 'Courses', [
        element('appTopBar', 'Aujourd hui\nListe de courses', {
          backgroundColor: 'bg-[color:var(--ncf-accent-strong)]',
          textColor: 'text-white',
          padding: 'px-6 py-4',
          radius: 'rounded-3xl',
        }),
        element('appSearch', 'Rechercher un article', {
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'px-4 py-3',
          radius: 'rounded-3xl',
        }),
        element('metricCard', 'Articles restants\n8\n3 urgents', {
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'p-5',
          radius: 'rounded-2xl',
        }),
        element('appListItem', 'Pain complet\nA acheter\nBoulangerie', {
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'px-4 py-3',
          radius: 'rounded-2xl',
        }),
        element('appListItem', 'Lait\nA acheter\nFrais', {
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'px-4 py-3',
          radius: 'rounded-2xl',
        }),
        element('appListItem', 'Pommes\nA acheter\nFruits', {
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'px-4 py-3',
          radius: 'rounded-2xl',
        }),
        element('appActionCard', 'Ajouter un article\nAjoute rapidement un produit a ta liste.\nAjouter', {
          targetScreen: add,
          backgroundColor: 'bg-[color:var(--ncf-surface-soft)]',
          padding: 'p-5',
          radius: 'rounded-3xl',
        }),
        element('appBottomNav', 'Courses\nCategories\nProfil', {
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'px-4 py-3',
          radius: 'rounded-3xl',
        }),
      ]),
      screen(add, 'Ajouter', [
        element('appTopBar', 'Nouvel article\nAjouter aux courses', {
          backgroundColor: 'bg-[color:var(--ncf-accent-strong)]',
          textColor: 'text-white',
          padding: 'px-6 py-4',
          radius: 'rounded-3xl',
        }),
        element('input', 'Nom du produit', {
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'px-4 py-3',
        }),
        element('select', 'Categorie\nFruits\nFrais\nEpicerie\nMaison', {
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'px-4 py-3',
        }),
        element('textarea', 'Note ou quantite', {
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'px-4 py-3',
          height: 100,
        }),
        element('button', 'Ajouter a la liste', {
          targetScreen: home,
          textColor: 'text-white',
          backgroundColor: 'bg-[color:var(--ncf-accent)]',
          padding: 'px-6 py-3',
          radius: 'rounded-xl',
        }),
      ]),
      screen(categories, 'Categories', [
        element('appTopBar', 'Organisation\nCategories', {
          backgroundColor: 'bg-[color:var(--ncf-accent-strong)]',
          textColor: 'text-white',
          padding: 'px-6 py-4',
          radius: 'rounded-3xl',
        }),
        element('features', 'Fruits\nPommes, bananes, oranges.\nFrais\nLait, beurre, fromage.\nMaison\nLessive, papier, entretien.', {
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'p-6',
          radius: 'rounded-2xl',
        }),
        element('button', 'Retour aux courses', {
          targetScreen: home,
          textColor: 'text-white',
          backgroundColor: 'bg-[color:var(--ncf-accent)]',
          padding: 'px-6 py-3',
          radius: 'rounded-xl',
        }),
      ]),
      screen(profile, 'Profil', [
        element('appTopBar', 'Parametres\nProfil', {
          backgroundColor: 'bg-[color:var(--ncf-accent-strong)]',
          textColor: 'text-white',
          padding: 'px-6 py-4',
          radius: 'rounded-3xl',
        }),
        element('userProfile', 'Alex Martin\nCourses familiales\nalex@exemple.fr', {
          backgroundColor: 'bg-[color:var(--ncf-surface-soft)]',
          padding: 'p-6',
          radius: 'rounded-3xl',
        }),
        element('list', 'Notifications avant le magasin\nListe partagee\nTri par categories', {
          backgroundColor: 'bg-[color:var(--ncf-surface)]',
          padding: 'p-6',
          radius: 'rounded-2xl',
        }),
        element('button', 'Retour', {
          targetScreen: home,
          textColor: 'text-white',
          backgroundColor: 'bg-[color:var(--ncf-accent)]',
          padding: 'px-6 py-3',
          radius: 'rounded-xl',
        }),
      ]),
    ],
  };
};

const taskApp = () => {
  const home = uid('screen-taches');
  const add = uid('screen-nouvelle-tache');
  const stats = uid('screen-stats');

  return {
    name: 'Gestion de taches',
    summary: 'App de taches avec tableau de bord, ajout et statistiques.',
    screens: [
      screen(home, 'Taches', [
        element('appTopBar', 'Bonjour\nMes taches', { backgroundColor: 'bg-[color:var(--ncf-accent-strong)]', textColor: 'text-white', padding: 'px-6 py-4', radius: 'rounded-3xl' }),
        element('metricCard', 'A faire\n7\n2 urgentes', { backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'p-5', radius: 'rounded-2xl' }),
        element('appListItem', 'Appeler le client\nPriorite haute\n10h30', { backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'px-4 py-3', radius: 'rounded-2xl' }),
        element('appListItem', 'Preparer devis\nEn cours\nAujourd hui', { backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'px-4 py-3', radius: 'rounded-2xl' }),
        element('appActionCard', 'Nouvelle tache\nAjoute une action a faire.\nCreer', { targetScreen: add, backgroundColor: 'bg-[color:var(--ncf-surface-soft)]', padding: 'p-5', radius: 'rounded-3xl' }),
        element('appBottomNav', 'Taches\nStats\nProfil', { backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'px-4 py-3', radius: 'rounded-3xl' }),
      ]),
      screen(add, 'Nouvelle tache', [
        element('appTopBar', 'Creation\nNouvelle tache', { backgroundColor: 'bg-[color:var(--ncf-accent-strong)]', textColor: 'text-white', padding: 'px-6 py-4', radius: 'rounded-3xl' }),
        element('input', 'Titre de la tache', { backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'px-4 py-3' }),
        element('select', 'Priorite\nBasse\nNormale\nHaute', { backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'px-4 py-3' }),
        element('button', 'Enregistrer', { targetScreen: home, textColor: 'text-white', backgroundColor: 'bg-[color:var(--ncf-accent)]', padding: 'px-6 py-3', radius: 'rounded-xl' }),
      ]),
      screen(stats, 'Stats', [
        element('appTopBar', 'Progression\nStatistiques', { backgroundColor: 'bg-[color:var(--ncf-accent-strong)]', textColor: 'text-white', padding: 'px-6 py-4', radius: 'rounded-3xl' }),
        element('stats', '18\nTerminees\n7\nA faire\n82%\nObjectif', { backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'p-6', radius: 'rounded-2xl' }),
        element('button', 'Retour', { targetScreen: home, textColor: 'text-white', backgroundColor: 'bg-[color:var(--ncf-accent)]', padding: 'px-6 py-3', radius: 'rounded-xl' }),
      ]),
    ],
  };
};

const genericApp = (prompt) => {
  const home = uid('screen-accueil');
  const detail = uid('screen-detail');
  const settings = uid('screen-reglages');
  const title = prompt ? prompt.slice(0, 42) : 'Mon application';

  return {
    name: title,
    summary: 'App generee localement avec une base accueil, detail et reglages.',
    screens: [
      screen(home, 'Accueil', [
        element('appTopBar', 'Bienvenue\nMon application', { backgroundColor: 'bg-[color:var(--ncf-accent-strong)]', textColor: 'text-white', padding: 'px-6 py-4', radius: 'rounded-3xl' }),
        element('appSearch', 'Rechercher', { backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'px-4 py-3', radius: 'rounded-3xl' }),
        element('appActionCard', 'Action principale\nOuvre le detail de cette application.\nOuvrir', { targetScreen: detail, backgroundColor: 'bg-[color:var(--ncf-surface-soft)]', padding: 'p-5', radius: 'rounded-3xl' }),
        element('notificationCard', 'Information\nAdapte ces blocs a ton idee.\nMaintenant', { backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'p-4', radius: 'rounded-2xl' }),
        element('appBottomNav', 'Accueil\nDetail\nReglages', { backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'px-4 py-3', radius: 'rounded-3xl' }),
      ]),
      screen(detail, 'Detail', [
        element('appTopBar', 'Detail\nInformation', { backgroundColor: 'bg-[color:var(--ncf-accent-strong)]', textColor: 'text-white', padding: 'px-6 py-4', radius: 'rounded-3xl' }),
        element('card', 'Bloc detail\nExplique ici le coeur de ton application.', { backgroundColor: 'bg-[color:var(--ncf-surface)]', padding: 'p-6', radius: 'rounded-2xl' }),
        element('button', 'Retour accueil', { targetScreen: home, textColor: 'text-white', backgroundColor: 'bg-[color:var(--ncf-accent)]', padding: 'px-6 py-3', radius: 'rounded-xl' }),
      ]),
      screen(settings, 'Reglages', [
        element('appTopBar', 'Parametres\nReglages', { backgroundColor: 'bg-[color:var(--ncf-accent-strong)]', textColor: 'text-white', padding: 'px-6 py-4', radius: 'rounded-3xl' }),
        element('userProfile', 'Utilisateur\nCompte principal\ncontact@exemple.fr', { backgroundColor: 'bg-[color:var(--ncf-surface-soft)]', padding: 'p-6', radius: 'rounded-3xl' }),
        element('button', 'Retour accueil', { targetScreen: home, textColor: 'text-white', backgroundColor: 'bg-[color:var(--ncf-accent)]', padding: 'px-6 py-3', radius: 'rounded-xl' }),
      ]),
    ],
  };
};

export const createLocalAiApp = (prompt) => {
  const text = prompt.toLowerCase();

  if (hasAny(text, ['course', 'courses', 'shopping', 'liste de course', 'liste de courses', 'supermarche', 'supermarché'])) {
    return groceryApp();
  }

  if (hasAny(text, ['tache', 'tâche', 'todo', 'planning', 'agenda', 'rendez-vous', 'rdv'])) {
    return taskApp();
  }

  if (hasAny(text, ['boutique', 'shop', 'ecommerce', 'e-commerce', 'produit', 'panier'])) {
    return {
      name: 'App boutique',
      summary: 'Modele boutique multi-ecrans.',
      templateId: 'shop-app',
      screens: null,
    };
  }

  if (hasAny(text, ['client', 'commande', 'support', 'crm'])) {
    return {
      name: 'App client',
      summary: 'Modele client multi-ecrans.',
      templateId: 'client-app',
      screens: null,
    };
  }

  if (hasAny(text, ['restaurant', 'menu', 'reservation', 'réservation'])) {
    return {
      name: 'Restaurant',
      summary: 'Modele restaurant.',
      templateId: 'restaurant',
      screens: null,
    };
  }

  return genericApp(prompt);
};
