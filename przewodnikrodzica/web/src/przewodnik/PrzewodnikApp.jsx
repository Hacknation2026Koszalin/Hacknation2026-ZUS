import { Navigate, Route, Routes } from "react-router-dom";
import { SesjaProvider, useSesja } from "./SesjaContext.jsx";
import Start from "./ekrany/Start.jsx";
import LoginGov from "./ekrany/LoginGov.jsx";
import Mobywatel from "./ekrany/Mobywatel.jsx";
import Zgoda from "./ekrany/Zgoda.jsx";
import Pobieranie from "./ekrany/Pobieranie.jsx";
import Witaj from "./ekrany/Witaj.jsx";
import Pulpit from "./ekrany/Pulpit.jsx";
import WBudowie from "./ekrany/WBudowie.jsx";
import PasekModulu from "./komponenty/PasekModulu.jsx";
import PrzewodnikPowitalny from "./komponenty/PrzewodnikPowitalny.jsx";
import "./przewodnik.css";

// Strony dostępne tylko po zalogowaniu: pasek modułu + ? + przewodnik ponownie
function Zalogowany({ children }) {
  const { zalogowany, onboardingZakonczony, przewodnikOtwarty, setPrzewodnikOtwarty } = useSesja();
  if (!zalogowany) return <Navigate to="/przewodnik" replace />;
  if (!onboardingZakonczony) return <Navigate to="/przewodnik/witaj" replace />;
  return (
    <>
      <PasekModulu />
      {children}
      {przewodnikOtwarty && <PrzewodnikPowitalny tylkoSlajdy onZamknij={() => setPrzewodnikOtwarty(false)} />}
    </>
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
        <Route path="witaj" element={<Witaj />} />
        <Route path="pulpit" element={chron(<Pulpit />)} />
        <Route path="sciezka" element={chron(<WBudowie tytul="Moja ścieżka" />)} />
        <Route path="swiadczenia" element={chron(<WBudowie tytul="Świadczenia" />)} />
        <Route path="kalkulator" element={chron(<WBudowie tytul="Kalkulator" />)} />
        <Route path="sprawy" element={chron(<WBudowie tytul="Moje sprawy" />)} />
        <Route path="wsparcie" element={chron(<WBudowie tytul="Wsparcie" />)} />
        <Route path="*" element={<Navigate to="/przewodnik" replace />} />
      </Routes>
    </SesjaProvider>
  );
}
