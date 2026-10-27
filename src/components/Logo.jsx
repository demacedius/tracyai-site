/* Logo Tracy AI : version texte foncé sur fond clair, texte blanc sur fond sombre */
export default function Logo({ dark }) {
  return (
    <span className={`logo ${dark ? 'logo--dark' : ''}`}>
      <img className="logo__light" src="/assets/tracyai-logo-light.svg" alt="Tracy AI" width="141" height="37" />
      <img className="logo__dark" src="/assets/tracyai-logo-dark.svg" alt="" aria-hidden="true" width="141" height="37" />
    </span>
  );
}
