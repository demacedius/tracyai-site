import { useEffect, useState } from 'react';
import { ScrollTrigger } from '../gsap.js';
import Magnetic from './Magnetic.jsx';
import Arrow from './Arrow.jsx';

// Bouton de prise de rendez-vous : visible après la scène des offres, masqué sur la section contact
export default function FloatingCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let inContact = false;
    const t1 = ScrollTrigger.create({ trigger: '#offre', start: 'top 80%', end: 'max', onToggle: (s) => setShow(s.isActive && !inContact) });
    const t2 = ScrollTrigger.create({
      trigger: '#contact', start: 'top 80%', end: 'bottom top',
      onToggle: (s) => { inContact = s.isActive; setShow(!s.isActive && t1.isActive); },
    });
    return () => { t1.kill(); t2.kill(); };
  }, []);
  return (
    <div className={`fcta ${show ? 'is-on' : ''}`}>
      <Magnetic href="#contact" className="btn btn--sun" data-cursor="Go">Prendre rendez-vous <Arrow /></Magnetic>
    </div>
  );
}
