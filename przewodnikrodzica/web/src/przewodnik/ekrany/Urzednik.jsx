// =====================================================================
// Widok urzędnika (tryb demo). Pokazuje wniosek w czytelnej postaci,
// automatyczne sprawdzenia i pozwala: przyjąć albo poprosić o uzupełnienie
// (z zaznaczeniem konkretnych pól — obywatel poprawi tylko je).
// =====================================================================
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CZESCI, POLA, dniMiedzy, fmtData, zl } from "../wniosek/formularz.js";
import { czyWidoczne, czyWymagane, pokazWartosc } from "../wniosek/silnik.js";
import { STATUSY, pobierzWnioski, zmienStatus } from "../wniosek/wnioski.js";
import Ikona from "../wniosek/Ikona.jsx";
import "../wniosek/wniosek.css";

const fmt = (iso) => new Date(iso).toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" });

function kontrole(wn) {
  const d = wn.dane || {};
  const k = wn.kontekst || {};
  const dzien = (wn.zlozono || new Date().toISOString()).slice(0, 10);
  const wynik = [];
  wynik.push(k.chorobowe ? ["ok", `Ubezpieczenie chorobowe: ${k.chorobowe} (${k.tytul} od ${fmtData(k.od)})`] : ["uwaga", "Brak danych o ubezpieczeniu chorobowym"]);
  wynik.push(k.zadluzenie > 0 ? ["uwaga", `Zadłużenie składkowe: ${zl(k.zadluzenie)}`] : ["ok", "Brak zadłużenia składkowego"]);
  if (d.wariant === "815") {
    if (d.urodzone === "tak" && d.dataUr) {
      const dni = dniMiedzy(d.dataUr, dzien);
      wynik.push(dni <= 21 ? ["ok", `Wariant 81,5%: wniosek złożony ${dni} dni po porodzie (limit 21 dni)`] : ["uwaga", `Wariant 81,5%: wniosek złożony ${dni} dni po porodzie — po terminie 21 dni`]);
    } else wynik.push(["ok", "Wariant 81,5%: wniosek złożony przed porodem — termin zachowany"]);
  } else if (d.wariant === "100") wynik.push(["info", "Wariant 100% — o urlop rodzicielski osoba poprosi osobno"]);
  if (d.termin && d.odKiedy) wynik.push(["ok", `Początek zasiłku ${fmtData(d.odKiedy)} — ${dniMiedzy(d.odKiedy, d.termin)} dni przed przewidywanym porodem (maks. 42)`]);
  const pliki = POLA.filter((p) => p.typ === "plik" && d[p.id]);
  if (pliki.length) wynik.push(["ok", `Załączniki: ${pliki.map((p) => d[p.id]).join(", ")}`]);
  if (d.akt === "rejestr") wynik.push(["info", "Urodzenie do potwierdzenia w rejestrze stanu cywilnego"]);
  wynik.push(["info", k.platnikPowyzej20 ? `Zasiłek wypłaca płatnik: ${k.platnik} (ponad 20 ubezpieczonych)` : "Zasiłek wypłaca ZUS"]);
  return wynik;
}

