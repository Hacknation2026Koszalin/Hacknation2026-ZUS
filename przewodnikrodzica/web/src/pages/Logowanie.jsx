import { Link } from "react-router-dom";
import "../index.css";

export default function Logowanie() {
  return (
    <main className="login-page">
      <div className="login-container">
        {/* NAGŁÓWEK */}
        <header className="login-header">
          <span className="login-eyebrow">DOSTĘP DO PRZEWODNIKA</span>

          <h1>Wybierz sposób logowania</h1>

          <p>
            Wybierz jedną z dostępnych metod, aby przejść do przewodnika i
            sprawdzić informacje o przysługujących Ci świadczeniach.
          </p>
        </header>

        {/* METODY LOGOWANIA */}
        <section className="login-methods" aria-label="Metody logowania">
          {/* APLIKACJA MOBILNA ZUS */}
          <div
            className="login-method login-method--disabled"
            aria-disabled="true"
          >
            <div className="login-method__icon">
              <img src="/smartphone.svg" alt="" aria-hidden="true" />
            </div>

            <div className="login-method__content">
              <h2>Aplikacja mobilna ZUS</h2>
              <p>Zaloguj się, skanując kod QR za pomocą aplikacji mobilnej.</p>
            </div>

            <span className="login-method__status">Niedostępne</span>
          </div>

          {/* LOGIN.GOV.PL */}
          <Link
            to="/przewodnik"
            className="login-method login-method--active"
            aria-label="Kontynuuj przez login.gov.pl — symulacja"
          >
            <div className="login-method__icon">
              <img src="/shield.svg" alt="" aria-hidden="true" />
            </div>

            <div className="login-method__content">
              <h2>login.gov.pl</h2>
              <p>
                Profil zaufany, bankowość elektroniczna, mObywatel lub e-Dowód.
              </p>
            </div>

            <span className="login-method__arrow" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </section>

        {/* INFORMACJA O SYMULACJI */}
        <div className="login-notice">
          <div className="login-notice__divider" />

          <p>
            To wersja demonstracyjna aplikacji. Proces logowania jest symulowany
            i nie wymaga podawania rzeczywistych danych osobowych ani danych
            uwierzytelniających.
          </p>
        </div>
      </div>
    </main>
  );
}
