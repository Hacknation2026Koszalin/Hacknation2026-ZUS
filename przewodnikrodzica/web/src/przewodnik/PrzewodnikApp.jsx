import { Navigate, Route, Routes } from "react-router-dom";
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
import ZasilekMacierzynski from "./ekrany/ZasilekMacierzynski.jsx";
import MojeSprawy from "./ekrany/MojeSprawy.jsx";
import Urzednik from "./ekrany/Urzednik.jsx";
import Sciezka from "./ekrany/Sciezka.jsx";
import WniosekZAM from "./wniosek/WniosekZAM.jsx";
import PasekModulu from "./komponenty/PasekModulu.jsx";
import PrzewodnikPowitalny from "./komponenty/PrzewodnikPowitalny.jsx";
import Zusanna from "./komponenty/Zusanna.jsx";
import { PasekZadluzenia } from "./komponenty/Zadluzenie.jsx";
import { maZadluzenie } from "./komponenty/Zadluzenie.jsx";
import "./przewodnik.css";
import "./wniosek/wniosek.css";
import "./wyglad.css";

// Strony dostępne tylko po zalogowaniu: pasek modułu + ? + przewodnik ponownie
function Zalogowany({ children }) {
  const {
    zalogowany,
    onboardingZakonczony,
    przewodnikOtwarty,
    setPrzewodnikOtwarty,
    zus,
  } = useSesja();
  if (!zalogowany) return <Navigate to="/przewodnik" replace />;
  if (!onboardingZakonczony) return <Navigate to="/przewodnik/witaj" replace />;
  return (
    <div className={`modul ${maZadluzenie(zus) ? "zadluzony" : ""}`}>
      <PasekModulu />
      {maZadluzenie(zus) && <PasekZadluzenia zus={zus} />}
      {children}
      <Zusanna />
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
          element={chron(<ZasilekMacierzynski />)}
        />
        <Route
          path="swiadczenia/zasilek-macierzynski/wniosek"
          element={chron(<WniosekZAM />)}
        />
        <Route path="kalkulator" element={chron(<Kalkulator />)} />
        <Route path="sprawy" element={chron(<MojeSprawy />)} />
        <Route path="pomoc" element={chron(<Wsparcie rodzaj="pomoc" />)} />
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
        <Route path="*" element={<Navigate to="/przewodnik" replace />} />
      </Routes>
    </SesjaProvider>
  );
}
