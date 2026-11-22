// Ułatwienia dostępu (ustawa o dostępności cyfrowej → WCAG 2.1 AA).
// Ustawienia zapisujemy w przeglądarce i nakładamy jako klasy na <html>:
//  a11y-t1 / a11y-t2          — większy tekst,
//  a11y-kontrast              — wysoki kontrast (ciemny tekst, wyraźne ramki),
//  a11y-zolty / a11y-zolty-j  — żółty tekst na czarnym / czarny tekst na żółtym,
//  a11y-dalt-cz / a11y-dalt-nz— kolory dla daltonistów (czerwony–zielony / niebieski–żółty),
//  a11y-odstepy               — większe odstępy (WCAG 1.4.12),
//  a11y-czcionka              — czytelna czcionka (np. przy dysleksji),
//  a11y-linki                 — podkreślone linki,
//  a11y-kursor                — duży kursor,
//  a11y-fokus                 — mocno widoczny fokus klawiatury,
//  a11y-ruch                  — bez animacji (także gdy system prosi o ograniczenie ruchu),
//  a11y-obrazki               — ukryte zdjęcia i ilustracje dekoracyjne.
// Do tego: czytanie na głos (Web Speech API) i linijka do czytania.
import { useEffect, useState } from "react";
import Ikona from "../wniosek/Ikona.jsx";

const KLUCZ = "przewodnik-dostepnosc";
const ZDARZENIE = "przewodnik-dostepnosc-zmiana";
const DOMYSLNE = { tekst: 0, kontrast: "brak", daltonizm: "brak", odstepy: false, czcionka: false, linki: false, kursor: false, fokus: false, ruch: false, obrazki: false, czytaj: false, linijka: false };

const czytaj = () => {
  try {
    const u = { ...DOMYSLNE, ...JSON.parse(localStorage.getItem(KLUCZ)) };
    if (u.kontrast === true) u.kontrast = "wysoki"; // stary zapis
    if (u.kontrast === false) u.kontrast = "brak";
    return u;
  } catch { return DOMYSLNE; }
};

// ---------- czytanie na głos ----------
const mowa = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;
export const mowaDostepna = !!mowa;
export function przeczytaj(tekst) {
  if (!mowa || !tekst) return;
  mowa.cancel();
  const u = new SpeechSynthesisUtterance(tekst.replace(/\s+/g, " ").trim().slice(0, 4000));
  u.lang = document.documentElement.lang === "uk" ? "uk-UA" : document.documentElement.lang === "en" ? "en-GB" : "pl-PL";
  u.rate = 0.95;
  mowa.speak(u);
}
export const zatrzymajCzytanie = () => mowa?.cancel();
function tekstElementu(el) {
  const cel = el.closest("button, a, label, h1, h2, h3, p, li, td, th, dt, dd, summary, legend") || el;
  return cel.getAttribute("aria-label") || cel.innerText || cel.textContent || "";
}
const naKlik = (e) => {
  if (e.target.closest(".a11y-pop, .a11y-panel")) return;
  przeczytaj(tekstElementu(e.target));
};
const naFokus = (e) => {
  if (e.target.closest(".a11y-pop, .a11y-panel")) return;
  przeczytaj(tekstElementu(e.target));
};

// ---------- linijka do czytania ----------
let linijka = null;
const ruchLinijki = (e) => { if (linijka) linijka.style.top = `${e.clientY - 22}px`; };

