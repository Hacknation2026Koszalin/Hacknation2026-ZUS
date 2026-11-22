// ŚWIADCZENIA i POMOC — dwie zakładki menu, jeden komponent.
//  rodzaj="swiadczenia" — wszystkie świadczenia, przy każdym: czy Ci przysługuje,
//  rodzaj="pomoc"       — kontakty, ZUSanna, samouczek, wsparcie psychologiczne.
import { useEffect } from "react";
import { useJezyk } from "../jezyk.js";
import { Link, useLocation } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import { DANE_ZUS_ZAPAS } from "../dane.js";
import { ocenSytuacje } from "../sytuacja.js";
import { ORGANIZACJE, POMOC, SWIADCZENIA, WSTRZYMANE_PRZY_ZADLUZENIU } from "../swiadczenia.js";
import { maZadluzenie } from "../komponenty/Zadluzenie.jsx";
import { OTWORZ_ZUSANNE } from "../komponenty/Zusanna.jsx";
import { PanelSkladek } from "../komponenty/Skladki.jsx";
import Ikona from "../wniosek/Ikona.jsx";
import { P } from "../parametry.js";

export function statusSwiadczenia(s, sytuacja, ankieta, zus) {
  if (maZadluzenie(zus) && WSTRZYMANE_PRZY_ZADLUZENIU.includes(s.id)) return ["blad", "Wstrzymane — zaległość w składkach"];
  return s.status(sytuacja, ankieta);
}

export default function Katalog({ rodzaj = "swiadczenia" }) {
  const { zus = DANE_ZUS_ZAPAS, ankieta: ankietaSesji = {}, etap, setPrzewodnikOtwarty, ustanie } = useSesja();
  const ankieta = { ...ankietaSesji, ustanie };
  const { hash } = useLocation();
  const sytuacja = ocenSytuacje(ankieta, zus, etap);
  const pomoc = rodzaj === "pomoc";
  const [, t] = useJezyk();

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
        <h1>{pomoc ? t("Gdzie szukać pomocy") : t("Co Ci przysługuje")}</h1>
        <p className="wn-lead">
          {pomoc
            ? "Masz pytanie albo potrzebujesz porozmawiać? Wybierz najwygodniejszy sposób."
            : "Każde świadczenie opisujemy prostym językiem i od razu mówimy, czy Ci przysługuje."}
        </p>

        {!pomoc && <PanelSkladek />}
        {!pomoc && (
          <Link to="/przewodnik/ryzyka" className="ry-baner">
            <Ikona n="alert" /> <span><b>Na co uważać</b> — kiedy możesz stracić świadczenie albo dostać mniej</span> <Ikona n="strzalka" />
          </Link>
        )}

        <div className="ws-siatka">
          {pomoc
            ? POMOC.filter((p) => p.id !== "organizacje").map((p) => {
                const tresc = (
                  <>
                    <span className="sw-kafel-ikona"><Ikona n={p.ikona} /></span>
                    <h3>{p.nazwa}</h3>
                    <p>{p.opis}</p>
                    {p.akcja && <span className="wiecej">{p.akcja === "zusanna" ? "Otwórz czat" : "Uruchom"} <Ikona n="strzalka" rozmiar={18} /></span>}
                  </>
                );
                if (p.link)
                  return <Link key={p.id} id={p.id} to={p.link} className="sw-kafel">{tresc}<span className="wiecej">Otwórz <Ikona n="strzalka" rozmiar={18} /></span></Link>;
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
                    {s.link && <span className="wiecej">{t("Przeczytaj przewodnik")} <Ikona n="strzalka" rozmiar={18} /></span>}
                  </>
                );
                return s.link ? (
                  <Link key={s.id} id={s.id} to={s.link} className={`sw-kafel ${klasa === "blad" ? "ws-blad" : ""}`}>{tresc}</Link>
                ) : (
                  <div key={s.id} id={s.id} className={`sw-kafel ${klasa === "blad" ? "ws-blad" : ""}`}>{tresc}</div>
                );
              })}
        </div>

        {pomoc && P.funkcje.organizacje && (
          <section className="org" id="organizacje" aria-labelledby="org-tytul">
            <h2 id="org-tytul">Organizacje, które pomagają w trudnych chwilach</h2>
            <p className="wn-lead">Fundacje i hospicja non-profit, które bezpłatnie wspierają rodziców po stracie dziecka, przy porodzie przedwczesnym, poronieniu albo gdy dziecko urodzi się ciężko chore.</p>
            <div className="org-siatka">
              {ORGANIZACJE.map((o) => (
                <div key={o.nazwa} className="org-karta">
                  <span className="org-syt">{o.sytuacja}</span>
                  <b>{o.nazwa}</b>
                  <p>{o.opis}</p>
                  {o.link && <a href={o.link} target="_blank" rel="noreferrer">{o.link.replace("https://", "").replace("www.", "")} <Ikona n="strzalka" rozmiar={16} /><span className="sr-only"> (otwiera się w nowej karcie)</span></a>}
                </div>
              ))}
            </div>
            <p className="org-uwaga">Lista przykładowa — nie jest rekomendacją ZUS. Potrzebujesz porozmawiać od razu? Kryzysowy telefon zaufania: 116 123.</p>
          </section>
        )}
      </div>
    </div>
  );
}
