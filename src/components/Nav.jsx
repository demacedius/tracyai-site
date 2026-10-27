import { useEffect, useState } from 'react';
import { ScrollTrigger } from '../gsap.js';
import Logo from './Logo.jsx';
import Magnetic from './Magnetic.jsx';

export default function Nav() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // le thème de la nav suit la section qu'elle survole
    const onTheme = (e) => setDark(e.detail === 'dark');
    window.addEventListener('navtheme', onTheme);
    // nav toujours visible (sticky) : on ajoute juste un fond dès qu'on a scrollé
    const st = ScrollTrigger.create({ start: 12, end: 'max', onToggle: (self) => setScrolled(self.isActive) });
    return () => { window.removeEventListener('navtheme', onTheme); st.kill(); };
  }, []);

  return (
    <header className={`nav ${dark ? 'nav--dark' : ''} ${scrolled ? 'nav--solid' : ''} ${open ? 'nav--open' : ''}`}>
      <a href="#top" className="nav__logo" aria-label="Tracy AI, accueil"><Logo dark={dark || open} /></a>
      <nav className="nav__links" aria-label="Navigation principale">
        <a href="#offres" className="ulink">Offres</a>
        <a href="#apropos" className="ulink">À propos</a>
        <a href="#contenus" className="ulink">Contenus gratuits</a>
      </nav>
      <div className="nav__right">
        <a href="#" className="nav__login">Se connecter</a>
        <Magnetic href="#contact" className="btn btn--sm btn--solid">Prendre rendez-vous</Magnetic>
      </div>
      <button className="nav__burger" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
        <span /><span />
      </button>
      <div className="nav__sheet" onClick={(e) => e.target.closest('a') && setOpen(false)}>
        <a href="#offres">Offres</a>
        <a href="#contenus">Contenus gratuits</a>
        <a href="#apropos">À propos</a>
        <a href="#">Se connecter</a>
        <a href="#contact" className="nav__sheet-cta">Prendre rendez-vous</a>
      </div>
    </header>
  );
}
