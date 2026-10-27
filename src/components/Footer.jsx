import { useRef } from 'react';
import useReveal from '../useReveal.js';

const SOCIALS = [
  ['LinkedIn', 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z'],
  ['YouTube', 'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z'],
  ['TikTok', 'M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z'],
];

export default function Footer() {
  const root = useRef(null);
  useReveal(root);
  return (
    <footer className="footer" ref={root} data-theme="dark">
      <div className="wrap">
        <div className="footer__top">
          <p className="footer__claim" data-split>Souveraineté IA, de l'audit à la production.</p>
          <div className="footer__cols" data-fade>
            <div>
              <p className="mono">Tracy AI</p>
              <a href="#top">Accueil</a>
              <a href="#offres">Offres</a>
              <a href="#contact">Contact</a>
            </div>
            <div>
              <p className="mono">Ressources</p>
              <a href="#contenus">Contenus gratuits</a>
              <a href="#apropos">À propos</a>
              <a href="#">Se connecter</a>
            </div>
            <div>
              <p className="mono">Suivez-nous</p>
              <div className="socials">
                {SOCIALS.map(([n, d]) => (
                  <a key={n} href="#" aria-label={n}><svg viewBox="0 0 24 24"><path d={d} /></svg></a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Tracy AI</span>
          <div>
            <a href="#">Politique de confidentialité</a>
            <a href="#">Mentions légales</a>
            <a href="#">Termes et conditions de vente</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
