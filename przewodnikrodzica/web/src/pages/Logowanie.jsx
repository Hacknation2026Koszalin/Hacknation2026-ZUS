import { Link } from "react-router-dom";

// Ekran wyboru sposobu logowania (symulacja). Nie zbieramy żadnych haseł ani danych logowania.
export default function Logowanie() {
  return (
    <div className="wrap page narrow">
      <h1>Zaloguj się</h1>
      <p className="lead">Wybierz sposób logowania. W prototypie działa tylko symulacja mObywatela.</p>
      <div className="login-options">
        <button className="login-option" disabled aria-disabled="true" title="Niedostępne w prototypie">
          <span className="login-icon" aria-hidden="true">📱</span>
          <span><b>Aplikacja mobilna ZUS</b><small>Skanuj kod QR za pomocą aplikacji mobilnej</small></span>
          <span aria-hidden="true">›</span>
        </button>
        <Link to="/przewodnik" className="login-option">
          <span className="login-icon" aria-hidden="true">🛡️</span>
          <span><b>login.gov.pl</b><small>Profil zaufany, bankowość, mObywatel, e-Dowód lub eID</small></span>
          <span aria-hidden="true">›</span>
        </Link>
      </div>
      <p className="muted small">Symulacja: kliknięcie „login.gov.pl” przeniesie do Przewodnika. Tu podepniecie ekrany logowania mObywatelem z planu podstron.</p>
    </div>
  );
}
