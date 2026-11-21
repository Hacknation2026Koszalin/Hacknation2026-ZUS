import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KrokiLogowania from "../komponenty/KrokiLogowania.jsx";

// Krok 2: potwierdzenie w aplikacji mObywatel (symulacja). Kod QR jest dekoracyjny.
const KOD = "482 913";
const AUTO_MS = 5000; // po tylu ms "telefon potwierdza" sam

// prosty, stały wzór kwadracików udający kod QR
const qr = Array.from({ length: 21 * 21 }, (_, i) => {
  const x = i % 21, y = Math.floor(i / 21);
  const naroznik = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
  if (naroznik) {
    const lx = x > 13 ? x - 14 : x, ly = y > 13 ? y - 14 : y;
    return lx === 0 || ly === 0 || lx === 6 || ly === 6 || (lx > 1 && lx < 5 && ly > 1 && ly < 5);
  }
  return (x * 7 + y * 13 + x * y) % 5 < 2;
});

export default function Mobywatel() {
  const nawiguj = useNavigate();
  const [potwierdzone, setPotwierdzone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPotwierdzone(true), AUTO_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!potwierdzone) return;
    const t = setTimeout(() => nawiguj("/przewodnik/zgoda"), 1200);
    return () => clearTimeout(t);
  }, [potwierdzone, nawiguj]);

  return (
    <div className="wrap page narrow">
      <KrokiLogowania aktywny={1} />
      <div className="sim-box mob">
        <p className="sim-tag">SYMULACJA LOGOWANIA</p>
        <h1>Potwierdź logowanie w aplikacji mObywatel</h1>
        <div className="mob-grid">
          <svg viewBox="0 0 21 21" className="qr" role="img" aria-label="Kod QR (symulacja)">
            {qr.map((on, i) => on && <rect key={i} x={i % 21} y={Math.floor(i / 21)} width="1" height="1" />)}
          </svg>
          <ol className="mob-kroki">
            <li>Otwórz aplikację <b>mObywatel</b> w telefonie.</li>
            <li>Wybierz <b>Kod QR</b> i zeskanuj kod obok — albo wpisz kod:</li>
            <li className="mob-kod" aria-label={`Kod ${KOD}`}>{KOD}</li>
            <li>Potwierdź logowanie w telefonie.</li>
          </ol>
        </div>

        <div className={`mob-status ${potwierdzone ? "ok" : ""}`} role="status" aria-live="polite">
          {potwierdzone ? "✓ Potwierdzono w aplikacji mObywatel" : (<><span className="spinner" aria-hidden="true" /> Czekamy na potwierdzenie w telefonie…</>)}
        </div>

        {!potwierdzone && (
          <div className="row-btns">
            <button className="btn btn-primary" onClick={() => setPotwierdzone(true)}>Symulacja: potwierdziłam w telefonie</button>
            <button className="btn btn-secondary" onClick={() => nawiguj("/przewodnik/logowanie")}>Wróć</button>
          </div>
        )}
      </div>
    </div>
  );
}
