// =====================================================================
// KONTO PUE/eZUS — symulacja połączenia z kontem ubezpieczonego.
// 1) Łączymy się (zgoda + autoryzacja) i pobieramy dane z konta.
// 2) Pokazujemy dane zgromadzone na koncie: dane osobowe, ubezpieczenia,
//    składki, zwolnienia e-ZLA, podstawę zasiłku.
// 3) „Coś się nie zgadza?” / „Zapytaj ZUS” — wiadomość do ZUS z odpowiedzią (symulacja).
// W prawdziwym wdrożeniu dane przychodzą z API PUE/eZUS po zalogowaniu przez login.gov.pl.
// =====================================================================
import { useEffect, useRef, useState } from "react";
import { useSesja } from "../SesjaContext.jsx";
import { DANE_ZUS_ZAPAS, PROFIL_MOBYWATEL } from "../dane.js";
import { dzisISO, fmtDzien } from "../terminy.js";
import { zwolnieniaDlaSytuacji } from "../komponenty/Zwolnienie.jsx";
import { kwota, maZadluzenie } from "../komponenty/Zadluzenie.jsx";
import Ikona from "../wniosek/Ikona.jsx";
import { useJezyk } from "../jezyk.js";

const KLUCZ_WIAD = "pue-wiadomosci";
const wczytajWiad = () => { try { return JSON.parse(sessionStorage.getItem(KLUCZ_WIAD)) || []; } catch { return []; } };

const KROKI = [
  "Łączę z PUE/eZUS przez login.gov.pl",
  "Potwierdzam Twoją tożsamość (mObywatel)",
  "Pobieram dane z konta ubezpieczonego",
  "Sprawdzam składki i zwolnienia lekarskie",
];

const TEMATY = ["Zasiłek macierzyński", "Zasiłek chorobowy / zwolnienie", "Składki i zaległości", "Dane na koncie (błąd)", "800+ i świadczenia rodzinne", "Inne"];

/** Ostatnie 6 miesięcy składek — z danych ZUS (symulacja). */
function skladki(zus) {
  const dzis = new Date(dzisISO());
  const dzialalnosc = /działalno/i.test(zus?.ubezpieczenie?.tytul || "");
  const zaleglosc = maZadluzenie(zus);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Date.UTC(dzis.getUTCFullYear(), dzis.getUTCMonth() - 1 - i, 1));
    const miesiac = d.toLocaleDateString("pl-PL", { month: "long", year: "numeric" });
    const podstawa = zus?.podstawaWymiaru || 6904.7;
    const chorobowa = Math.round(podstawa * 0.0245 * 100) / 100;
    const nieoplacona = zaleglosc && dzialalnosc && i < 3;
    return { miesiac, podstawa, chorobowa, status: nieoplacona ? "zaleglosc" : "oplacona" };
  });
}

/** Automatyczna odpowiedź „konsultanta” zależna od tematu. */
function odpowiedz(temat, zus) {
  const u = zus?.ubezpieczenie || {};
  switch (temat) {
    case "Zasiłek macierzyński":
      return `Dzień dobry. Na Pani koncie widzimy ubezpieczenie chorobowe (${u.chorobowe || "—"}). Zasiłek macierzyński wypłaci ${u.platnikPowyzej20 ? "pracodawca" : "ZUS"}. Wniosek złoży Pani w Przewodniku w zakładce „Złóż wniosek”.`;
    case "Zasiłek chorobowy / zwolnienie":
      return "Dzień dobry. Zwolnienia lekarskie z kodem B (ciąża) są płatne w wysokości 100% podstawy. Status zwolnienia widzi Pani w Przewodniku na stronie „Moje konto”.";
    case "Składki i zaległości":
      return maZadluzenie(zus)
        ? `Dzień dobry. Na koncie jest zaległość ${kwota(zus.zadluzenie)}. Może Pani spłacić ją jednorazowo albo złożyć wniosek o układ ratalny w eZUS (RDU). Po spłacie zasiłek zostanie wypłacony.`
        : "Dzień dobry. Na Pani koncie nie ma zaległości w składkach. Zaświadczenie o niezaleganiu wygeneruje Pani w eZUS.";
    case "Dane na koncie (błąd)":
      return "Dzień dobry. Dziękujemy za zgłoszenie. Sprawdzimy dane u płatnika składek. Jeśli błąd się potwierdzi, płatnik złoży korektę dokumentów, a Pani dostanie powiadomienie.";
    default:
      return "Dzień dobry. Dziękujemy za pytanie. Konsultant odpowie szczegółowo w ciągu 7 dni roboczych. Pilne sprawy: 22 560 16 00.";
  }
}

