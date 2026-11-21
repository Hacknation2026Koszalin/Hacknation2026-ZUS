import { Outlet, useLocation } from "react-router-dom";
import TopBar from "./TopBar.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

// Po zalogowaniu do przewodnika chowamy menu serwisu — zostaje tylko menu rodzica.
const STREFA_KONTA = /^\/przewodnik\/(pulpit|karta-ciazy|sciezka|swiadczenia|kalkulator|sprawy|wsparcie|urzednik|witaj)/;

export default function Layout() {
  const { pathname } = useLocation();
  const wKoncie = STREFA_KONTA.test(pathname);
  return (
    <>
      <a className="skip" href="#tresc">Przejdź do treści</a>
      {!wKoncie && <TopBar />}
      {!wKoncie && <Header />}
      <main id="tresc">
        <Outlet />
      </main>
      {wKoncie ? (
        <footer className="modul-stopka">
          <div className="wrap">Przewodnik młodego rodzica · wersja prototypowa · HackNation 2026</div>
        </footer>
      ) : (
        <Footer />
      )}
    </>
  );
}
