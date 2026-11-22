// PANEL ADMINISTRACYJNY (demo) — parametry z przepisów i włączanie funkcji bez zmian w kodzie.
// W produkcji: logowanie pracownika ZUS, role, zatwierdzanie zmian, zapis w bazie przez API.
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DOMYSLNE, P, historia, przywrocDomyslne, zapiszParametry, zmienione } from "../parametry.js";
import { oblicz, wczytajParametry } from "../kalkulatorZasilku.js";
import Ikona from "../wniosek/Ikona.jsx";

const zl = (v) => v.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " zł";
const fmtCzas = (iso) => new Date(iso).toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" });
const pobierz = (sciezka, obj) => sciezka.split(".").reduce((o, k) => o?.[k], obj);
const ustawW = (obj, sciezka, v) => {
  const kopia = structuredClone(obj);
  const klucze = sciezka.split(".");
  let o = kopia;
  klucze.slice(0, -1).forEach((k) => (o = o[k]));
  o[klucze.at(-1)] = v;
  return kopia;
};

// Opis pól panelu: [ścieżka, etykieta, jednostka, min, max, krok, podstawa prawna]
const GRUPY = [
  {
    tytul: "Wysokość zasiłku",
    pola: [
      ["stawki.macierzynski", "Zasiłek za urlop macierzyński", "%", 0, 100, 0.5, "ustawa zasiłkowa, art. 31"],
      ["stawki.wariant815", "Wariant jednej stawki (macierzyński + rodzicielski)", "%", 0, 100, 0.5, "art. 31 ust. 3"],
      ["stawki.rodzicielski", "Zasiłek za urlop rodzicielski", "%", 0, 100, 0.5, "art. 31 ust. 1a"],
      ["skladkiPracownika", "Składki pracownika odejmowane od brutto", "%", 0, 40, 0.01, "emerytalna + rentowa + chorobowa"],
      ["termin815Dni", "Termin na wniosek o wariant 81,5% po porodzie", "dni", 1, 60, 1, "art. 31 ust. 3"],
    ],
  },
  {
    tytul: "Wymiar urlopu macierzyńskiego (tygodnie)",
    pola: [
      ["macierzynskiTyg.1", "1 dziecko", "tyg.", 1, 60, 1, "Kodeks pracy, art. 180"],
      ["macierzynskiTyg.2", "2 dzieci", "tyg.", 1, 60, 1, ""],
      ["macierzynskiTyg.3", "3 dzieci", "tyg.", 1, 60, 1, ""],
      ["macierzynskiTyg.4", "4 dzieci", "tyg.", 1, 60, 1, ""],
      ["macierzynskiTyg.5", "5 i więcej dzieci", "tyg.", 1, 60, 1, ""],
      ["minMatkaTyg", "Minimum dla mamy po porodzie", "tyg.", 0, 30, 1, "art. 180 § 5"],
      ["uzupelniajacyMaxTyg", "Uzupełniający urlop macierzyński (maks.)", "tyg.", 0, 30, 1, "art. 180 § 8"],
    ],
  },
  {
    tytul: "Urlop rodzicielski i ojcowski",
    pola: [
      ["rodzicielskiTyg.jedno", "Rodzicielski — 1 dziecko", "tyg.", 0, 100, 1, "art. 182¹ᵃ"],
      ["rodzicielskiTyg.wiele", "Rodzicielski — wieloraczki", "tyg.", 0, 100, 1, ""],
      ["rodzicielskiTyg.zaZyciemJedno", "Rodzicielski — „Za życiem”, 1 dziecko", "tyg.", 0, 120, 1, ""],
      ["rodzicielskiTyg.zaZyciemWiele", "Rodzicielski — „Za życiem”, wieloraczki", "tyg.", 0, 120, 1, ""],
      ["nieprzenoszalneTyg", "Tygodnie tylko dla każdego z rodziców", "tyg.", 0, 20, 1, "art. 182¹ᵃ § 2"],
      ["ojcowskiDni", "Urlop ojcowski", "dni", 0, 60, 1, "art. 182³"],
    ],
  },
  {
    tytul: "Adopcja i rodzina zastępcza — wiek dziecka",
    pola: [
      ["wiekDziecka.przysposobienie", "Adopcja — do ukończenia", "lat", 0, 18, 1, "art. 183"],
      ["wiekDziecka.zastepcza", "Rodzina zastępcza — do ukończenia", "lat", 0, 18, 1, ""],
      ["wiekDziecka.zastepczaOdroczenie", "Rodzina zastępcza, odroczony obowiązek szkolny", "lat", 0, 18, 1, ""],
    ],
  },
  {
    tytul: "Kwoty i progi",
    pola: [
      ["minimalneWynagrodzenie", "Minimalne wynagrodzenie", "zł", 0, 20000, 1, "rozporządzenie RM"],
      ["progZadluzeniaProc", "Próg zaległości blokującej zasiłek (% min. wynagrodzenia)", "%", 0, 100, 0.1, "art. 2a ustawy zasiłkowej"],
      ["swiadczenieRodzicielskie", "Świadczenie rodzicielskie (gmina)", "zł/mies.", 0, 10000, 1, "ustawa o świadczeniach rodzinnych"],
      ["czasSesjiMin", "Automatyczne wylogowanie po", "min", 1, 120, 1, "bezpieczeństwo"],
    ],
  },
];

