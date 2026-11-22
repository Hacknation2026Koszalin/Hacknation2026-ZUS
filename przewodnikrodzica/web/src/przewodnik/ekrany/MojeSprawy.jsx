// Moje sprawy — status wysłanych wniosków z filtrami (status, kategoria, adresat, data, szukaj)
// i podziałem na kategorie. Odświeża się sam co kilka sekund, więc gdy urzędnik w drugiej karcie
// zmieni status, tu od razu to widać. Do listy dokładamy sprawy zakończone z konta PUE/eZUS (symulacja).
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import { PROFIL_MOBYWATEL } from "../dane.js";
import { ZAM } from "../wniosek/formularz.js";
import { formularz } from "../wniosek/formularze/index.js";
import { statusDla, pobierzWnioski } from "../wniosek/wnioski.js";
import Ikona from "../wniosek/Ikona.jsx";
import { useJezyk } from "../jezyk.js";
import { ZDARZENIE_ROBOCZE, fmtZapisu, linkDoWniosku, usunWersjeRobocza, wersjeRobocze } from "../wniosek/robocze.js";

const polaDla = (w) => (formularz(w.typ) || ZAM).pola;
const fmt = (iso) => new Date(iso).toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" });
const fmtD = (iso) => new Date(iso).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });

// ---------- kategorie ----------
export const KATEGORIE = [
  { id: "zasilki", nazwa: "Zasiłki z ZUS", ikona: "dokument", typy: ["ZAM", "ZAS-26", "ZAS-33", "ZAS-23", "ZAS-55", "ZAS-39", "ZPM", "ZPO", "ZPW", "ZZD", "ZAS-58", "ZAS-59", "e-ZLA"] },
  { id: "urlopy", nazwa: "Urlopy u pracodawcy", ikona: "teczka", typy: ["URL-M", "URL-R", "URL-O", "URL-W"] },
  { id: "rodzina", nazwa: "800+ i świadczenia rodzinne", ikona: "serce", typy: ["SW-800"] },
  { id: "usc", nazwa: "Urząd stanu cywilnego", ikona: "urzad", typy: ["USC-1"] },
  { id: "skladki", nazwa: "Składki i zaświadczenia", ikona: "kalkulator", typy: ["US-7", "ZUS-ZAS"] },
];
const kategoriaDla = (w) => KATEGORIE.find((k) => k.typy.includes(w.typ || "ZAM"))?.id || "zasilki";

// ---------- grupy statusów (filtr) ----------
const GRUPY = [
  { id: "wszystkie", nazwa: "Wszystkie" },
  { id: "w_trakcie", nazwa: "W trakcie", ikona: "zegar" },
  { id: "do_poprawy", nazwa: "Do poprawy", ikona: "alert" },
  { id: "przyjete", nazwa: "Przyjęte", ikona: "check" },
  { id: "zakonczone", nazwa: "Zakończone", ikona: "plik" },
];
const grupaDla = (w) =>
  w.status === "do_uzupelnienia" ? "do_poprawy"
    : w.status === "przyjety" ? "przyjete"
      : w.status === "zakonczony" ? "zakonczone"
        : "w_trakcie";

const OKRESY = [
  { id: "wszystkie", nazwa: "Cały czas", dni: null },
  { id: "30", nazwa: "Ostatnie 30 dni", dni: 30 },
  { id: "90", nazwa: "Ostatnie 3 miesiące", dni: 90 },
  { id: "rok", nazwa: "Ten rok", dni: "rok" },
];

