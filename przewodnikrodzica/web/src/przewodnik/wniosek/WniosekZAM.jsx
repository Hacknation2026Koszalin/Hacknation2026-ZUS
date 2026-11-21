// =====================================================================
// Symulacja składania wniosku ZAM — „przewodnik jak w grze”
// Etapy: start → wypelnianie → (braki) → przeglad → podpis → wyslano
// =====================================================================
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import { DANE_ZUS_ZAPAS, PROFIL_MOBYWATEL } from "../dane.js";
import { CZESCI, POLA, tekstNieDotyczy, tekstPodpowiedzi } from "./formularz.js";
import { blad, braki, czyWidoczne, czyWymagane, pokazWartosc, postep, widocznePola, wyczysc } from "./silnik.js";
import { pobierzWnioski, wyslijWniosek } from "./wnioski.js";
import Papier from "./Papier.jsx";
import Ikona from "./Ikona.jsx";
import "./wniosek.css";

const KLUCZ_SZKICU = "wniosek-zam-szkic";
const wczytajSzkic = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KLUCZ_SZKICU));
  } catch {
    return null;
  }
};
const ruchOgraniczony = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// ---------- Dymek przewodnika ----------
function Dymek({ pole, w, ctx, nr, ile, err, pokazBlad, przypomnij, pierwszy, onDalej, onPomin, onWstecz, onWylacz }) {
  const wym = czyWymagane(pole, w, ctx);
  return (
    <div className={`wn-dymek ${przypomnij ? "wn-potrzasnij" : ""}`} role="group" aria-label="Przewodnik po wniosku">
      <div className="wn-dymek-gora">
        <span>Pole {nr} z {ile}</span>
        <span className={`wn-chip ${wym ? "wym" : ""}`}>{wym ? "Wymagane" : "Nieobowiązkowe"}</span>
      </div>
      <p className="wn-dymek-txt">{tekstPodpowiedzi(pole, w, ctx)}</p>
      <div aria-live="assertive">
        {pokazBlad && err && (
          <p className="wn-dymek-blad" id={`blad-${pole.id}`}>
            <Ikona n="alert" rozmiar={18} /> {err}
          </p>
        )}
        {przypomnij && !(pokazBlad && err) && (
          <p className="wn-dymek-przyp">Najpierw to pole. Jeśli nie wiesz, co wpisać, kliknij „Pomiń”.</p>
        )}
      </div>
      <div className="wn-dymek-przyciski">
        <button type="button" className="wn-btn wn-btn-tekst" onClick={onWstecz} disabled={pierwszy}>
          <Ikona n="wstecz" rozmiar={18} /> Wstecz
        </button>
        <button type="button" className="wn-btn wn-btn-drugi" onClick={onPomin}>
          {wym ? "Nie wiem — pomiń" : "Pomiń"}
        </button>
        <button type="button" className="wn-btn wn-btn-glowny" onClick={onDalej}>
          Dalej <Ikona n="strzalka" rozmiar={18} />
        </button>
      </div>
      {wym && <p className="wn-dymek-mala">Pominięte pole dalej jest wymagane — przypomnimy o nim przed wysłaniem.</p>}
      <button type="button" className="wn-link wn-dymek-wyl" onClick={onWylacz}>
        Wyłącz przewodnik i wypełnij sam(a)
      </button>
    </div>
  );
}

