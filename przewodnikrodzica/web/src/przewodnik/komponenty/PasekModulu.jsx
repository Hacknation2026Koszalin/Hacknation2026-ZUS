import { useEffect, useRef, useState } from "react";
import { useJezyk } from "../jezyk.js";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import { POMOC, SWIADCZENIA } from "../swiadczenia.js";
import { FORMULARZE, slug } from "../wniosek/formularze/index.js";
import Ustawienia from "./Ustawienia.jsx";
import { Dzwonek } from "./Powiadomienia.jsx";
import CzasSesji from "./CzasSesji.jsx";
import { OTWORZ_ZUSANNE } from "./Zusanna.jsx";
import Ikona from "../wniosek/Ikona.jsx";
import { P } from "../parametry.js";

// Jedno menu po zalogowaniu — wszystko kręci się wokół rodzicielstwa.
// „Świadczenia” i „Pomoc” rozwijają listę po najechaniu (albo po Tab).

function Rozwijane({ nazwa, ikona, do: cel, aktywne, pozycje, onAkcja }) {
  const [, t] = useJezyk();
  const [otwarte, setOtwarte] = useState(false);
  const zamkniecie = useRef(null);
  const otworz = () => { clearTimeout(zamkniecie.current); setOtwarte(true); };
  const zamknij = () => { zamkniecie.current = setTimeout(() => setOtwarte(false), 120); };
  return (
    <div
      className={`mw ${otwarte ? "otwarte" : ""}`}
      onMouseEnter={otworz}
      onMouseLeave={zamknij}
      onFocus={otworz}
      onBlur={zamknij}
      onKeyDown={(e) => e.key === "Escape" && setOtwarte(false)}
    >
      <NavLink to={cel} className={`mw-link ${aktywne ? "active" : ""}`} aria-haspopup="true" aria-expanded={otwarte}>
        <Ikona n={ikona} rozmiar={18} /> {nazwa} <Ikona n="dol" rozmiar={16} className="mw-strzalka" />
      </NavLink>
      {otwarte && (
        <div className="mw-panel" role="menu">
          {pozycje.map((p) =>
            p.akcja ? (
              <button key={p.id} type="button" role="menuitem" className="mw-poz" onClick={() => { setOtwarte(false); onAkcja?.(p.akcja); }}>
                <Ikona n={p.ikona} rozmiar={18} /> {p.nazwa}
              </button>
            ) : (
              <NavLink key={p.id} role="menuitem" to={p.link || `${cel}#${p.id}`} onClick={() => setOtwarte(false)}>
                <Ikona n={p.ikona} rozmiar={18} /> {p.nazwa}
              </NavLink>
            )
          )}
          <NavLink role="menuitem" to={cel} className="mw-wszystko" onClick={() => setOtwarte(false)}>
            {t("Zobacz wszystko")} <Ikona n="strzalka" rozmiar={16} />
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default function PasekModulu() {
  const { setPrzewodnikOtwarty, wyloguj } = useSesja();
  const { state, pathname } = useLocation();
  const [ustawienia, setUstawienia] = useState(false);
  const [, t] = useJezyk();
  const [slot, setSlot] = useState(null);
  const [menuOtwarte, setMenuOtwarte] = useState(false);
  useEffect(() => {
    const f = () => setUstawienia(true);
    window.addEventListener("otworz-ustawienia", f);
    return () => window.removeEventListener("otworz-ustawienia", f);
  }, []);
  useEffect(() => { setMenuOtwarte(false); }, [pathname]);
  useEffect(() => {
    if (!menuOtwarte) return;
    const esc = (e) => e.key === "Escape" && setMenuOtwarte(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [menuOtwarte]);
  useEffect(() => { setSlot(document.getElementById("naglowek-akcje")); }, []);
  const akcja = (a) => {
    if (a === "zusanna") window.dispatchEvent(new Event(OTWORZ_ZUSANNE));
    if (a === "samouczek") setPrzewodnikOtwarty(true);
  };

  return (
    <header className="modul-pasek">
      <div className="wrap modul-in">
        <button type="button" className="hamburger" aria-expanded={menuOtwarte} aria-controls="menu-konta" onClick={() => setMenuOtwarte((o) => !o)}>
          <span className="hamburger-ikona" aria-hidden="true"><span /><span /><span /></span>
          {menuOtwarte ? t("Zamknij") : t("Menu")}
        </button>
        <nav id="menu-konta" className={`modul-zakladki ${menuOtwarte ? "otwarte" : ""}`} aria-label="Menu konta">
          <NavLink to="/przewodnik/pulpit"><Ikona n="dom" rozmiar={18} /> {t("Moje konto")}</NavLink>
          <NavLink to="/przewodnik/sciezka"><Ikona n="mapa" rozmiar={18} /> {t("Moja ścieżka")}</NavLink>
          <Rozwijane nazwa={t("Świadczenia")} ikona="dokument" do="/przewodnik/swiadczenia" aktywne={pathname.startsWith("/przewodnik/swiadczenia") && !pathname.endsWith("/wniosek")} pozycje={SWIADCZENIA} />
          <Rozwijane
            nazwa={t("Złóż wniosek")} ikona="pioro" do="/przewodnik/wnioski"
            aktywne={pathname.startsWith("/przewodnik/wnioski") || pathname.endsWith("/wniosek")}
            pozycje={FORMULARZE.map((f) => ({ id: f.symbol, nazwa: <><span className="mw-sym">{f.symbol}</span> {f.menu}</>, ikona: "dokument", link: `/przewodnik/wnioski/${slug(f)}` }))}
          />
          <NavLink to="/przewodnik/kalkulator"><Ikona n="kalkulator" rozmiar={18} /> {t("Kalkulator")}</NavLink>
          <NavLink to="/przewodnik/sprawy"><Ikona n="teczka" rozmiar={18} /> {t("Moje sprawy")}</NavLink>
          <Rozwijane nazwa={t("Pomoc")} ikona="kolo" do="/przewodnik/pomoc" aktywne={pathname.startsWith("/przewodnik/pomoc")} pozycje={POMOC} onAkcja={akcja} />
        </nav>
        {(() => {
          // Czas sesji, powiadomienia, ustawienia i samouczek mieszkają w nagłówku (w miejscu wyszukiwarki)
          const ikony = (
            <>
              <CzasSesji />
              {P.funkcje.powiadomienia && <Dzwonek />}
              <button className="ikona-btn zebatka" aria-label={t("Ustawienia")} title={t("Ustawienia")} onClick={() => setUstawienia(true)}>
                <Ikona n="zebatka" rozmiar={22} />
              </button>
              <button
                className={`ikona-btn pomoc-btn ${state?.zPrzewodnika ? "pulsuje" : ""}`}
                aria-label="Samouczek — jak działa przewodnik"
                title={t("Samouczek")}
                onClick={() => setPrzewodnikOtwarty(true)}
              >?</button>
            </>
          );
          return slot ? createPortal(ikony, slot) : ikony;
        })()}
        <button type="button" className="wyloguj-btn" onClick={wyloguj}>
          <Ikona n="wyloguj" rozmiar={18} /> <span>{t("Wyloguj się")}</span>
        </button>
      </div>
      {/* Okno ustawień renderujemy w <body>, żeby nie chowało się pod nagłówkiem */}
      {createPortal(<div className="modul us-portal"><Ustawienia otwarte={ustawienia} onZamknij={() => setUstawienia(false)} /></div>, document.body)}
    </header>
  );
}
