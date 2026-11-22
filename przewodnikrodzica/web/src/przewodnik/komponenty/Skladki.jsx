// STAN SKŁADEK — zadłużenie na dzień powstania prawa do zasiłku + symulacja zaświadczenia.
// Dzień powstania prawa: start trwającego zwolnienia (zasiłek chorobowy) albo dzień porodu
// (zasiłek macierzyński). Osoba może też wybrać dowolną datę.
import { useEffect, useMemo, useState } from "react";
import { useSesja } from "../SesjaContext.jsx";
import { DANE_ZUS_ZAPAS, PROFIL_MOBYWATEL } from "../dane.js";
import { dzisISO, fmtDzien } from "../terminy.js";
import { PROG_ZADLUZENIA, kwota } from "./Zadluzenie.jsx";
import { aktualneZwolnienie } from "./Zwolnienie.jsx";
import Ikona from "../wniosek/Ikona.jsx";

/** Zaległość na wskazany dzień (z historii; bez historii — bieżąca kwota). */
export function stanNaDzien(zus, dzien) {
  const hist = zus?.historiaZadluzenia;
  if (!hist?.length) return zus?.zadluzenie || 0;
  const wpisy = hist.filter((h) => h.od <= dzien).sort((a, b) => (a.od < b.od ? 1 : -1));
  return wpisy[0]?.kwota ?? 0;
}

/** Podpowiedzi „dnia powstania prawa” z danych, które już mamy. */
export function dniPowstaniaPrawa(sesja, zus) {
  const wynik = [];
  const l4 = aktualneZwolnienie(zus, { etap: sesja.etap, ankieta: sesja.ankieta || {}, data: sesja.etap === "ciaza" ? sesja.terminPorodu : null });
  if (l4) wynik.push({ data: l4.od, opis: "zasiłek chorobowy — początek obecnego zwolnienia" });
  const porod = sesja.etap === "dziecko" ? sesja.dataPorodu : sesja.terminPorodu;
  if (porod) wynik.push({ data: porod, opis: sesja.etap === "dziecko" ? "zasiłek macierzyński — dzień porodu" : "zasiłek macierzyński — planowany dzień porodu" });
  return wynik;
}

export function ZaswiadczenieModal({ zus, profil, dzien, onZamknij }) {
  const stan = stanNaDzien(zus, dzien);
  const numer = useMemo(() => `SYM/${new Date().getFullYear()}/${String(Math.floor(100000 + Math.random() * 900000))}`, []);
  const u = zus?.ubezpieczenie || {};
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onZamknij();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onZamknij]);
  return (
    <div className="dk-tlo zs-druk-tlo" onClick={onZamknij}>
      <div className="dk-okno zsw-okno" role="dialog" aria-modal="true" aria-labelledby="zsw-tytul" onClick={(e) => e.stopPropagation()}>
        <article className="zsw-dok" aria-describedby="zsw-sym">
          <div className="zsw-znak" aria-hidden="true">SYMULACJA</div>
          <header className="zsw-glowa">
            <span>Wzór demonstracyjny</span>
            <span>Nr {numer}</span>
          </header>
          <h2 id="zsw-tytul">{stan > 0 ? "Zaświadczenie o stanie zaległości w składkach" : "Zaświadczenie o niezaleganiu w opłacaniu składek"}</h2>
          <dl className="zsw-dl">
            <div><dt>Wystawiono</dt><dd>{fmtDzien(dzisISO())}</dd></div>
            <div><dt>Dla</dt><dd>{profil.imie} {profil.nazwisko}, PESEL {profil.pesel}</dd></div>
            <div><dt>Tytuł ubezpieczenia</dt><dd>{u.tytul || "—"}</dd></div>
            <div><dt>Stan na dzień</dt><dd>{fmtDzien(dzien)}</dd></div>
          </dl>
          <p className={`zsw-wynik ${stan > 0 ? "blad" : "ok"}`}>
            {stan > 0
              ? <>Zaległość w składkach na ubezpieczenia społeczne: <b>{kwota(stan)}</b></>
              : <>Brak zaległości w składkach na ubezpieczenia społeczne.</>}
          </p>
          {stan > PROG_ZADLUZENIA && (
            <p className="zsw-uwaga">Zaległość przekracza 1% minimalnego wynagrodzenia ({kwota(PROG_ZADLUZENIA)}) — zasiłek zostanie wypłacony po jej spłacie (przy spłacie w ciągu 6 miesięcy — za cały okres).</p>
          )}
          <p id="zsw-sym" className="zsw-stopka">Symulacja na potrzeby prototypu. Nie jest to dokument ZUS i nie ma mocy prawnej.</p>
        </article>
        <div className="dk-przyciski">
          <button type="button" className="dk-btn dk-btn-drugi" onClick={() => window.print()}><Ikona n="drukarka" rozmiar={18} /> Drukuj / zapisz PDF</button>
          <button type="button" className="dk-btn dk-btn-glowny" onClick={onZamknij} autoFocus>Zamknij</button>
        </div>
      </div>
    </div>
  );
}

