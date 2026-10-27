import { useRef } from 'react';
import useReveal from '../useReveal.js';
import Arrow from './Arrow.jsx';
import { CLIENTS } from '../data.js';

/* Références clients. Remplacer le wordmark texte par le logo SVG dès qu'il est fourni. */
export default function Trust() {
  const root = useRef(null);
  useReveal(root);
  return (
    <section className="trust" id="references" ref={root} data-theme="light">
      <div className="wrap">
        <div className="rule" data-line />
        <div className="trust__grid">
          <div>
            <p className="kicker mono" data-fade>Références</p>
            <h2 className="h2" data-split>Ils nous ont fait <em>confiance</em></h2>
          </div>
          <ul className="trust__list">
            {CLIENTS.map((c, i) => (
              <li key={c.name} data-fade={i}>
                <a className="client" href={c.url} target="_blank" rel="noopener noreferrer">
                  <span className="client__mark">{c.mark}</span>
                  <span className="client__meta">
                    <span className="mono">{c.sector}</span>
                    <span>{c.desc}</span>
                  </span>
                  <span className="client__go" aria-hidden><Arrow /></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
