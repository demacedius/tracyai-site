import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Écrans tactiles (téléphones, tablettes) : scroll natif normalisé par GSAP au lieu de Lenis.
// Évite les sauts de la barre d'adresse iOS et les tremblements de la section épinglée.
export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

ScrollTrigger.config({ ignoreMobileResize: true });

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger, SplitText };
