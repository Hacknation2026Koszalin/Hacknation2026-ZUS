import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AKTUALNOSCI_ZAPAS, NAJCZESCIEJ, ZALATW } from "../data/nawigacja.js";

const formatDaty = (iso) =>
  new Date(iso).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function Home() {
  const [aktualnosci, setAktualnosci] = useState(AKTUALNOSCI_ZAPAS);
  const [zrodlo, setZrodlo] = useState("zapas");

  // Aktualności z backendu .NET (GET /api/aktualnosci); gdy nie działa — dane zapasowe
  useEffect(() => {
    fetch("/api/aktualnosci")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((dane) => {
        setAktualnosci(dane);
        setZrodlo("api");
      })
      .catch(() => setZrodlo("zapas"));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="wrap hero-in">
          <div>
            <h1>Załatw sprawę w ZUS szybciej2137</h1>
            <p>
              Świadczenia, zasiłki, składki i formularze — w jednym miejscu.
            </p>
            <div className="hero-cta">
              <Link to="/logowanie" className="btn btn-primary">
                Zaloguj do eZUS
              </Link>
              <Link
                to="/wzory-formularzy/najpopularniejsze"
                className="btn btn-secondary"
              >
                Wzory formularzy
              </Link>
            </div>
          </div>

          {/* MIEJSCE NA NASZ MODUŁ — wyróżniona karta prowadząca do przewodnika */}
          <Link to="/przewodnik" className="promo-card">
            <span className="badge">Nowość</span>
            <h2>Przewodnik młodego rodzica</h2>
            <p>
              Sprawdź, jakie zasiłki przysługują Ci w ciąży i po porodzie, ile
              wyniosą i gdzie złożyć wniosek.
            </p>
            <span className="promo-link">Rozpocznij →</span>
          </Link>
        </div>
      </section>

      <section className="wrap section">
        <h2 className="section-title">Załatw sprawę</h2>
        <div className="grid grid-4">
          {ZALATW.map((k) => (
            <Link key={k.tytul} to={k.do} className="tile tile-action">
              <span className="tile-icon" aria-hidden="true">
                {k.ikona}
              </span>
              <b>{k.tytul}</b>
              <span>{k.opis}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <h2 className="section-title">Najczęściej szukane</h2>
        <div className="grid grid-3">
          {NAJCZESCIEJ.map((k) => (
            <Link key={k.tytul} to={k.do} className="tile">
              <b>{k.tytul}</b>
              <span>{k.opis}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2 className="section-title">Aktualności</h2>
          <small className="muted">
            {zrodlo === "api"
              ? "dane z API .NET"
              : "dane zapasowe (API niedostępne)"}
          </small>
        </div>
        <div className="grid grid-3">
          {aktualnosci.map((a) => (
            <article key={a.id} className="news">
              <time dateTime={a.data}>{formatDaty(a.data)}</time>
              <h3>{a.tytul}</h3>
              <p>{a.lead}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