// ---------- Główny komponent ----------
export default function WniosekZAM() {
  const sesja = useSesja();
  const nav = useNavigate();
  const { state } = useLocation();
  const ctx = useMemo(
    () => ({
      profil: sesja.profil || PROFIL_MOBYWATEL,
      zus: sesja.zus || DANE_ZUS_ZAPAS,
      dzis: new Date().toISOString().slice(0, 10),
    }),
    [sesja.profil, sesja.zus],
  );

  const szkic = wczytajSzkic();
  const [w, setW] = useState(szkic?.w || {});
  const [pominiete, setPominiete] = useState(szkic?.pominiete || []);
  const [numer, setNumer] = useState(szkic?.numer || null); // numer przy poprawie
  const [uwagaUrzednika, setUwagaUrzednika] = useState(szkic?.uwaga || null);
  const [etap, setEtap] = useState("start");
  const [prowadz, setProwadz] = useState(true);
  const [aktywne, setAktywne] = useState(null);
  const [kolejka, setKolejka] = useState(null); // tylko wybrane pola (braki / poprawa)
  const [bladAktywnego, setBladAktywnego] = useState(false);
  const [przypomnij, setPrzypomnij] = useState(false);
  const [pokazBledy, setPokazBledy] = useState(false);
  const [oswiadczenie, setOswiadczenie] = useState(false);
  const [wysylanie, setWysylanie] = useState(false);
  const [wyslany, setWyslany] = useState(null);
  const gora = useRef(null);

  // Zapis szkicu (żeby odświeżenie strony nie kasowało wpisanych danych)
  useEffect(() => {
    try {
      sessionStorage.setItem(KLUCZ_SZKICU, JSON.stringify({ w, pominiete, numer, uwaga: uwagaUrzednika }));
    } catch {
      /* bez zapisu */
    }
  }, [w, pominiete, numer, uwagaUrzednika]);

  // Poprawa wniosku na prośbę urzędnika (wejście z „Moich spraw”)
  useEffect(() => {
    if (!state?.poprawa) return;
    pobierzWnioski().then((lista) => {
      const wn = lista.find((x) => x.numer === state.poprawa);
      if (!wn) return;
      setW(wn.dane || {});
      setNumer(wn.numer);
      setUwagaUrzednika({ komentarz: wn.komentarz, pola: wn.doPoprawy || [] });
      const doPoprawy = (wn.doPoprawy || []).filter((id) => POLA.some((p) => p.id === id));
      setPominiete([]);
      if (doPoprawy.length) {
        setKolejka(doPoprawy);
        setAktywne(doPoprawy[0]);
        setProwadz(true);
        setEtap("wypelnianie");
      } else {
        setEtap("przeglad");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.poprawa]);

  // Kolejność pól, po których prowadzimy
  const kolejnosc = (kolejka ? kolejka.map((id) => POLA.find((p) => p.id === id)) : widocznePola(w, ctx))
    .filter((p) => p && czyWidoczne(p, w, ctx))
    .map((p) => p.id);

  // Przewiń do aktywnego pola i ustaw na nim fokus
  useEffect(() => {
    if (etap !== "wypelnianie" || !prowadz || !aktywne) return;
    const el = document.getElementById(`pole-${aktywne}`);
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: ruchOgraniczony() ? "auto" : "smooth" });
    const cel = el.querySelector(`input:checked, #in-${aktywne}, input:not([disabled]), select, button`);
    setTimeout(() => cel?.focus({ preventScroll: true }), 50);
  }, [aktywne, etap, prowadz]);

  useEffect(() => {
    if (etap !== "wypelnianie") gora.current?.scrollIntoView({ block: "start" });
  }, [etap]);

  const ustaw = (id, v) => {
    setW((s) => ({ ...s, [id]: v }));
    setBladAktywnego(false);
    setPrzypomnij(false);
  };

  const zakoncz = () => {
    setKolejka(null);
    setAktywne(null);
    setEtap(braki(w, ctx).length ? "braki" : "przeglad");
  };

  const przejdz = (kierunek) => {
    const i = kolejnosc.indexOf(aktywne);
    const nast = kolejnosc[i + kierunek];
    setBladAktywnego(false);
    setPrzypomnij(false);
    if (nast) setAktywne(nast);
    else if (kierunek > 0) zakoncz();
  };

  const dalej = () => {
    const pole = POLA.find((p) => p.id === aktywne);
    if (blad(pole, w, ctx)) {
      setBladAktywnego(true);
      return;
    }
    setPominiete((l) => l.filter((x) => x !== aktywne));
    przejdz(1);
  };

  const pomin = () => {
    const pole = POLA.find((p) => p.id === aktywne);
    if (blad(pole, w, ctx)) setPominiete((l) => [...new Set([...l, aktywne])]);
    przejdz(1);
  };

  const prowadzOd = (ids) => {
    const lista = ids.filter((id) => czyWidoczne(POLA.find((p) => p.id === id), w, ctx));
    if (!lista.length) return;
    setKolejka(ids.length === widocznePola(w, ctx).length ? null : lista);
    setAktywne(lista[0]);
    setProwadz(true);
    setPokazBledy(false);
    setEtap("wypelnianie");
  };

  const zacznij = (zPrzewodnikiem) => {
    setEtap("wypelnianie");
    setKolejka(null);
    setProwadz(zPrzewodnikiem);
    setAktywne(zPrzewodnikiem ? widocznePola(w, ctx)[0].id : null);
  };

  const odNowa = () => {
    setW({});
    setPominiete([]);
    setNumer(null);
    setUwagaUrzednika(null);
  };

  const wyslij = async () => {
    setWysylanie(true);
    await new Promise((r) => setTimeout(r, 1200)); // „podpisywanie” — symulacja
    const wynik = await wyslijWniosek({
      numer: numer || undefined,
      typ: "ZAM",
      nazwa: "Wniosek o zasiłek macierzyński",
      osoba: { imie: ctx.profil.imie, nazwisko: ctx.profil.nazwisko, pesel: ctx.profil.pesel },
      dane: wyczysc(w, ctx),
      kontekst: {
        tytul: ctx.zus.ubezpieczenie.tytul,
        od: ctx.zus.ubezpieczenie.od,
        chorobowe: ctx.zus.ubezpieczenie.chorobowe,
        platnik: ctx.zus.ubezpieczenie.platnik,
        platnikPowyzej20: ctx.zus.ubezpieczenie.platnikPowyzej20,
        zadluzenie: ctx.zus.zadluzenie,
        podstawa: ctx.zus.podstawaWymiaru,
      },
    });
    try {
      sessionStorage.removeItem(KLUCZ_SZKICU);
    } catch {
      /* nic */
    }
    setWysylanie(false);
    setWyslany(wynik);
    setEtap("wyslano");
  };

  const { gotowe, wszystkie } = postep(w, ctx);
  const brakujace = braki(w, ctx);
  const poleAkt = POLA.find((p) => p.id === aktywne);
  const zaczety = Object.keys(w).length > 0;

  // ================= WIDOKI =================
  return (
    <div className="wn" ref={gora}>
      <div className="wrap">
        <nav className="wn-okruszki" aria-label="Jesteś tutaj">
          <Link to="/przewodnik/swiadczenia">Świadczenia</Link> <span aria-hidden="true">/</span>{" "}
          <Link to="/przewodnik/swiadczenia/zasilek-macierzynski">Zasiłek macierzyński</Link> <span aria-hidden="true">/</span>{" "}
          <span>Wniosek</span>
        </nav>

        {etap === "start" && (
          <div className="wn-karta wn-start">
            <span className="wn-tag">Symulacja</span>
            <h1>Wniosek o zasiłek macierzyński</h1>
            <p className="wn-lead">
              Wypełnisz wniosek <b>ZAM</b>. Zajmie Ci to około 5 minut.
            </p>
            <ul className="wn-lista-ok">
              <li><Ikona n="check" /> Dane z mObywatela wpiszemy za Ciebie.</li>
              <li><Ikona n="check" /> Pola, które Cię nie dotyczą, wyłączymy automatycznie.</li>
              <li><Ikona n="check" /> Nie wiesz, co wpisać? Pomiń pole — przypomnimy o nim przed wysłaniem.</li>
              <li><Ikona n="check" /> Zanim wyślesz, zobaczysz cały wniosek i możesz go poprawić.</li>
            </ul>
            <p className="wn-uwaga-proto">
              <Ikona n="info" /> Twój pracodawca zgłasza ponad 20 osób, więc w prawdziwym życiu dokumenty złożysz u niego.
              W prototypie pokazujemy wniosek ZUS, żeby zaprezentować przewodnik po formularzu.
            </p>
            {zaczety && (
              <div className="wn-szkic">
                <span><Ikona n="zegar" /> Masz zapisany szkic: {gotowe} z {wszystkie} wymaganych pól.</span>
                <button type="button" className="wn-link" onClick={odNowa}>Zacznij od nowa</button>
              </div>
            )}
            <div className="wn-wybor">
              <button type="button" className="wn-wybor-opcja polecane" onClick={() => zacznij(true)}>
                <span className="wn-polecane">Polecane</span>
                <b>Prowadź mnie krok po kroku</b>
                <span>Podświetlimy jedno pole naraz i wyjaśnimy, co wpisać.</span>
              </button>
              <button type="button" className="wn-wybor-opcja" onClick={() => zacznij(false)}>
                <b>Wypełnię sam(a)</b>
                <span>Znam ten wniosek. Przewodnik włączysz w każdej chwili.</span>
              </button>
            </div>
          </div>
        )}

        {etap === "wypelnianie" && (
          <>
            <div className={`wn-hud ${prowadz ? "nad-zaslona" : ""}`}>
              <div className="wn-hud-in">
                <div className="wn-hud-tytul">
                  <b>Wniosek ZAM</b>
                  <span>
                    {kolejka ? `Poprawiasz wybrane pola` : `${gotowe} z ${wszystkie} wymaganych pól`}
                    {pominiete.length > 0 && <span className="wn-chip uwaga">Pominięte: {pominiete.length}</span>}
                  </span>
                </div>
                <div className="wn-pasek" role="progressbar" aria-valuemin={0} aria-valuemax={wszystkie} aria-valuenow={gotowe} aria-label="Postęp wypełniania">
                  <div style={{ width: `${wszystkie ? (gotowe / wszystkie) * 100 : 0}%` }} />
                </div>
                <button
                  type="button"
                  className="wn-btn wn-btn-drugi wn-btn-maly"
                  onClick={() => {
                    if (prowadz) {
                      setProwadz(false);
                    } else {
                      setProwadz(true);
                      setAktywne(aktywne || brakujace[0]?.id || widocznePola(w, ctx)[0].id);
                    }
                  }}
                >
                  {prowadz ? "Wyłącz przewodnik" : "Włącz przewodnik"}
                </button>
              </div>
            </div>

            {uwagaUrzednika?.komentarz && (
              <div className="wn-alert uwaga">
                <Ikona n="urzad" />
                <div>
                  <b>Urzędnik prosi o poprawienie wniosku</b>
                  <p>„{uwagaUrzednika.komentarz}”</p>
                </div>
              </div>
            )}

            {prowadz && aktywne && <div className="wn-zaslona" onClick={() => setPrzypomnij(true)} aria-hidden="true" />}

            <div
              className="wn-obszar"
              onKeyDown={(e) => {
                if (prowadz && e.key === "Enter" && e.target.tagName === "INPUT" && !["file", "checkbox"].includes(e.target.type)) {
                  e.preventDefault();
                  dalej();
                }
              }}
            >
              <Papier
                w={w}
                ctx={ctx}
                ustaw={ustaw}
                prowadz={prowadz && !!aktywne}
                aktywne={prowadz ? aktywne : null}
                pominiete={pominiete}
                pokazBledy={pokazBledy}
                bladAktywnego={bladAktywnego}
                dymek={
                  poleAkt && (
                    <Dymek
                      pole={poleAkt}
                      w={w}
                      ctx={ctx}
                      nr={kolejnosc.indexOf(aktywne) + 1}
                      ile={kolejnosc.length}
                      err={blad(poleAkt, w, ctx)}
                      pokazBlad={bladAktywnego}
                      przypomnij={przypomnij}
                      pierwszy={kolejnosc.indexOf(aktywne) <= 0}
                      onDalej={dalej}
                      onPomin={pomin}
                      onWstecz={() => przejdz(-1)}
                      onWylacz={() => setProwadz(false)}
                    />
                  )
                }
              />
              {!prowadz && (
                <div className="wn-dol">
                  <button
                    type="button"
                    className="wn-btn wn-btn-glowny wn-btn-duzy"
                    onClick={() => {
                      setPokazBledy(true);
                      zakoncz();
                    }}
                  >
                    Sprawdź wniosek <Ikona n="strzalka" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {etap === "braki" && (
          <div className="wn-karta">
            <span className="wn-ikona-duza uwaga"><Ikona n="alert" rozmiar={28} /></span>
            <h1>Zostało {brakujace.length} {brakujace.length === 1 ? "pole" : brakujace.length < 5 ? "pola" : "pól"} do uzupełnienia</h1>
            <p className="wn-lead">Bez nich nie możemy wysłać wniosku. Pola, które Cię nie dotyczą, nie są tu liczone.</p>
            <ul className="wn-braki">
              {brakujace.map((p) => (
                <li key={p.id}>
                  <span className="wn-nr">{p.nr}.</span>
                  <div>
                    <b>{p.etykieta}</b>
                    <small>{blad(p, w, ctx)}</small>
                  </div>
                  <button type="button" className="wn-link" onClick={() => prowadzOd([p.id])}>Uzupełnij</button>
                </li>
              ))}
            </ul>
            <div className="wn-przyciski">
              <button type="button" className="wn-btn wn-btn-glowny wn-btn-duzy" onClick={() => prowadzOd(brakujace.map((p) => p.id))}>
                Uzupełnij teraz krok po kroku
              </button>
              <button type="button" className="wn-btn wn-btn-drugi wn-btn-duzy" onClick={() => { setProwadz(false); setPokazBledy(true); setEtap("wypelnianie"); }}>
                Wróć do formularza
              </button>
            </div>
          </div>
        )}

        {etap === "przeglad" && (
          <div className="wn-przeglad">
            <div className="wn-karta">
              <span className="wn-tag">Krok przed wysłaniem</span>
              <h1>Sprawdź swój wniosek</h1>
              <p className="wn-lead">
                Przeczytaj wszystko jeszcze raz. Jeśli coś się nie zgadza, kliknij „Popraw” przy wybranej części.
              </p>
            </div>
            {CZESCI.map((c, i) => {
              const pola = POLA.filter((p) => p.czesc === c.id);
              const wid = pola.filter((p) => czyWidoczne(p, w, ctx));
              const nd = pola.filter((p) => !czyWidoczne(p, w, ctx));
              return (
                <section key={c.id} className="wn-karta wn-sekcja-przegl">
                  <div className="wn-sekcja-glowa">
                    <h2><span>Część {i + 1}.</span> {c.tytul}</h2>
                    {wid.length > 0 && (
                      <button type="button" className="wn-btn wn-btn-tekst" onClick={() => prowadzOd(wid.map((p) => p.id))}>
                        <Ikona n="olowek" rozmiar={18} /> Popraw
                      </button>
                    )}
                  </div>
                  {wid.length > 0 && (
                    <dl className="wn-dl">
                      {wid.map((p) => (
                        <div key={p.id}>
                          <dt>{p.nr}. {p.etykieta}</dt>
                          <dd>{pokazWartosc(p, w[p.id], ctx.profil)}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {nd.length > 0 && (
                    <details className="wn-nd-lista">
                      <summary>Nie dotyczy Cię: {nd.length} {nd.length === 1 ? "pole" : nd.length < 5 ? "pola" : "pól"}</summary>
                      <ul>
                        {nd.map((p) => (
                          <li key={p.id}><b>{p.nr}. {p.etykieta}</b> — {tekstNieDotyczy(p, w, ctx)}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </section>
              );
            })}
            <div className="wn-akcje-dol">
              <button type="button" className="wn-btn wn-btn-drugi wn-btn-duzy" onClick={() => { setProwadz(false); setEtap("wypelnianie"); }}>
                <Ikona n="wstecz" /> Wróć do poprawy
              </button>
              <button type="button" className="wn-btn wn-btn-glowny wn-btn-duzy" onClick={() => (brakujace.length ? setEtap("braki") : setEtap("podpis"))}>
                Wszystko się zgadza — akceptuję
              </button>
            </div>
          </div>
        )}

        {etap === "podpis" && (
          <div className="wn-karta wn-podpis">
            <span className="wn-tag">Symulacja podpisu</span>
            <h1>Akceptacja i wysłanie</h1>
            <p className="wn-lead">Po wysłaniu wniosek trafi do urzędnika. Status sprawdzisz w zakładce „Moje sprawy”.</p>
            <label className="wn-zgoda duza">
              <input type="checkbox" checked={oswiadczenie} onChange={(e) => setOswiadczenie(e.target.checked)} />
              <span>Oświadczam, że dane we wniosku są zgodne z prawdą.</span>
            </label>
            <div className="wn-przyciski">
              <button type="button" className="wn-btn wn-btn-tekst" onClick={() => setEtap("przeglad")} disabled={wysylanie}>
                <Ikona n="wstecz" /> Wróć do podglądu
              </button>
              <button type="button" className="wn-btn wn-btn-glowny wn-btn-duzy" disabled={!oswiadczenie || wysylanie} onClick={wyslij}>
                {wysylanie ? <><span className="wn-spinner" aria-hidden="true" /> Podpisywanie…</> : "Podpisz i wyślij"}
              </button>
            </div>
            <p className="wn-dymek-mala" aria-live="polite">{wysylanie ? "Podpisujemy wniosek (symulacja podpisu zaufanego)…" : ""}</p>
          </div>
        )}

        {etap === "wyslano" && wyslany && (
          <div className="wn-karta wn-sukces">
            <span className="wn-ikona-duza ok"><Ikona n="check" rozmiar={32} /></span>
            <h1>Wniosek wysłany</h1>
            <p className="wn-lead">Numer sprawy: <b className="wn-mono">{wyslany.numer}</b></p>
            <ol className="wn-os">
              <li className="done"><span /> <b>Wysłany</b><small>{new Date().toLocaleDateString("pl-PL")}</small></li>
              <li className="teraz"><span /> <b>Sprawdza urzędnik</b><small>Damy znać, jeśli czegoś zabraknie</small></li>
              <li><span /> <b>Decyzja i wypłata</b><small>Zasiłek wypłaci Twój pracodawca</small></li>
            </ol>
            <div className="wn-przyciski">
              <button type="button" className="wn-btn wn-btn-glowny wn-btn-duzy" onClick={() => nav("/przewodnik/sprawy")}>Przejdź do Moich spraw</button>
              <Link className="wn-btn wn-btn-drugi wn-btn-duzy" to="/przewodnik/urzednik">Zobacz widok urzędnika (demo)</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
