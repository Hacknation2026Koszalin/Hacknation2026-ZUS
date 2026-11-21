import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KrokiLogowania from "../komponenty/KrokiLogowania.jsx";
import { useSesja } from "../SesjaContext.jsx";
import { DANE_ZUS_ZAPAS } from "../dane.js";

// Krok 4: animacja pobierania danych z ZUS, potem przewodnik powitalny
const POZYCJE = ["Ubezpieczenie chorobowe i podstawa wymiaru", "Zaświadczenia lekarskie e-ZLA", "Stan rozliczeń składek"];

export default function Pobieranie() {
  const nawiguj = useNavigate();
  const { profil, ustaw } = useSesja();
  const [gotowe, setGotowe] = useState(0); // ile pozycji odhaczonych

  useEffect(() => {
    const pesel = profil?.pesel || "";
    const dane = fetch(`/api/symulacja/zus/${pesel}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .catch(() => DANE_ZUS_ZAPAS);

    // odhaczamy po kolei co 700 ms, niezależnie od szybkości odpowiedzi
    const timery = POZYCJE.map((_, i) => setTimeout(() => setGotowe(i + 1), 700 * (i + 1)));
    const koniec = setTimeout(async () => {
      ustaw({ zus: await dane, zalogowany: true });
      nawiguj("/przewodnik/witaj");
    }, 700 * POZYCJE.length + 600);

    return () => [...timery, koniec].forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="wrap page narrow">
      <KrokiLogowania aktywny={3} />
      <div className="sim-box">
        <p className="sim-tag">SYMULACJA</p>
        <h1>Pobieramy Twoje dane z ZUS</h1>
        <ul className="pobieranie" aria-live="polite">
          {POZYCJE.map((p, i) => (
            <li key={p} className={i < gotowe ? "ok" : i === gotowe ? "teraz" : ""}>
              <span className="pob-ikona" aria-hidden="true">{i < gotowe ? "✓" : i === gotowe ? "" : "•"}</span>
              {p}
            </li>
          ))}
        </ul>
        <div className="pasek" aria-hidden="true"><div style={{ width: `${(gotowe / POZYCJE.length) * 100}%` }} /></div>
      </div>
    </div>
  );
}
