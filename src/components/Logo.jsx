/* Logo Tracy AI : version texte foncé sur fond clair, texte blanc sur fond sombre */
export default function Logo({ dark }) {
  return (
    <span className={`logo ${dark ? 'logo--dark' : ''}`}>
      <img className="logo__light" src="/assets/tracyai-nav-light.svg" alt="Tracy AI" width="168" height="44" />
      <img className="logo__dark" src="/assets/tracyai-nav-dark.svg" alt="" aria-hidden="true" width="168" height="44" />
    </span>
  );
}
