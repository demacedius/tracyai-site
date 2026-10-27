import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, reducedMotion } from '../gsap.js';
import useReveal from '../useReveal.js';

// Bandeau défilant : sa vitesse et son inclinaison réagissent à la vitesse du scroll
export default function Marquee() {
  const root = useRef(null);
  useReveal(root);
  useLayoutEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      const tracks = gsap.utils.toArray('.mq__track');
      const loops = tracks.map((t, i) => gsap.to(t, { xPercent: i % 2 ? 50 : -50, duration: 28, ease: 'none', repeat: -1 }));
      if (tracks[1]) gsap.set(tracks[1], { xPercent: -50 });
      const skew = gsap.quickTo('.mq__row', 'skewX', { duration: 0.6, ease: 'power3' });
      ScrollTrigger.create({
        trigger: root.current, start: 'top bottom', end: 'bottom top',
        onUpdate: (self) => {
          const v = self.getVelocity() / 300;
          loops.forEach((l) => l.timeScale(1 + Math.min(Math.abs(v), 6)));
          skew(gsap.utils.clamp(-10, 10, -v));
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);
  const item = (
    <>
      <span>Souveraineté IA</span><i>✦</i><span className="o">De l'audit à la production</span><i>✦</i>
      <span>Gagner du temps</span><i>✦</i>
    </>
  );
  return (
    <section className="mq" ref={root} data-theme="dark" aria-label="Souveraineté IA, de l'audit à la production">
      <div className="mq__row"><div className="mq__track" aria-hidden="true">{item}{item}{item}{item}</div></div>
      <div className="mq__row mq__row--alt"><div className="mq__track" aria-hidden="true">{item}{item}{item}{item}</div></div>
    </section>
  );
}
