import { Link } from "react-router-dom";

// /przewodnik — strona wejściowa modułu
export default function Start() {
  return (
    <div className="wrap page">
      <nav aria-label="Ścieżka" className="breadcrumb">
        <Link to="/">Strona główna</Link> › <span aria-current="page">Przewodnik młodego rodzica</span>
      </nav>
      <section className="guide-hero">
        <span className="badge">Nowość</span>
        <h1>Przewodnik młodego rodzica</h1>
        <p className="lead">Zasiłki w ciąży i po porodzie: co Ci przysługuje, ile dostaniesz, jakie wnioski i gdzie je złożyć — krok po kroku.</p>
        <Link to="/przewodnik/logowanie" className="btn btn-primary btn-lg">Zaloguj się przez mObywatel</Link>
        <p className="muted small">Logowanie w prototypie jest symulowane — nie podajesz żadnych haseł.</p>
      </section>
    </div>
  );
}
