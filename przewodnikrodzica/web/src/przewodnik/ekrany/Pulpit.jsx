import { Link } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import { ETAPY } from "../dane.js";

// Pulpit po zalogowaniu (wersja startowa — rozbudujecie wg planu podstron)
export default function Pulpit() {
  const { profil, etap, zus, ustaw } = useSesja();
  const e = ETAPY.find((x) => x.id === etap) || ETAPY[1];
  const ub = zus?.ubezpieczenie;
  const zl = (v) => v?.toLocaleString("pl-PL", { minimumFractionDigits: 2 }) + " zł";

  return (
    <div className="wrap page">
      <section className="pulpit-hero">
        <div>
          <p className="muted">{e.ikona} {e.nazwa} · <button className="link" onClick={() => ustaw({ onboardingZakonczony: false, etap: null })}>zmień</button></p>
          <h1>Cześć{profil?.imie ? `, ${profil.imie}` : ""}!</h1>
          <p className="lead"><b>{e.powitanie}</b> {e.podtytul}</p>
        </div>
      </section>

      <div className="grid grid-3">
        <article className="karta">
          <p className="karta-h">Twoje ubezpieczenie</p>
          {ub ? (
            <>
              <p className={`status ${ub.okresWyczekiwaniaSpelniony ? "zielony" : "zolty"}`}>
                {ub.okresWyczekiwaniaSpelniony ? "✓ Masz ubezpieczenie chorobowe" : "⚠ Sprawdź okres wyczekiwania"}
              </p>
              <p className="muted small">{ub.tytul} od {new Date(ub.od).toLocaleDateString("pl-PL")} · {ub.chorobowe}</p>
              <p className="muted small">Podstawa wymiaru: <b>{zl(zus.podstawaWymiaru)}</b></p>
              <p className="muted small">Zasiłek wypłaci: <b>{ub.platnikPowyzej20 ? "Twój pracodawca" : "ZUS"}</b></p>
            </>
          ) : <p className="muted">Brak danych z ZUS.</p>}
        </article>

        <article className="karta">
          <p className="karta-h">Najbliższe terminy</p>
          <ul className="terminy">
            <li><b>Do 6 tyg. przed porodem</b> — możesz zacząć urlop macierzyński</li>
            <li><b>Do 21 dni po porodzie</b> — wniosek o zasiłek 81,5% za cały rok</li>
            <li><b>Do 21 dni po porodzie</b> — zgłoszenie urodzenia</li>
          </ul>
          <Link to="/przewodnik/sciezka" className="link">Cała ścieżka →</Link>
        </article>

        <article className="karta">
          <p className="karta-h">Zaświadczenia e-ZLA</p>
          {zus?.eZLA?.length ? (
            <ul className="terminy">
              {zus.eZLA.map((z) => (
                <li key={z.od}>{new Date(z.od).toLocaleDateString("pl-PL")} – {new Date(z.do).toLocaleDateString("pl-PL")} <span className="tag">kod {z.kod}</span></li>
              ))}
            </ul>
          ) : <p className="muted">Brak zwolnień.</p>}
          {zus?.zadluzenie > 0 && <p className="status czerwony">Zadłużenie składkowe: {zl(zus.zadluzenie)}</p>}
        </article>
      </div>

      <h2 className="section-title" style={{ marginTop: 32 }}>Na skróty</h2>
      <div className="grid grid-4">
        {[["🧮", "Kalkulator zasiłku", "/przewodnik/kalkulator"], ["✍️", "Złóż wniosek", "/przewodnik/swiadczenia"], ["🗂️", "Moje dane z ZUS", "/przewodnik/sciezka"], ["🤍", "Wsparcie", "/przewodnik/wsparcie"]].map(([i, n, d]) => (
          <Link key={n} to={d} className="tile tile-action"><span className="tile-icon" aria-hidden="true">{i}</span><b>{n}</b></Link>
        ))}
      </div>
    </div>
  );
}
