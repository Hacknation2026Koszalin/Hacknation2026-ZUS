import { Link, useParams } from "react-router-dom";
import { znajdzPozycje } from "../data/nawigacja.js";
import NotFound from "./NotFound.jsx";

// Jedna strona-wydmuszka dla wszystkich pozycji menu: /:sekcja/:pozycja
export default function Podstrona() {
  const { sekcja: sSlug, pozycja: pSlug } = useParams();
  const { sekcja, pozycja } = znajdzPozycje(sSlug, pSlug);
  if (!sekcja || !pozycja) return <NotFound />;

  return (
    <div className="wrap page">
      <nav aria-label="Ścieżka" className="breadcrumb">
        <Link to="/">Strona główna</Link> › <span>{sekcja.nazwa}</span> › <span aria-current="page">{pozycja.nazwa}</span>
      </nav>
      <div className="page-grid">
        <aside className="sidenav" aria-label={sekcja.nazwa}>
          <p className="sidenav-h">{sekcja.nazwa}</p>
          <ul>
            {sekcja.pozycje.map((p) => (
              <li key={p.slug}>
                <Link to={`/${sekcja.slug}/${p.slug}`} aria-current={p.slug === pozycja.slug ? "page" : undefined}>{p.nazwa}</Link>
              </li>
            ))}
          </ul>
        </aside>
        <article>
          <h1>{pozycja.nazwa}</h1>
          <p className="lead">Ta podstrona jest wydmuszką — w prototypie pokazujemy tylko układ serwisu.</p>
          <div className="placeholder">
            <p>Treść podstrony „{pozycja.nazwa}” w budowie.</p>
            {(sekcja.slug === "swiadczenia" || pozycja.slug === "zasilki") && (
              <Link to="/przewodnik" className="btn btn-primary">Przejdź do Przewodnika młodego rodzica</Link>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
