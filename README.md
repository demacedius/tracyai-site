# Cadence · site vitrine

React + Vite, animations GSAP (ScrollTrigger, SplitText) et Lenis pour le scroll fluide.

## Lancer en local
npm install
npm run dev

## Mettre en ligne sur Vercel
npx vercel --prod
(Vercel détecte Vite tout seul : build `npm run build`, dossier `dist`.)

## À brancher
- Formulaire de contact : ajouter la variable d'environnement `VITE_FORM_ENDPOINT`
  dans Vercel (URL Formspree, Make, n8n...). Sans elle, le formulaire est en mode démo.
- Vidéo : renseigner `YOUTUBE_ID` dans `src/components/Content.jsx`.
- Textes : tout est centralisé dans `src/data.js`.

## Où sont les animations
- `src/components/Stage.jsx` : hero, roue des 3 offres, dézoom sur le graphe (timeline scrubée, section épinglée).
- `src/useReveal.js` : apparitions des autres sections.
- `src/components/Preloader.jsx`, `Cursor.jsx`, `Magnetic.jsx` : préchargement, curseur, boutons magnétiques.

## Scroll
Lenis (le moteur sur lequel est construite Locomotive Scroll v5), synchronisé avec GSAP ScrollTrigger.
Réglages : `lerp` dans `src/App.jsx`, `scrub` dans `src/components/Stage.jsx`.
