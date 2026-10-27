import { useLayoutEffect, useRef } from 'react';

import { gsap } from '../gsap.js';

export default function Preloader({ onDone }) {
  const root = useRef(null);
  const done = useRef(onDone);
  done.current = onDone;

  // dépendances vides : l'animation ne se joue qu'une fois, même si le parent se ré-affiche
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const count = { v: 0 };
      const num = root.current.querySelector('.pl__count');
      const tl = gsap.timeline({
        onComplete: () => { root.current.style.display = 'none'; },
      });
      tl.from('.pl__mark', { scale: 0.4, rotate: -120, opacity: 0, duration: 1, ease: 'expo.out' })
        .from('.pl__word span', { yPercent: 110, stagger: 0.04, duration: 0.9, ease: 'expo.out' }, 0.15)
        .to(count, {
          v: 100, duration: 1.6, ease: 'power2.inOut',
          onUpdate: () => { num.textContent = String(Math.round(count.v)).padStart(3, '0'); },
        }, 0)
        .to('.pl__bar i', { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, 0)
        .to('.pl__inner', { opacity: 0, y: -30, duration: 0.5, ease: 'power2.in' }, 1.7)
        .to('.pl__panel', {
          yPercent: -100, duration: 1.1, ease: 'expo.inOut', stagger: 0.08,
        }, 1.95)
        .add(() => done.current && done.current(), 2.35);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div className="pl" ref={root} aria-hidden="true">
      <div className="pl__panel pl__panel--a" />
      <div className="pl__panel pl__panel--b" />
      <div className="pl__inner">
        <img className="pl__mark" src="/assets/tracyai-icon.svg" alt="" width="72" height="72" />
        <div className="pl__word">{'TracyAI'.split('').map((c, i) => <span key={i} className={i > 4 ? 'pl__ai' : undefined}>{c}</span>)}</div>
        <div className="pl__foot">
          <span className="mono">Souveraineté IA</span>
          <span className="pl__count mono">000</span>
        </div>
        <div className="pl__bar"><i /></div>
      </div>
    </div>
  );
}
