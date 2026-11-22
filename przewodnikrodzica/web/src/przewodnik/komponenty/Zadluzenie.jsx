// Wariant „zaległość w składkach”.
// Zasada (ustawa zasiłkowa, art. 2a): osobie prowadzącej działalność (i współpracującej) zasiłek
// nie przysługuje, gdy w dniu powstania prawa do niego ma zaległość wyższą niż 1% minimalnego
// wynagrodzenia — do czasu spłaty całości. Spłata w ciągu 6 miesięcy = zasiłek za cały okres.
// Układ ratalny / odroczenie spłacane w terminie = brak zadłużenia.
import { useEffect, useState } from "react";
import Ikona from "../wniosek/Ikona.jsx";
import { useSesja } from "../SesjaContext.jsx";
import { PROFIL_MOBYWATEL } from "../dane.js";
import { fmtDzien } from "../terminy.js";
import { ZaswiadczenieModal, dniPowstaniaPrawa, stanNaDzien } from "./Skladki.jsx";

import { P, naZmiane } from "../parametry.js";
// Z panelu administracyjnego: minimalne wynagrodzenie i próg (domyślnie 1% = 48,06 zł)
export let MINIMALNE_WYNAGRODZENIE = P.minimalneWynagrodzenie;
export let PROG_ZADLUZENIA = Math.round(P.minimalneWynagrodzenie * P.progZadluzeniaProc) / 100;
naZmiane(() => {
  MINIMALNE_WYNAGRODZENIE = P.minimalneWynagrodzenie;
  PROG_ZADLUZENIA = Math.round(P.minimalneWynagrodzenie * P.progZadluzeniaProc) / 100;
});

export const kwota = (v) => v.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " zł";
export const maZadluzenie = (zus) => (zus?.zadluzenie || 0) > PROG_ZADLUZENIA;

// Dane do trybu demonstracyjnego (przełącznik w ustawieniach)
export const ZUS_Z_ZALEGLOSCIA = {
  ubezpieczenie: { tytul: "działalność gospodarcza", od: "2022-05-01", chorobowe: "dobrowolne", okresWyczekiwaniaSpelniony: true, platnik: "Anna Testowa (własna firma)", platnikPowyzej20: false },
  podstawaWymiaru: 5203.8,
  eZLA: [{ od: "2026-11-09", do: "2026-12-06", kod: "B" }],
  historiaZadluzenia: [{ od: "2026-06-16", kwota: 412.5 }, { od: "2026-08-16", kwota: 842.17 }, { od: "2026-10-16", kwota: 1284.37 }],
  zadluzenie: 1284.37,
};

export function ZadluzenieModal({ zus, onZamknij }) {
  const sesja = useSesja();
  const dni = dniPowstaniaPrawa(sesja, zus);
  const [zaswiadczenie, setZaswiadczenie] = useState(null);
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onZamknij();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onZamknij]);
  return (
    <div className="dk-tlo" onClick={onZamknij}>
      <div className="dk-okno zd-okno" role="alertdialog" aria-modal="true" aria-labelledby="zd-tytul" aria-describedby="zd-opis" onClick={(e) => e.stopPropagation()}>
        <span className="zd-ikona"><Ikona n="alert" rozmiar={30} /></span>
        <h2 id="zd-tytul">Masz zaległość w składkach ZUS</h2>
        <p className="zd-kwota">{kwota(zus.zadluzenie)}</p>
        <div id="zd-opis">
          <p><b>Do czasu opłacenia zaległości nie wypłacimy Ci zasiłku</b> — macierzyńskiego ani chorobowego.</p>
          <ul className="zd-lista">
            <li><Ikona n="check" rozmiar={18} /> <span>Jeśli spłacisz całość w ciągu <b>6 miesięcy</b> od dnia, w którym nabędziesz prawo do zasiłku, dostaniesz go <b>za cały okres</b>. Po 6 miesiącach — tylko od dnia spłaty.</span></li>
            <li><Ikona n="info" rozmiar={18} /> <span>Zasada dotyczy zaległości wyższej niż {P.progZadluzeniaProc}% minimalnego wynagrodzenia ({kwota(PROG_ZADLUZENIA)}).</span></li>
            <li><Ikona n="poczta" rozmiar={18} /> <span>Nie dasz rady spłacić od razu? Poproś ZUS o raty albo odroczenie. Gdy płacisz w terminie, uznajemy, że nie masz zaległości.</span></li>
          </ul>
          {dni.length > 0 && (
            <div className="zd-dni">
              <b>Stan na dzień powstania prawa do zasiłku</b>
              {dni.map((d) => (
                <p key={d.data + d.opis}>
                  {fmtDzien(d.data)} ({d.opis}): <b className={stanNaDzien(zus, d.data) > PROG_ZADLUZENIA ? "blad" : ""}>{kwota(stanNaDzien(zus, d.data))}</b>
                  <button type="button" className="wn-link" onClick={() => setZaswiadczenie(d.data)}>zaświadczenie</button>
                </p>
              ))}
            </div>
          )}
        </div>
        <div className="dk-przyciski">
          <a className="dk-btn dk-btn-drugi" href="https://www.zus.pl" target="_blank" rel="noreferrer">Jak spłacić <span className="sr-only">(otwiera zus.pl w nowej karcie)</span></a>
          <button type="button" className="dk-btn dk-btn-glowny" onClick={onZamknij} autoFocus>Rozumiem</button>
        </div>
      </div>
      {zaswiadczenie && <ZaswiadczenieModal zus={zus} profil={sesja.profil || PROFIL_MOBYWATEL} dzien={zaswiadczenie} onZamknij={() => setZaswiadczenie(null)} />}
    </div>
  );
}

// Czerwony pasek ostrzeżenia na każdej stronie konta
export function PasekZadluzenia({ zus }) {
  const [okno, setOkno] = useState(false);
  return (
    <div className="pz" role="alert">
      <div className="wrap pz-in">
        <Ikona n="alert" rozmiar={22} />
        <p><b>Uwaga: zaległość w składkach — {kwota(zus.zadluzenie)}.</b> Do czasu spłaty nie wypłacimy zasiłku macierzyńskiego ani chorobowego.</p>
        <button type="button" onClick={() => setOkno(true)}>Co mam zrobić?</button>
      </div>
      {okno && <ZadluzenieModal zus={zus} onZamknij={() => setOkno(false)} />}
    </div>
  );
}
