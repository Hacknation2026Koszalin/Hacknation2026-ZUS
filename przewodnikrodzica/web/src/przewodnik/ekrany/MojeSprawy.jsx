// Moje sprawy — status wysłanych wniosków. Odświeża się sam co kilka sekund,
// więc gdy urzędnik w drugiej karcie zmieni status, tu od razu to widać.
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import { PROFIL_MOBYWATEL } from "../dane.js";
import { ZAM } from "../wniosek/formularz.js";
import { formularz } from "../wniosek/formularze/index.js";

const polaDla = (w) => (formularz(w.typ) || ZAM).pola;
import { statusDla, STATUSY, pobierzWnioski } from "../wniosek/wnioski.js";
import Ikona from "../wniosek/Ikona.jsx";

const fmt = (iso) => new Date(iso).toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" });

export default function MojeSprawy() {
  const { profil = PROFIL_MOBYWATEL } = useSesja();
  const nav = useNavigate();
  const [lista, setLista] = useState(null);

  useEffect(() => {
    let zyje = true;
    const odswiez = () => pobierzWnioski().then((l) => zyje && setLista(l.filter((w) => w.osoba?.pesel === profil.pesel)));
    odswiez();
    const t = setInterval(odswiez, 4000);
    window.addEventListener("storage", odswiez);
    return () => {
      zyje = false;
      clearInterval(t);
      window.removeEventListener("storage", odswiez);
    };
  }, [profil.pesel]);

  return (
    <div className="wn">
      <div className="wrap" style={{ maxWidth: 860 }}>
        <h1>Moje sprawy</h1>
        <p className="wn-lead">Tu widzisz wysłane wnioski i ich status.</p>

        {lista === null && <p className="muted">Wczytywanie…</p>}

        {lista?.length === 0 && (
          <div className="wn-karta">
            <p style={{ marginTop: 0 }}>Nie masz jeszcze żadnych spraw.</p>
            <Link to="/przewodnik/wnioski" className="wn-btn wn-btn-glowny">Złóż wniosek</Link>
          </div>
        )}

        {lista?.map((w) => {
          const st = statusDla(w);
          return (
            <article key={w.numer} className="wn-karta sp-wniosek">
              <div className="sp-glowa">
                <div>
                  <h2>{w.nazwa}</h2>
                  <small>Nr sprawy <span className="wn-mono">{w.numer}</span> · złożono {fmt(w.zlozono)} · {w.adresat === "pracodawca" ? `u pracodawcy (${w.adresatNazwa})` : w.adresat === "usc" ? "w urzędzie stanu cywilnego" : "w ZUS"}</small>
                </div>
                <span className={`wn-chip ${st.klasa}`}>{st.tekst}</span>
              </div>

              {w.status === "do_uzupelnienia" && (
                <div className="wn-alert uwaga">
                  <Ikona n="urzad" />
                  <div>
                    <b>Urzędnik prosi o uzupełnienie</b>
                    {w.komentarz && <p>„{w.komentarz}”</p>}
                    {w.doPoprawy?.length > 0 && (
                      <p>Do poprawy: {w.doPoprawy.map((id) => polaDla(w).find((p) => p.id === id)?.etykieta).filter(Boolean).join(", ")}</p>
                    )}
                    <button type="button" className="wn-btn wn-btn-glowny" style={{ marginTop: 10 }}
                      onClick={() => nav(`/przewodnik/wnioski/${(w.typ || "ZAM").toLowerCase()}`, { state: { poprawa: w.numer } })}>
                      Popraw wniosek
                    </button>
                  </div>
                </div>
              )}
              {w.status === "przyjety" && (
                <div className="wn-alert ok">
                  <Ikona n="check" />
                  <div><b>Wniosek przyjęty.</b> Zasiłek wypłaci {w.kontekst?.platnikPowyzej20 ? "Twój pracodawca" : "ZUS"}.</div>
                </div>
              )}

              <ol className="wn-os" aria-label="Historia sprawy">
                {(w.historia || []).map((h, i) => (
                  <li key={i} className={h.status === "do_uzupelnienia" ? "uwaga" : "done"}>
                    <span /> <b>{h.opis}</b><small>{fmt(h.data)}</small>
                  </li>
                ))}
                {w.status === "u_urzednika" && (
                  <li className="teraz"><span /> <b>Sprawdza urzędnik</b><small>Damy znać, jeśli czegoś zabraknie</small></li>
                )}
              </ol>
            </article>
          );
        })}

        <p className="sw-zrodlo">
          Tryb demo: <Link to="/przewodnik/urzednik">widok urzędnika ZUS</Link> albo <Link to="/przewodnik/pracodawca">widok pracodawcy (kadry)</Link> — najlepiej w drugiej karcie.
        </p>
      </div>
    </div>
  );
}