// Panel na stronie „Świadczenia”: stan dziś, na dzień powstania prawa, zaświadczenie
export function PanelSkladek() {
  const sesja = useSesja();
  const zus = sesja.zus || DANE_ZUS_ZAPAS;
  const profil = sesja.profil || PROFIL_MOBYWATEL;
  const podpowiedzi = dniPowstaniaPrawa(sesja, zus);
  const [dzien, setDzien] = useState(podpowiedzi[0]?.data || dzisISO());
  const [zaswiadczenie, setZaswiadczenie] = useState(false);
  const dzis = stanNaDzien(zus, dzisISO());
  const naDzien = stanNaDzien(zus, dzien);
  const przyszly = dzien > dzisISO();

  return (
    <section className={`sk-panel ${dzis > PROG_ZADLUZENIA ? "alarm" : ""}`} aria-labelledby="skl-tytul">
      <div className="sk-panel-glowa">
        <span className="zl-ikona"><Ikona n={dzis > PROG_ZADLUZENIA ? "alert" : "check"} rozmiar={24} /></span>
        <div>
          <h2 id="skl-tytul">Twoje składki w ZUS</h2>
          <p>{dzis > 0 ? <>Dziś masz zaległość: <b>{kwota(dzis)}</b></> : "Dziś nie masz zaległości w składkach."}</p>
        </div>
      </div>
      <div className="sk-panel-dzien">
        <label htmlFor="skl-data"><b>Stan na dzień powstania prawa do zasiłku</b></label>
        <div className="sk-panel-wybor">
          {podpowiedzi.map((p) => (
            <button key={p.data + p.opis} type="button" className={dzien === p.data ? "wybrany" : ""} onClick={() => setDzien(p.data)}>
              {fmtDzien(p.data)} <small>{p.opis}</small>
            </button>
          ))}
          <input id="skl-data" type="date" value={dzien} onChange={(e) => e.target.value && setDzien(e.target.value)} />
        </div>
        <p className={`sk-panel-wynik ${naDzien > PROG_ZADLUZENIA ? "blad" : "ok"}`}>
          {naDzien > 0
            ? <>Na {fmtDzien(dzien)}{przyszly ? " (jeśli nie spłacisz wcześniej)" : ""}: zaległość <b>{kwota(naDzien)}</b>{naDzien > PROG_ZADLUZENIA ? " — zasiłek zostanie wstrzymany do spłaty." : " — poniżej progu 1%, zasiłek nie jest wstrzymany."}</>
            : <>Na {fmtDzien(dzien)}: brak zaległości — zasiłek może być wypłacony.</>}
        </p>
      </div>
      <button type="button" className="dk-btn dk-btn-drugi sk-panel-btn" onClick={() => setZaswiadczenie(true)}>
        <Ikona n="dokument" rozmiar={18} /> Wystaw zaświadczenie (symulacja)
      </button>
      {zaswiadczenie && <ZaswiadczenieModal zus={zus} profil={profil} dzien={dzien} onZamknij={() => setZaswiadczenie(false)} />}
    </section>
  );
}
