import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, SplitText, reducedMotion, isTouch } from '../gsap.js';
import { OFFERS, SLOGAN } from '../data.js';
import Magnetic from './Magnetic.jsx';
import Arrow from './Arrow.jsx';

/* ==========================================================================
   Scène principale : hero → roue des 3 offres → dézoom sur le graphe complet
   Une seule section épinglée, pilotée par une timeline GSAP "scrub".
   ========================================================================== */

const TICKS = 64;
const RIM_TICKS = 180;
const SATS = 26;
const NS = 'http://www.w3.org/2000/svg';

// Générateur pseudo-aléatoire déterministe (le graphe est identique à chaque visite)
const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

function geometry(w, h) {
  const mobile = w < 768;
  const D = mobile ? Math.min(w * 0.62, h * 0.34) : Math.min(h * 0.5, w * 0.3); // diamètre d'un cercle
  const A = mobile ? { x: w * 0.5, y: h * 0.33 } : { x: w * 0.68, y: h * 0.5 }; // position active
  const R = mobile ? h * 1.05 : h * 1.3; // rayon de la roue
  const step = mobile ? 50 : 46; // degrés entre deux offres sur la roue
  const W = { x: A.x, y: A.y + R }; // centre de la roue (sous l'écran)
  const G = mobile ? { x: w * 0.5, y: h * 0.36 } : { x: w * 0.68, y: h * 0.52 }; // centre du graphe final
  // rayon du graphe : assez grand pour que le noyau ne touche pas le triangle formé par les 3 cercles
  const Rg = mobile ? Math.min(w * 0.32, h * 0.18) : Math.min(h * 0.31, w * 0.195);
  const gScale = mobile ? 0.36 : 0.38;
  const svc = [-90, 30, 150].map((a) => ({ x: G.x + Rg * Math.cos((a * Math.PI) / 180), y: G.y + Rg * Math.sin((a * Math.PI) / 180) }));
  return { w, h, mobile, D, A, R, step, W, G, Rg, gScale, svc };
}

