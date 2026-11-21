
import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { MENU } from "../data/nawigacja.js";

export default function Header() {
  const [otwarte, setOtwarte] = useState(null);
  const [mobilne, setMobilne] = useState(false);
  const [fraza, setFraza] = useState("");

  const lokalizacja = useLocation();
  const nawiguj = useNavigate();
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

  const szukaj = (event) => {
    event.preventDefault();
    const query = fraza.trim();

    if (!query) return;

    nawiguj(`/szukaj?q=${encodeURIComponent(query)}`);
    setOtwarte(null);
    setMobilne(false);
  };

  return (
    <header className="zus-header" ref={headerRef}>

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
              <strong>
                Zakład Ubezpieczeń Społecznych
              </strong>
              <small>Wersja demonstracyjna</small>
            </span>
          </Link>

          <form
            className="zus-header__search"
            role="search"
            onSubmit={szukaj}
          >
            <label htmlFor="zus-search" className="sr-only">
              Szukaj w serwisie
            </label>

            <input
              id="zus-search"
              type="search"
              placeholder="Szukaj w serwisie"
              value={fraza}
              onChange={(e) => setFraza(e.target.value)}
            />

            <button type="submit" aria-label="Szukaj">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="10.8" cy="10.8" r="7.2" />
                <path d="m16.2 16.2 4.3 4.3" />
              </svg>
            </button>
          </form>

          <button
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
          </button>
        </div>
      </div>

      <nav
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
      </nav>
    </header>
  );
}
