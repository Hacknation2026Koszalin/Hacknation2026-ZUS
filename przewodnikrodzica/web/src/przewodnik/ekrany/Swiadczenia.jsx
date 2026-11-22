import { Link } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import { DANE_ZUS_ZAPAS } from "../dane.js";
import Ikona from "../wniosek/Ikona.jsx";

// Lista świadczeń. Na razie opisany jest jeden: zasiłek macierzyński.
export default function Swiadczenia() {
  const { zus = DANE_ZUS_ZAPAS } = useSesja();
  const ubezpieczona = zus.ubezpieczenie?.chorobowe && zus.ubezpieczenie.chorobowe !== "brak";

  const LISTA = [
    {
      nazwa: "Zasiłek macierzyński", ikona: "dokument", gotowe: true,
      opis: "Pieniądze za czas urlopu macierzyńskiego i rodzicielskiego.",
      status: ubezpieczona ? ["ok", "Przysługuje Ci"] : ["uwaga", "Sprawdź"],
      link: "/przewodnik/swiadczenia/zasilek-macierzynski",
    },
    { nazwa: "Zasiłek chorobowy w ciąży", ikona: "dokument", opis: "100% podstawy, gdy lekarz wystawi zwolnienie z kodem B.", status: ["ok", "Przysługuje Ci"] },
    { nazwa: "Urlop rodzicielski", ikona: "zegar", opis: "41 tygodni do podziału między rodziców (9 tygodni dla każdego).", status: ["ok", "Przysługuje Ci"] },
    { nazwa: "Urlop ojcowski", ikona: "zegar", opis: "2 tygodnie dla taty do ukończenia przez dziecko 12 miesięcy.", status: ["info", "Dla taty"] },
    { nazwa: "Świadczenie rodzicielskie", ikona: "info", opis: "Dla osób bez ubezpieczenia chorobowego. Wypłaca gmina, nie ZUS.", status: ["szary", "Nie dotyczy Cię — masz ubezpieczenie"] },
    { nazwa: "Zasiłek opiekuńczy", ikona: "dokument", opis: "Gdy opiekujesz się chorym dzieckiem.", status: ["info", "Na później"] },
  ];

  return (
    <div className="wn">
      <div className="wrap">
        <h1>Świadczenia</h1>
        <p className="wn-lead">Każde świadczenie opisujemy prostym językiem i od razu mówimy, czy Ci przysługuje.</p>
        <div className="sw-siatka">
          {LISTA.map((s) => {
            const tresc = (
              <>
                <span className="sw-kafel-ikona"><Ikona n={s.ikona} /></span>
                <h2>{s.nazwa}</h2>
                <p>{s.opis}</p>
                <span className={`wn-chip ${s.status[0]}`}>{s.status[0] === "ok" && <Ikona n="check" rozmiar={14} />} {s.status[1]}</span>
                {s.gotowe ? <span className="wiecej">Szczegóły i wniosek <Ikona n="strzalka" rozmiar={18} /></span> : <span className="muted" style={{ fontSize: 14 }}>Opis w przygotowaniu</span>}
              </>
            );
            return s.gotowe ? (
              <Link key={s.nazwa} to={s.link} className="sw-kafel">{tresc}</Link>
            ) : (
              <div key={s.nazwa} className="sw-kafel wylaczony">{tresc}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
