import { useRef, useState } from 'react';
import useReveal from '../useReveal.js';

// Remplacer par l'ID de la vidéo YouTube
const YOUTUBE_ID = '';

export default function Content() {
  const root = useRef(null);
  const [play, setPlay] = useState(false);
  useReveal(root);
  return (
    <section className="content" id="contenus" ref={root} data-theme="light">
      <div className="wrap">
        <div className="rule" data-line />
        <div className="content__head">
          <div>
            <p className="kicker mono" data-fade>Ressources</p>
            <h2 className="h2" data-split>Nos contenus gratuits</h2>
          </div>
        </div>
        <div className="video" data-clip data-cursor="Lire">
          {play && YOUTUBE_ID ? (
            <iframe src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`} title="Vidéo Tracy AI" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          ) : (
            <button className="video__play" aria-label="Lire la vidéo" onClick={() => setPlay(true)}>
              <span><svg width="22" height="24" viewBox="0 0 22 24"><path d="M2 1v22l19-11z" fill="currentColor" /></svg></span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
