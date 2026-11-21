import { Link, useSearchParams } from "react-router-dom";
import { MENU } from "../data/nawigacja.js";

// Proste wyszukiwanie po nazwach pozycji menu (bez backendu)
export default function Szukaj() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase();
  const wyniki = MENU.flatMap((s) => s.pozycje.map((p) => ({ ...p, sekcja: s }))).filter((p) => p.nazwa.toLowerCase().includes(q));
  const przewodnik = ["macierz", "rodzic", "ciąż", "ciaz", "ojcow", "urlop", "dziec"].some((k) => q.includes(k));

  return (
    <div className="wrap page narrow">
      <h1>Wyniki wyszukiwania</h1>
      <p className="lead">Fraza: „{params.get("q")}”</p>
      {przewodnik && (
        <Link to="/przewodnik" className="promo-card promo-inline">
          <span className="badge">Polecamy</span>
          <b>Przewodnik młodego rodzica</b>
          <span>Zasiłki w ciąży i po porodzie — krok po kroku</span>
        </Link>
      )}
      <ul className="results">
        {wyniki.map((p) => (
          <li key={`${p.sekcja.slug}-${p.slug}`}>
            <Link to={`/${p.sekcja.slug}/${p.slug}`}>{p.nazwa}</Link> <small className="muted">— {p.sekcja.nazwa}</small>
          </li>
        ))}
        {!wyniki.length && !przewodnik && <li>Brak wyników.</li>}
      </ul>
    </div>
  );
}
