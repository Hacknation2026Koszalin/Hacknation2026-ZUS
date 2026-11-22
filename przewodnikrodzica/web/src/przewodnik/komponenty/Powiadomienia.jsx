// Powiadomienia o zbliżających się terminach.
// - dzwonek w menu: lista terminów na najbliższe 30 dni (działa zawsze, bez zgód),
// - powiadomienia przeglądarki: po włączeniu, raz dziennie przy wejściu na konto
//   (prototyp nie ma serwera, więc nie wysyła powiadomień, gdy strona jest zamknięta).
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import { DANE_ZUS_ZAPAS, PROFIL_MOBYWATEL } from "../dane.js";
import { zbudujPlan } from "../plan.js";
import { maChorobowe } from "../sytuacja.js";
import { dzisISO, fmtDzien, ileDni } from "../terminy.js";
import { pobierzIcs } from "../kalendarz.js";
import { useChecklista } from "./OsCzasu.jsx";
import { useDataKluczowa } from "./DataKluczowa.jsx";
import { terminZwolnienia } from "./Zwolnienie.jsx";
import Ikona from "../wniosek/Ikona.jsx";

const KLUCZ = "przewodnik-powiadomienia";
const ZDARZENIE = "przewodnik-powiadomienia-zmiana";

function czytaj() {
  try { return JSON.parse(localStorage.getItem(KLUCZ)) || { wlaczone: false, dni: 7 }; } catch { return { wlaczone: false, dni: 7 }; }
}

export function usePowiadomienia() {
  const [ust, setUst] = useState(czytaj);
  useEffect(() => {
    const odswiez = () => setUst(czytaj());
    window.addEventListener(ZDARZENIE, odswiez);
    return () => window.removeEventListener(ZDARZENIE, odswiez);
  }, []);
  const zapisz = (nowe) => {
    const w = { ...czytaj(), ...nowe };
    try { localStorage.setItem(KLUCZ, JSON.stringify(w)); } catch { /* nic */ }
    window.dispatchEvent(new Event(ZDARZENIE));
  };
  const wsparcie = typeof window !== "undefined" && "Notification" in window;
  const zgoda = wsparcie ? Notification.permission : "unsupported";
  const wlacz = async () => {
    let p = zgoda;
    if (wsparcie && p === "default") p = await Notification.requestPermission();
    zapisz({ wlaczone: true, ostatnio: null });
    if (p === "granted") new Notification("Przypomnienia włączone", { body: "Damy znać, gdy zbliży się termin wniosku.", icon: "/logo.png" });
    return p;
  };
  const wylacz = () => zapisz({ wlaczone: false });
  return { ...ust, zgoda, wsparcie, wlacz, wylacz, zapisz };
}

// Terminy, które jeszcze nie minęły i nie są odhaczone (posortowane)
export function useNadchodzace() {
  const { profil = PROFIL_MOBYWATEL, zus = DANE_ZUS_ZAPAS, etap = "ciaza", ankieta = {} } = useSesja();
  const { data } = useDataKluczowa();
  const lista = useChecklista(profil.pesel);
  const dzis = dzisISO();
  const plan = zbudujPlan({ etap, data, odp: ankieta, chor: maChorobowe(ankieta, zus) });
  const l4 = terminZwolnienia(zus, { etap, ankieta, data, dzis });
  return plan
    .flatMap((k) => k.zadania.map((z) => ({ ...z, termin: z.termin || k.data })))
    .concat(l4 ? [l4] : [])
    .filter((z) => z.termin && !lista.czyZrobione(z) && ileDni(dzis, z.termin) >= 0)
    .map((z) => ({ ...z, zostalo: ileDni(dzis, z.termin) }))
    .sort((a, b) => a.zostalo - b.zostalo);
}

// Raz dziennie pokaż powiadomienie przeglądarki o terminach w zasięgu `dni`
function useWyslijPowiadomienia(terminy) {
  const { wlaczone, dni = 7, ostatnio, zgoda, zapisz } = usePowiadomienia();
  useEffect(() => {
    if (!wlaczone || zgoda !== "granted") return;
    const dzis = dzisISO();
    if (ostatnio === dzis) return;
    const bliskie = terminy.filter((z) => z.zostalo <= dni);
    if (!bliskie.length) return;
    const z = bliskie[0];
    new Notification(z.zostalo === 0 ? "Dziś mija termin!" : `Za ${z.zostalo} dni mija termin`, {
      body: z.t + (bliskie.length > 1 ? ` (i ${bliskie.length - 1} inne)` : ""),
      icon: "/logo.png",
      tag: "przewodnik-terminy",
    });
    zapisz({ ostatnio: dzis });
  }, [wlaczone, zgoda, dni, ostatnio, terminy, zapisz]);
}

