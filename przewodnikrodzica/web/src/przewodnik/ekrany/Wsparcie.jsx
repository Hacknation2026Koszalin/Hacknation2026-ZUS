// ŚWIADCZENIA i POMOC — dwie zakładki menu, jeden komponent.
//  rodzaj="swiadczenia" — wszystkie świadczenia, przy każdym: czy Ci przysługuje,
//  rodzaj="pomoc"       — kontakty, ZUSanna, samouczek, wsparcie psychologiczne.
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import { DANE_ZUS_ZAPAS } from "../dane.js";
import { ocenSytuacje } from "../sytuacja.js";
import { POMOC, SWIADCZENIA, WSTRZYMANE_PRZY_ZADLUZENIU } from "../swiadczenia.js";
import { maZadluzenie } from "../komponenty/Zadluzenie.jsx";
import { OTWORZ_ZUSANNE } from "../komponenty/Zusanna.jsx";
import Ikona from "../wniosek/Ikona.jsx";

export function statusSwiadczenia(s, sytuacja, ankieta, zus) {
  if (maZadluzenie(zus) && WSTRZYMANE_PRZY_ZADLUZENIU.includes(s.id)) return ["blad", "Wstrzymane — zaległość w składkach"];
  return s.status(sytuacja, ankieta);
}

export default function Katalog({ rodzaj = "swiadczenia" }) {
  const { zus = DANE_ZUS_ZAPAS, ankieta = {}, etap, setPrzewodnikOtwarty } = useSesja();
  const { hash } = useLocation();
  const sytuacja = ocenSytuacje(ankieta, zus, etap);
  const pomoc = rodzaj === "pomoc";

  // Przewiń do pozycji wybranej z menu rozwijanego (#800-plus itp.)
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ws-podswietl");
    const t = setTimeout(() => el.classList.remove("ws-podswietl"), 1600);
    return () => clearTimeout(t);
  }, [hash]);

  const akcja = (p) => {
    if (p.akcja === "zusanna") window.dispatchEvent(new Event(OTWORZ_ZUSANNE));
    if (p.akcja === "samouczek") setPrzewodnikOtwarty(true);
  };

  return (
    <div className="wn ws">
      <div className="wrap">
        <span className="plan-kicker">{pomoc ? "Pomoc" : "Świadczenia"}</span>
        <h1>{pomoc ? "Gdzie szukać pomocy" : "Co Ci przysługuje"}</h1>
        <p className="wn-lead">
          {pomoc
            ? "Masz pytanie albo potrzebujesz porozmawiać? Wybierz najwygodniejszy sposób."
            : "Każde świadczenie opisujemy prostym językiem i od razu mówimy, czy Ci przysługuje."}
        </p>

        <div className="ws-siatka">
          {pomoc
            ? POMOC.map((p) => {
                const tresc = (
                  <>
                    <span className="sw-kafel-ikona"><Ikona n={p.ikona} /></span>
                    <h3>{p.nazwa}</h3>
                    <p>{p.opis}</p>
                    {p.akcja && <span className="wiecej">{p.akcja === "zusanna" ? "Otwórz czat" : "Uruchom"} <Ikona n="strzalka" rozmiar={18} /></span>}
                  </>
                );
                return p.akcja ? (
                  <button key={p.id} id={p.id} type="button" className="sw-kafel ws-przycisk" onClick={() => akcja(p)}>{tresc}</button>
                ) : (
                  <div key={p.id} id={p.id} className="sw-kafel">{tresc}</div>
                );
              })
            : SWIADCZENIA.map((s) => {
                const [klasa, tekst] = statusSwiadczenia(s, sytuacja, ankieta, zus);
                const tresc = (
                  <>
                    <span className="sw-kafel-ikona"><Ikona n={s.ikona} /></span>
                    <h3>{s.nazwa}</h3>
                    <p>{s.opis}</p>
                    <span className={`wn-chip ${klasa}`}>{klasa === "ok" && <Ikona n="check" rozmiar={14} />}{klasa === "blad" && <Ikona n="alert" rozmiar={14} />} {tekst}</span>
                    {s.link && <span className="wiecej">Szczegóły i wniosek <Ikona n="strzalka" rozmiar={18} /></span>}
                  </>
                );
                return s.link ? (
                  <Link key={s.id} id={s.id} to={s.link} className={`sw-kafel ${klasa === "blad" ? "ws-blad" : ""}`}>{tresc}</Link>
                ) : (
                  <div key={s.id} id={s.id} className={`sw-kafel ${klasa === "blad" ? "ws-blad" : ""}`}>{tresc}</div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
