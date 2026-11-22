// Prosta stopka strefy konta (układ: znak po lewej, opis i linki po prawej, pod spodem linki prawne)
import { Link } from "react-router-dom";

const ZEWNETRZNE = [
  ["zus.pl", "https://www.zus.pl"],
  ["gov.pl", "https://www.gov.pl"],
  ["mObywatel", "https://www.mobywatel.gov.pl"],
];

// Oficjalne informacje o uprawnieniach rodziców
const UPRAWNIENIA = [
  ["ZUS", "Zasiłek macierzyński i inne świadczenia", "https://www.zus.pl/swiadczenia/zasilki/zasilek-macierzynski"],
  ["Ministerstwo Rodziny, Pracy i Polityki Społecznej", "Urlop rodzicielski", "https://www.gov.pl/web/rodzina/urlop-rodzicielski"],
  ["Ministerstwo Rodziny, Pracy i Polityki Społecznej", "Uprawnienia związane z rodzicielstwem", "https://www.gov.pl/web/rodzina/uprawnienia-zwiazane-z-rodzicielstwem"],
  ["Państwowa Inspekcja Pracy", "Rodzice w pracy — Twoje prawa", "https://www.pip.gov.pl/nasza-oferta/rodzice-w-pracy"],
];

const PRAWNE = [
  ["Mapa strony", "/mapa-strony"],
  ["Deklaracja dostępności", "/deklaracja-dostepnosci"],
  ["Polityka prywatności", "/polityka-prywatnosci"],
  ["Pliki cookies", "/cookies"],
  ["Kontakt", "/o-zus/kontakt"],
];

const Zewn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
);

export default function StopkaKonta() {
  return (
    <footer className="sk">
      <div className="wrap">
        <div className="sk-gora">
          <Link to="/" className="sk-znak" aria-label="Strona główna">
            <img src="/logo.png" alt="Zakład Ubezpieczeń Społecznych" />
            <span>Wersja demonstracyjna</span>
          </Link>
          <div className="sk-opis">
            <p>
              Przewodnik młodego rodzica pomaga sprawdzić, jakie urlopy i zasiłki Ci przysługują, i prowadzi przez wnioski krok po kroku.
              To prototyp przygotowany na HackNation 2026 — nie jest serwisem Zakładu Ubezpieczeń Społecznych.
            </p>
            <ul className="sk-zewn">
              {ZEWNETRZNE.map(([n, h]) => (
                <li key={n}><a href={h} target="_blank" rel="noreferrer">{n} <Zewn /><span className="sr-only"> (otwiera się w nowej karcie)</span></a></li>
              ))}
            </ul>
          </div>
        </div>
        <nav className="sk-upr" aria-labelledby="sk-upr-tytul">
          <h2 id="sk-upr-tytul">Uprawnienia rodziców — oficjalne źródła</h2>
          <ul>
            {UPRAWNIENIA.map(([kto, co, h]) => (
              <li key={h}>
                <a href={h} target="_blank" rel="noreferrer">
                  <small>{kto}</small>
                  <b>{co} <Zewn /></b>
                  <span className="sr-only"> (otwiera się w nowej karcie)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="sk-prawne">
          {PRAWNE.map(([n, h]) => <li key={n}><Link to={h}>{n}</Link></li>)}
        </ul>
        <p className="sk-licencja">Dane w prototypie są zmyślone. Treści uproszczone — przed decyzją sprawdź aktualne informacje na zus.pl.</p>
      </div>
    </footer>
  );
}
