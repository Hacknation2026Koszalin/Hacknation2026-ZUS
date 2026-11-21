import { Link, NavLink, useLocation } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";

// Pasek nawigacji przewodnika (widoczny po zalogowaniu) z ikoną ? i profilem
const ZAKLADKI = [
  ["Pulpit", "/przewodnik/pulpit"],
  ["Moja ścieżka", "/przewodnik/sciezka"],
  ["Świadczenia", "/przewodnik/swiadczenia"],
  ["Kalkulator", "/przewodnik/kalkulator"],
  ["Moje sprawy", "/przewodnik/sprawy"],
  ["Wsparcie", "/przewodnik/wsparcie"],
];

export default function PasekModulu() {
  const { profil, setPrzewodnikOtwarty, wyloguj } = useSesja();
  const { state } = useLocation();
  const inicjaly = profil ? `${profil.imie[0]}${profil.nazwisko[0]}` : "?";

  return (
    <div className="modul-pasek">
      <div className="wrap modul-in">
        <Link to="/przewodnik/pulpit" className="modul-nazwa">Przewodnik rodzica</Link>
        <nav className="modul-zakladki" aria-label="Przewodnik">
          {ZAKLADKI.map(([n, d]) => (
            <NavLink key={d} to={d} className={n === "Kalkulator" ? "wyroznij" : ""}>{n}</NavLink>
          ))}
        </nav>
        <button
          className={`pomoc ${state?.zPrzewodnika ? "pulsuje" : ""}`}
          aria-label="Pomoc i przewodnik"
          title="Pomoc i przewodnik"
          onClick={() => setPrzewodnikOtwarty(true)}
        >?</button>
        <button className="awatar" title="Wyloguj (symulacja)" onClick={wyloguj}>{inicjaly}</button>
      </div>
    </div>
  );
}
