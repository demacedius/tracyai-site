import { useRef } from 'react';
import useReveal from '../useReveal.js';
import { MISSION, OFFERS } from '../data.js';

export default function About() {
  const root = useRef(null);
  useReveal(root);
  return (
    <section className="about" id="apropos" ref={root} data-theme="light">
      <div className="wrap">
        <div className="rule" data-line />
        <div className="about__grid">
          <div>
            <p className="kicker mono" data-fade>À propos</p>
            <h2 className="h2" data-split>Notre <em>mission</em></h2>
          </div>
          <div className="about__text">
            {MISSION.map((p, i) => <p key={i} data-fade={i}>{p}</p>)}
          </div>
        </div>
        <ol className="steps">
          {OFFERS.map((o, i) => (
            <li key={o.n} data-fade={i}>
              <span className="mono">{o.n}</span>
              <b>{o.title}</b>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
