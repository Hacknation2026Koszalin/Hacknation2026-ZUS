// Ustawienia (ikona zębatki w menu): data, odpowiedzi z ankiety, dane w przeglądarce, wylogowanie.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import { PYTANIA, nazwaEtapu } from "../sytuacja.js";
import { fmtDzien } from "../terminy.js";
import { DataModal, useDataKluczowa } from "./DataKluczowa.jsx";
import { DANE_ZUS_ZAPAS } from "../dane.js";
import { useNadchodzace, usePowiadomienia } from "./Powiadomienia.jsx";
import { pobierzIcs } from "../kalendarz.js";
import { POWODY_USTANIA } from "./Umowa.jsx";
import { PanelDostepnosci } from "./Dostepnosc.jsx";
import { ZUS_Z_ZALEGLOSCIA, maZadluzenie } from "./Zadluzenie.jsx";
import Ikona from "../wniosek/Ikona.jsx";
import { P } from "../parametry.js";
import { useNavigate as useNav } from "react-router-dom";

const tekstOdp = (klucz, v) => PYTANIA[klucz]?.opcje?.find((o) => o.v === v)?.t || "—";

export default function Ustawienia({ otwarte, onZamknij }) {
  const sesja = useSesja();
  const nav = useNavigate();
  const { def, data } = useDataKluczowa();
  const [modalDaty, setModalDaty] = useState(false);
  const [wyczyszczone, setWyczyszczone] = useState(false);
  const odp = sesja.ankieta || {};
  const pow = usePowiadomienia();
  const terminy = useNadchodzace();
  const zadluzenieDemo = maZadluzenie(sesja.zus);
  const przelaczZadluzenie = (wl) => {
    sessionStorage.removeItem("zadluzenie-pokazane");
    sesja.ustaw({
      zus: wl ? ZUS_Z_ZALEGLOSCIA : DANE_ZUS_ZAPAS,
      ankieta: wl ? { ...odp, praca: "dzialalnosc", chorobowe: "tak" } : { ...odp, praca: "umowa", chorobowe: undefined },
    });
    if (wl) onZamknij(); // od razu pokaż, jak wygląda konto z zaległością

  };

  useEffect(() => {
    if (!otwarte) return;
    setWyczyszczone(false);
    const esc = (e) => e.key === "Escape" && !modalDaty && onZamknij();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [otwarte, modalDaty, onZamknij]);

  if (!otwarte) return null;

  const zmienOdpowiedzi = () => {
    onZamknij();
    sesja.ustaw({ onboardingZakonczony: false });
    nav("/przewodnik/witaj");
  };

  const wyczysc = () => {
    try {
      localStorage.removeItem("przewodnik-checklista");
      Object.keys(sessionStorage).filter((k) => k.startsWith("wniosek-")).forEach((k) => sessionStorage.removeItem(k));
    } catch {
      /* nic */
    }
    setWyczyszczone(true);
  };

  return (
    <>
    <div className="dk-tlo" onClick={onZamknij}>
      <div className="dk-okno us-okno" role="dialog" aria-modal="true" aria-labelledby="us-tytul" onClick={(e) => e.stopPropagation()}>
        <div className="us-glowa">
          <h2 id="us-tytul"><Ikona n="zebatka" rozmiar={24} /> Ustawienia</h2>
          <button type="button" className="us-x" onClick={onZamknij} aria-label="Zamknij ustawienia">×</button>
        </div>

        {def && (
          <section className="us-sekcja">
            <h3>{def.etykieta}</h3>
            <p>{data ? <b>{fmtDzien(data)}</b> : "Nie podano — pokazujemy terminy ustawowe."}</p>
            <button type="button" className="dk-btn dk-btn-drugi" onClick={() => setModalDaty(true)}>{data ? "Zmień datę" : def.dodaj}</button>
          </section>
        )}

        <section className="us-sekcja">
          <h3>Twoje odpowiedzi</h3>
          <dl className="us-dl">
            <div><dt>Kim jesteś dla dziecka</dt><dd>{tekstOdp("rola", odp.rola)}</dd></div>
            <div><dt>Etap</dt><dd>{nazwaEtapu(sesja.etap, odp) || "—"}</dd></div>
            <div><dt>Praca</dt><dd>{tekstOdp("praca", odp.praca)}</dd></div>
            {odp.chorobowe && <div><dt>Dobrowolne chorobowe</dt><dd>{tekstOdp("chorobowe", odp.chorobowe)}</dd></div>}
          </dl>
          <button type="button" className="dk-btn dk-btn-drugi" onClick={zmienOdpowiedzi}>Zmień odpowiedzi</button>
        </section>

        <section className="us-sekcja" id="us-umowa">
          <h3>Koniec umowy o pracę (opcjonalnie)</h3>
          <p>Jeśli Twoja umowa się kończy, pokażemy, co to oznacza dla zasiłków. Data zostaje tylko w tej sesji.</p>
          <div className="us-umowa">
            <label>
              <span>Data ustania stosunku pracy</span>
              <input type="date" value={sesja.ustanie?.data || ""} onChange={(e) => sesja.ustaw({ ustanie: { ...(sesja.ustanie || {}), data: e.target.value } })} />
            </label>
            <label>
              <span>Powód</span>
              <select value={sesja.ustanie?.powod || ""} onChange={(e) => sesja.ustaw({ ustanie: { ...(sesja.ustanie || {}), powod: e.target.value } })}>
                <option value="">— wybierz —</option>
                {POWODY_USTANIA.map((p) => <option key={p.v} value={p.v}>{p.t}</option>)}
              </select>
            </label>
          </div>
          {sesja.ustanie?.data && <button type="button" className="wn-link" onClick={() => sesja.ustaw({ ustanie: null })}>Usuń datę końca umowy</button>}
        </section>

        <section className="us-sekcja">
          <h3>Powiadomienia</h3>
          <label className="a11y-opcja">
            <span><b>Przypominaj o terminach</b><small>{pow.zgoda === "denied" ? "Przeglądarka blokuje powiadomienia — przypomnimy w dzwonku." : `Na ${pow.dni} dni przed terminem wniosku.`}</small></span>
            <input type="checkbox" role="switch" checked={!!pow.wlaczone} onChange={(e) => (e.target.checked ? pow.wlacz() : pow.wylacz())} />
          </label>
          {terminy.length > 0 && (
            <button type="button" className="dk-btn dk-btn-drugi us-kal" onClick={() => pobierzIcs(terminy)}>
              <Ikona n="kalendarz" rozmiar={18} /> Dodaj terminy do kalendarza ({terminy.length})
            </button>
          )}
        </section>

        <section className="us-sekcja">
          <h3>Ułatwienia dostępu</h3>
          <PanelDostepnosci />
        </section>

        {P.funkcje.trybDemo && <section className="us-sekcja us-demo">
          <h3>Tryb demonstracyjny</h3>
          <label className="a11y-opcja">
            <span><b>Wariant: zaległość w składkach</b><small>Przedsiębiorczyni z zaległością {"—"} zasiłek wstrzymany do spłaty.</small></span>
            <input type="checkbox" role="switch" checked={zadluzenieDemo} onChange={(e) => przelaczZadluzenie(e.target.checked)} />
          </label>
          <PrzelaczAdmin onZamknij={onZamknij} />
        </section>}

        <section className="us-sekcja">
          <h3>Dane w tej przeglądarce</h3>
          <p>Odhaczone zadania i szkic wniosku zapisujemy tylko na tym urządzeniu.</p>
          <button type="button" className="dk-btn dk-btn-drugi" onClick={wyczysc} disabled={wyczyszczone}>
            {wyczyszczone ? "Wyczyszczone" : "Wyczyść moje dane"}
          </button>
        </section>

        <div className="dk-przyciski">
          <button type="button" className="dk-btn dk-btn-tekst" onClick={() => { onZamknij(); sesja.wyloguj(); }}>Wyloguj</button>
          <button type="button" className="dk-btn dk-btn-glowny" onClick={onZamknij}>Gotowe</button>
        </div>
      </div>
    </div>
    <DataModal otwarty={modalDaty} onZamknij={() => setModalDaty(false)} />
    </>
  );
}

// Przełącznik na panel administracyjny (w produkcji: tylko dla pracowników ZUS z uprawnieniami)
function PrzelaczAdmin({ onZamknij }) {
  const nav = useNav();
  return (
    <button type="button" className="dk-btn dk-btn-drugi us-admin" onClick={() => { onZamknij(); nav("/przewodnik/admin"); }}>
      <Ikona n="zebatka" rozmiar={18} /> Przełącz na panel administracyjny
    </button>
  );
}
