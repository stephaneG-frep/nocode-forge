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

const surfaceProps = {
  backgroundColor: 'bg-[color:var(--ncf-surface)]',
  padding: 'p-5',
  radius: 'rounded-2xl',
};

const heroProps = {
  backgroundColor: 'bg-[color:var(--ncf-accent-strong)]',
  textColor: 'text-white',
  padding: 'px-6 py-4',
  radius: 'rounded-3xl',
};

const actionProps = {
  backgroundColor: 'bg-[color:var(--ncf-surface-soft)]',
  padding: 'p-5',
  radius: 'rounded-3xl',
};

const primaryButtonProps = {
  textColor: 'text-white',
  backgroundColor: 'bg-[color:var(--ncf-accent)]',
  padding: 'px-6 py-3',
  radius: 'rounded-xl',
};

const createDomainApp = ({
  name,
  summary,
  homeName,
  detailName,
  addName,
  profileName = 'Profil',
  headline,
  search,
  metric,
  items,
  actionTitle,
  detailTitle,
  detailBody,
  addFields,
  profileContent,
  nav,
}) => {
  const home = uid(`screen-${homeName.toLowerCase()}`);
  const detail = uid(`screen-${detailName.toLowerCase()}`);
  const add = uid(`screen-${addName.toLowerCase()}`);
  const profile = uid('screen-profil');

  return {
    name,
    summary,
    screens: [
      screen(home, homeName, [
        element('appTopBar', headline, heroProps),
        element('appSearch', search, { ...surfaceProps, padding: 'px-4 py-3', radius: 'rounded-3xl' }),
        element('metricCard', metric, surfaceProps),
        ...items.map((item) => element('appListItem', item, { ...surfaceProps, padding: 'px-4 py-3' })),
        element('appActionCard', `${actionTitle}\nAjoute ou gere une nouvelle entree.\nAjouter`, { ...actionProps, targetScreen: add }),
        element('button', `Voir ${detailName.toLowerCase()}`, { ...primaryButtonProps, targetScreen: detail }),
        element('appBottomNav', nav, { ...surfaceProps, padding: 'px-4 py-3', radius: 'rounded-3xl' }),
      ]),
      screen(detail, detailName, [
        element('appTopBar', `${detailName}\nDetails`, heroProps),
        element('card', `${detailTitle}\n${detailBody}`, surfaceProps),
        element('features', 'Points importants\nStatut, priorite et notes.\nSuivi\nHistorique et prochaines actions.\nPartage\nInformations utiles pour l utilisateur.', surfaceProps),
        element('button', `Retour ${homeName.toLowerCase()}`, { ...primaryButtonProps, targetScreen: home }),
      ]),
      screen(add, addName, [
        element('appTopBar', `${addName}\nNouvelle entree`, heroProps),
        ...addFields.map((field) => element(field.type, field.content, { ...surfaceProps, padding: 'px-4 py-3' })),
        element('button', 'Enregistrer', { ...primaryButtonProps, targetScreen: home }),
      ]),
      screen(profile, profileName, [
        element('appTopBar', `${profileName}\nParametres`, heroProps),
        element('userProfile', profileContent, { ...actionProps, padding: 'p-6' }),
        element('list', 'Notifications\nPreferences\nAide et support', surfaceProps),
        element('button', `Retour ${homeName.toLowerCase()}`, { ...primaryButtonProps, targetScreen: home }),
      ]),
    ],
  };
};

