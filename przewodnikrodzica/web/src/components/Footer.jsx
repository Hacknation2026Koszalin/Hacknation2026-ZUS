import { Link } from "react-router-dom";
import { STOPKA } from "../data/nawigacja.js";

// Ścieżki w tej tablicy są przykładowe, podmień na własne.
const PRAWNE = [
  ["Deklaracja dostępności", "/deklaracja-dostepnosci"],
  ["Polityka prywatności", "/polityka-prywatnosci"],
  ["Mapa strony", "/mapa-strony"],
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-cols">
        {STOPKA.map((k) => (
          <nav key={k.naglowek} aria-label={k.naglowek}>
            <p className="footer-h">{k.naglowek}</p>
            <ul>
              {k.linki.map(([nazwa, do_]) => (
                <li key={nazwa}>
                  <Link to={do_}>{nazwa}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="wrap footer-bottom">
        <p className="footer-note">
          Prototyp przygotowany na HackNation 2026. Nie jest serwisem ZUS.
        </p>
        <ul className="footer-legal">
          {PRAWNE.map(([nazwa, do_]) => (
            <li key={do_}>
              <Link to={do_}>{nazwa}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}