const FUNKCJE = [
  ["zusanna", "Asystentka ZUSanna", "Czat w prawym dolnym rogu."],
  ["powiadomienia", "Powiadomienia o terminach", "Dzwonek w nagłówku i przypomnienia."],
  ["organizacje", "Lista organizacji wsparcia", "Sekcja w „Pomoc”."],
  ["trybDemo", "Tryb demonstracyjny w ustawieniach", "Np. wariant z zaległością w składkach."],
];

export default function Admin() {
  const [szkic, setSzkic] = useState(() => structuredClone(P));
  const [komunikat, setKomunikat] = useState("");
  const [hist, setHist] = useState(historia);
  const roznice = zmienione(szkic, P).length;
  const odDomyslnych = zmienione(szkic);

  const zmien = (sciezka, v) => setSzkic((s) => ustawW(s, sciezka, v));

  // Podgląd: jak zmiana wpływa na przykładową osobę (6 000 zł podstawy, 1 dziecko, tylko mama)
  const podglad = useMemo(() => {
    const zaPola = (stan) => {
      const kopia = structuredClone(P);
      Object.assign(P, structuredClone(stan));
      wczytajParametry();
      const r = oblicz({ sytuacja: "urodzenie", dzieci: 1, tryb: "matka", macMatka: 20, rodMatka: 20, podstawaM: 6000, podstawaO: 0, pracaM: 0, pracaO: 0, uzupTyg: 0 });
      Object.assign(P, kopia);
      wczytajParametry();
      return r;
    };
    return { teraz: zaPola(P), nowe: zaPola(szkic) };
  }, [szkic, hist]);

  const zapisz = () => {
    zapiszParametry(szkic, `Zmieniono ${roznice} ${roznice === 1 ? "parametr" : roznice < 5 ? "parametry" : "parametrów"} (obowiązuje od ${szkic.obowiazujeOd})`);
    setHist(historia());
    setKomunikat("Zapisano. Nowe wartości działają od razu w kalkulatorze, progach i funkcjach.");
  };
  const domyslne = () => {
    przywrocDomyslne();
    setSzkic(structuredClone(DOMYSLNE));
    setHist(historia());
    setKomunikat("Przywrócono wartości domyślne.");
  };
  const eksport = () => {
    const blob = new Blob([JSON.stringify(szkic, null, 2)], { type: "application/json" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `parametry-${szkic.obowiazujeOd}.json` });
    a.click();
  };
  const importuj = async (e) => {
    const plik = e.target.files?.[0];
    if (!plik) return;
    try {
      const dane = JSON.parse(await plik.text());
      setSzkic((s) => ({ ...s, ...dane }));
      setKomunikat("Wczytano plik — sprawdź wartości i kliknij „Zapisz zmiany”.");
    } catch {
      setKomunikat("Nie udało się odczytać pliku JSON.");
    }
  };

  const linia = (r, nazwa) => r.linie?.find((l) => l.nazwa.startsWith(nazwa));

  return (
    <div className="wn adm" style={{ paddingTop: 0 }}>
      <div className="urz-pasek adm-pasek">
        <div className="wrap">
          <Ikona n="zebatka" /> Panel administracyjny — parametry narzędzia <small>— demo, zmiany zapisują się w tej przeglądarce</small>
          <Link to="/przewodnik/pulpit" style={{ marginLeft: "auto", color: "#fff", fontWeight: 400, fontSize: 14 }}>Wróć do widoku obywatela</Link>
        </div>
      </div>

      <div className="wrap adm-uklad">
        <div>
          <div className="wn-karta">
            <h1 style={{ marginTop: 0 }}>Parametry z przepisów</h1>
            <p className="wn-lead">Gdy zmienią się przepisy, wpisz nowe wartości tutaj — kalkulator, progi i podpowiedzi przeliczą się bez zmian w kodzie.</p>
            <label className="adm-od">
              <span>Obowiązuje od</span>
              <input type="date" value={szkic.obowiazujeOd} onChange={(e) => zmien("obowiazujeOd", e.target.value)} />
            </label>
          </div>

          {GRUPY.map((g) => (
            <section key={g.tytul} className="wn-karta adm-grupa">
              <h2>{g.tytul}</h2>
              {g.pola.map(([sc, et, jedn, min, max, krok, prawo]) => {
                const v = pobierz(sc, szkic);
                const zm = odDomyslnych.includes(sc);
                const zly = v === "" || isNaN(v) || v < min || v > max;
                return (
                  <label key={sc} className={`adm-pole ${zm ? "zmienione" : ""} ${zly ? "zly" : ""}`}>
                    <span className="adm-et">
                      {et}
                      {prawo && <small>{prawo}</small>}
                    </span>
                    <span className="adm-wej">
                      <input type="number" min={min} max={max} step={krok} value={v} onChange={(e) => zmien(sc, e.target.value === "" ? "" : Number(e.target.value))} aria-invalid={zly || undefined} />
                      <span>{jedn}</span>
                    </span>
                    {zm && <span className="adm-zm" title={`Domyślnie: ${pobierz(sc, DOMYSLNE)}`}>zmienione · domyślnie {pobierz(sc, DOMYSLNE)}</span>}
                    {zly && <span className="adm-blad">Wartość od {min} do {max}</span>}
                  </label>
                );
              })}
            </section>
          ))}

          <section className="wn-karta adm-grupa">
            <h2>Funkcje</h2>
            <p className="muted">Włączaj i wyłączaj moduły — np. nową funkcję najpierw dla testów.</p>
            {FUNKCJE.map(([k, nazwa, opis]) => (
              <label key={k} className="a11y-opcja">
                <span><b>{nazwa}</b><small>{opis}</small></span>
                <input type="checkbox" role="switch" checked={!!szkic.funkcje[k]} onChange={(e) => zmien(`funkcje.${k}`, e.target.checked)} />
              </label>
            ))}
          </section>

          <section className="wn-karta adm-grupa">
            <h2>Komunikat dla użytkowników</h2>
            <p className="muted">Np. „Od 1 stycznia zmieniła się wysokość świadczenia rodzicielskiego”. Pusty = brak komunikatu.</p>
            <textarea className="adm-kom" rows={3} value={szkic.komunikat} onChange={(e) => zmien("komunikat", e.target.value)} />
          </section>
        </div>

        <aside className="adm-bok">
          <div className="wn-karta adm-sticky">
            <h2>Zapis</h2>
            <p>{roznice ? <b>Niezapisane zmiany: {roznice}</b> : "Brak niezapisanych zmian."}</p>
            <div aria-live="polite">{komunikat && <p className="wn-alert ok" style={{ display: "block" }}>{komunikat}</p>}</div>
            <button type="button" className="wn-btn wn-btn-glowny wn-btn-duzy" disabled={!roznice} onClick={zapisz}>Zapisz zmiany</button>
            <div className="adm-akcje">
              <button type="button" className="wn-link" onClick={domyslne}>Przywróć domyślne</button>
              <button type="button" className="wn-link" onClick={eksport}>Eksportuj JSON</button>
              <label className="wn-link adm-import">Importuj JSON<input type="file" accept="application/json" onChange={importuj} /></label>
            </div>

            <h3>Podgląd zmiany</h3>
            <p className="muted adm-maly">Mama, 1 dziecko, podstawa 6 000 zł, sama korzysta z urlopów.</p>
            <dl className="adm-podglad">
              {[["Macierzyński (mies.)", "Urlop macierzyński"], ["Rodzicielski (mies.)", "Urlop rodzicielski"]].map(([et, n]) => {
                const a = linia(podglad.teraz, n);
                const b = linia(podglad.nowe, n);
                return (
                  <div key={et}>
                    <dt>{et}</dt>
                    <dd>{a ? zl(a.miesiecznie) : "—"} {b && a && b.miesiecznie !== a.miesiecznie && <b>→ {zl(b.miesiecznie)}</b>}</dd>
                  </div>
                );
              })}
              <div>
                <dt>Rodzicielski (tyg.)</dt>
                <dd>{podglad.teraz.meta?.rodM} {podglad.nowe.meta?.rodM !== podglad.teraz.meta?.rodM && <b>→ {podglad.nowe.meta?.rodM}</b>}</dd>
              </div>
            </dl>

            <h3>Historia zmian</h3>
            {hist.length ? (
              <ul className="adm-hist">
                {hist.slice(0, 6).map((h, i) => <li key={i}><small>{fmtCzas(h.kiedy)} · {h.kto}</small>{h.opis}</li>)}
              </ul>
            ) : <p className="muted adm-maly">Jeszcze nic nie zmieniano.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
