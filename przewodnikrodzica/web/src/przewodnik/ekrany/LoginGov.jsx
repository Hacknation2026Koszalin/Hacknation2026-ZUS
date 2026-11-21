
import { useNavigate } from "react-router-dom";
import KrokiLogowania from "../komponenty/KrokiLogowania.jsx";

const SPOSOBY = [
  {
    id: "mobywatel",
    nazwa: "mObywatel",
    opis: "Potwierdź tożsamość za pomocą aplikacji w telefonie",
    ikona: "/scrolling.svg",
    aktywny: true,
  },
  {
    id: "pz",
    nazwa: "Profil zaufany",
    opis: "Logowanie za pomocą Profilu zaufanego",
    ikona: "/shield.svg",
    aktywny: false,
  },
  {
    id: "bank",
    nazwa: "Bankowość elektroniczna",
    opis: "Logowanie za pośrednictwem banku",
    ikona: "/bank.svg",
    aktywny: false,
  },
  {
    id: "edowod",
    nazwa: "e-Dowód",
    opis: "Logowanie za pomocą e-dowodu",
    ikona: "/business-card.svg",
    aktywny: false,
  },
];

export default function LoginGov() {
  const nawiguj = useNavigate();

  return (
    <main className="gov-login">

      <div className="wrap gov-login__container">

        {/* ETAPY LOGOWANIA */}
        <div className="gov-login__steps">
          <KrokiLogowania aktywny={0} />
        </div>

        {/* NAGŁÓWEK */}
        <header className="gov-login__header">

          <span className="gov-login__eyebrow">
            Weryfikacja tożsamości
          </span>

          <h1>Wybierz sposób logowania</h1>

          <p>
            Aby przejść do Przewodnika młodego rodzica,
            wybierz metodę potwierdzenia tożsamości.
          </p>

        </header>

        {/* METODY LOGOWANIA */}
        <section
          className="gov-login__methods"
          aria-label="Dostępne metody logowania"
        >

          {SPOSOBY.map((sposob) => (
            <button
              key={sposob.id}
              type="button"
              className={`gov-login__method ${
                sposob.aktywny
                  ? "gov-login__method--active"
                  : "gov-login__method--disabled"
              }`}
              disabled={!sposob.aktywny}
              onClick={() => {
                if (sposob.aktywny) {
                  nawiguj("/przewodnik/mobywatel");
                }
              }}
            >

              {/* IKONA */}
              <span className="gov-login__icon">
                <img
                  src={sposob.ikona}
                  alt=""
                  aria-hidden="true"
                />
              </span>

              {/* NAZWA I OPIS */}
              <span className="gov-login__method-content">
                <span className="gov-login__method-name">
                  {sposob.nazwa}
                </span>

                <span className="gov-login__method-description">
                  {sposob.opis}
                </span>
              </span>

              {/* STATUS */}
              {sposob.aktywny ? (
                <span
                  className="gov-login__method-arrow"
                  aria-hidden="true"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </span>
              ) : (
                <span className="gov-login__unavailable">
                  Niedostępne
                </span>
              )}

            </button>
          ))}

        </section>

        {/* INFORMACJA O PROTOTYPIE */}
        <div className="gov-login__notice">

          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path
              d="M12 11v5M12 7.5h.01"
              strokeLinecap="round"
            />
          </svg>

          <p>
            Jest to wersja demonstracyjna serwisu.
            Logowanie odbywa się w trybie symulacji
            i nie wymaga podawania prawdziwych danych.
          </p>

        </div>

      </div>
    </main>
  );
}