export function zastosujDostepnosc(u = czytaj()) {
  const h = document.documentElement;
  h.classList.toggle("a11y-t1", u.tekst === 1);
  h.classList.toggle("a11y-t2", u.tekst === 2);
  h.classList.toggle("a11y-kontrast", u.kontrast === "wysoki");
  h.classList.toggle("a11y-zolty", u.kontrast === "zolty");
  h.classList.toggle("a11y-zolty-j", u.kontrast === "zolty-jasny");
  h.classList.toggle("a11y-dalt-cz", u.daltonizm === "cz");
  h.classList.toggle("a11y-dalt-nz", u.daltonizm === "nz");
  h.classList.toggle("a11y-odstepy", !!u.odstepy);
  h.classList.toggle("a11y-czcionka", !!u.czcionka);
  h.classList.toggle("a11y-linki", !!u.linki);
  h.classList.toggle("a11y-kursor", !!u.kursor);
  h.classList.toggle("a11y-fokus", !!u.fokus);
  h.classList.toggle("a11y-ruch", !!u.ruch);
  h.classList.toggle("a11y-obrazki", !!u.obrazki);
  // czytanie po kliknięciu / po przejściu Tabem
  document.removeEventListener("click", naKlik, true);
  document.removeEventListener("focusin", naFokus, true);
  if (u.czytaj && mowa) {
    document.addEventListener("click", naKlik, true);
    document.addEventListener("focusin", naFokus, true);
  } else zatrzymajCzytanie();
  // linijka
  window.removeEventListener("mousemove", ruchLinijki);
  if (u.linijka) {
    if (!linijka) {
      linijka = document.createElement("div");
      linijka.className = "a11y-linijka";
      linijka.setAttribute("aria-hidden", "true");
      document.body.appendChild(linijka);
    }
    window.addEventListener("mousemove", ruchLinijki);
  } else if (linijka) { linijka.remove(); linijka = null; }
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

function Przelacznik({ id, etykieta, opis, wartosc, onZmiana, wylaczony }) {
  return (
    <label className={`a11y-opcja ${wylaczony ? "wylaczona" : ""}`} htmlFor={id}>
      <span><b>{etykieta}</b><small>{opis}</small></span>
      <input id={id} type="checkbox" role="switch" checked={wartosc} disabled={wylaczony} onChange={(e) => onZmiana(e.target.checked)} />
    </label>
  );
}

function Wybor({ legenda, wartosc, opcje, onZmiana, klasa = "" }) {
  return (
    <fieldset className={`a11y-wybor ${klasa}`}>
      <legend>{legenda}</legend>
      <div className="a11y-wybor-opcje">
        {opcje.map(([v, nazwa, podglad]) => (
          <button key={v} type="button" aria-pressed={wartosc === v} className={wartosc === v ? "wybrany" : ""} onClick={() => onZmiana(v)}>
            {podglad && <span className={`a11y-podglad ${podglad}`} aria-hidden="true">Aa</span>}
            {nazwa}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function PanelDostepnosci() {
  const [u, zmien] = useDostepnosc();
  const czytajStrone = () => {
    const main = document.querySelector("main, .modul, #root");
    przeczytaj(main?.innerText || document.body.innerText);
  };
  return (
    <div className="a11y-panel">
      <fieldset className="a11y-tekst">
        <legend>Wielkość tekstu</legend>
        {[["A", 0, "Standardowy"], ["A+", 1, "Większy"], ["A++", 2, "Największy"]].map(([z, v, opis]) => (
          <button key={v} type="button" aria-pressed={u.tekst === v} aria-label={`${opis} tekst`} className={u.tekst === v ? "wybrany" : ""} onClick={() => zmien({ tekst: v })}>{z}</button>
        ))}
      </fieldset>

      <Wybor legenda="Kontrast" wartosc={u.kontrast} onZmiana={(v) => zmien({ kontrast: v })} klasa="a11y-kontrasty"
        opcje={[["brak", "Standardowy", "pg-std"], ["wysoki", "Wysoki", "pg-wys"], ["zolty", "Żółty na czarnym", "pg-zc"], ["zolty-jasny", "Czarny na żółtym", "pg-cz"]]} />

      <Wybor legenda="Kolory dla daltonistów" wartosc={u.daltonizm} onZmiana={(v) => zmien({ daltonizm: v })}
        opcje={[["brak", "Wyłączone"], ["cz", "Czerwony i zielony"], ["nz", "Niebieski i żółty"]]} />
      <p className="a11y-podpowiedz">Statusy pokazujemy też ikoną i słowem — nie tylko kolorem.</p>

      <div className="a11y-czytnik">
        <b>Czytanie na głos</b>
        {mowaDostepna ? (
          <div className="a11y-czytnik-przyciski">
            <button type="button" onClick={czytajStrone}><Ikona n="dymek" rozmiar={16} /> Przeczytaj stronę</button>
            <button type="button" onClick={zatrzymajCzytanie}>Zatrzymaj</button>
          </div>
        ) : <small>Twoja przeglądarka nie obsługuje czytania na głos. Użyj czytnika ekranu (NVDA, VoiceOver, TalkBack).</small>}
      </div>
      <Przelacznik id="a11y-c" etykieta="Czytaj po kliknięciu" opis="Czyta tekst, który klikniesz albo zaznaczysz Tabem" wartosc={u.czytaj} wylaczony={!mowaDostepna} onZmiana={(v) => zmien({ czytaj: v })} />
      <Przelacznik id="a11y-cz" etykieta="Czytelna czcionka" opis="Prostsze litery, np. przy dysleksji" wartosc={u.czcionka} onZmiana={(v) => zmien({ czcionka: v })} />
      <Przelacznik id="a11y-o" etykieta="Większe odstępy" opis="Łatwiej czytać dłuższe teksty" wartosc={u.odstepy} onZmiana={(v) => zmien({ odstepy: v })} />
      <Przelacznik id="a11y-li" etykieta="Linijka do czytania" opis="Pasek, który idzie za myszką" wartosc={u.linijka} onZmiana={(v) => zmien({ linijka: v })} />
      <Przelacznik id="a11y-l" etykieta="Podkreśl linki" opis="Linki widać bez koloru" wartosc={u.linki} onZmiana={(v) => zmien({ linki: v })} />
      <Przelacznik id="a11y-f" etykieta="Wyraźny fokus" opis="Gruba ramka przy obsłudze klawiaturą" wartosc={u.fokus} onZmiana={(v) => zmien({ fokus: v })} />
      <Przelacznik id="a11y-k2" etykieta="Duży kursor" opis="Łatwiej znaleźć wskaźnik myszy" wartosc={u.kursor} onZmiana={(v) => zmien({ kursor: v })} />
      <Przelacznik id="a11y-ob" etykieta="Ukryj obrazki" opis="Mniej rozpraszaczy na stronie" wartosc={u.obrazki} onZmiana={(v) => zmien({ obrazki: v })} />
      <Przelacznik id="a11y-r" etykieta="Zatrzymaj animacje" opis="Bez ruchu i migania" wartosc={u.ruch} onZmiana={(v) => zmien({ ruch: v })} />
      <button type="button" className="a11y-reset" onClick={() => zmien(null)}>Przywróć domyślne</button>
      <p className="a11y-info">
        Całą stronę obsłużysz klawiaturą (Tab, Enter, Esc), a treści przeczyta czytnik ekranu (NVDA, JAWS, VoiceOver, TalkBack).
        Osoby głuche: <a href="https://www.zus.pl/kontakt/obsluga-osob-niepelnosprawnych" target="_blank" rel="noreferrer">tłumacz polskiego języka migowego (PJM)<span className="sr-only"> — otwiera się w nowej karcie</span></a>.{" "}
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
