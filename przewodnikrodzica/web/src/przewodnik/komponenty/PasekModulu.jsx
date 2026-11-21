import { Link, NavLink, useLocation } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import Ikona from "../wniosek/Ikona.jsx";

// Jedno menu po zalogowaniu — wszystko kręci się wokół rodzicielstwa
const ZAKLADKI = [
  ["Moje konto", "/przewodnik/pulpit"],
  ["Karta ciąży", "/przewodnik/karta-ciazy"],
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
    <header className="modul-pasek">
      <div className="wrap modul-in">
        <Link to="/przewodnik/pulpit" className="modul-znak" aria-label="Moje konto — strona główna">
          <Ikona n="wozek" rozmiar={22} />
        </Link>
        <nav className="modul-zakladki" aria-label="Menu konta">
          {ZAKLADKI.map(([n, d]) => (
            <NavLink key={d} to={d}>{n}</NavLink>
          ))}
        </nav>
        <button
          className={`pomoc ${state?.zPrzewodnika ? "pulsuje" : ""}`}
          aria-label="Pomoc i przewodnik"
          title="Pomoc i przewodnik"
          onClick={() => setPrzewodnikOtwarty(true)}
        >?</button>
        <button className="awatar" title="Wyloguj (symulacja)" aria-label={`Wyloguj ${profil?.imie || ""}`} onClick={wyloguj}>{inicjaly}</button>
      </div>
    </header>
  );
}
