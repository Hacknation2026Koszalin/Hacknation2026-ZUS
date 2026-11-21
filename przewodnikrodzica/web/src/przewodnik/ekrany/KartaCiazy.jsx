// =====================================================================
// KARTA CIĄŻY — „pobrana od ginekologa” (symulacja)
// Najpierw pytamy backend (/api/symulacja/karta-ciazy/{pesel}), a gdy nie działa —
// bierzemy dane zapasowe z dane.js.
// =====================================================================
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import { KARTA_CIAZY, PROFIL_MOBYWATEL } from "../dane.js";
import { dzisISO, fmtDzien, ileDni, tydzienCiazy } from "../terminy.js";
import Ikona from "../wniosek/Ikona.jsx";

export default function KartaCiazy() {
  const { profil = PROFIL_MOBYWATEL } = useSesja();
  const [karta, setKarta] = useState(KARTA_CIAZY);
  const [pokazPlec, setPokazPlec] = useState(false);
  const [odswiezanie, setOdswiezanie] = useState(false);

  const pobierz = async () => {
    setOdswiezanie(true);
    try {
      const r = await fetch(`/api/symulacja/karta-ciazy/${profil.pesel}`);
      if (!r.ok) throw new Error();
      setKarta(await r.json());
    } catch {
      setKarta(KARTA_CIAZY);
    }
    setTimeout(() => setOdswiezanie(false), 600);
  };
  useEffect(() => {
    pobierz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dzis = dzisISO();
  const tc = tydzienCiazy(karta, dzis);
  const doPorodu = ileDni(dzis, karta.terminPorodu);
  const wiek = Math.floor(ileDni(profil.dataUrodzenia || "1992-07-15", dzis) / 365.25);
  const trymestr = tc.tydzien < 14 ? "I" : tc.tydzien < 28 ? "II" : "III";
  const ciaza = karta.liczbaDzieci === 1 ? "pojedyncza" : karta.liczbaDzieci === 2 ? "bliźniacza" : "mnoga";

  return (
    <div className="kc wrap">
      <div className="kc-glowa">
        <div>
          <h1>Karta ciąży</h1>
          <p className="kc-zrodlo">
            <Ikona n="tarcza" rozmiar={16} /> Pobrano za Twoją zgodą z gabinetu: <b>{karta.zrodlo.placowka}</b>, {karta.zrodlo.lekarz} · {fmtDzien(karta.zrodlo.pobrano)}
            <span className="kc-sym">symulacja</span>
          </p>
        </div>
        <div className="kc-akcje">
          <button type="button" className="kc-btn" onClick={pobierz} disabled={odswiezanie}>
            <Ikona n="odswiez" rozmiar={18} className={odswiezanie ? "kreci" : ""} /> {odswiezanie ? "Pobieranie…" : "Odśwież z gabinetu"}
          </button>
          <button type="button" className="kc-btn" onClick={() => window.print()}>
            <Ikona n="drukarka" rozmiar={18} /> Pobierz PDF
          </button>
        </div>
      </div>

      {/* --- „Dokument” --- */}
      <article className="kc-dok" aria-label="Karta przebiegu ciąży">
        <div className="kc-pas" aria-hidden="true" />
        <header className="kc-dok-glowa">
          <div>
            <span className="kc-etyk">Karta przebiegu ciąży</span>
            <h2>{profil.imie} {profil.nazwisko}</h2>
            <p>{wiek} lat · grupa krwi {karta.grupaKrwi} · {karta.ktoraCiaza}. ciąża, {karta.ktoryPorod}. poród</p>
          </div>
          <div className="kc-tydzien">
            <b>{tc.tydzien}<small>+{tc.dzien}</small></b>
            <span>tydzień · {trymestr} trymestr</span>
          </div>
        </header>

        <div className="kc-kafle">
          <div className="kc-kafel kc-kafel-glowny">
            <small>Przewidywany termin porodu</small>
            <b>{fmtDzien(karta.terminPorodu)}</b>
            <span>za {doPorodu} dni</span>
          </div>
          <div className="kc-kafel">
            <small>Liczba dzieci</small>
            <b>{karta.liczbaDzieci}</b>
            <span>ciąża {ciaza}</span>
          </div>
          <div className="kc-kafel kc-plec">
            <small>Płeć dziecka</small>
            {pokazPlec ? (
              <>
                <b className="kc-odkryta">{karta.plec}</b>
                <button type="button" className="kc-link" onClick={() => setPokazPlec(false)}>Ukryj</button>
              </>
            ) : (
              <button type="button" className="kc-odkryj" onClick={() => setPokazPlec(true)}>
                <Ikona n="oko" rozmiar={18} /> Odkryj
              </button>
            )}
            {!pokazPlec && <span>ukryte — nie każdy chce wiedzieć</span>}
          </div>
          <div className="kc-kafel">
            <small>Następna wizyta</small>
            <b>{fmtDzien(karta.nastepnaWizyta, { day: "numeric", month: "long" })}</b>
            <span>za {ileDni(dzis, karta.nastepnaWizyta)} dni</span>
          </div>
        </div>

        <div className="kc-postep" aria-hidden="true">
          <div className="kc-postep-tor"><div style={{ width: `${tc.procent}%` }} /></div>
          <div className="kc-postep-opis"><span>I trymestr</span><span>II trymestr</span><span>III trymestr</span></div>
        </div>

        <div className="kc-sekcje">
          <section>
            <h3>Ostatnia wizyta · {fmtDzien(karta.pomiary.data, { day: "numeric", month: "long" })} ({karta.pomiary.tydzien} tydz.)</h3>
            <dl className="kc-dl">
              <div><dt>Masa ciała mamy</dt><dd>{karta.pomiary.masaCiala}</dd></div>
              <div><dt>Ciśnienie</dt><dd>{karta.pomiary.cisnienie}</dd></div>
              <div><dt>Szacowana masa dziecka</dt><dd>{karta.pomiary.masaPlodu}</dd></div>
              <div><dt>Tętno dziecka</dt><dd>{karta.pomiary.tetnoPlodu}</dd></div>
            </dl>
          </section>
          <section>
            <h3>Badania</h3>
            <ul className="kc-badania">
              {karta.badania.map((b) => (
                <li key={b.nazwa} className={b.stan}>
                  <Ikona n={b.stan === "ok" ? "check" : "zegar"} rozmiar={16} />
                  <span><b>{b.nazwa}</b> — {b.wynik}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="kc-wizyty">
            <h3>Przebieg ciąży</h3>
            <ol>
              {karta.wizyty.map((w) => (
                <li key={w.data}>
                  <span className="kc-w-data">{fmtDzien(w.data, { day: "numeric", month: "short" })}<small>{w.tydzien} tydz.</small></span>
                  <span>{w.opis}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <footer className="kc-stopka">
          Pierwszy dzień ostatniej miesiączki: {fmtDzien(karta.ostatniaMiesiaczka)} · termin = + 280 dni
        </footer>
      </article>

      <div className="kc-prywatnosc">
        <Ikona n="tarcza" />
        <p>
          <b>Twoje dane medyczne widzisz tylko Ty.</b> Do spraw w ZUS używamy wyłącznie terminu porodu i liczby dzieci —
          np. żeby policzyć terminy i wpisać je za Ciebie do wniosku.
        </p>
        <Link to="/przewodnik/swiadczenia/zasilek-macierzynski/wniosek" className="kc-btn kc-btn-glowny">Użyj we wniosku</Link>
      </div>
    </div>
  );
}
