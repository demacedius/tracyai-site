// Contenus du site : à faire valider par le client
export const SLOGAN = ["Souveraineté IA,", "de l'audit", 'à la production.'];

export const OFFERS = [
  {
    n: '01',
    short: 'Audit & conseil IA',
    title: 'Audit de vos capacités IA et conseil',
    desc: "Pouvez-vous faire tourner l'IA dont vous avez besoin, en toute confidentialité, avec vos serveurs actuels ? Nous dimensionnons et recommandons le bon scénario.",
  },
  {
    n: '02',
    short: 'Analyse de structure',
    title: 'Analyse de la structure de votre société',
    desc: "Nous cartographions vos équipes, processus, outils et flux pour repérer où l'IA vous fait vraiment gagner du temps, puis nous priorisons.",
  },
  {
    n: '03',
    short: 'Solutions sur mesure',
    title: 'Développement de solutions personnalisées',
    desc: "Nous développons et mettons en production votre application IA, sur une infrastructure maîtrisée : coût prévisible, données chez vous.",
  },
];

export const MISSION = [
  "Notre mission est de vous offrir des solutions d'intelligence artificielle innovantes, conçues pour vous faire gagner du temps et optimiser votre productivité.",
  "Nous mettons la puissance de l'IA au service de votre efficacité, en vous proposant des outils performants et adaptés à vos besoins.",
];

// Synthèse de l'offre Tracy AI (source : Offre_Tracy_AI.pdf)
export const PROBLEMS = [
  { t: 'Un coût qui dérive', d: "Facturée au token, l'IA coûte plus cher à chaque usage, sans plafond. Difficile d'en faire un budget." },
  { t: 'Une dépendance au fournisseur', d: 'Tarifs, conditions et modèles changent sans vous. Vos outils en dépendent directement.' },
  { t: 'Des données qui sortent', d: "Chaque requête envoie vos documents et données clients vers un service externe. RGPD et secret des affaires s'en mêlent." },
];

export const BRIQUES = [
  {
    n: '01', tag: 'Audit 1', title: 'Infrastructure et ressources',
    q: "Peut-on faire tourner l'IA dont vous avez besoin, en confidentialité, avec vos ressources actuelles ?",
    items: ['Cas d\'usage, volumes, performance attendue', 'Serveurs, GPU, réseau, compétences internes', 'Scénario : existant, mise à niveau ou cloud souverain'],
    out: "Rapport de capacité, scénario recommandé et comparatif de coûts face au token",
  },
  {
    n: '02', tag: 'Audit 2', title: 'Organisation et leviers IA',
    q: "Où l'IA peut-elle vous faire gagner du temps, et donc de l'argent ?",
    items: ['Équipes, rôles, processus et validations', 'Outils, flux d\'information, ressaisies', 'Leviers évalués : temps gagné, coût, complexité'],
    out: "Graphe complet de votre organisation et feuille de route priorisée",
  },
  {
    n: '03', tag: 'Développement', title: 'Application IA sur mesure',
    q: 'Comment mettre en production les solutions identifiées ?',
    items: ['Interface, serveur, base de données et brique IA', 'Modules éprouvés : auth, paiements, LLM, RAG', 'Livraisons itératives, un interlocuteur unique'],
    out: 'Application déployée, code source, documentation et prise en main',
  },
];

export const PARCOURS = [
  { t: 'Échange de cadrage', d: 'On comprend votre besoin et on choisit les briques utiles.' },
  { t: 'Audit infrastructure', d: 'Capacité de vos ressources et scénario recommandé.' },
  { t: 'Audit organisation', d: 'Graphe de votre société et leviers IA priorisés.' },
  { t: 'Mise en production', d: 'Développement et déploiement des solutions retenues.' },
];

export const CLIENTS = [
  { name: 'Vertech', mark: "Vertech'", url: 'https://vertech.eu/', sector: 'Industrie verrière', desc: "Système de supervision pour l'industrie verrière" },
];

// Formulaire : renseigner VITE_FORM_ENDPOINT (Formspree, Make, n8n...) dans Vercel
export const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || '';
