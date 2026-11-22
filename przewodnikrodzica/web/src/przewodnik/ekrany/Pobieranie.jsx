
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import KrokiLogowania from "../komponenty/KrokiLogowania.jsx";
import { useSesja } from "../SesjaContext.jsx";
import { DANE_ZUS_ZAPAS } from "../dane.js";

const POZYCJE = [
  "Ubezpieczenie chorobowe i podstawa wymiaru",
  "Zaświadczenia lekarskie e-ZLA",
  "Stan rozliczeń składek",
];

const KROK_MS = 700;
const PRZEJSCIE_MS = 650;

export default function Pobieranie() {
  const nawiguj = useNavigate();
  const { profil, ustaw } = useSesja();

  const [gotowe, setGotowe] = useState(0);
  const [pobieranieZakonczone, setPobieranieZakonczone] =
    useState(false);

  const ustawRef = useRef(ustaw);
  const nawigujRef = useRef(nawiguj);

  useEffect(() => {
    ustawRef.current = ustaw;
    nawigujRef.current = nawiguj;
  }, [ustaw, nawiguj]);

  useEffect(() => {
    const controller = new AbortController();
    const timery = [];
    let aktywne = true;

    const pesel = profil?.pesel || "";

    const pobierzDane = async () => {
      try {
        const odpowiedz = await fetch(
          `/api/symulacja/zus/${encodeURIComponent(pesel)}`,
          { signal: controller.signal }
        );

        if (!odpowiedz.ok) {
          throw new Error("API ZUS niedostępne");
        }

        const dane = await odpowiedz.json();

        if (
          !dane ||
          typeof dane !== "object" ||
          Array.isArray(dane)
        ) {
          throw new Error("Nieprawidłowy format danych");
        }

        return dane;
      } catch (error) {
        if (error.name === "AbortError") {
          return null;
        }

        return DANE_ZUS_ZAPAS;
      }
    };

    const danePromise = pobierzDane();

    // Kolejne elementy zmieniają status co 700 ms.
    POZYCJE.forEach((_, index) => {
      const timer = setTimeout(() => {
        if (aktywne) {
          setGotowe(index + 1);
        }
      }, KROK_MS * (index + 1));

      timery.push(timer);
    });

    // Kończymy animację, gdy minie czas i
    // odpowiedź API (lub dane zapasowe) będzie gotowa.
    const zakoncz = async () => {
      const dane = await danePromise;

      if (!aktywne || !dane) return;

      setGotowe(POZYCJE.length);
      setPobieranieZakonczone(true);

      ustawRef.current({
        zus: dane,
        zalogowany: true,
      });

      const timer = setTimeout(() => {
        if (aktywne) {
          nawigujRef.current("/przewodnik/witaj");
        }
      }, PRZEJSCIE_MS);

      timery.push(timer);
    };

    const timer = setTimeout(
      zakoncz,
      KROK_MS * POZYCJE.length
    );

    timery.push(timer);

    return () => {
      aktywne = false;
      controller.abort();
      timery.forEach(clearTimeout);
    };
  }, [profil?.pesel]);

  const procent = Math.round(
    (gotowe / POZYCJE.length) * 100
  );

  return (
    <main className="zus-fetch">
      <div className="zus-fetch__container">

        {/* POSTĘP LOGOWANIA */}
        <div className="zus-fetch__steps">
          <KrokiLogowania aktywny={3} />
        </div>

        {/* NAGŁÓWEK */}
        <header className="zus-fetch__header">

          <span className="zus-fetch__eyebrow">
            Przygotowujemy Twój przewodnik
          </span>

          <h1>
            Pobieramy potrzebne informacje
          </h1>

          <p>
            Sprawdzamy dane, które pomogą dopasować
            informacje o świadczeniach do Twojej sytuacji.
          </p>

        </header>

        {/* GŁÓWNY POSTĘP */}
        <section
          className="zus-fetch__content"
          aria-label="Postęp pobierania danych"
        >

          <div className="zus-fetch__progress-head">
            <span>
              {pobieranieZakonczone
                ? "Dane są gotowe"
                : "Trwa przygotowywanie danych"}
            </span>

            <strong>{procent}%</strong>
          </div>

          <div
            className="zus-fetch__progress"
            role="progressbar"
            aria-label="Postęp przygotowywania danych"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={procent}
          >
            <div
              className="zus-fetch__progress-fill"
              style={{ width: `${procent}%` }}
            />
          </div>

          {/* LISTA POBIERANYCH DANYCH */}
          <ul className="zus-fetch__list">

            {POZYCJE.map((pozycja, index) => {
              const zakonczone = index < gotowe;
              const aktualne =
                index === gotowe &&
                !pobieranieZakonczone;

              return (
                <li
                  key={pozycja}
                  className={[
                    "zus-fetch__item",
                    zakonczone
                      ? "is-done"
                      : aktualne
                      ? "is-current"
                      : "is-pending",
                  ].join(" ")}
                >

                  <span
                    className="zus-fetch__item-icon"
                    aria-hidden="true"
                  >
                    {zakonczone ? (
                      <svg
                        viewBox="0 0 24 24"
                        width="17"
                        height="17"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                    ) : aktualne ? (
                      <span className="zus-fetch__spinner" />
                    ) : (
                      <span className="zus-fetch__pending-dot" />
                    )}
                  </span>

                  <span className="zus-fetch__item-text">
                    {pozycja}
                  </span>

                  <span className="zus-fetch__item-state">
                    {zakonczone
                      ? "Gotowe"
                      : aktualne
                      ? "Sprawdzanie"
                      : "Oczekuje"}
                  </span>

                </li>
              );
            })}

          </ul>
        </section>

        {/* KOMUNIKAT */}
        <div
          className={`zus-fetch__message ${
            pobieranieZakonczone ? "is-success" : ""
          }`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {pobieranieZakonczone ? (
            <>
              <span
                className="zus-fetch__message-dot"
                aria-hidden="true"
              />

              <p>
                Wszystko gotowe. Za chwilę przejdziesz
                do swojego przewodnika.
              </p>
            </>
          ) : (
            <>
              <span
                className="zus-fetch__message-dot"
                aria-hidden="true"
              />

              <p>
                Nie zamykaj tej strony. Przejście do
                przewodnika nastąpi automatycznie.
              </p>
            </>
          )}
        </div>

        <p className="zus-fetch__disclaimer">
          Wersja demonstracyjna — pobieranie danych
          z ZUS jest symulowane.
        </p>

      </div>
    </main>
  );
}
