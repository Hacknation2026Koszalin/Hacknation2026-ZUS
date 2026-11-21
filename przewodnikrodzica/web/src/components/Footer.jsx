import { Link } from "react-router-dom";
import { STOPKA } from "../data/nawigacja.js";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-cols">
        {STOPKA.map((k) => (
          <div key={k.naglowek}>
            <p className="footer-h">{k.naglowek}</p>
            <ul>
              {k.linki.map(([nazwa, do_]) => (
                <li key={nazwa}><Link to={do_}>{nazwa}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="wrap footer-bottom">
        <span>Prototyp przygotowany na HackNation 2026. Nie jest serwisem ZUS.</span>
        <span>Deklaracja dostępności · Polityka prywatności · Mapa strony</span>
      </div>
    </footer>
  );
}
