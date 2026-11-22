// Oś czasu w zygzaku (prawo–lewo) z listą rzeczy do zrobienia przy każdym kroku.
// Działa z datami (konkretne dni) i bez dat (terminy ustawowe).
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { etykietaWzgledna } from "../plan.js";
import { fmtDzien, opisZa } from "../terminy.js";
import { pobierzWnioski } from "../wniosek/wnioski.js";
import Ikona from "../wniosek/Ikona.jsx";

const KLUCZ = "przewodnik-checklista";
const wczytaj = () => {
  try {
    return JSON.parse(localStorage.getItem(KLUCZ)) || {};
  } catch {
    return {};
  }
};

const ZNACZNIK = {
  krytyczny: ["Nie przegap!", "dzwonek"],
  szansa: ["Możesz już", "check"],
  info: ["Warto wiedzieć", "info"],
  porod: ["Wielki dzień", "serce"],
};

/** Stan listy zadań (odhaczenia w przeglądarce + automatycznie: wysłany wniosek). */
export function useChecklista(pesel) {
  const [zrobione, setZrobione] = useState(wczytaj);
  const [wnioski, setWnioski] = useState([]);
  useEffect(() => {
    pobierzWnioski().then((l) => setWnioski(l.filter((w) => w.osoba?.pesel === pesel)));
  }, [pesel]);
  const czyZrobione = (z) => !!zrobione[z.id] || ((z.id === "zam" || z.powiazane === "zam") && wnioski.length > 0);
  const auto = (z) => czyZrobione(z) && !zrobione[z.id];
  const przelacz = (id) =>
    setZrobione((s) => {
      const n = { ...s, [id]: !s[id] };
      try {
        localStorage.setItem(KLUCZ, JSON.stringify(n));
      } catch {
        /* bez zapisu */
      }
      return n;
    });
  return { czyZrobione, auto, przelacz, wnioski };
}

export default function OsCzasu({ plan, lista, dzisTekst, strata = false }) {
  let ostatniaFaza = null;
  return (
    <ol className={`plan ${strata ? "plan-spokojny" : ""}`}>
      {dzisTekst && (
        <li className="plan-dzis">
          <span className="plan-dzis-kropka" />
          <span className="plan-dzis-txt">{dzisTekst}</span>
        </li>
      )}
      {plan.map((k, i) => {
        const nowaFaza = k.faza !== ostatniaFaza;
        ostatniaFaza = k.faza;
        const ok = k.zadania.length > 0 && k.zadania.every(lista.czyZrobione);
        const pilne = !strata && k.data && !k.minelo && k.za <= 30;
        const strona = i % 2 === 0 ? "prawo" : "lewo";
        const wzgl = etykietaWzgledna(k.przesuniecie);
        return [
          nowaFaza && <li key={`f-${k.faza}-${i}`} className="plan-faza"><span>{k.faza}</span></li>,
          <li key={k.id} className={`plan-krok ${strona} ${strata ? "info" : k.waga} ${pilne ? "pilne" : ""} ${ok ? "ok" : ""} ${k.minelo ? "minelo" : ""}`}>
            <div className="plan-bok" aria-hidden="true">
              {k.data ? (
                <>
                  <span className="plan-za">{opisZa(k.za)}</span>
                  <span className="plan-bok-pod">{k.faza === "Po porodzie" ? "jeśli poród będzie w terminie" : ""}</span>
                </>
              ) : (
                <span className="plan-za plan-za-tekst">{k.kiedy}</span>
              )}
            </div>

            <div className="plan-wezel">
              {ok ? <Ikona n="check" rozmiar={30} /> : k.data ? (
                <>
                  <b>{new Date(k.data).getDate()}</b>
                  <span>{fmtDzien(k.data, { month: "short" }).replace(".", "")}</span>
                </>
              ) : wzgl ? (
                <b className="plan-wezel-wzgl">{wzgl}</b>
              ) : (
                <b>{i + 1}</b>
              )}
            </div>

            <article className="plan-tresc">
              {!strata && (
                <span className="plan-znacznik">
                  <Ikona n={ZNACZNIK[k.waga][1]} rozmiar={14} /> {k.znacznik || (pilne && k.waga !== "krytyczny" ? "Pilne" : ZNACZNIK[k.waga][0])}
                </span>
              )}
              <p className="plan-data">
                {k.data ? <>{fmtDzien(k.data)} · <span>{opisZa(k.za)}</span></> : <span>{k.kiedy[0].toUpperCase() + k.kiedy.slice(1)}</span>}
              </p>
              <h3>{k.tytul}</h3>
              <p className="plan-opis">{k.opis}</p>
              {k.zadania.length > 0 && (
                <ul className="plan-lista">
                  {k.zadania.map((z) => {
                    const done = lista.czyZrobione(z);
                    const auto = lista.auto(z);
                    return (
                      <li key={z.id} className={done ? "zrobione" : ""}>
                        <label>
                          <input type="checkbox" checked={done} disabled={auto} onChange={() => lista.przelacz(z.id)} />
                          <span className="plan-check" aria-hidden="true"><Ikona n="check" rozmiar={16} /></span>
                          <span className="plan-zad">
                            {z.t}
                            {z.info && <small>{z.info}</small>}
                            {auto && <small className="plan-auto">Wniosek wysłany — widzisz go w „Moich sprawach”.</small>}
                          </span>
                        </label>
                        {z.link && !done && (
                          <Link to={z.link} className="plan-akcja">{z.akcja} <Ikona n="strzalka" rozmiar={16} /></Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>
          </li>,
        ];
      })}
    </ol>
  );
}