const domainApps = {
  sport: () => createDomainApp({
    name: 'App sport',
    summary: 'App sport avec entrainements, seance detaillee, ajout et profil.',
    homeName: 'Entrainements',
    detailName: 'Seance',
    addName: 'Ajouter seance',
    headline: 'Aujourd hui\nProgramme sport',
    search: 'Rechercher un exercice',
    metric: 'Objectif semaine\n4 seances\n2 restantes',
    items: ['Haut du corps\n45 minutes\nIntensite moyenne', 'Cardio rapide\n20 minutes\nA faire demain'],
    actionTitle: 'Nouvelle seance',
    detailTitle: 'Seance jambes',
    detailBody: 'Squats, fentes, gainage et etirements.',
    addFields: [
      { type: 'input', content: 'Nom de la seance' },
      { type: 'select', content: 'Intensite\nDouce\nMoyenne\nForte' },
      { type: 'textarea', content: 'Exercices prevus' },
    ],
    profileContent: 'Alex Sport\nObjectif remise en forme\n4 seances par semaine',
    nav: 'Sport\nSeance\nProfil',
  }),
  budget: () => createDomainApp({
    name: 'Budget personnel',
    summary: 'App budget avec solde, transactions, ajout et profil.',
    homeName: 'Budget',
    detailName: 'Transaction',
    addName: 'Ajouter depense',
    headline: 'Ce mois ci\nBudget personnel',
    search: 'Rechercher une depense',
    metric: 'Solde restant\n842 EUR\nBudget maitrise',
    items: ['Courses\n-64 EUR\nAlimentation', 'Transport\n-28 EUR\nMobilite'],
    actionTitle: 'Nouvelle depense',
    detailTitle: 'Depense courses',
    detailBody: 'Montant, categorie, date et note de suivi.',
    addFields: [
      { type: 'input', content: 'Nom de la depense' },
      { type: 'input', content: 'Montant' },
      { type: 'select', content: 'Categorie\nMaison\nAlimentation\nTransport\nLoisirs' },
    ],
    profileContent: 'Compte principal\nBudget familial\nobjectif@exemple.fr',
    nav: 'Budget\nDepenses\nProfil',
  }),
  recettes: () => createDomainApp({
    name: 'Carnet de recettes',
    summary: 'App recettes avec recherche, detail recette, ajout et profil.',
    homeName: 'Recettes',
    detailName: 'Recette',
    addName: 'Ajouter recette',
    headline: 'Cuisine\nMes recettes',
    search: 'Rechercher une recette',
    metric: 'Recettes gardees\n24\n5 favorites',
    items: ['Pates cremeuses\n25 minutes\nFacile', 'Salade fraiche\n10 minutes\nLegere'],
    actionTitle: 'Nouvelle recette',
    detailTitle: 'Pates cremeuses',
    detailBody: 'Ingredients, etapes, temps de cuisson et conseils.',
    addFields: [
      { type: 'input', content: 'Nom de la recette' },
      { type: 'textarea', content: 'Ingredients' },
      { type: 'textarea', content: 'Etapes de preparation' },
    ],
    profileContent: 'Chef maison\nRecettes favorites\ncuisine@exemple.fr',
    nav: 'Recettes\nFavoris\nProfil',
  }),
  reservation: () => createDomainApp({
    name: 'App reservation',
    summary: 'App de reservation avec planning, detail, ajout et profil.',
    homeName: 'Reservations',
    detailName: 'Reservation',
    addName: 'Nouvelle reservation',
    headline: 'Planning\nReservations',
    search: 'Rechercher un client ou une date',
    metric: 'Aujourd hui\n6 reservations\n2 a confirmer',
    items: ['Table Martin\n19h30\n4 personnes', 'Salle reunion\n14h00\nEquipe projet'],
    actionTitle: 'Nouvelle reservation',
    detailTitle: 'Reservation Martin',
    detailBody: 'Heure, nombre de personnes, statut et notes.',
    addFields: [
      { type: 'input', content: 'Nom du client' },
      { type: 'input', content: 'Date et heure' },
      { type: 'textarea', content: 'Notes de reservation' },
    ],
    profileContent: 'Gestion reservations\nPlanning partage\ncontact@exemple.fr',
    nav: 'Planning\nClients\nProfil',
  }),
  formation: () => createDomainApp({
    name: 'App formation',
    summary: 'App formation avec cours, lecon, ajout et profil.',
    homeName: 'Cours',
    detailName: 'Lecon',
    addName: 'Ajouter cours',
    headline: 'Apprendre\nMes formations',
    search: 'Rechercher un cours',
    metric: 'Progression\n68%\n3 modules actifs',
    items: ['React debutant\nModule 2\nEn cours', 'Design UI\nLecon 5\nA revoir'],
    actionTitle: 'Nouveau cours',
    detailTitle: 'Lecon React',
    detailBody: 'Objectifs, contenu, exercice et progression.',
    addFields: [
      { type: 'input', content: 'Titre du cours' },
      { type: 'textarea', content: 'Description du module' },
      { type: 'select', content: 'Niveau\nDebutant\nIntermediaire\nAvance' },
    ],
    profileContent: 'Apprenant\nParcours web\nformation@exemple.fr',
    nav: 'Cours\nLecons\nProfil',
  }),
  sante: () => createDomainApp({
    name: 'Suivi sante',
    summary: 'App sante avec suivi, detail, ajout et profil.',
    homeName: 'Sante',
    detailName: 'Suivi',
    addName: 'Ajouter mesure',
    headline: 'Bien etre\nSuivi sante',
    search: 'Rechercher une mesure',
    metric: 'Objectif eau\n1.5 L\nEncore 0.5 L',
    items: ['Sommeil\n7h20\nBonne nuit', 'Marche\n6200 pas\nObjectif proche'],
    actionTitle: 'Nouvelle mesure',
    detailTitle: 'Suivi sommeil',
    detailBody: 'Duree, qualite, note et tendance.',
    addFields: [
      { type: 'input', content: 'Type de mesure' },
      { type: 'input', content: 'Valeur' },
      { type: 'textarea', content: 'Note personnelle' },
    ],
    profileContent: 'Profil sante\nObjectifs bien etre\nsante@exemple.fr',
    nav: 'Sante\nSuivi\nProfil',
  }),
  immobilier: () => createDomainApp({
    name: 'App immobilier',
    summary: 'App immobilier avec biens, fiche detail, ajout et profil.',
    homeName: 'Biens',
    detailName: 'Fiche bien',
    addName: 'Ajouter bien',
    headline: 'Catalogue\nBiens immobiliers',
    search: 'Rechercher une ville ou un bien',
    metric: 'Biens actifs\n18\n4 visites prevues',
    items: ['Appartement T3\nLyon\n285 000 EUR', 'Maison jardin\nNantes\n420 000 EUR'],
    actionTitle: 'Nouveau bien',
    detailTitle: 'Appartement T3 Lyon',
    detailBody: 'Prix, surface, description, photos et contact.',
    addFields: [
      { type: 'input', content: 'Titre du bien' },
      { type: 'input', content: 'Prix' },
      { type: 'textarea', content: 'Description du bien' },
    ],
    profileContent: 'Agence demo\nGestion des biens\nagence@exemple.fr',
    nav: 'Biens\nVisites\nProfil',
  }),
};

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

  if (hasAny(text, ['reservation', 'réservation', 'booking', 'planning reservation'])) {
    return domainApps.reservation();
  }

  if (hasAny(text, ['restaurant', 'menu'])) {
    return {
      name: 'Restaurant',
      summary: 'Modele restaurant.',
      templateId: 'restaurant',
      screens: null,
    };
  }

  if (hasAny(text, ['sport', 'fitness', 'entrainement', 'entraînement', 'musculation', 'coach'])) {
    return domainApps.sport();
  }

  if (hasAny(text, ['budget', 'argent', 'depense', 'dépense', 'finance', 'compte', 'solde'])) {
    return domainApps.budget();
  }

  if (hasAny(text, ['recette', 'recettes', 'cuisine', 'ingredient', 'ingrédient', 'repas'])) {
    return domainApps.recettes();
  }

  if (hasAny(text, ['formation', 'cours', 'lecon', 'leçon', 'apprendre', 'eleve', 'élève'])) {
    return domainApps.formation();
  }

  if (hasAny(text, ['sante', 'santé', 'bien etre', 'bien-être', 'sommeil', 'suivi sante'])) {
    return domainApps.sante();
  }

  if (hasAny(text, ['immobilier', 'maison', 'appartement', 'bien immobilier', 'agence'])) {
    return domainApps.immobilier();
  }

  return genericApp(prompt);
};