// Sprawy zakończone wcześniej — w prawdziwym wdrożeniu przyszłyby z PUE/eZUS
const ARCHIWUM = [
  {
    numer: "ZLA-2026-418230", typ: "e-ZLA", nazwa: "Zasiłek chorobowy w ciąży (e-ZLA, kod B)", adresat: "pracodawca", adresatNazwa: "Przykładowa Firma sp. z o.o.",
    status: "zakonczony", zlozono: "2026-08-04T09:12:00", zrodlo: "PUE/eZUS", wynik: "Zasiłek wypłacony za 4–31 sierpnia 2026 r.",
    historia: [{ data: "2026-08-04T09:12:00", opis: "Lekarz wystawił e-ZLA" }, { data: "2026-08-05T08:00:00", opis: "Pracodawca otrzymał zwolnienie" }, { data: "2026-09-10T10:00:00", opis: "Zasiłek wypłacony z wynagrodzeniem" }],
  },
  {
    numer: "US7-2026-102938", typ: "US-7", nazwa: "Zaświadczenie o niezaleganiu w składkach", adresat: "zus",
    status: "zakonczony", zlozono: "2026-10-02T14:30:00", zrodlo: "PUE/eZUS", wynik: "Zaświadczenie wydane — do pobrania w eZUS.",
    historia: [{ data: "2026-10-02T14:30:00", opis: "Wniosek wysłany przez eZUS" }, { data: "2026-10-03T11:20:00", opis: "Zaświadczenie wydane" }],
  },
  {
    numer: "ZZD-2026-556120", typ: "ZZD", nazwa: "Zmiana numeru konta do wypłaty zasiłku (ZZD)", adresat: "zus",
    status: "do_uzupelnienia", zlozono: "2026-11-12T19:05:00", zrodlo: "PUE/eZUS", komentarz: "Numer rachunku ma 25 cyfr — podaj pełny numer (26 cyfr).",
    historia: [{ data: "2026-11-12T19:05:00", opis: "Wniosek wysłany przez eZUS" }, { data: "2026-11-14T09:40:00", status: "do_uzupelnienia", opis: "Urzędnik prosi o uzupełnienie" }],
  },
];

