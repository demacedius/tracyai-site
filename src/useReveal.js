import { useLayoutEffect } from 'react';
import { gsap, ScrollTrigger, SplitText, reducedMotion } from './gsap.js';

/* Animations d'apparition génériques pour une section :
   [data-split]  titres révélés ligne par ligne depuis un masque
   [data-fade]   fondu montant
   [data-line]   filet qui se trace
   [data-clip]   média dévoilé par un volet
   data-theme="dark" sur la section : la nav passe en clair */
export default function useReveal(ref) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const root = ref.current;
      const theme = root.dataset.theme;
      if (theme) {
        ScrollTrigger.create({
          trigger: root, start: 'top 40px', end: 'bottom 40px',
          onToggle: (s) => s.isActive && window.dispatchEvent(new CustomEvent('navtheme', { detail: theme })),
        });
      }
      if (reducedMotion()) return;
      root.querySelectorAll('[data-split]').forEach((el) => {
        const split = SplitText.create(el, { type: 'lines,words', mask: 'lines' });
        gsap.from(split.words, {
          yPercent: 110, rotate: 3, duration: 1.3, ease: 'expo.out', stagger: 0.025,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });
      root.querySelectorAll('[data-fade]').forEach((el, i) => {
        gsap.from(el, {
          y: 40, autoAlpha: 0, duration: 1.2, ease: 'expo.out', delay: (Number(el.dataset.fade) || 0) * 0.1,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });
      root.querySelectorAll('[data-line]').forEach((el) => {
        gsap.from(el, { scaleX: 0, transformOrigin: 'left', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 90%' } });
      });
      root.querySelectorAll('[data-clip]').forEach((el) => {
        gsap.fromTo(el, { clipPath: 'inset(18% 8% 18% 8% round 24px)' }, {
          clipPath: 'inset(0% 0% 0% 0% round 24px)', ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 25%', scrub: 1 },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [ref]);
}
