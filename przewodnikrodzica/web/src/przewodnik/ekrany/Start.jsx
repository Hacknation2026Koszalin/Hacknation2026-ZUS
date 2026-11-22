import { useState } from "react";
import { Link } from "react-router-dom";
import { KLUCZ_WYLOGOWANIA } from "../komponenty/CzasSesji.jsx";

// /przewodnik — strona wejściowa modułu
export default function Start() {
  const [wylogowano, setWylogowano] = useState(() => sessionStorage.getItem(KLUCZ_WYLOGOWANIA) === "1");
  const ukryj = () => { sessionStorage.removeItem(KLUCZ_WYLOGOWANIA); setWylogowano(false); };
  return (
    <div className="wrap page">
      {wylogowano && (
        <div className="cs-info" role="status">
          <b>Wylogowaliśmy Cię z powodu braku aktywności.</b> Twoje odhaczone zadania są zapisane na tym urządzeniu — zaloguj się ponownie, aby wrócić.
          <button type="button" onClick={ukryj} aria-label="Zamknij komunikat">×</button>
        </div>
      )}
      <nav aria-label="Ścieżka" className="breadcrumb">
        <Link to="/">Strona główna</Link> › <span aria-current="page">Przewodnik młodego rodzica</span>
      </nav>
      <section className="guide-hero">
        <h1>Przewodnik młodego rodzica</h1>
        <p className="lead">Zasiłki w ciąży i po porodzie: co Ci przysługuje, ile dostaniesz, jakie wnioski i gdzie je złożyć — krok po kroku.</p>
        <Link to="/przewodnik/logowanie" className="btn btn-primary btn-lg">Zaloguj się przez mObywatel</Link>
      </section>
    </div>
  );
}