export default function MojeSprawy() {
  const { profil = PROFIL_MOBYWATEL } = useSesja();
  const [, t] = useJezyk();
  const nav = useNavigate();
  const [lista, setLista] = useState(null);
  const [grupa, setGrupa] = useState("wszystkie");
  const [kategoria, setKategoria] = useState("wszystkie");
  const [adresat, setAdresat] = useState("wszyscy");
  const [okres, setOkres] = useState("wszystkie");
  const [fraza, setFraza] = useState("");
  const [sort, setSort] = useState("najnowsze");
  const [widok, setWidok] = useState("lista"); // lista | kategorie
  const [rozwiniete, setRozwiniete] = useState({});
  const [robocze, setRobocze] = useState(() => wersjeRobocze(profil.pesel));
  useEffect(() => {
    const f = () => setRobocze(wersjeRobocze(profil.pesel));
    window.addEventListener(ZDARZENIE_ROBOCZE, f);
    window.addEventListener("storage", f);
    return () => { window.removeEventListener(ZDARZENIE_ROBOCZE, f); window.removeEventListener("storage", f); };
  }, [profil.pesel]);

  useEffect(() => {
    let zyje = true;
    const odswiez = () => pobierzWnioski().then((l) => zyje && setLista(l.filter((w) => w.osoba?.pesel === profil.pesel)));
    odswiez();
    const iv = setInterval(odswiez, 4000);
    window.addEventListener("storage", odswiez);
    return () => {
      zyje = false;
      clearInterval(iv);
      window.removeEventListener("storage", odswiez);
    };
  }, [profil.pesel]);

  const wszystkie = useMemo(() => (lista ? [...lista, ...ARCHIWUM] : null), [lista]);

  const pasujeBezGrupy = (w) => {
    if (kategoria !== "wszystkie" && kategoriaDla(w) !== kategoria) return false;
    if (adresat !== "wszyscy" && (w.adresat || "zus") !== adresat) return false;
    const o = OKRESY.find((x) => x.id === okres);
    if (o?.dni === "rok" && new Date(w.zlozono).getFullYear() !== new Date().getFullYear()) return false;
    if (typeof o?.dni === "number" && Date.now() - new Date(w.zlozono).getTime() > o.dni * 86400000) return false;
    const f = fraza.trim().toLowerCase();
    if (f && !`${w.nazwa} ${w.numer} ${w.typ || ""}`.toLowerCase().includes(f)) return false;
    return true;
  };
  const poFiltrach = (wszystkie || []).filter(pasujeBezGrupy);
  const liczby = Object.fromEntries(GRUPY.map((g) => [g.id, g.id === "wszystkie" ? poFiltrach.length : poFiltrach.filter((w) => grupaDla(w) === g.id).length]));
  const widoczne = poFiltrach
    .filter((w) => grupa === "wszystkie" || grupaDla(w) === grupa)
    .sort((a, b) => (sort === "najnowsze" ? (a.zlozono < b.zlozono ? 1 : -1) : a.zlozono < b.zlozono ? -1 : 1));
  const aktywneFiltry = kategoria !== "wszystkie" || adresat !== "wszyscy" || okres !== "wszystkie" || fraza || grupa !== "wszystkie";
  const wyczysc = () => { setGrupa("wszystkie"); setKategoria("wszystkie"); setAdresat("wszyscy"); setOkres("wszystkie"); setFraza(""); };

  const Karta = ({ w }) => {
    const st = w.status === "zakonczony" ? { tekst: "Zakończona", klasa: "szary" } : statusDla(w);
    const otwarta = rozwiniete[w.numer] ?? w.status === "do_uzupelnienia";
    const kat = KATEGORIE.find((k) => k.id === kategoriaDla(w));
    return (
      <article className={`wn-karta sp-wniosek sp-${grupaDla(w)}`}>
        <div className="sp-glowa">
          <span className="sp-kat-ikona" aria-hidden="true"><Ikona n={kat?.ikona || "dokument"} rozmiar={22} /></span>
          <div className="sp-glowa-tekst">
            <h2>{w.nazwa}</h2>
            <small>
              Nr <span className="wn-mono">{w.numer}</span> · {fmtD(w.zlozono)} · {w.adresat === "pracodawca" ? `u pracodawcy${w.adresatNazwa ? ` (${w.adresatNazwa})` : ""}` : w.adresat === "usc" ? "w urzędzie stanu cywilnego" : "w ZUS"}
              {w.zrodlo && <> · <span className="sp-zrodlo">z konta {w.zrodlo}</span></>}
            </small>
          </div>
          <span className={`wn-chip ${st.klasa}`}><span className="sp-chip-ikona" aria-hidden="true">{grupaDla(w) === "do_poprawy" ? "!" : grupaDla(w) === "przyjete" ? "✓" : grupaDla(w) === "zakonczone" ? "■" : "●"}</span>{st.tekst}</span>
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
                onClick={() => nav(`/przewodnik/wnioski/${(w.typ || "ZAM").toLowerCase()}`, w.zrodlo ? undefined : { state: { poprawa: w.numer } })}>
                Popraw wniosek
              </button>
            </div>
          </div>
        )}
        {w.status === "przyjety" && (
          <div className="wn-alert ok">
            <Ikona n="check" />
            <div><b>Wniosek przyjęty.</b> {w.adresat === "pracodawca" ? "Pracodawca przyjął wniosek." : w.adresat === "usc" ? "Urząd przygotowuje dokument." : `Zasiłek wypłaci ${w.kontekst?.platnikPowyzej20 ? "Twój pracodawca" : "ZUS"}.`}</div>
          </div>
        )}
        {w.wynik && (
          <div className="wn-alert ok"><Ikona n="check" /><div>{w.wynik}</div></div>
        )}

        <button type="button" className="sp-rozwin" aria-expanded={otwarta} onClick={() => setRozwiniete((r) => ({ ...r, [w.numer]: !otwarta }))}>
          {otwarta ? "Ukryj historię sprawy" : "Pokaż historię sprawy"} <Ikona n="dol" rozmiar={16} />
        </button>
        {otwarta && (
          <ol className="wn-os" aria-label="Historia sprawy">
            {(w.historia || []).map((h, i) => (
              <li key={i} className={h.status === "do_uzupelnienia" ? "uwaga" : "done"}>
                <span /> <b>{h.opis}</b><small>{fmt(h.data)}</small>
              </li>
            ))}
            {(w.status === "u_urzednika" || !w.status) && (
              <li className="teraz"><span /> <b>{w.adresat === "pracodawca" ? "Sprawdza pracodawca" : "Sprawdza urzędnik"}</b><small>Damy znać, jeśli czegoś zabraknie</small></li>
            )}
          </ol>
        )}
      </article>
    );
  };

  return (
    <div className="wn sp">
      <div className="wrap" style={{ maxWidth: 1040 }}>
        <h1>{t("Moje sprawy")}</h1>
        <p className="wn-lead">Wszystkie Twoje wnioski w jednym miejscu. Filtruj po statusie, kategorii albo dacie.</p>

        {/* --- wersje robocze --- */}
        {robocze.length > 0 && (
          <section className="sp-robocze" aria-labelledby="sp-robocze-tytul">
            <h2 id="sp-robocze-tytul"><Ikona n="plik" rozmiar={20} /> Wersje robocze <span className="sp-licznik">{robocze.length}</span></h2>
            <p className="sp-robocze-opis">Wnioski, które zaczęłaś/zacząłeś i zapisałaś/zapisałeś na później. Nic nie zostało jeszcze wysłane.</p>
            <ul>
              {robocze.map((r) => (
                <li key={r.symbol} className="sp-robocza">
                  <span className="zw-symbol">{r.symbol}</span>
                  <div className="sp-robocza-tekst">
                    <b>{r.nazwa}</b>
                    <small>Zapisano {fmtZapisu(r.zapisano)} · {r.gotowe} z {r.wszystkie} wymaganych pól</small>
                    <span className="sp-robocza-pasek" role="progressbar" aria-valuemin={0} aria-valuemax={r.wszystkie} aria-valuenow={r.gotowe} aria-label={`Wypełniono ${r.gotowe} z ${r.wszystkie} pól`}>
                      <span style={{ width: `${r.wszystkie ? (r.gotowe / r.wszystkie) * 100 : 0}%` }} />
                    </span>
                  </div>
                  <div className="sp-robocza-akcje">
                    <Link to={linkDoWniosku(r.symbol)} className="wn-btn wn-btn-glowny">Dokończ wniosek</Link>
                    <button type="button" className="wn-link" onClick={() => usunWersjeRobocza(profil.pesel, r.symbol)} aria-label={`Usuń wersję roboczą: ${r.nazwa}`}>Usuń</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* --- zakładki statusów --- */}
        <div className="sp-zakladki" role="tablist" aria-label="Status spraw">
          {GRUPY.map((g) => (
            <button key={g.id} type="button" role="tab" aria-selected={grupa === g.id} className={`sp-zakladka sp-z-${g.id} ${grupa === g.id ? "aktywna" : ""}`} onClick={() => setGrupa(g.id)}>
              {g.ikona && <Ikona n={g.ikona} rozmiar={16} />} {g.nazwa} <span className="sp-licznik">{liczby[g.id]}</span>
            </button>
          ))}
        </div>

        {/* --- filtry --- */}
        <div className="sp-filtry">
          <label className="sp-pole sp-szukaj">
            <span>Szukaj</span>
            <span className="sp-input-ikona"><Ikona n="lupa" rozmiar={18} /><input type="search" value={fraza} onChange={(e) => setFraza(e.target.value)} placeholder="Nazwa albo numer sprawy" /></span>
          </label>
          <label className="sp-pole">
            <span>Kategoria</span>
            <select value={kategoria} onChange={(e) => setKategoria(e.target.value)}>
              <option value="wszystkie">Wszystkie kategorie</option>
              {KATEGORIE.map((k) => <option key={k.id} value={k.id}>{k.nazwa}</option>)}
            </select>
          </label>
          <label className="sp-pole">
            <span>Gdzie złożono</span>
            <select value={adresat} onChange={(e) => setAdresat(e.target.value)}>
              <option value="wszyscy">Wszędzie</option>
              <option value="zus">ZUS</option>
              <option value="pracodawca">Pracodawca</option>
              <option value="usc">Urząd stanu cywilnego</option>
            </select>
          </label>
          <label className="sp-pole">
            <span>Data złożenia</span>
            <select value={okres} onChange={(e) => setOkres(e.target.value)}>
              {OKRESY.map((o) => <option key={o.id} value={o.id}>{o.nazwa}</option>)}
            </select>
          </label>
          <label className="sp-pole">
            <span>Kolejność</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="najnowsze">Najnowsze najpierw</option>
              <option value="najstarsze">Najstarsze najpierw</option>
            </select>
          </label>
        </div>

        <div className="sp-pasek">
          <p role="status" aria-live="polite">
            {widoczne.length === 1 ? "1 sprawa" : `${widoczne.length} ${widoczne.length >= 2 && widoczne.length <= 4 ? "sprawy" : "spraw"}`}
            {aktywneFiltry && <button type="button" className="wn-link sp-wyczysc" onClick={wyczysc}>Wyczyść filtry</button>}
          </p>
          <div className="sp-widok" role="group" aria-label="Układ listy">
            <button type="button" aria-pressed={widok === "lista"} className={widok === "lista" ? "aktywny" : ""} onClick={() => setWidok("lista")}>Lista</button>
            <button type="button" aria-pressed={widok === "kategorie"} className={widok === "kategorie" ? "aktywny" : ""} onClick={() => setWidok("kategorie")}>Według kategorii</button>
          </div>
        </div>

        {wszystkie === null && <p className="muted">Wczytywanie…</p>}

        {wszystkie && widoczne.length === 0 && (
          <div className="wn-karta sp-pusto">
            <Ikona n="lupa" rozmiar={28} />
            <p>{aktywneFiltry ? "Żadna sprawa nie pasuje do filtrów." : "Nie masz jeszcze żadnych spraw."}</p>
            {aktywneFiltry ? <button type="button" className="wn-btn" onClick={wyczysc}>Wyczyść filtry</button> : <Link to="/przewodnik/wnioski" className="wn-btn wn-btn-glowny">Złóż wniosek</Link>}
          </div>
        )}

        {widok === "lista"
          ? <div className="sp-lista">{widoczne.map((w) => <Karta key={w.numer} w={w} />)}</div>
          : KATEGORIE.map((k) => {
            const wk = widoczne.filter((w) => kategoriaDla(w) === k.id);
            if (!wk.length) return null;
            return (
              <section key={k.id} className="sp-grupa" aria-labelledby={`sp-k-${k.id}`}>
                <h2 id={`sp-k-${k.id}`} className="sp-grupa-tytul"><Ikona n={k.ikona} rozmiar={20} /> {k.nazwa} <span className="sp-licznik">{wk.length}</span></h2>
                <div className="sp-lista">{wk.map((w) => <Karta key={w.numer} w={w} />)}</div>
              </section>
            );
          })}

        <p className="sw-zrodlo">
          Tryb demo: <Link to="/przewodnik/urzednik">widok urzędnika ZUS</Link> albo <Link to="/przewodnik/pracodawca">widok pracodawcy (kadry)</Link> — najlepiej w drugiej karcie. Sprawy oznaczone „z konta PUE/eZUS” to przykłady.
        </p>
      </div>
    </div>
  );
}
