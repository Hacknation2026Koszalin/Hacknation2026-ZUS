import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import StopkaKonta from "./StopkaKonta.jsx";

// Po zalogowaniu do przewodnika chowamy menu serwisu — zostaje tylko menu rodzica.
const STREFA_KONTA = /^\/przewodnik\/(pulpit|sciezka|swiadczenia|kalkulator|sprawy|wsparcie|pomoc|wnioski|ryzyka|urzednik|pracodawca|admin|witaj)/;

export default function Layout() {
  const { pathname } = useLocation();
  const wKoncie = STREFA_KONTA.test(pathname);
  return (
    <>
      <a className="skip" href="#tresc">Przejdź do treści</a>
      {/* W strefie konta: bez górnego paska i menu serwisu; w nagłówku ikony konta, dostępność i języki */}
      <Header bezMenu={wKoncie} />
      <main id="tresc">
        <Outlet />
      </main>
      {wKoncie ? <StopkaKonta /> : <Footer />}
    </>
  );
}
