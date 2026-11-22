import { Link } from "react-router-dom";

export default function Przewodnik() {
  return (
    <main className="parent-guide">
      {/* NAWIGACJA OKRUSZKOWA */}
      <div className="wrap">
        <nav
          aria-label="Ścieżka nawigacji"
          className="parent-guide__breadcrumb"
        >
          <Link to="/">Strona główna</Link>

          <span aria-hidden="true">/</span>

          <Link to="/swiadczenia/zasilki">Świadczenia</Link>

          <span aria-hidden="true">/</span>

          <span aria-current="page">Przewodnik młodego rodzica</span>
        </nav>
      </div>

      {/* GŁÓWNA SEKCJA */}
      <section
        className="parent-guide__hero"
        aria-labelledby="parent-guide-title"
      >
        <div className="wrap parent-guide__layout">
          <div className="parent-guide__intro">
            <div className="parent-guide__eyebrow">
              <span aria-hidden="true" />
              DLA PRZYSZŁYCH I OBECNYCH RODZICÓW
            </div>

            <h1 id="parent-guide-title">
              Rodzicielstwo to
              <br />
              nowy rozdział.
              <br />
              <span>Formalności nie muszą.</span>
            </h1>

            <p className="parent-guide__lead">
              Sprawdź, jakie świadczenia mogą Ci przysługiwać w ciąży i po
              narodzinach dziecka. Dowiedz się, ile możesz otrzymać, jakie
              dokumenty przygotować i kiedy złożyć wniosek.
            </p>

            <div className="parent-guide__actions">
              <Link
                to="/logowanie?cel=przewodnik"
                className="parent-guide__button"
              >
                Zaloguj się przez mObywatel
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </Link>
            </div>

            <p className="parent-guide__notice">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v5M12 7.5h.01" strokeLinecap="round" />
              </svg>
              Logowanie w wersji demonstracyjnej jest symulowane.
            </p>
          </div>

          {/* DEKORACYJNA CZĘŚĆ GRAFICZNA */}
          <div className="parent-guide__visual" aria-hidden="true">
            <div className="parent-guide__visual-back" />

            <div className="parent-guide__visual-main">
              <svg viewBox="0 0 430 430" width="100%" height="100%" fill="none">
                <circle
                  cx="215"
                  cy="215"
                  r="166"
                  stroke="#B3D9BE"
                  strokeWidth="1.5"
                />
                <circle
                  cx="215"
                  cy="215"
                  r="126"
                  stroke="#B3D9BE"
                  strokeWidth="1.5"
                />
                <circle
                  cx="215"
                  cy="215"
                  r="86"
                  stroke="#B3D9BE"
                  strokeWidth="1.5"
                />

                <path
                  d="M215 283s-87-49-87-116c0-27 21-48 48-48 17 0 31 8 39 23 8-15 22-23 39-23 27 0 48 21 48 48 0 67-87 116-87 116Z"
                  fill="#059037"
                  fillOpacity=".12"
                  stroke="#059037"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* JAK TO DZIAŁA */}
      <section
        className="parent-guide__how"
        aria-labelledby="parent-guide-how-title"
      >
        <div className="wrap">
          <div className="parent-guide__section-heading">
            <h2 id="parent-guide-how-title">Jak działa przewodnik?</h2>

            <p>Trzy proste kroki, które pomogą Ci uporządkować formalności.</p>
          </div>

          <div className="parent-guide__steps">
            <div className="parent-guide__step">
              <span className="parent-guide__step-number">01</span>

              <h3>Opowiedz nam o swojej sytuacji</h3>

              <p>
                Odpowiedz na kilka pytań dotyczących zatrudnienia, ciąży lub
                narodzin dziecka.
              </p>
            </div>

            <div className="parent-guide__step">
              <span className="parent-guide__step-number">02</span>

              <h3>Sprawdź przysługujące świadczenia</h3>

              <p>
                Zobacz, jakie zasiłki mogą Ci przysługiwać i poznaj ich
                orientacyjną wysokość.
              </p>
            </div>

            <div className="parent-guide__step">
              <span className="parent-guide__step-number">03</span>

              <h3>Przygotuj potrzebne dokumenty</h3>

              <p>
                Dowiedz się, jakie wnioski przygotować, gdzie je złożyć i jakich
                terminów pilnować.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
