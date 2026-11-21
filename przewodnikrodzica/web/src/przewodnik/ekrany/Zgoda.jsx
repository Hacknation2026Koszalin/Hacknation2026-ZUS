
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import KrokiLogowania from "../komponenty/KrokiLogowania.jsx";
import { useSesja } from "../SesjaContext.jsx";
import { PROFIL_MOBYWATEL } from "../dane.js";

export default function Zgoda() {
  const nawiguj = useNavigate();
  const { ustaw } = useSesja();

  const [profil, setProfil] = useState(PROFIL_MOBYWATEL);

  // Pobieranie danych symulacyjnych z backendu .NET.
  useEffect(() => {
    const controller = new AbortController();

    const pobierzProfil = async () => {
      try {
        const response = await fetch(
          "/api/symulacja/mobywatel",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Nie udało się pobrać profilu");
        }

        const dane = await response.json();

        if (
          dane &&
          typeof dane === "object" &&
          !Array.isArray(dane)
        ) {
          setProfil({
            ...PROFIL_MOBYWATEL,
            ...dane,
          });
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        // Pozostawiamy profil demonstracyjny.
      }
    };

    pobierzProfil();

    return () => controller.abort();
  }, []);

  const formatujDate = (wartosc) => {
    if (!wartosc) return "—";

    const data = new Date(wartosc);

    if (Number.isNaN(data.getTime())) {
      return "—";
    }

    return data.toLocaleDateString("pl-PL");
  };

  const pola = [
    {
      nazwa: "Imię i nazwisko",
      wartosc: `${profil.imie ?? ""} ${
        profil.nazwisko ?? ""
      }`.trim(),
    },
    {
      nazwa: "PESEL",
      wartosc: profil.pesel,
    },
    {
      nazwa: "Data urodzenia",
      wartosc: formatujDate(profil.dataUrodzenia),
    },
    {
      nazwa: "Obywatelstwo",
      wartosc: profil.obywatelstwo,
    },
    {
      nazwa: "Adres zamieszkania",
      wartosc: profil.adres,
    },
  ];

  const zgadzam = () => {
    ustaw({ profil });
    nawiguj("/przewodnik/pobieranie");
  };

  return (
    <main className="zgoda-page">
      <div className="zgoda-page__container">

        {/* POSTĘP LOGOWANIA */}
        <div className="zgoda-page__progress">
          <KrokiLogowania aktywny={2} />
        </div>

        {/* NAGŁÓWEK */}
        <header className="zgoda-page__header">
          <span className="zgoda-page__eyebrow">
            Ostatni krok logowania
          </span>

          <h1>
            Potwierdź przekazanie danych
          </h1>

          <p>
            Aby przygotować Twój indywidualny
            przewodnik, potrzebujemy poniższych
            informacji. Sprawdź ich poprawność
            przed kontynuowaniem.
          </p>
        </header>

        {/* DANE OSOBOWE */}
        <section
          className="zgoda-page__section"
          aria-labelledby="zgoda-dane-title"
        >
          <div className="zgoda-page__section-heading">
            <h2 id="zgoda-dane-title">
              Dane z mObywatela
            </h2>

            <span className="zgoda-page__source">
              Dane demonstracyjne
            </span>
          </div>

          <dl className="zgoda-page__data">
            {pola.map(({ nazwa, wartosc }) => (
              <div
                key={nazwa}
                className="zgoda-page__data-row"
              >
                <dt>{nazwa}</dt>
                <dd>{wartosc || "—"}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ZAKRES DANYCH Z ZUS */}
        <section
          className="zgoda-page__zus"
          aria-labelledby="zgoda-zus-title"
        >
          <div className="zgoda-page__zus-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3 4 7v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V7l-8-4Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          <div>
            <h2 id="zgoda-zus-title">
              Jakie dane pobierzemy z ZUS?
            </h2>

            <p>
              Po wyrażeniu zgody przewodnik
              wykorzysta również informacje
              o Twoim ubezpieczeniu chorobowym,
              podstawie wymiaru zasiłku,
              zaświadczeniach lekarskich e-ZLA
              oraz stanie rozliczeń składek.
            </p>
          </div>
        </section>

        {/* PRZYCISKI */}
        <div className="zgoda-page__actions">
          <button
            type="button"
            className="zgoda-page__confirm"
            onClick={zgadzam}
          >
            Zgadzam się i kontynuuję

            <svg
              width="18"
              height="18"
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
          </button>

          <button
            type="button"
            className="zgoda-page__cancel"
            onClick={() => nawiguj("/przewodnik")}
          >
            Anuluj
          </button>
        </div>

        <p className="zgoda-page__disclaimer">
          To wersja demonstracyjna. Dane pochodzą
          z symulacji i nie są pobierane z rzeczywistego
          systemu mObywatel ani ZUS.
        </p>

      </div>
    </main>
  );
}
