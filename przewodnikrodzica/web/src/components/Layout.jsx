import { Outlet } from "react-router-dom";
import TopBar from "./TopBar.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  return (
    <>
      <a className="skip" href="#tresc">Przejdź do treści</a>
      <div className="proto" role="note">
        Prototyp na HackNation 2026 — to nie jest serwis Zakładu Ubezpieczeń Społecznych.
      </div>
      <TopBar />
      <Header />
      <main id="tresc">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