export default function KontoPUE() {
  const sesja = useSesja();
  const [, t] = useJezyk();
  const { profil = PROFIL_MOBYWATEL, zus = DANE_ZUS_ZAPAS, etap = "ciaza", ankieta = {}, pue, ustaw } = sesja;
  const [krok, setKrok] = useState(pue?.polaczono ? KROKI.length : -1);
  const [zakladka, setZakladka] = useState("dane");
  const [wiad, setWiad] = useState(wczytajWiad);
  const [forma, setForma] = useState({ temat: TEMATY[0], tresc: "", kanal: "pue" });
  const [blad, setBlad] = useState("");
  const formRef = useRef(null);
  const polaczono = !!pue?.polaczono;

  useEffect(() => { try { sessionStorage.setItem(KLUCZ_WIAD, JSON.stringify(wiad)); } catch { /* brak pamięci */ } }, [wiad]);

  // Symulacja połączenia: kolejne kroki co 0,7 s
  useEffect(() => {
    if (krok < 0 || krok >= KROKI.length) return;
    const tm = setTimeout(() => {
      if (krok + 1 === KROKI.length) ustaw({ pue: { polaczono: new Date().toISOString() } });
      setKrok(krok + 1);
    }, 700);
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [krok]);

  // Odpowiedź „konsultanta” przychodzi po kilku sekundach
  useEffect(() => {
    const czeka = wiad.find((w) => !w.odpowiedz);
    if (!czeka) return;
    const tm = setTimeout(() => {
      setWiad((l) => l.map((w) => (w.id === czeka.id ? { ...w, odpowiedz: odpowiedz(w.temat, zus), odpowiedzData: new Date().toISOString() } : w)));
    }, 4000);
    return () => clearTimeout(tm);
  }, [wiad, zus]);

  const zglos = (temat, tresc) => {
    setForma((f) => ({ ...f, temat, tresc }));
    setZakladka("zapytaj");
    setTimeout(() => formRef.current?.querySelector("textarea")?.focus(), 50);
  };
  const wyslij = (e) => {
    e.preventDefault();
    if (forma.tresc.trim().length < 10) { setBlad("Napisz pytanie — co najmniej 10 znaków."); return; }
    setBlad("");
    setWiad((l) => [{ id: Date.now(), ...forma, data: new Date().toISOString(), numer: `PUE-${Math.floor(100000 + Math.random() * 900000)}` }, ...l]);
    setForma((f) => ({ ...f, tresc: "" }));
  };

  // ---------- ekran przed połączeniem ----------
  if (!polaczono) {
    return (
      <div className="pue">
        <div className="wrap pue-start">
          <span className="pue-logo" aria-hidden="true"><Ikona n="tarcza" rozmiar={40} /></span>
          <h1>{t("Konto PUE/eZUS")}</h1>
          <p className="pue-lead">Połącz Przewodnik ze swoim kontem w PUE/eZUS. Zobaczysz dane, które ZUS ma na Twoim koncie, i zadasz pytanie, gdy coś budzi wątpliwości.</p>
          <ul className="pue-co">
            <li><Ikona n="check" rozmiar={18} /> dane osobowe i adres</li>
            <li><Ikona n="check" rozmiar={18} /> ubezpieczenia i płatnik składek</li>
            <li><Ikona n="check" rozmiar={18} /> składki z ostatnich miesięcy</li>
            <li><Ikona n="check" rozmiar={18} /> zwolnienia lekarskie (e-ZLA)</li>
          </ul>
          {krok < 0 ? (
            <button type="button" className="h-btn h-btn-limonka pue-polacz" onClick={() => setKrok(0)}>
              <Ikona n="tarcza" rozmiar={20} /> Połącz z PUE/eZUS
            </button>
          ) : (
            <ol className="pue-kroki" aria-live="polite">
              {KROKI.map((k, i) => (
                <li key={k} className={i < krok ? "zrobione" : i === krok ? "teraz" : ""}>
                  <span className="pue-krok-znak" aria-hidden="true">{i < krok ? "✓" : i === krok ? "" : i + 1}</span> {k}
                  {i < krok && <span className="sr-only"> — gotowe</span>}
                </li>
              ))}
            </ol>
          )}
          <p className="pue-uwaga"><Ikona n="info" rozmiar={16} /> Symulacja: nie podajesz loginu ani hasła. Dane są przykładowe.</p>
        </div>
      </div>
    );
  }

  // ---------- połączono ----------
  const u = zus.ubezpieczenie || {};
  const l4 = zwolnieniaDlaSytuacji(zus, { etap, ankieta, data: sesja.terminPorodu, dzis: dzisISO() });
  const sk = skladki(zus);
  const Wiersz = ({ e, v, temat }) => (
    <div className="pue-wiersz">
      <dt>{e}</dt>
      <dd>{v}</dd>
      <button type="button" className="pue-zglos" onClick={() => zglos("Dane na koncie (błąd)", `Na koncie widzę: ${e} — ${typeof v === "string" ? v : ""}. To się nie zgadza, bo `)} aria-label={`Zgłoś błąd: ${e}`}>
        {temat || "Nie zgadza się?"}
      </button>
    </div>
  );
  const ZAKLADKI = [
    ["dane", "Dane osobowe", "czlowiek"],
    ["ubezpieczenie", "Ubezpieczenia", "tarcza"],
    ["skladki", "Składki", "kalkulator"],
    ["zwolnienia", "Zwolnienia e-ZLA", "dokument"],
    ["zapytaj", `Zapytaj ZUS${wiad.length ? ` (${wiad.length})` : ""}`, "dymek"],
  ];

  return (
    <div className="pue">
      <div className="wrap">
        <div className="pue-glowa">
          <div>
            <h1>{t("Konto PUE/eZUS")}</h1>
            <p className="pue-status"><span className="pue-kropka" aria-hidden="true" /> Połączono · dane z {new Date(pue.polaczono).toLocaleString("pl-PL", { dateStyle: "long", timeStyle: "short" })}</p>
          </div>
          <div className="pue-glowa-akcje">
            <button type="button" className="dk-btn dk-btn-drugi" onClick={() => { ustaw({ pue: null }); setKrok(0); }}><Ikona n="odswiez" rozmiar={16} /> Odśwież dane</button>
            <button type="button" className="dk-btn dk-btn-glowny" onClick={() => zglos(TEMATY[0], "")}><Ikona n="dymek" rozmiar={16} /> Zapytaj ZUS</button>
          </div>
        </div>

        <div className="pue-podsum">
          <div className="pue-kafel"><small>Ubezpieczenie chorobowe</small><b>{u.chorobowe || "brak"}</b></div>
          <div className="pue-kafel"><small>Podstawa zasiłku</small><b>{kwota(zus.podstawaWymiaru || 0)}</b></div>
          <div className={`pue-kafel ${maZadluzenie(zus) ? "blad" : "ok"}`}><small>Zaległości w składkach</small><b>{maZadluzenie(zus) ? kwota(zus.zadluzenie) : "brak"}</b></div>
          <div className="pue-kafel"><small>Zwolnienia w tym roku</small><b>{l4.length}</b></div>
        </div>

        <div className="pue-zakladki" role="tablist" aria-label="Dane z konta">
          {ZAKLADKI.map(([id, nazwa, ik]) => (
            <button key={id} type="button" role="tab" id={`pue-t-${id}`} aria-selected={zakladka === id} aria-controls={`pue-p-${id}`} className={zakladka === id ? "aktywna" : ""} onClick={() => setZakladka(id)}>
              <Ikona n={ik} rozmiar={18} /> {nazwa}
            </button>
          ))}
        </div>

        <div className="pue-panel" role="tabpanel" id={`pue-p-${zakladka}`} aria-labelledby={`pue-t-${zakladka}`}>
          {zakladka === "dane" && (
            <dl className="pue-dl">
              <Wiersz e="Imię i nazwisko" v={`${profil.imie} ${profil.nazwisko}`} />
              <Wiersz e="PESEL" v={profil.pesel} />
              <Wiersz e="Data urodzenia" v={fmtDzien(profil.dataUrodzenia)} />
              <Wiersz e="Adres zamieszkania" v={profil.adres} />
              <Wiersz e="Rachunek do wypłat" v="PL 61 1090 1014 0000 0712 1981 2874" />
            </dl>
          )}
          {zakladka === "ubezpieczenie" && (
            <dl className="pue-dl">
              <Wiersz e="Tytuł ubezpieczenia" v={u.tytul || "—"} />
              <Wiersz e="Ubezpieczenie od" v={u.od ? fmtDzien(u.od) : "—"} />
              <Wiersz e="Płatnik składek" v={u.platnik || "—"} />
              <Wiersz e="Ubezpieczenie chorobowe" v={u.chorobowe || "brak"} />
              <Wiersz e="Okres wyczekiwania" v={u.okresWyczekiwaniaSpelniony ? "spełniony" : "jeszcze nie"} />
              <Wiersz e="Kto wypłaca zasiłki" v={u.platnikPowyzej20 ? "pracodawca (zgłasza ponad 20 osób)" : "ZUS"} />
            </dl>
          )}
          {zakladka === "skladki" && (
            <div className="pue-tabela-wrap">
              <table className="pue-tabela">
                <caption className="sr-only">Składki z ostatnich 6 miesięcy</caption>
                <thead><tr><th scope="col">Miesiąc</th><th scope="col">Podstawa</th><th scope="col">Składka chorobowa</th><th scope="col">Status</th><th scope="col"><span className="sr-only">Akcja</span></th></tr></thead>
                <tbody>
                  {sk.map((s) => (
                    <tr key={s.miesiac}>
                      <td>{s.miesiac}</td>
                      <td>{kwota(s.podstawa)}</td>
                      <td>{kwota(s.chorobowa)}</td>
                      <td><span className={`wn-chip ${s.status === "oplacona" ? "ok" : "blad"}`}>{s.status === "oplacona" ? "✓ opłacona" : "! nieopłacona"}</span></td>
                      <td><button type="button" className="pue-zglos" onClick={() => zglos("Składki i zaległości", `Składka za ${s.miesiac}: `)}>Zapytaj</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {zakladka === "zwolnienia" && (
            l4.length ? (
              <ul className="pue-l4">
                {l4.map((z) => (
                  <li key={z.od}>
                    <Ikona n="dokument" rozmiar={20} />
                    <span><b>{fmtDzien(z.od)} – {fmtDzien(z.do)}</b><small>kod {z.kod} · ciąża · 100% podstawy</small></span>
                    <span className={`wn-chip ${z.do < dzisISO() ? "szary" : "ok"}`}>{z.do < dzisISO() ? "zakończone" : "trwa"}</span>
                    <button type="button" className="pue-zglos" onClick={() => zglos("Zasiłek chorobowy / zwolnienie", `Zwolnienie ${fmtDzien(z.od)} – ${fmtDzien(z.do)}: `)}>Zapytaj</button>
                  </li>
                ))}
              </ul>
            ) : <p className="pue-pusto">Na koncie nie ma zwolnień lekarskich, które dotyczą Twojej sytuacji.</p>
          )}
          {zakladka === "zapytaj" && (
            <div className="pue-zapytaj">
              <form ref={formRef} className="pue-forma" onSubmit={wyslij} noValidate>
                <h2>Napisz do ZUS</h2>
                <p className="muted">Masz wątpliwości co do danych albo świadczenia? Wiadomość trafi do konsultanta przez PUE/eZUS.</p>
                <label className="sp-pole"><span>Temat</span>
                  <select value={forma.temat} onChange={(e) => setForma({ ...forma, temat: e.target.value })}>
                    {TEMATY.map((x) => <option key={x}>{x}</option>)}
                  </select>
                </label>
                <label className="sp-pole"><span>Twoje pytanie</span>
                  <textarea rows={5} value={forma.tresc} onChange={(e) => setForma({ ...forma, tresc: e.target.value })} aria-invalid={!!blad} aria-describedby="pue-blad" placeholder="Napisz własnymi słowami, czego dotyczy sprawa." />
                </label>
                <p id="pue-blad" className="dk-blad" role="alert">{blad}</p>
                <fieldset className="pue-kanal">
                  <legend>Jak chcesz dostać odpowiedź?</legend>
                  {[["pue", "Wiadomość w PUE/eZUS"], ["email", "E-mail"], ["telefon", "Telefon od konsultanta"]].map(([v, n]) => (
                    <label key={v}><input type="radio" name="kanal" value={v} checked={forma.kanal === v} onChange={() => setForma({ ...forma, kanal: v })} /> {n}</label>
                  ))}
                </fieldset>
                <button type="submit" className="dk-btn dk-btn-glowny"><Ikona n="wyslij" rozmiar={16} /> Wyślij pytanie</button>
              </form>
              <div className="pue-wiadomosci">
                <h2>Twoje wiadomości</h2>
                {wiad.length === 0 && <p className="muted">Nie masz jeszcze wiadomości. Odpowiedź zwykle przychodzi w ciągu 7 dni roboczych — w symulacji po kilku sekundach.</p>}
                <ul aria-live="polite">
                  {wiad.map((w) => (
                    <li key={w.id} className="pue-wiad">
                      <div className="pue-wiad-glowa"><b>{w.temat}</b><span className={`wn-chip ${w.odpowiedz ? "ok" : "info"}`}>{w.odpowiedz ? "✓ odpowiedziano" : "● czeka na odpowiedź"}</span></div>
                      <small>Nr {w.numer} · {new Date(w.data).toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" })}</small>
                      <p className="pue-pyt">{w.tresc}</p>
                      {w.odpowiedz && (
                        <div className="pue-odp"><Ikona n="urzad" rozmiar={18} /><div><small>Konsultant ZUS</small><p>{w.odpowiedz}</p></div></div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