export default function Stage({ ready }) {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (!ready) return undefined;
    const ctx = gsap.context((self) => {
      const q = gsap.utils.selector(root);
      const pin = q('.stage__pin')[0];
      const nodes = q('.node');
      const rim = q('.wheel')[0];
      const graph = q('.graph')[0];
      const svg = q('.graph__svg')[0];
      const core = q('.core')[0];
      const counter = q('.offers__count b')[0];
      const bars = q('.offers__bar i');
      const glabels = q('.glabel');
      let g = geometry(window.innerWidth, window.innerHeight);

      /* ---------- Construction du graphe final (SVG) ---------- */
      let lines = [];
      let sats = [];
      let pulses = [];
      function buildGraph() {
        svg.setAttribute('viewBox', `0 0 ${g.w} ${g.h}`);
        svg.innerHTML = '';
        lines = []; sats = []; pulses = [];
        const rand = rng(42);
        const mk = (tag, attrs) => { const el = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); svg.appendChild(el); return el; };
        // anneaux décoratifs
        mk('circle', { cx: g.G.x, cy: g.G.y, r: g.Rg * 2.2, class: 'g-ring' });
        mk('circle', { cx: g.G.x, cy: g.G.y, r: g.Rg * 1.45, class: 'g-ring g-ring--sun' });
        // satellites (vos processus)
        const pts = [];
        for (let i = 0; i < SATS; i++) {
          const a = rand() * Math.PI * 2;
          const d = g.Rg * (0.75 + rand() * 1.35);
          const x = g.G.x + Math.cos(a) * d * (g.mobile ? 1.15 : 1.5);
          const y = g.G.y + Math.sin(a) * d;
          if (x < 20 || x > g.w - 20 || y < 90 || y > g.h - 30) continue;
          pts.push({ x, y, r: 2.5 + rand() * 4.5, sun: rand() > 0.82 });
        }
        pts.forEach((p, i) => {
          const near = g.svc.reduce((m, s) => (Math.hypot(s.x - p.x, s.y - p.y) < Math.hypot(m.x - p.x, m.y - p.y) ? s : m));
          lines.push(mk('line', { x1: near.x, y1: near.y, x2: p.x, y2: p.y, pathLength: 1, class: 'g-line g-line--sat' }));
          if (i % 3 === 0) lines.push(mk('line', { x1: p.x, y1: p.y, x2: g.G.x, y2: g.G.y, pathLength: 1, class: 'g-line g-line--faint' }));
          if (i % 2 === 0 && pts[i + 1]) lines.push(mk('line', { x1: p.x, y1: p.y, x2: pts[i + 1].x, y2: pts[i + 1].y, pathLength: 1, class: 'g-line g-line--faint' }));
        });
        g.svc.forEach((s, i) => {
          const n = g.svc[(i + 1) % 3];
          lines.push(mk('line', { x1: s.x, y1: s.y, x2: n.x, y2: n.y, pathLength: 1, class: 'g-line g-line--main' }));
          lines.push(mk('line', { x1: s.x, y1: s.y, x2: g.G.x, y2: g.G.y, pathLength: 1, class: 'g-line g-line--sun' }));
        });
        pts.forEach((p) => sats.push(mk('circle', { cx: p.x, cy: p.y, r: p.r, class: p.sun ? 'g-sat g-sat--sun' : 'g-sat' })));
        // impulsions qui circulent des offres vers le noyau
        g.svc.forEach((s) => {
          for (let k = 0; k < 2; k++) {
            const c = mk('circle', { cx: s.x, cy: s.y, r: 4, class: 'g-pulse' });
            pulses.push({ c, from: s, delay: k * 0.9 + Math.random() * 0.4 });
          }
        });
        gsap.set(lines, { attr: { 'stroke-dasharray': 1, 'stroke-dashoffset': 1 } });
        lastDez = -1;
        gsap.set(sats, { scale: 0, transformOrigin: '50% 50%', transformBox: 'fill-box' });
        gsap.set(core, { left: g.G.x, top: g.G.y, width: g.Rg * 0.78, height: g.Rg * 0.78 });
        graph.style.transformOrigin = `${g.G.x}px ${g.G.y}px`;
        // la roue
        rim.style.width = rim.style.height = `${g.R * 2}px`;
        rim.style.left = `${g.W.x - g.R}px`;
        rim.style.top = `${g.W.y - g.R}px`;
        nodes.forEach((n) => { n.style.width = n.style.height = `${g.D}px`; });
      }

      // impulsions en boucle (indépendantes du scroll)
      const pulseTl = gsap.timeline({ repeat: -1, paused: true });
      function buildPulses() {
        pulseTl.clear();
        pulses.forEach(({ c, from, delay }) => {
          pulseTl.fromTo(c, { attr: { cx: from.x, cy: from.y }, opacity: 0 },
            { attr: { cx: g.G.x, cy: g.G.y }, duration: 1.8, ease: 'power1.in', keyframes: { opacity: [0, 1, 1, 0] } }, delay);
        });
      }

      /* ---------- Rendu de la roue / des cercles à partir de l'état ---------- */
      const state = { rot: -1.15, dez: 0, spin: 0 };
      let lastDez = -1;
      const backOut = gsap.parseEase('back.out(3)');
      const back22 = gsap.parseEase('back.out(2.2)');
      const inOut3 = gsap.parseEase('power3.inOut');
      const expoOut = gsap.parseEase('expo.out');
      function render() {
        const { rot, dez, spin } = state;
        nodes.forEach((n, i) => {
          const deg = -90 - i * g.step + rot * g.step;
          const rad = (deg * Math.PI) / 180;
          const wx = g.W.x + g.R * Math.cos(rad);
          const wy = g.W.y + g.R * Math.sin(rad);
          const act = gsap.utils.clamp(0, 1, 1 - Math.abs(deg + 90) / g.step);
          const wScale = 0.42 + 0.58 * act;
          const e = inOut3(dez);
          const x = wx + (g.svc[i].x - wx) * e;
          const y = wy + (g.svc[i].y - wy) * e;
          const s = wScale + (g.gScale - wScale) * e;
          n.style.transform = `translate3d(${x - g.D / 2}px, ${y - g.D / 2}px, 0) scale(${s})`;
          n.style.setProperty('--act', (act * (1 - dez)).toFixed(3));
          n.style.setProperty('--dez', dez.toFixed(3));
          n.style.setProperty('--spin', `${(spin * 900 + i * 40).toFixed(1)}deg`);
          n.style.setProperty('--orbit', `${(spin * -1400 + i * 90).toFixed(1)}deg`);
          // visible seulement dans la zone utile
          const vis = Math.max(dez, gsap.utils.clamp(0, 1, 1.6 - Math.abs(deg + 90) / g.step));
          n.style.opacity = vis.toFixed(3);
        });
        rim.style.transform = `rotate(${rot * g.step}deg) scale(${1 - dez * 0.35})`;
        rim.style.opacity = (1 - dez * 1.3).toFixed(3);
        // graphe : arrive "de très près" (dézoom)
        const gz = gsap.utils.clamp(0, 1, (dez - 0.15) / 0.85);
        graph.style.opacity = gz.toFixed(3);
        graph.style.transform = `scale(${2.4 - 1.4 * expoOut(gz)})`;
        // le graphe ne se recalcule que pendant le dézoom (gros gain de fluidité sur le reste)
        if (dez !== lastDez) {
          lastDez = dez;
          const draw = gsap.utils.clamp(0, 1, (dez - 0.35) / 0.55);
          lines.forEach((l, i) => l.setAttribute('stroke-dashoffset', Math.max(0, 1 - draw * 1.6 + (i % 7) * 0.08).toFixed(3)));
          const pop = gsap.utils.clamp(0, 1, (dez - 0.5) / 0.4);
          sats.forEach((c, i) => {
            const k = gsap.utils.clamp(0, 1, pop * 1.8 - (i / sats.length) * 0.8);
            c.style.transform = `scale(${backOut(k)})`;
          });
        }
        const coreK = gsap.utils.clamp(0, 1, (dez - 0.55) / 0.3);
        core.style.setProperty('--k', back22(coreK).toFixed(3));
        core.style.setProperty('--flash', (coreK > 0 && coreK < 1 ? coreK : coreK >= 1 ? 1 : 0).toFixed(3));
        if (dez > 0.95) pulseTl.play(); else pulseTl.pause();
        // étiquettes du graphe final
        const lab = gsap.utils.clamp(0, 1, (dez - 0.7) / 0.3);
        glabels.forEach((l, i) => {
          // étiquette centrée dans le cercle du graphe
          l.style.transform = `translate3d(${g.svc[i].x}px, ${g.svc[i].y}px, 0) translate(-50%, -50%) translateY(${(1 - lab) * 10}px)`;
          l.style.width = `${g.D * g.gScale * 0.82}px`;
          l.style.opacity = lab.toFixed(3);
        });
        // compteur / progression
        const idx = gsap.utils.clamp(0, 2, Math.round(rot));
        counter.textContent = OFFERS[idx].n;
        bars.forEach((b, i) => { b.style.setProperty('--p', gsap.utils.clamp(0, 1, rot + 1 - i + (dez > 0 ? 1 : 0)).toFixed(3)); });
      }

      buildGraph();
      buildPulses();
      render();

      /* ---------- Textes découpés ---------- */
      const heroSplit = SplitText.create(q('.hero__title'), { type: 'lines', mask: 'lines' });
      const offerSplits = q('.offer').map((o) => ({
        head: SplitText.create(o.querySelector('h2'), { type: 'lines', mask: 'lines' }),
        body: SplitText.create(o.querySelector('p'), { type: 'lines', mask: 'lines' }),
        num: o.querySelector('.offer__num'),
      }));
      const promise = SplitText.create(q('.promise h2'), { type: 'lines,words', mask: 'lines' });
      offerSplits.forEach((s) => gsap.set([s.head.lines, s.body.lines], { yPercent: 110 }));
      gsap.set(promise.words, { yPercent: 110 });
      gsap.set(q('.promise .fade'), { autoAlpha: 0, y: 30 });

      /* ---------- Intro du hero (après le préchargement) ---------- */
      const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
      intro.from(heroSplit.lines, { yPercent: 110, duration: 1.4 })
        .from(q('.hero .reveal'), { y: 40, autoAlpha: 0, duration: 1.2, stagger: 0.08 }, 0.4)
        .from(q('.hero__index li'), { x: 30, autoAlpha: 0, duration: 1, stagger: 0.07 }, 0.6)
        .from(q('.hero__line'), { scaleX: 0, transformOrigin: 'left', duration: 1.6, ease: 'expo.inOut' }, 0.2);

      /* ---------- Timeline principale pilotée par le scroll ----------
         Créée à la fin de l'intro pour enregistrer les bonnes valeurs de départ. */
      let st = null;
      let setAnchor = () => {};
      intro.eventCallback('onComplete', () => self.add(buildScroll));
      if (reducedMotion()) intro.progress(1);
      function buildScroll() {
      const touch = isTouch();
      const tl = gsap.timeline({ defaults: { ease: 'none' }, onUpdate: render });
      tl.to(state, { spin: 1, duration: 10 }, 0);
      // 1. le titre s'envole
      tl.to(heroSplit.lines, { yPercent: -110, duration: 0.7, ease: 'power2.in' }, 0);
      tl.to(q('.hero .reveal, .hero__index, .hero__line'), { y: -80, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 0);
      tl.to(q('.stage__bg'), { opacity: 1, duration: 0.7, ease: 'power1.inOut' }, 0.25);
      tl.fromTo(q('.wheel, .nodes'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45 }, 0.55);
      tl.to(q('.stage__glow'), { opacity: 1, duration: 1 }, 0.5);
      tl.to(q('.offers__meta'), { autoAlpha: 1, duration: 0.4 }, 0.9);
      // 2. la roue amène l'offre 01
      tl.to(state, { rot: 0, duration: 1.3, ease: 'power3.out' }, 0.35);
      const showOffer = (i, at) => {
        const s = offerSplits[i];
        tl.to([s.head.lines, s.body.lines], { yPercent: 0, duration: 0.7, ease: 'expo.out', stagger: 0.06 }, at);
        tl.fromTo(s.num, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out' }, at);
      };
      const hideOffer = (i, at) => {
        const s = offerSplits[i];
        tl.to([s.head.lines, s.body.lines], { yPercent: -110, duration: 0.5, ease: 'power2.in', stagger: 0.03 }, at);
        tl.to(s.num, { autoAlpha: 0, y: -20, duration: 0.4, ease: 'power2.in' }, at);
      };
      showOffer(0, 1.15);
      // 3. tour de roue vers l'offre 02
      tl.addLabel('o2', 2.7);
      hideOffer(0, 2.7);
      tl.to(state, { rot: 1, duration: 1.3, ease: 'power3.inOut' }, 2.7);
      showOffer(1, 3.4);
      // 4. tour de roue vers l'offre 03
      tl.addLabel('o3', 4.9);
      hideOffer(1, 4.9);
      tl.to(state, { rot: 2, duration: 1.3, ease: 'power3.inOut' }, 4.9);
      showOffer(2, 5.6);
      // 5. gros dézoom : tout est relié
      tl.addLabel('dez', 7.1);
      hideOffer(2, 7.1);
      tl.to(q('.offers__meta'), { autoAlpha: 0, duration: 0.4 }, 7.1);
      tl.to(state, { dez: 1, duration: 2.1, ease: 'none' }, 7.2);
      tl.to(promise.words, { yPercent: 0, duration: 0.8, ease: 'expo.out', stagger: 0.04 }, 8.4);
      tl.to(q('.promise .fade'), { autoAlpha: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.1 }, 8.7);
      tl.to({}, { duration: 0.9 }, 9.3); // temps de pause sur le graphe

      st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * (touch ? 10 : 8)}`,
        // au doigt : on se cale sur chaque offre puis sur le graphe
        snap: touch ? { snapTo: [...[0, 1.95, 4.2, 6.45, 9.6].map((t) => t / tl.duration()), 1], directional: true, duration: { min: 0.4, max: 0.9 }, delay: 0.08, ease: 'power2.inOut' } : false,
        pin,
        scrub: 0.6,
        anticipatePin: 1,
        animation: tl,
        refreshPriority: 10, // la scène est créée après les autres déclencheurs : on la recalcule en premier
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          window.dispatchEvent(new CustomEvent('navtheme', { detail: self.progress > 0.04 ? 'dark' : 'light' }));
        },
        onLeaveBack: () => window.dispatchEvent(new CustomEvent('navtheme', { detail: 'light' })),
      });
      // repère pour le lien "Offres" de la nav : début de l'offre 01
      const anchor = q('#offres')[0];
      setAnchor = () => { anchor.dataset.scrollTarget = String(st.start + (st.end - st.start) * (1.6 / tl.duration())); };
      setAnchor();
      ScrollTrigger.addEventListener('refresh', setAnchor);
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      }

      // recalcul de la géométrie au redimensionnement
      const onResize = () => {
        g = geometry(window.innerWidth, window.innerHeight);
        buildGraph();
        buildPulses();
        render();
      };
      window.addEventListener('resize', onResize);

      // parallaxe douce des halos avec la souris
      const glowX = gsap.quickTo(q('.stage__glow')[0], 'x', { duration: 1.8, ease: 'power3' });
      const glowY = gsap.quickTo(q('.stage__glow')[0], 'y', { duration: 1.8, ease: 'power3' });
      const onMove = (e) => { glowX((e.clientX / window.innerWidth - 0.5) * 120); glowY((e.clientY / window.innerHeight - 0.5) * 120); };
      window.addEventListener('pointermove', onMove);

      return () => {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('pointermove', onMove);
        ScrollTrigger.removeEventListener('refresh', setAnchor);
        pulseTl.kill();
      };
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section className="stage" id="top" ref={root} aria-label="Tracy AI, souveraineté IA">
      <div className="stage__pin">
        <div className="stage__bg" />
        <div className="stage__glow" />

        {/* Hero */}
        <div className="hero">
          <p className="hero__kicker mono reveal">Conseil, audit et développement IA</p>
          <h1 className="hero__title">
            {SLOGAN.map((l, i) => (
              <span key={i} className="hero__l">{i === 0 ? (<>Souveraineté <em>IA</em>,</>) : l}</span>
            ))}
          </h1>
          <ol className="hero__index mono" aria-label="Nos trois offres">
            {OFFERS.map((o) => <li key={o.n}><b>{o.n}</b>{o.short}</li>)}
          </ol>
          <div className="hero__line" />
          <div className="hero__foot">
            <p className="hero__lead reveal">Objectif : gagner du temps.</p>
            <div className="hero__ctas reveal">
              <Magnetic href="#contact" className="btn btn--solid" data-cursor="Go">Prendre rendez-vous <Arrow /></Magnetic>
              <Magnetic href="#offres" className="btn btn--line">Découvrir nos offres</Magnetic>
            </div>
          </div>
          <div className="hero__scroll mono reveal"><span />Scroll</div>
        </div>

        {/* Roue + cercles */}
        <div className="wheel" aria-hidden="true">
          <svg viewBox="0 0 1000 1000">
            <circle cx="500" cy="500" r="498" className="wheel__rim" />
            <circle cx="500" cy="500" r="430" className="wheel__inner" />
            {Array.from({ length: RIM_TICKS }, (_, i) => {
              const a = (i / RIM_TICKS) * Math.PI * 2;
              const big = i % 10 === 0;
              const r1 = 470, r2 = big ? 448 : 460;
              return <line key={i} x1={500 + r1 * Math.cos(a)} y1={500 + r1 * Math.sin(a)} x2={500 + r2 * Math.cos(a)} y2={500 + r2 * Math.sin(a)} className={big ? 'wt wt--big' : 'wt'} />;
            })}
          </svg>
        </div>

        <div className="graph" aria-hidden="true">
          <svg className="graph__svg" />
        </div>
        <div className="core" aria-hidden="true"><span>Gagner<br />du temps</span></div>
        <div className="glabels" aria-hidden="true">
          {OFFERS.map((o) => <span key={o.n} className="glabel"><b className="mono">{o.n}</b>{o.short}</span>)}
        </div>

        <div className="nodes" aria-hidden="true">
          {OFFERS.map((o) => (
            <div className="node" key={o.n}>
              <svg className="node__ticks" viewBox="0 0 200 200">
                {Array.from({ length: TICKS }, (_, i) => {
                  const a = (i / TICKS) * Math.PI * 2;
                  const big = i % 8 === 0;
                  return <line key={i} x1={100 + 90 * Math.cos(a)} y1={100 + 90 * Math.sin(a)} x2={100 + (big ? 99 : 95) * Math.cos(a)} y2={100 + (big ? 99 : 95) * Math.sin(a)} className={big ? 'nt nt--big' : 'nt'} />;
                })}
              </svg>
              <div className="node__orbit"><i /></div>
              <div className="node__core">
                <span className="node__n mono">{o.n}</span>
                <span className="node__label">{o.short}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Textes des offres */}
        <div className="offers" id="offres">
          <div className="offers__meta">
            <span className="mono offers__kicker">Nos offres</span>
            <span className="offers__count mono"><b>01</b> / 03</span>
          </div>
          {OFFERS.map((o) => (
            <article className="offer" key={o.n}>
              <span className="offer__num mono">{o.n}</span>
              <h2>{o.title}</h2>
              <p>{o.desc}</p>
            </article>
          ))}
          <div className="offers__bar offers__meta" aria-hidden="true"><i /><i /><i /></div>
        </div>

        {/* Promesse finale */}
        <div className="promise">
          <span className="mono promise__kicker fade">La promesse</span>
          <h2>De l'audit à la production, tout est relié.</h2>
          <p className="fade">Un seul objectif : vous faire gagner du temps.</p>
          <div className="fade"><Magnetic href="#contact" className="btn btn--white" data-cursor="Go">Prendre rendez-vous <Arrow /></Magnetic></div>
        </div>
      </div>
    </section>
  );
}