export const modifyElementsWithLocalAi = (prompt, elements = []) => {
  const text = prompt.toLowerCase();
  const additions = [];
  let themeId = null;

  if (hasAny(text, ['stat', 'stats', 'statistique', 'statistiques', 'chiffre', 'kpi'])) {
    additions.push(
      element('stats', '128\nVues\n24\nActions\n92%\nObjectif', { ...surfaceProps, padding: 'p-6' }),
      element('metricCard', 'Progression\n92%\nObjectif presque atteint', surfaceProps)
    );
  }

  if (hasAny(text, ['recherche', 'chercher', 'filtre', 'filtrer'])) {
    additions.push(element('appSearch', 'Rechercher', { ...surfaceProps, padding: 'px-4 py-3', radius: 'rounded-3xl' }));
  }

  if (hasAny(text, ['formulaire', 'contact', 'inscription', 'saisir', 'champ'])) {
    additions.push(
      element('input', 'Nom complet', { ...surfaceProps, padding: 'px-4 py-3' }),
      element('input', 'Email', { ...surfaceProps, padding: 'px-4 py-3' }),
      element('textarea', 'Message', { ...surfaceProps, padding: 'px-4 py-3', height: 110 }),
      element('button', 'Envoyer', primaryButtonProps)
    );
  }

  if (hasAny(text, ['liste', 'items', 'elements', 'cartes'])) {
    additions.push(
      element('appListItem', 'Nouvel element\nInformation principale\nDetail utile', { ...surfaceProps, padding: 'px-4 py-3' }),
      element('appListItem', 'Deuxieme element\nStatut actif\nMaintenant', { ...surfaceProps, padding: 'px-4 py-3' })
    );
  }

  if (hasAny(text, ['navigation', 'menu bas', 'onglet', 'onglets'])) {
    additions.push(element('appBottomNav', 'Accueil\nRecherche\nProfil', { ...surfaceProps, padding: 'px-4 py-3', radius: 'rounded-3xl' }));
  }

  if (hasAny(text, ['professionnel', 'pro', 'premium', 'moderne', 'plus joli', 'ameliorer', 'ameliore'])) {
    additions.push(
      element('notificationCard', 'Mise en avant\nMessage important pour guider l utilisateur.\nNouveau', { ...surfaceProps, padding: 'p-4' }),
      element('features', 'Avantage principal\nSimple a comprendre.\nGain de temps\nAction rapide.\nSuivi clair\nInformations bien rangees.', surfaceProps),
      element('appActionCard', 'Action importante\nGuide l utilisateur vers la prochaine etape.\nContinuer', actionProps)
    );
  }

  if (hasAny(text, ['sombre', 'dark', 'bleu nuit'])) {
    themeId = 'midnight-blue';
  }

  if (additions.length === 0) {
    additions.push(
      element('appActionCard', 'Nouvelle section IA\nDecris plus precisement ce que tu veux pour l ajuster.\nModifier', actionProps)
    );
  }

  return {
    elements: [...elements, ...additions],
    addedCount: additions.length,
    themeId,
    summary: `${additions.length} element(s) ajoute(s) sur cet ecran`,
  };
};
