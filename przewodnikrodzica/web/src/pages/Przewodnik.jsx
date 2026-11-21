import { Link } from "react-router-dom";

// PUNKT DOKLEJENIA NASZEGO MODUŁU.
// Docelowo: tu startuje "Przewodnik młodego rodzica" (logowanie mObywatel -> przewodnik powitalny -> pulpit).
// Moduł najlepiej trzymać w osobnym folderze src/przewodnik/ i podpiąć jako <Route path="/przewodnik/*">.
export default function Przewodnik() {
  return (
    <div className="wrap page">
      <nav aria-label="Ścieżka" className="breadcrumb">
        <Link to="/">Strona główna</Link> › <Link to="/swiadczenia/zasilki">Świadczenia</Link> › <span aria-current="page">Przewodnik młodego rodzica</span>
      </nav>
      <section className="guide-hero">
        <span className="badge">Nowość</span>
        <h1>Przewodnik młodego rodzica</h1>
        <p className="lead">Zasiłki w ciąży i po porodzie: co Ci przysługuje, ile dostaniesz, jakie wnioski i gdzie złożyć — krok po kroku.</p>
        <Link to="/logowanie?cel=przewodnik" className="btn btn-primary btn-lg">Zaloguj się przez mObywatel</Link>
        <p className="muted small">Logowanie w prototypie jest symulowane.</p>
      </section>
      <div className="placeholder">
        <p><b>Tu doklejamy moduł „Przewodnik młodego rodzica”.</b></p>
        <p>Plan podstron: logowanie → przewodnik powitalny → pulpit, kalkulator, świadczenia, moje sprawy, wsparcie.</p>
      </div>
    </div>
  );
}
