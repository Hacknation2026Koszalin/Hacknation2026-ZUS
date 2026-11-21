import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { MENU } from "../data/nawigacja.js";

export default function Header() {
  const [otwarte, setOtwarte] = useState(null); // slug otwartej sekcji mega menu
  const [mobilne, setMobilne] = useState(false); // menu na telefonie
  const [fraza, setFraza] = useState("");
  const lokalizacja = useLocation();
  const nawiguj = useNavigate();

  // zamknij menu po przejściu na inną stronę
  useEffect(() => {
    setOtwarte(null);
    setMobilne(false);
  }, [lokalizacja.pathname]);

  // Escape zamyka menu
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setOtwarte(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const szukaj = (e) => {
    e.preventDefault();
    if (fraza.trim()) nawiguj(`/szukaj?q=${encodeURIComponent(fraza.trim())}`);
  };

  return (
    <header className="header">
      <div className="wrap header-in">
        <Link to="/" className="logo" aria-label="Strona główna">
          <span className="logo-mark" aria-hidden="true">Z</span>
          <span className="logo-text">
            <b>Zakład Ubezpieczeń Społecznych</b>
            <small>wersja prototypowa</small>
          </span>
        </Link>

        <form className="search" role="search" onSubmit={szukaj}>
          <label htmlFor="szukaj" className="sr-only">Szukaj w serwisie</label>
          <input id="szukaj" type="search" placeholder="Czego szukasz? np. zasiłek macierzyński" value={fraza} onChange={(e) => setFraza(e.target.value)} />
          <button type="submit" aria-label="Szukaj">🔍</button>
        </form>

        <button className="hamburger" aria-expanded={mobilne} aria-controls="menu-glowne" onClick={() => setMobilne(!mobilne)}>
          {mobilne ? "✕ Zamknij" : "☰ Menu"}
        </button>
      </div>

      <nav id="menu-glowne" className={`mainnav ${mobilne ? "open" : ""}`} aria-label="Menu główne" onMouseLeave={() => setOtwarte(null)}>
        <ul className="wrap mainnav-list">
          {MENU.map((s) => (
            <li key={s.slug} onMouseEnter={() => setOtwarte(s.slug)}>
              <button className={`mainnav-btn ${otwarte === s.slug ? "active" : ""}`} aria-expanded={otwarte === s.slug} onClick={() => setOtwarte(otwarte === s.slug ? null : s.slug)}>
                {s.nazwa} <span aria-hidden="true">▾</span>
              </button>
              {otwarte === s.slug && (
                <div className="mega">
                  <div className="wrap mega-in">
                    <p className="mega-title">{s.nazwa}</p>
                    <ul className="mega-list">
                      {s.pozycje.map((p) => (
                        <li key={p.slug}>
                          <NavLink to={`/${s.slug}/${p.slug}`}>{p.nazwa}</NavLink>
                        </li>
                      ))}
                    </ul>
                    {s.slug === "swiadczenia" && (
                      <Link to="/przewodnik" className="mega-promo">
                        <span className="badge">Nowość</span>
                        <b>Przewodnik młodego rodzica</b>
                        <span>Zasiłki w ciąży i po porodzie — krok po kroku</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
          <li>
            <NavLink to="/przewodnik" className="mainnav-btn mainnav-highlight">Przewodnik rodzica</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
