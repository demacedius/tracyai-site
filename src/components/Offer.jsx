import { useRef } from 'react';
import useReveal from '../useReveal.js';
import Magnetic from './Magnetic.jsx';
import { PROBLEMS, BRIQUES, PARCOURS } from '../data.js';

/* Synthèse de l'offre Tracy AI : constat → 3 briques → parcours type */
export default function Offer() {
  const root = useRef(null);
  useReveal(root);
  return (
    <section className="pitch" id="offre" ref={root} data-theme="light">
      <div className="wrap">
        <div className="rule" data-line />
        <div className="pitch__head">
          <div>
            <p className="kicker mono" data-fade>L'offre en détail</p>
            <h2 className="h2" data-split>Une IA chez vous, <em>à coût prévisible.</em></h2>
          </div>
          <p className="pitch__lead" data-fade="1">
            La plupart des entreprises utilisent une IA louée et facturée au token. Simple pour démarrer,
            elle pose trois problèmes dès que l'usage devient réel.
          </p>
        </div>

        <ol className="problems">
          {PROBLEMS.map((p, i) => (
            <li key={p.t} data-fade={i}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <b>{p.t}</b>
              <p>{p.d}</p>
            </li>
          ))}
        </ol>

        <div className="answer" data-fade>
          <span className="answer__dot" aria-hidden />
          <p>
            <b>Notre réponse :</b> déployer l'IA sur une infrastructure que vous maîtrisez, avec des données
            qui restent chez vous. Deux audits pour savoir quoi automatiser et où l'héberger, puis la mise en production.
          </p>
        </div>

        <div className="briques">
          {BRIQUES.map((b, i) => (
            <article className="brique" key={b.n} data-fade={i}>
              <header>
                <span className="mono">{b.n} · {b.tag}</span>
                <h3>{b.title}</h3>
              </header>
              <p className="brique__q">{b.q}</p>
              <ul>{b.items.map((it) => <li key={it}>{it}</li>)}</ul>
              <footer>
                <span className="mono">Livrable</span>
                <p>{b.out}</p>
              </footer>
            </article>
          ))}
        </div>

        <div className="parcours">
          <div className="parcours__head">
            <p className="kicker mono" data-fade>Parcours type</p>
            <p className="parcours__note" data-fade="1">
              Les audits peuvent être menés séparément ou en parallèle. Ensemble, les trois briques forment
              une stratégie IA complète, qui évolue avec votre entreprise.
            </p>
          </div>
          <ol className="parcours__list">
            {PARCOURS.map((s, i) => (
              <li key={s.t} data-fade={i}>
                <span className="parcours__n">{i + 1}</span>
                <b>{s.t}</b>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="parcours__foot" data-fade>
            <p>Tarifs et délais établis après l'échange de cadrage, selon la taille de votre entreprise et le périmètre retenu.</p>
            <Magnetic href="#contact" className="btn btn--solid">Réserver un échange de cadrage</Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
