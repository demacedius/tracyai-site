import { useEffect, useRef } from 'react';
import { gsap, reducedMotion } from '../gsap.js';

// Bouton magnétique : il est attiré par le curseur
export default function Magnetic({ as: Tag = 'a', className = '', strength = 0.35, children, ...rest }) {
  const el = useRef(null);
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    const node = el.current;
    const inner = node.querySelector('.mag__inner');
    const xTo = gsap.quickTo(node, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(node, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const ixTo = inner && gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const iyTo = inner && gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const move = (e) => {
      const r = node.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      xTo(x * strength); yTo(y * strength);
      if (inner) { ixTo(x * strength * 0.4); iyTo(y * strength * 0.4); }
    };
    const leave = () => { xTo(0); yTo(0); if (inner) { ixTo(0); iyTo(0); } };
    node.addEventListener('pointermove', move);
    node.addEventListener('pointerleave', leave);
    return () => { node.removeEventListener('pointermove', move); node.removeEventListener('pointerleave', leave); };
  }, [strength]);
  return (
    <Tag ref={el} className={`mag ${className}`} {...rest}>
      <span className="mag__inner">{children}</span>
    </Tag>
  );
}
