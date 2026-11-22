import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { SesjaProvider, useSesja } from "./SesjaContext.jsx";
import Start from "./ekrany/Start.jsx";
import LoginGov from "./ekrany/LoginGov.jsx";
import Mobywatel from "./ekrany/Mobywatel.jsx";
import Zgoda from "./ekrany/Zgoda.jsx";
import Pobieranie from "./ekrany/Pobieranie.jsx";
import Witaj from "./ekrany/Witaj.jsx";
import Pulpit from "./ekrany/Pulpit.jsx";
import Kalkulator from "./ekrany/Kalkulator.jsx";
import WBudowie from "./ekrany/WBudowie.jsx";
import Wsparcie from "./ekrany/Wsparcie.jsx";
import ZlozWniosek, { KreatorFormularza } from "./ekrany/ZlozWniosek.jsx";
import PrzewodnikSwiadczenia from "./ekrany/PrzewodnikSwiadczenia.jsx";
import Ryzyka from "./ekrany/Ryzyka.jsx";
import MojeSprawy from "./ekrany/MojeSprawy.jsx";
import Urzednik from "./ekrany/Urzednik.jsx";
import Sciezka from "./ekrany/Sciezka.jsx";
import KontoPUE from "./ekrany/KontoPUE.jsx";
import WniosekZAM from "./wniosek/WniosekZAM.jsx";
import PasekModulu from "./komponenty/PasekModulu.jsx";
import PrzewodnikPowitalny from "./komponenty/PrzewodnikPowitalny.jsx";
import Zusanna from "./komponenty/Zusanna.jsx";
import { P } from "./parametry.js";
import { useJezyk } from "./jezyk.js";
import Admin from "./ekrany/Admin.jsx";
import { PasekZadluzenia } from "./komponenty/Zadluzenie.jsx";
import { maZadluzenie } from "./komponenty/Zadluzenie.jsx";
import "./przewodnik.css";
import "./wniosek/wniosek.css";
import "./wyglad.css";

// Czytnik ekranu: po zmianie strony ogłaszamy jej tytuł i przenosimy fokus na nagłówek (WCAG 2.4.3, 4.1.3)
function OgloszenieStrony() {
  const { pathname } = useLocation();
  const [tekst, setTekst] = useState("");
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0); // nowa strona zaczyna się od góry
    const tm = setTimeout(() => {
      const h1 = document.querySelector(".modul h1");
      const nazwa = h1?.innerText?.replace(/\s+/g, " ").trim();
      if (nazwa) {
        document.title = `${nazwa} — Przewodnik Młodego Rodzica`;
        setTekst(`Strona: ${nazwa}`);
        if (!window.location.hash && document.activeElement === document.body) {
          h1.setAttribute("tabindex", "-1");
          h1.focus({ preventScroll: true });
        }
      }
    }, 150);
    return () => clearTimeout(tm);
  }, [pathname]);
  return <div className="sr-only" role="status" aria-live="polite">{tekst}</div>;
}

// Strony dostępne tylko po zalogowaniu: pasek modułu + ? + przewodnik ponownie
function Zalogowany({ children }) {
  const {
    zalogowany,
    onboardingZakonczony,
    przewodnikOtwarty,
    setPrzewodnikOtwarty,
    zus,
  } = useSesja();
  const [jezyk, t] = useJezyk();
  if (!zalogowany) return <Navigate to="/przewodnik" replace />;
  if (!onboardingZakonczony) return <Navigate to="/przewodnik/witaj" replace />;
  return (
    <div className={`modul ${maZadluzenie(zus) ? "zadluzony" : ""}`}>
      <OgloszenieStrony />
      <PasekModulu />
      {maZadluzenie(zus) && <PasekZadluzenia zus={zus} />}
      {jezyk !== "pl" && (
        <div className="pk pk-jezyk" role="status" lang={jezyk}><div className="wrap">{t("tylko-po-polsku")}</div></div>
      )}
      {P.komunikat && (
        <div className="pk" role="status"><div className="wrap"><b>Komunikat:</b> {P.komunikat}</div></div>
      )}
      {children}
      {P.funkcje.zusanna && <Zusanna />}
      {przewodnikOtwarty && (
        <PrzewodnikPowitalny
          tylkoSlajdy
          onZamknij={() => setPrzewodnikOtwarty(false)}
        />
      )}
    </div>
  );
}

const chron = (el) => <Zalogowany>{el}</Zalogowany>;

export default function PrzewodnikApp() {
  return (
    <SesjaProvider>
      <Routes>
        <Route index element={<Start />} />
        <Route path="logowanie" element={<LoginGov />} />
        <Route path="mobywatel" element={<Mobywatel />} />
        <Route path="zgoda" element={<Zgoda />} />
        <Route path="pobieranie" element={<Pobieranie />} />
        <Route
          path="witaj"
          element={
            <div className="modul">
              <Witaj />
            </div>
          }
        />
        <Route path="pulpit" element={chron(<Pulpit />)} />
        <Route path="sciezka" element={chron(<Sciezka />)} />
        <Route path="swiadczenia" element={chron(<Wsparcie rodzaj="swiadczenia" />)} />
        <Route
          path="swiadczenia/zasilek-macierzynski"
          element={chron(<PrzewodnikSwiadczenia id="zasilek-macierzynski" />)}
        />
        <Route
          path="swiadczenia/zasilek-macierzynski/wniosek"
          element={chron(<WniosekZAM />)}
        />
        <Route path="kalkulator" element={chron(<Kalkulator />)} />
        <Route path="sprawy" element={chron(<MojeSprawy />)} />
        <Route path="pomoc" element={chron(<Wsparcie rodzaj="pomoc" />)} />
        <Route path="swiadczenia/:id" element={chron(<PrzewodnikSwiadczenia />)} />
        <Route path="ryzyka" element={chron(<Ryzyka />)} />
        <Route path="konto-pue" element={chron(<KontoPUE />)} />
        <Route path="wnioski" element={chron(<ZlozWniosek />)} />
        <Route path="wnioski/:symbol" element={chron(<KreatorFormularza />)} />
        <Route path="wsparcie" element={<Navigate to="/przewodnik/pomoc" replace />} />
        {/* Tryb demo: widok urzędnika (bez logowania obywatela) */}
        <Route
          path="urzednik"
          element={
            <div className="modul">
              <Urzednik />
            </div>
          }
        />
        <Route
          path="admin"
          element={
            <div className="modul">
              <Admin />
            </div>
          }
        />
        <Route
          path="pracodawca"
          element={
            <div className="modul">
              <Urzednik rola="pracodawca" />
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/przewodnik" replace />} />
      </Routes>
    </SesjaProvider>
  );
}
