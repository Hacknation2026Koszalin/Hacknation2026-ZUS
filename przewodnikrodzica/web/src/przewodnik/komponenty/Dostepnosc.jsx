// Ułatwienia dostępu (ustawa o dostępności cyfrowej → WCAG 2.1 AA).
// Ustawienia zapisujemy w przeglądarce i nakładamy jako klasy na <html>:
//  a11y-t1 / a11y-t2  — większy tekst (200% zoomu wspiera też sama przeglądarka),
//  a11y-kontrast      — wysoki kontrast,
//  a11y-odstepy       — większe odstępy między wierszami i literami (WCAG 1.4.12),
//  a11y-linki         — podkreślone linki,
//  a11y-ruch          — bez animacji (także gdy system prosi o ograniczenie ruchu).
import { useEffect, useState } from "react";
import Ikona from "../wniosek/Ikona.jsx";

const KLUCZ = "przewodnik-dostepnosc";
const ZDARZENIE = "przewodnik-dostepnosc-zmiana";
const DOMYSLNE = { tekst: 0, kontrast: false, odstepy: false, linki: false, ruch: false };

const czytaj = () => {
  try { return { ...DOMYSLNE, ...JSON.parse(localStorage.getItem(KLUCZ)) }; } catch { return DOMYSLNE; }
};

export function zastosujDostepnosc(u = czytaj()) {
  const h = document.documentElement;
  h.classList.toggle("a11y-t1", u.tekst === 1);
  h.classList.toggle("a11y-t2", u.tekst === 2);
  h.classList.toggle("a11y-kontrast", !!u.kontrast);
  h.classList.toggle("a11y-odstepy", !!u.odstepy);
  h.classList.toggle("a11y-linki", !!u.linki);
  h.classList.toggle("a11y-ruch", !!u.ruch);
}

export function useDostepnosc() {
  const [u, setU] = useState(czytaj);
  useEffect(() => {
    const f = () => setU(czytaj());
    window.addEventListener(ZDARZENIE, f);
    return () => window.removeEventListener(ZDARZENIE, f);
  }, []);
  const zmien = (nowe) => {
    const w = nowe === null ? DOMYSLNE : { ...czytaj(), ...nowe };
    try { localStorage.setItem(KLUCZ, JSON.stringify(w)); } catch { /* nic */ }
    zastosujDostepnosc(w);
    window.dispatchEvent(new Event(ZDARZENIE));
  };
  return [u, zmien];
}

function Przelacznik({ id, etykieta, opis, wartosc, onZmiana }) {
  return (
    <label className="a11y-opcja" htmlFor={id}>
      <span><b>{etykieta}</b><small>{opis}</small></span>
      <input id={id} type="checkbox" role="switch" checked={wartosc} onChange={(e) => onZmiana(e.target.checked)} />
    </label>
  );
}

export function PanelDostepnosci() {
  const [u, zmien] = useDostepnosc();
  return (
    <div className="a11y-panel">
      <fieldset className="a11y-tekst">
        <legend>Wielkość tekstu</legend>
        {[["A", 0, "Standardowy"], ["A+", 1, "Większy"], ["A++", 2, "Największy"]].map(([z, v, opis]) => (
          <button key={v} type="button" aria-pressed={u.tekst === v} aria-label={`${opis} tekst`} className={u.tekst === v ? "wybrany" : ""} onClick={() => zmien({ tekst: v })}>{z}</button>
        ))}
      </fieldset>
      <Przelacznik id="a11y-k" etykieta="Wysoki kontrast" opis="Ciemny tekst, wyraźne obramowania" wartosc={u.kontrast} onZmiana={(v) => zmien({ kontrast: v })} />
      <Przelacznik id="a11y-o" etykieta="Większe odstępy" opis="Łatwiej czytać dłuższe teksty" wartosc={u.odstepy} onZmiana={(v) => zmien({ odstepy: v })} />
      <Przelacznik id="a11y-l" etykieta="Podkreśl linki" opis="Linki widać bez koloru" wartosc={u.linki} onZmiana={(v) => zmien({ linki: v })} />
      <Przelacznik id="a11y-r" etykieta="Zatrzymaj animacje" opis="Bez ruchu i migania" wartosc={u.ruch} onZmiana={(v) => zmien({ ruch: v })} />
      <button type="button" className="a11y-reset" onClick={() => zmien(null)}>Przywróć domyślne</button>
      <p className="a11y-info">
        Całą stronę obsłużysz klawiaturą (Tab, Enter, Esc). Treści czyta czytnik ekranu. Brakuje czegoś?{" "}
        <a href="/deklaracja-dostepnosci">Deklaracja dostępności</a>.
      </p>
    </div>
  );
}

// Przycisk „Dostępność” w górnym pasku — rozwija panel
export function PrzyciskDostepnosci({ ikona = false }) {
  const [otwarte, setOtwarte] = useState(false);
  useEffect(() => {
    zastosujDostepnosc();
    if (!otwarte) return;
    const esc = (e) => e.key === "Escape" && setOtwarte(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [otwarte]);
  return (
    <span className={`a11y-wrap ${ikona ? "a11y-ikonowy" : ""}`}>
      {ikona ? (
        <button type="button" className="ikona-btn" aria-expanded={otwarte} aria-controls="a11y-pop" aria-label="Dostępność" title="Dostępność" onClick={() => setOtwarte((o) => !o)}>
          <Ikona n="czlowiek" rozmiar={22} />
        </button>
      ) : (
        <button type="button" className="a11y-btn" aria-expanded={otwarte} aria-controls="a11y-pop" onClick={() => setOtwarte((o) => !o)}>
          <Ikona n="czlowiek" rozmiar={16} /> Dostępność
        </button>
      )}
      {otwarte && (
        <div id="a11y-pop" className="a11y-pop" role="dialog" aria-label="Ułatwienia dostępu">
          <div className="a11y-pop-glowa">
            <b>Ułatwienia dostępu</b>
            <button type="button" onClick={() => setOtwarte(false)} aria-label="Zamknij">×</button>
          </div>
          <PanelDostepnosci />
        </div>
      )}
    </span>
  );
}
