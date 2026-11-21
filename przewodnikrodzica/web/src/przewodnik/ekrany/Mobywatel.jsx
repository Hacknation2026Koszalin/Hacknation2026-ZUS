
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KrokiLogowania from "../komponenty/KrokiLogowania.jsx";

const KOD = "482 913";
const AUTO_MS = 5000;

const qr = Array.from({ length: 21 * 21 }, (_, i) => {
  const x = i % 21;
  const y = Math.floor(i / 21);

  const naroznik =
    (x < 7 && y < 7) ||
    (x > 13 && y < 7) ||
    (x < 7 && y > 13);

  if (naroznik) {
    const lx = x > 13 ? x - 14 : x;
    const ly = y > 13 ? y - 14 : y;

    return (
      lx === 0 ||
      ly === 0 ||
      lx === 6 ||
      ly === 6 ||
      (lx > 1 && lx < 5 && ly > 1 && ly < 5)
    );
  }

  return (x * 7 + y * 13 + x * y) % 5 < 2;
});

export default function Mobywatel() {
  const nawiguj = useNavigate();
  const [potwierdzone, setPotwierdzone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setPotwierdzone(true),
      AUTO_MS
    );

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!potwierdzone) return;

    const timer = setTimeout(
      () => nawiguj("/przewodnik/zgoda"),
      1200
    );

    return () => clearTimeout(timer);
  }, [potwierdzone, nawiguj]);

  return (
    <main className="mb-auth">
      <div className="mb-auth__container">

        <KrokiLogowania aktywny={1} />

        <div className="mb-auth__header">
          <span className="mb-auth__label">
            Logowanie przez mObywatel
          </span>

          <h1>Potwierdź swoją tożsamość</h1>

          <p>
            Otwórz aplikację mObywatel
            i potwierdź logowanie.
          </p>
        </div>

        <div className="mb-auth__content">

          <div className="mb-auth__qr-area">
            <div className="mb-auth__qr-frame">
              <svg
                viewBox="0 0 21 21"
                className="mb-auth__qr"
                role="img"
                aria-label="Przykładowy kod QR, nie służy do skanowania"
              >
                {qr.map(
                  (on, i) =>
                    on && (
                      <rect
                        key={i}
                        x={i % 21}
                        y={Math.floor(i / 21)}
                        width="1"
                        height="1"
                      />
                    )
                )}
              </svg>
            </div>

            <span className="mb-auth__qr-note">
              Kod QR — symulacja
            </span>
          </div>

          <div className="mb-auth__instructions">
            <h2>Jak potwierdzić?</h2>

            <ol>
              <li>
                Otwórz aplikację <strong>mObywatel</strong>.
              </li>

              <li>
                Wybierz opcję skanowania kodu QR.
              </li>

              <li>
                Potwierdź logowanie na telefonie.
              </li>
            </ol>

            <div className="mb-auth__code">
              <span>Przykładowy kod do wpisania</span>
              <strong>{KOD}</strong>
            </div>
          </div>
        </div>

        <div
          className={`mb-auth__status ${
            potwierdzone ? "is-success" : ""
          }`}
          role="status"
          aria-live="polite"
        >
          {potwierdzone ? (
            <>
              <span
                className="mb-auth__check"
                aria-hidden="true"
              >
                ✓
              </span>
              <span>Logowanie potwierdzone</span>
            </>
          ) : (
            <>
              <span
                className="mb-auth__spinner"
                aria-hidden="true"
              />
              <span>Oczekiwanie na potwierdzenie…</span>
            </>
          )}
        </div>

        {!potwierdzone && (
          <div className="mb-auth__actions">
            <button
              type="button"
              className="mb-auth__confirm"
              onClick={() => setPotwierdzone(true)}
            >
              Symuluj potwierdzenie
            </button>

            <button
              type="button"
              className="mb-auth__back"
              onClick={() =>
                nawiguj("/przewodnik/logowanie")
              }
            >
              Wróć
            </button>
          </div>
        )}

        <p className="mb-auth__disclaimer">
          Wersja demonstracyjna — połączenie
          z mObywatelem jest symulowane.
        </p>

      </div>
    </main>
  );
}
