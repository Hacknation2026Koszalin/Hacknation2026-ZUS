
import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
} from "react-router-dom";
import { MENU } from "../data/nawigacja.js";
import { PrzyciskDostepnosci } from "../przewodnik/komponenty/Dostepnosc.jsx";
import { JEZYKI, ustawJezyk, useJezyk } from "../przewodnik/jezyk.js";


export default function Header({ bezMenu = false }) {
  const [otwarte, setOtwarte] = useState(null);
  const [mobilne, setMobilne] = useState(false);
  const [jezyk, t] = useJezyk();

  const lokalizacja = useLocation();
  const headerRef = useRef(null);

  useEffect(() => {
    setOtwarte(null);
    setMobilne(false);
  }, [lokalizacja.pathname, lokalizacja.search]);

  useEffect(() => {
    const zamknijEscape = (event) => {
      if (event.key === "Escape") {
        setOtwarte(null);
        setMobilne(false);
      }
    };

    const klikPoza = (event) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target)
      ) {
        setOtwarte(null);
        setMobilne(false);
      }
    };

    document.addEventListener("keydown", zamknijEscape);
    document.addEventListener("pointerdown", klikPoza);

    return () => {
      document.removeEventListener("keydown", zamknijEscape);
      document.removeEventListener("pointerdown", klikPoza);
    };
  }, []);

  return (
    <header className={`zus-header ${bezMenu ? "zus-header--konto" : ""}`} ref={headerRef}>

      <div className="zus-header__top">
        <div className="wrap zus-header__top-inner">

          <Link
            to="/"
            className="zus-header__logo"
            aria-label="Strona główna"
          >
            <img
              src="/logo.png"
              alt="Zakład Ubezpieczeń Społecznych"
            />

            <span className="zus-header__identity">
              <strong>{t("Zakład Ubezpieczeń Społecznych")}</strong>
              <small>{t("Wersja demonstracyjna")}</small>
            </span>
          </Link>

          {bezMenu ? (
            <div className="zus-header__akcje">
              {/* Tu menu konta wstawia: czas sesji, powiadomienia, ustawienia, samouczek */}
              <div id="naglowek-akcje" className="naglowek-akcje" />
              <PrzyciskDostepnosci ikona />
              <div className="jezyki" role="group" aria-label="Język serwisu">
                {JEZYKI.map(([kod, skrot, nazwa]) => (
                  <button key={kod} type="button" lang={kod} aria-pressed={jezyk === kod} title={nazwa} className={jezyk === kod ? "aktywny" : ""} onClick={() => ustawJezyk(kod)}>{skrot}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="zh">
              <a href="/o-zus/kontakt" className="zh-link">{t("Kontakt")}</a>
              <label className="zh-jezyk">
                <span className="sr-only">Język serwisu</span>
                <select value={jezyk} onChange={(e) => ustawJezyk(e.target.value)}>
                  {JEZYKI.map(([kod, skrot, nazwa]) => <option key={kod} value={kod} title={nazwa}>{kod.toUpperCase()}</option>)}
                </select>
              </label>
              <span className="zh-sep" aria-hidden="true" />
              <a href="https://www.zus.pl" target="_blank" rel="noreferrer" className="zh-kwadrat" title="Informacje dla osób niesłyszących" aria-label="Informacje dla osób niesłyszących (zus.pl)">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-5 2" /><path d="M10 9a2 2 0 1 1 4 0M4 20l3-3M3 16l2-2" /></svg>
              </a>
              <span className="zh-kwadrat-wrap"><PrzyciskDostepnosci ikona /></span>
              <a href="https://bip.zus.pl" target="_blank" rel="noreferrer" className="zh-bip" aria-label="Biuletyn Informacji Publicznej"><span aria-hidden="true">◥</span>bip</a>
              <a href="https://www.zus.pl" target="_blank" rel="noreferrer" className="zh-btn zh-btn-pue">{t("Zaloguj do PUE/eZUS")} <span aria-hidden="true">›</span></a>
              <Link to="/przewodnik" className="zh-btn zh-btn-przewodnik">{t("Zaloguj do Przewodnika Młodego Rodzica")} <span aria-hidden="true">›</span></Link>
            </div>
          )}

          {!bezMenu && <button
            type="button"
            className="zus-header__mobile-toggle"
            aria-expanded={mobilne}
            aria-controls="zus-navigation"
            onClick={() => {
              setMobilne((prev) => !prev);
              setOtwarte(null);
            }}
          >
            {mobilne ? (
              <>
                <span>Zamknij</span>
                <span aria-hidden="true">×</span>
              </>
            ) : (
              <>
                <span>Menu</span>
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </>
            )}
          </button>}
        </div>
      </div>

      {!bezMenu && <nav
        id="zus-navigation"
        className={`zus-nav ${mobilne ? "is-open" : ""}`}
        aria-label="Menu główne"
        onMouseLeave={() => setOtwarte(null)}
      >
        <div className="wrap zus-nav__inner">
          <ul className="zus-nav__list">

            {MENU.map((sekcja) => {
              const rozwiniete = otwarte === sekcja.slug;
              const aktywne =
                lokalizacja.pathname === `/${sekcja.slug}` ||
                lokalizacja.pathname.startsWith(
                  `/${sekcja.slug}/`
                );

              return (
                <li
                  className={`zus-nav__item ${
                    rozwiniete ? "is-expanded" : ""
                  } ${aktywne ? "is-current" : ""}`}
                  key={sekcja.slug}
                  onMouseEnter={() => {
                    if (window.innerWidth > 980) {
                      setOtwarte(sekcja.slug);
                    }
                  }}
                >
                  <button
                    type="button"
                    className="zus-nav__trigger"
                    aria-expanded={rozwiniete}
                    aria-controls={`zus-mega-${sekcja.slug}`}
                    onClick={() =>
                      setOtwarte(
                        rozwiniete ? null : sekcja.slug
                      )
                    }
                  >
                    <span>{sekcja.nazwa}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {rozwiniete && (
                    <div
                      className="zus-mega"
                      id={`zus-mega-${sekcja.slug}`}
                    >
                      <div className="wrap zus-mega__inner">

                        <div className="zus-mega__heading">
                          <h2>{sekcja.nazwa}</h2>
                          <span className="zus-mega__rule" />
                        </div>

                        <div className="zus-mega__body">
                          <ul className="zus-mega__links">
                            {sekcja.pozycje.map((pozycja) => (
                              <li key={pozycja.slug}>
                                <NavLink
                                  to={`/${sekcja.slug}/${pozycja.slug}`}
                                  onClick={() =>
                                    setOtwarte(null)
                                  }
                                >
                                  {pozycja.nazwa}
                                </NavLink>
                              </li>
                            ))}
                          </ul>

                          {sekcja.slug === "swiadczenia" && (
                            <Link
                              to="/przewodnik"
                              className="zus-mega__promo"
                              onClick={() =>
                                setOtwarte(null)
                              }
                            >
                              <span>
                                Przewodnik przyszłego rodzica
                              </span>
                              <p>
                                Informacje o zasiłkach
                                w ciąży i po porodzie,
                                krok po kroku.
                              </p>
                              <strong>
                                Otwórz przewodnik
                                <span aria-hidden="true">↗</span>
                              </strong>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <NavLink
            to="/przewodnik"
            className={({ isActive }) =>
              `zus-nav__featured ${
                isActive ? "is-active" : ""
              }`
            }
            onClick={() => {
              setOtwarte(null);
              setMobilne(false);
            }}
          >
            Przewodnik rodzica
            <span aria-hidden="true">↗</span>
          </NavLink>
        </div>
      </nav>}
    </header>
  );
}