export function Dzwonek() {
  const terminy = useNadchodzace();
  const { wlaczone, wlacz, zgoda } = usePowiadomienia();
  const [otwarte, setOtwarte] = useState(false);
  const ref = useRef(null);
  useWyslijPowiadomienia(terminy);
  const bliskie = terminy.filter((z) => z.zostalo <= 30);

  useEffect(() => {
    if (!otwarte) return;
    const klik = (e) => !ref.current?.contains(e.target) && setOtwarte(false);
    const esc = (e) => e.key === "Escape" && setOtwarte(false);
    document.addEventListener("mousedown", klik);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", klik); document.removeEventListener("keydown", esc); };
  }, [otwarte]);

  return (
    <div className="dz" ref={ref}>
      <button type="button" className="ikona-btn dz-btn" aria-expanded={otwarte} aria-label={`Powiadomienia${bliskie.length ? `: ${bliskie.length} bliskie terminy` : ""}`} title="Powiadomienia" onClick={() => setOtwarte((o) => !o)}>
        <Ikona n="dzwonek" rozmiar={22} />
        {bliskie.length > 0 && <span className="dz-licznik" aria-hidden="true">{bliskie.length}</span>}
      </button>
      {otwarte && (
        <div className="dz-panel" role="dialog" aria-label="Najbliższe terminy">
          <div className="dz-glowa"><b>Najbliższe terminy</b><span>30 dni</span></div>
          {bliskie.length ? (
            <ul>
              {bliskie.map((z) => (
                <li key={z.id}>
                  <span className={`dz-dni ${z.zostalo <= 7 ? "pilne" : ""}`}>{z.zostalo === 0 ? "dziś" : `${z.zostalo} dni`}</span>
                  <span><b>{z.t}</b><small>do {fmtDzien(z.termin)}</small></span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dz-pusto">{terminy.length ? "W ciągu 30 dni nie mija żaden termin." : "Dodaj datę w ustawieniach, a pokażemy konkretne terminy."}</p>
          )}
          <div className="dz-stopka">
            {terminy.length > 0 && (
              <button type="button" onClick={() => pobierzIcs(terminy)}><Ikona n="kalendarz" rozmiar={16} /> Dodaj do kalendarza</button>
            )}
            {!wlaczone ? (
              <button type="button" onClick={wlacz}><Ikona n="dzwonek" rozmiar={16} /> Włącz przypomnienia</button>
            ) : (
              <span className="dz-ok"><Ikona n="check" rozmiar={16} /> Przypomnienia {zgoda === "granted" ? "włączone" : "w aplikacji"}</span>
            )}
            <Link to="/przewodnik/sciezka" onClick={() => setOtwarte(false)}>Moja ścieżka</Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Karta do „Mojej ścieżki”: przypomnienia + kalendarz
export function KartaPrzypomnien() {
  const terminy = useNadchodzace();
  const { wlaczone, wlacz, wylacz, zgoda, wsparcie, dni, zapisz } = usePowiadomienia();
  return (
    <div className="kp">
      <span className="kp-ikona"><Ikona n="dzwonek" rozmiar={24} /></span>
      <div className="kp-tekst">
        <b>Nie przegap żadnego terminu</b>
        <span>
          {terminy.length
            ? `Masz ${terminy.length} ${terminy.length === 1 ? "termin" : terminy.length < 5 ? "terminy" : "terminów"} przed sobą. Włącz przypomnienia — do kalendarza dodasz je z dzwonka na górze.`
            : "Gdy dodasz datę, przypomnimy Ci o każdym terminie."}
        </span>
        {wlaczone && zgoda === "denied" && <small className="kp-uwaga">Przeglądarka blokuje powiadomienia — przypomnimy w dzwonku na górze strony.</small>}
      </div>
      <div className="kp-akcje">
        <label className="kp-przelacznik">
          <input type="checkbox" checked={!!wlaczone} onChange={(e) => (e.target.checked ? wlacz() : wylacz())} />
          <span>Przypomnienia {wsparcie ? "" : "(w aplikacji)"}</span>
        </label>
        {wlaczone && (
          <label className="kp-dni">
            na
            <select value={dni} onChange={(e) => zapisz({ dni: Number(e.target.value), ostatnio: null })}>
              <option value={3}>3 dni</option>
              <option value={7}>7 dni</option>
              <option value={14}>14 dni</option>
            </select>
            przed terminem
          </label>
        )}
      </div>
    </div>
  );
}
