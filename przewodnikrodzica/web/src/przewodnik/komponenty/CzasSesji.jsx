// Automatyczne wylogowanie po braku aktywności (jak w eZUS / mObywatelu).
// Licznik w menu; minutę przed końcem okno z odliczaniem i „Zostań zalogowany”.
// Test: sessionStorage.setItem("czas-sesji-s", "70") — sesja 70 s zamiast 15 min.
import { useCallback, useEffect, useRef, useState } from "react";
import { useSesja } from "../SesjaContext.jsx";
import Ikona from "../wniosek/Ikona.jsx";

import { P } from "../parametry.js";

const CZAS_S = () => Number(sessionStorage.getItem("czas-sesji-s")) || P.czasSesjiMin * 60;
const OSTRZEZENIE_S = 60;
export const KLUCZ_WYLOGOWANIA = "wylogowano-nieaktywnosc";
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function CzasSesji() {
  const { wyloguj } = useSesja();
  const koniec = useRef(Date.now() + CZAS_S() * 1000);
  const [zostalo, setZostalo] = useState(CZAS_S());
  const ostrzega = zostalo <= OSTRZEZENIE_S;

  const odnow = useCallback(() => {
    koniec.current = Date.now() + CZAS_S() * 1000;
    setZostalo(CZAS_S());
  }, []);

  // Aktywność odnawia sesję — ale nie wtedy, gdy już wisi ostrzeżenie (trzeba kliknąć świadomie)
  useEffect(() => {
    let ostatnio = 0;
    const aktywnosc = () => {
      const t = Date.now();
      if (t - ostatnio < 1000 || koniec.current - t <= OSTRZEZENIE_S * 1000) return;
      ostatnio = t;
      koniec.current = t + CZAS_S() * 1000;
    };
    const zdarzenia = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    zdarzenia.forEach((z) => window.addEventListener(z, aktywnosc, { passive: true }));
    return () => zdarzenia.forEach((z) => window.removeEventListener(z, aktywnosc));
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const s = Math.max(0, Math.ceil((koniec.current - Date.now()) / 1000));
      setZostalo(s);
      if (s === 0) {
        sessionStorage.setItem(KLUCZ_WYLOGOWANIA, "1");
        wyloguj();
      }
    }, 1000);
    return () => clearInterval(t);
  }, [wyloguj]);

  return (
    <>
      <button type="button" className={`cs ${ostrzega ? "pilne" : ""}`} onClick={odnow} title="Kliknij, aby przedłużyć sesję" aria-label={`Sesja wygaśnie za ${mmss(zostalo)}. Kliknij, aby przedłużyć.`}>
        <Ikona n="zegar" rozmiar={16} /> <span aria-hidden="true">{mmss(zostalo)}</span>
      </button>
      {ostrzega && (
        <div className="dk-tlo cs-tlo">
          <div className="dk-okno cs-okno" role="alertdialog" aria-modal="true" aria-labelledby="cs-tytul" aria-describedby="cs-opis">
            <span className="cs-ikona"><Ikona n="zegar" rozmiar={30} /></span>
            <h2 id="cs-tytul">Czy nadal tu jesteś?</h2>
            <p id="cs-opis">Dla Twojego bezpieczeństwa wylogujemy Cię z powodu braku aktywności za:</p>
            <p className="cs-licznik" aria-live="assertive" aria-atomic="true">{mmss(zostalo)}</p>
            <div className="dk-przyciski">
              <button type="button" className="dk-btn dk-btn-tekst" onClick={() => wyloguj()}>Wyloguj teraz</button>
              <button type="button" className="dk-btn dk-btn-glowny" onClick={odnow} autoFocus>Zostań zalogowany</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
