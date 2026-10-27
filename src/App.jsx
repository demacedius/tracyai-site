import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, reducedMotion, isTouch } from './gsap.js';
import Preloader from './components/Preloader.jsx';
import Cursor from './components/Cursor.jsx';
import Nav from './components/Nav.jsx';
import Stage from './components/Stage.jsx';
import Offer from './components/Offer.jsx';
import Trust from './components/Trust.jsx';
import About from './components/About.jsx';
import Content from './components/Content.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import FloatingCta from './components/FloatingCta.jsx';
import Grain from './components/Grain.jsx';

export default function App() {
  const [ready, setReady] = useState(reducedMotion());
  const [loaderGone, setLoaderGone] = useState(reducedMotion());
  const onLoaded = useCallback(() => {
    setReady(true);
    setTimeout(() => setLoaderGone(true), 1200); // laisse les volets finir de remonter
  }, []);

  // Smooth scroll Lenis synchronisé avec ScrollTrigger
  useLayoutEffect(() => {
    if (reducedMotion()) return undefined;
    if (isTouch()) {
      // mobile : scroll natif + normalizeScroll (plus fiable que Lenis au doigt)
      ScrollTrigger.normalizeScroll({ allowNestedScroll: true, momentum: (self) => Math.min(0.8, Math.abs(self.velocityY) / 3000) });
      return () => ScrollTrigger.normalizeScroll(false);
    }
    const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    // la hauteur de page change quand la scène est épinglée : on prévient Lenis
    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener('refresh', onRefresh);
    return () => {
      ScrollTrigger.removeEventListener('refresh', onRefresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  useEffect(() => {
    // bloque le scroll pendant le préchargement (tactile : pas de Lenis)
    if (isTouch() && !reducedMotion()) document.documentElement.style.overflow = ready ? '' : 'hidden';
    if (ready && window.__lenis) window.__lenis.start();
    if (ready) document.documentElement.classList.add('is-ready');
  }, [ready]);

  // Liens d'ancre fluides
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const target = el.dataset.scrollTarget ? Number(el.dataset.scrollTarget) : el;
      if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.6 });
      else window.scrollTo({ top: typeof target === 'number' ? target : el.offsetTop, behavior: 'smooth' });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      {!loaderGone && <Preloader onDone={onLoaded} />}
      <Cursor />
      <Grain />
      <Nav />
      <main>
        <Stage ready={ready} />
        <Offer />
        <Trust />
        <About />
        <Content />
        <Contact />
      </main>
      <Footer />
      <FloatingCta />
    </>
  );
}