export default function Urzednik() {
  const [lista, setLista] = useState([]);
  const [wybrany, setWybrany] = useState(null);
  const [prosba, setProsba] = useState(false);
  const [pola, setPola] = useState([]);
  const [komentarz, setKomentarz] = useState("");
  const [komunikat, setKomunikat] = useState("");

  const odswiez = () => pobierzWnioski().then(setLista);
  useEffect(() => {
    odswiez();
    const t = setInterval(odswiez, 4000);
    window.addEventListener("storage", odswiez);
    return () => {
      clearInterval(t);
      window.removeEventListener("storage", odswiez);
    };
  }, []);

  const wn = lista.find((x) => x.numer === wybrany) || lista[0];
  const ctx = wn && {
    zus: { ubezpieczenie: { platnikPowyzej20: wn.kontekst?.platnikPowyzej20, platnik: wn.kontekst?.platnik } },
    dzis: (wn.zlozono || "").slice(0, 10),
  };

  const wybierz = (numer) => {
    setWybrany(numer);
    setProsba(false);
    setPola([]);
    setKomentarz("");
    setKomunikat("");
  };

  const przyjmij = async () => {
    await zmienStatus(wn.numer, "przyjety");
    setKomunikat("Wniosek przyjęty. Obywatel zobaczy to w „Moich sprawach”.");
    odswiez();
  };

  const wyslijProsbe = async () => {
    await zmienStatus(wn.numer, "do_uzupelnienia", { komentarz: komentarz.trim(), doPoprawy: pola });
    setProsba(false);
    setKomunikat("Prośba wysłana. Obywatel poprawi tylko zaznaczone pola.");
    odswiez();
  };

  return (
    <div className="wn" style={{ paddingTop: 0 }}>
      <div className="urz-pasek">
        <div className="wrap">
          <Ikona n="urzad" /> Panel urzędnika <small>— symulacja, dane testowe</small>
          <Link to="/przewodnik/sprawy" style={{ marginLeft: "auto", color: "#fff", fontWeight: 400, fontSize: 14 }}>Wróć do widoku obywatela</Link>
        </div>
      </div>
      <div className="wrap" style={{ paddingTop: 24 }}>
        {lista.length === 0 ? (
          <div className="wn-karta">
            <h1>Brak wniosków</h1>
            <p>Złóż wniosek jako Anna Testowa, a pojawi się tutaj.</p>
            <Link to="/przewodnik/swiadczenia/zasilek-macierzynski/wniosek" className="wn-btn wn-btn-glowny">Przejdź do wniosku</Link>
          </div>
        ) : (
          <div className="urz-uklad">
            <div className="urz-lista" role="list" aria-label="Wnioski">
              {lista.map((x) => {
                const st = STATUSY[x.status] || STATUSY.u_urzednika;
                return (
                  <button key={x.numer} role="listitem" type="button" className={`urz-pozycja ${x.numer === wn.numer ? "akt" : ""}`} onClick={() => wybierz(x.numer)}>
                    <b>{x.osoba?.imie} {x.osoba?.nazwisko}</b>
                    <small>{x.typ} · <span className="wn-mono">{x.numer}</span></small>
                    <small>{fmt(x.zlozono)}</small>
                    <span className={`wn-chip ${st.klasa}`}>{st.tekst}</span>
                  </button>
                );
              })}
            </div>

            <div>
              <div className="wn-karta">
                <div className="sp-glowa">
                  <div>
                    <h1 style={{ fontSize: 26, margin: 0 }}>{wn.nazwa}</h1>
                    <small className="muted">
                      {wn.osoba?.imie} {wn.osoba?.nazwisko} · PESEL <span className="wn-mono">{wn.osoba?.pesel}</span> · nr <span className="wn-mono">{wn.numer}</span>
                    </small>
                  </div>
                  <span className={`wn-chip ${(STATUSY[wn.status] || STATUSY.u_urzednika).klasa}`}>{(STATUSY[wn.status] || STATUSY.u_urzednika).tekst}</span>
                </div>
              </div>

              <div className="wn-karta">
                <h2 style={{ fontSize: 18, marginTop: 0 }}>Sprawdzenie automatyczne</h2>
                <ul className="urz-kontrole">
                  {kontrole(wn).map(([typ, txt], i) => (
                    <li key={i} className={typ}>
                      <Ikona n={typ === "ok" ? "check" : typ === "uwaga" ? "alert" : "info"} rozmiar={18} /> {txt}
                    </li>
                  ))}
                </ul>
                <p className="sw-dopisek">Sprawdzenie pomaga, ale decyzję zawsze podejmuje urzędnik.</p>
              </div>

              <div className="wn-karta">
                <h2 style={{ fontSize: 18, marginTop: 0 }}>Treść wniosku</h2>
                {prosba && <p className="wn-alert uwaga" style={{ display: "block" }}>Zaznacz pola, które obywatel ma poprawić.</p>}
                {CZESCI.map((c, i) => {
                  const wid = POLA.filter((p) => p.czesc === c.id && czyWidoczne(p, wn.dane || {}, ctx));
                  if (!wid.length) return null;
                  return (
                    <div key={c.id} style={{ marginBottom: 12 }}>
                      <h3 style={{ fontSize: 15, textTransform: "uppercase", letterSpacing: ".04em", margin: "16px 0 4px" }}>Część {i + 1}. {c.tytul}</h3>
                      <dl style={{ margin: 0 }}>
                        {wid.map((p) => (
                          <div key={p.id} className={`urz-pole ${pola.includes(p.id) ? "oznaczone" : ""}`}>
                            {prosba ? (
                              <input type="checkbox" aria-label={`Do poprawy: ${p.etykieta}`} checked={pola.includes(p.id)}
                                onChange={(e) => setPola((l) => (e.target.checked ? [...l, p.id] : l.filter((x) => x !== p.id)))} />
                            ) : <span />}
                            <dt>{p.nr}. {p.etykieta}{!czyWymagane(p, wn.dane || {}, ctx) && " (nieob.)"}</dt>
                            <dd>{pokazWartosc(p, wn.dane?.[p.id], wn.osoba)}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  );
                })}
              </div>

              <div className="wn-karta">
                <div aria-live="polite">{komunikat && <p className="wn-alert ok" style={{ display: "block", marginTop: 0 }}>{komunikat}</p>}</div>
                {!prosba ? (
                  <div className="wn-przyciski" style={{ marginTop: 0 }}>
                    <button type="button" className="wn-btn wn-btn-glowny wn-btn-duzy" onClick={przyjmij} disabled={wn.status === "przyjety"}>
                      <Ikona n="check" /> Przyjmij wniosek
                    </button>
                    <button type="button" className="wn-btn wn-btn-drugi wn-btn-duzy" onClick={() => { setProsba(true); setKomunikat(""); }}>
                      Poproś o uzupełnienie
                    </button>
                  </div>
                ) : (
                  <>
                    <label htmlFor="urz-kom" style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>Wiadomość dla obywatela</label>
                    <textarea id="urz-kom" className="urz-textarea" value={komentarz} onChange={(e) => setKomentarz(e.target.value)}
                      placeholder="Np. Proszę dołączyć czytelne zaświadczenie lekarskie." />
                    <div className="wn-przyciski">
                      <button type="button" className="wn-btn wn-btn-tekst" onClick={() => setProsba(false)}>Anuluj</button>
                      <button type="button" className="wn-btn wn-btn-glowny wn-btn-duzy" disabled={!pola.length || !komentarz.trim()} onClick={wyslijProsbe}>
                        Wyślij prośbę ({pola.length} {pola.length === 1 ? "pole" : "pola"})
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
