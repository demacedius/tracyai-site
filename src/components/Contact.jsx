import { useRef, useState } from 'react';
import useReveal from '../useReveal.js';
import { OFFERS, FORM_ENDPOINT } from '../data.js';
import Magnetic from './Magnetic.jsx';
import Arrow from './Arrow.jsx';

export default function Contact() {
  const root = useRef(null);
  const [needs, setNeeds] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error | demo
  useReveal(root);

  const toggle = (n) => setNeeds((v) => (v.includes(n) ? v.filter((x) => x !== n) : [...v, n]));

  const submit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    data.besoins = needs.join(', ');
    if (!FORM_ENDPOINT) { setStatus('demo'); return; }
    setStatus('sending');
    try {
      const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      setStatus(r.ok ? 'sent' : 'error');
    } catch { setStatus('error'); }
  };

  return (
    <section className="contact" id="contact" ref={root} data-theme="dark">
      <div className="wrap contact__grid">
        <div className="contact__intro">
          <p className="kicker mono" data-fade>Contact</p>
          <h2 className="h2 h2--xl" data-split>Parlons de votre <em>projet</em>.</h2>
          <p className="contact__lead" data-fade="1">Un premier échange pour comprendre vos enjeux et voir où l'IA peut vous faire gagner du temps.</p>
        </div>

        {status === 'sent' || status === 'demo' ? (
          <div className="contact__done" data-fade>
            <p className="h3">Merci, votre demande est bien partie.</p>
            <p>Nous revenons vers vous rapidement.</p>
            {status === 'demo' && <p className="mono contact__demo">Mode démo : le formulaire n'est pas encore relié à une adresse.</p>}
          </div>
        ) : (
          <form className="form" onSubmit={submit} data-fade="1">
            <fieldset className="form__needs">
              <legend className="mono">Votre besoin</legend>
              {OFFERS.map((o) => (
                <button type="button" key={o.n} className={`chip ${needs.includes(o.short) ? 'is-on' : ''}`} aria-pressed={needs.includes(o.short)} onClick={() => toggle(o.short)}>
                  <span className="mono">{o.n}</span>{o.short}
                </button>
              ))}
            </fieldset>
            <div className="form__row">
              <label className="field"><input name="nom" required placeholder=" " autoComplete="name" /><span>Nom et prénom</span></label>
              <label className="field"><input name="societe" placeholder=" " autoComplete="organization" /><span>Société</span></label>
            </div>
            <label className="field"><input name="email" type="email" required placeholder=" " autoComplete="email" /><span>Email professionnel</span></label>
            <label className="field"><textarea name="message" rows="3" placeholder=" " /><span>Votre projet en quelques mots</span></label>
            <div className="form__foot">
              <Magnetic as="button" type="submit" className="btn btn--white btn--lg" data-cursor="Envoyer" disabled={status === 'sending'}>
                {status === 'sending' ? 'Envoi…' : 'Prendre rendez-vous'} <Arrow />
              </Magnetic>
              {status === 'error' && <p className="form__error">Une erreur est survenue, réessayez dans un instant.</p>}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
