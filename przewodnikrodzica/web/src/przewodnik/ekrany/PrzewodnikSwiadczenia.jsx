// Przewodnik po świadczeniu — jeden szablon dla wszystkich (dane w przewodniki.js).
// Każdy może przeczytać; ramka „Dla Ciebie” mówi tylko, czy to Twoja sytuacja.
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import { DANE_ZUS_ZAPAS } from "../dane.js";
import { ocenSytuacje } from "../sytuacja.js";
import { PRZEWODNIKI } from "../przewodniki.js";
import { maZadluzenie } from "../komponenty/Zadluzenie.jsx";
import { WSTRZYMANE_PRZY_ZADLUZENIU } from "../swiadczenia.js";
import Ikona from "../wniosek/Ikona.jsx";

const SEKCJE = [
  ["skrot", "W skrócie"],
  ["komu", "Czy mi przysługuje?"],
  ["ile", "Ile dostanę?"],
  ["jakDlugo", "Jak długo?"],
  ["kiedy", "Kiedy złożyć?"],
  ["gdzie", "Gdzie złożyć?"],
  ["dokumenty", "Jakie dokumenty?"],
  ["uwaga", "Na co uważać?"],
  ["pytania", "Pytania i podstawa prawna"],
];

// **pogrubienie** → <b>
function Tekst({ t }) {
  return t.split(/(\*\*[^*]+\*\*)/).map((c, i) => (c.startsWith("**") ? <b key={i}>{c.slice(2, -2)}</b> : c));
}

function Tresc({ elementy }) {
  const tabele = elementy.filter((e) => typeof e === "object");
  const teksty = elementy.filter((e) => typeof e === "string");
  return (
    <>
      {teksty.length > 0 && <ul>{teksty.map((t, i) => <li key={i}><Tekst t={t} /></li>)}</ul>}
      {tabele.map((e, i) => (
        <table key={i} className="sw-tabela">
          <thead><tr>{e.tabela[0].map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>{e.tabela.slice(1).map((w, j) => <tr key={j}>{w.map((k, x) => <td key={x}>{k}</td>)}</tr>)}</tbody>
        </table>
      ))}
    </>
  );
}

export default function PrzewodnikSwiadczenia({ id: idProp }) {
  const { id: idUrl } = useParams();
  const id = idProp || idUrl;
  const d = PRZEWODNIKI[id];
  const sesja = useSesja();
  const zus = sesja.zus || DANE_ZUS_ZAPAS;
  const ankieta = sesja.ankieta || {};
  const [aktywna, setAktywna] = useState(SEKCJE[0][0]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver((w) => w.forEach((e) => e.isIntersecting && setAktywna(e.target.id)), { rootMargin: "-20% 0px -70% 0px" });
    SEKCJE.forEach(([s]) => { const el = document.getElementById(s); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [id]);

  if (!d) return <Navigate to="/przewodnik/swiadczenia" replace />;
  const ctx = { zus, ankieta, etap: sesja.etap, ustanie: sesja.ustanie, sytuacja: ocenSytuacje(ankieta, zus, sesja.etap) };
  let dla = d.dlaCiebie(ctx);
  if (maZadluzenie(zus) && WSTRZYMANE_PRZY_ZADLUZENIU.includes(id))
    dla = { ...dla, status: ["blad", "Wstrzymane — zaległość w składkach"], tekst: "Masz zaległość w składkach powyżej progu — dopóki jej nie spłacisz, ZUS nie wypłaci tego świadczenia." };

  const spis = (
    <ol>{SEKCJE.map(([s, t]) => <li key={s}><a href={`#${s}`} className={aktywna === s ? "akt" : ""}>{t}</a></li>)}</ol>
  );

  return (
    <div className="wn">
      <div className="wrap">
        <nav className="wn-okruszki" aria-label="Jesteś tutaj">
          <Link to="/przewodnik/swiadczenia">Świadczenia</Link> <span aria-hidden="true">/</span> <span>{d.tytul}</span>
        </nav>
        <div className="sw-uklad">
          <aside className="sw-spis" aria-label="Spis treści"><b>Na tej stronie</b>{spis}</aside>
          <article className="sw-tresc">
            <details className="sw-spis-mobile"><summary>Spis treści</summary>{spis}</details>
            <h1>{d.tytul}</h1>
            <p className="wn-lead">{d.lead}</p>

            <div className={`sw-dla-ciebie ${dla.status[0]}`}>
              <h2>
                <span className={`sw-odznaka ${dla.status[0]}`}>{dla.status[0] === "ok" ? <Ikona n="check" rozmiar={16} /> : dla.status[0] === "blad" ? <Ikona n="alert" rozmiar={16} /> : <Ikona n="info" rozmiar={16} />} {dla.status[1]}</span>
                Dla Ciebie
              </h2>
              <p style={{ margin: 0 }}><Tekst t={dla.tekst} /></p>
              {dla.kwoty && (
                <div className="sw-kwoty">{dla.kwoty.map(([m, k]) => <div key={m} className="sw-kwota"><small>{m}</small><b>{k}</b></div>)}</div>
              )}
              {dla.dopisek && <p className="sw-dopisek">{dla.dopisek} Dokładnie policzysz w <Link to="/przewodnik/kalkulator">Kalkulatorze</Link>.</p>}
            </div>

            {SEKCJE.slice(0, -1).map(([s, t]) => (
              <section key={s} id={s}>
                <h2>{t}</h2>
                <Tresc elementy={d[s] || []} />
              </section>
            ))}

            <section id="pytania" className="sw-faq">
              <h2>Pytania i podstawa prawna</h2>
              {(d.pytania || []).map(([q, a]) => (
                <details key={q}><summary>{q}</summary><p>{a}</p></details>
              ))}
              <p className="sw-zrodlo">Podstawa prawna: {d.prawo}</p>
            </section>

            <div className="sw-cta">
              {d.wniosek ? (
                <>
                  <p><b>Chcesz złożyć wniosek?</b> Poprowadzimy Cię pole po polu i podpowiemy, gdzie go złożyć.</p>
                  <Link to={d.wniosek.link} className="wn-btn wn-btn-glowny wn-btn-duzy">{d.wniosek.tekst} <Ikona n="strzalka" /></Link>
                </>
              ) : (
                <p><b>Masz pytanie?</b> Zapytaj ZUSannę albo zajrzyj do <Link to="/przewodnik/ryzyka">„Na co uważać”</Link>.</p>
              )}
              <Link to="/przewodnik/swiadczenia" className="wn-btn wn-btn-drugi wn-btn-duzy"><Ikona n="wstecz" /> Wszystkie świadczenia</Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
