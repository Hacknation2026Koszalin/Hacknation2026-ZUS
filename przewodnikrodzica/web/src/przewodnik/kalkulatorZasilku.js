// Silnik kalkulatora zasiłku macierzyńskiego – czysta funkcja, bez zależności od Reacta.
// Wymiary i stawki wg „Zasiłkowego Przewodnika Przyszłego Rodzica”
// (ustawa zasiłkowa + Kodeks pracy). Przed wdrożeniem zweryfikuj je z aktualnym stanem prawnym.

// Wszystkie wartości z przepisów pochodzą z panelu administracyjnego (parametry.js).
// `export let` = żywe powiązania: po zmianie w panelu importujące moduły widzą nowe wartości.
import { P, naZmiane } from "./parametry.js";

export let SKLADKI_PRACOWNIKA = 0.1371; // emerytalna 9,76% + rentowa 1,5% + chorobowa 2,45%
export let MACIERZYNSKI_TYG = { 1: 20, 2: 31, 3: 33, 4: 35, 5: 37 }; // wg liczby dzieci (5 = 5 i więcej)
export let MIN_MATKA_MAC_TYG = 14;
export let NIEPRZENOSZALNE_ROD_TYG = 9;
export let OJCOWSKI_DNI = 14;
export function wczytajParametry() {
  SKLADKI_PRACOWNIKA = P.skladkiPracownika / 100;
  MACIERZYNSKI_TYG = { ...P.macierzynskiTyg };
  MIN_MATKA_MAC_TYG = P.minMatkaTyg;
  NIEPRZENOSZALNE_ROD_TYG = P.nieprzenoszalneTyg;
  OJCOWSKI_DNI = P.ojcowskiDni;
}
wczytajParametry();
if (typeof window !== "undefined") naZmiane(wczytajParametry);

export const maxMacierzynski = (n) =>
  MACIERZYNSKI_TYG[Math.min(Math.max(n, 1), 5)];
export const pulaRodzicielski = (n, zaZyciem) => {
  const r = P.rodzicielskiTyg;
  return zaZyciem ? (n > 1 ? r.zaZyciemWiele : r.zaZyciemJedno) : n > 1 ? r.wiele : r.jedno;
};

export const podstawaZBrutto = (brutto) =>
  Math.round((Number(brutto) || 0) * (1 - SKLADKI_PRACOWNIKA) * 100) / 100;

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const r2 = (v) => Math.round(v * 100) / 100;

function linia({ kto, nazwa, tyg, pct, podstawa, praca = 0, uwaga }) {
  const dniPelne = Math.round(tyg * 7);
  const dniKal = praca ? Math.round(dniPelne / (1 - praca)) : dniPelne;
  return {
    kto,
    nazwa,
    uwaga,
    procent: pct,
    praca,
    dni: dniKal,
    tygodnie: Math.round((dniKal / 7) * 10) / 10,
    miesiecznie: r2(podstawa * pct * (1 - praca)),
    razem: r2(((dniPelne * podstawa) / 30) * pct),
    zPracy: praca ? r2(podstawa * praca) : 0, // szacunek: to samo wynagrodzenie proporcjonalnie do etatu
  };
}

export function oblicz(s) {
  const adop = s.sytuacja === "przysposobienie";
  const n = clamp(Number(s.dzieci) || 1, 1, 5);
  const oboje = s.tryb === "oboje";
  const ostrzezenia = [];
  const terminy = [];

  // --- uprawnienia dla przyjętego dziecka (wiek) ---
  if (adop) {
    const wd = P.wiekDziecka;
    const limit = s.typAdopcji === "zastepcza" ? (s.odroczenie ? wd.zastepczaOdroczenie : wd.zastepcza) : wd.przysposobienie;
    if (Number(s.wiek) > limit) {
      return {
        blad: `Dla tego wariantu prawo do urlopu na warunkach urlopu macierzyńskiego przysługuje do ${limit}. roku życia dziecka. Przy podanym wieku zasiłek nie przysługuje.`,
      };
    }
  }

  const maxMac = maxMacierzynski(n);
  const macMin = adop ? 0 : MIN_MATKA_MAC_TYG;
  const macM = oboje ? clamp(Number(s.macMatka), macMin, maxMac) : maxMac;
  const macO = oboje ? maxMac - macM : 0;

  let pula = pulaRodzicielski(n, !adop && s.zaZyciem);
  if (adop && Number(s.wiek) > 6) {
    pula = 0;
    ostrzezenia.push(
      "Urlop rodzicielski przysługuje najdalej do końca roku kalendarzowego, w którym dziecko kończy 6 lat – przy tym wieku został pominięty.",
    );
  } else if (adop && Number(s.wiek) === 6) {
    ostrzezenia.push(
      "Dziecko ma 6 lat – prawo do urlopu rodzicielskiego może być ograniczone. Sprawdź w ZUS.",
    );
  }
  const rodM =
    pula === 0
      ? 0
      : oboje
        ? clamp(
            Number(s.rodMatka),
            NIEPRZENOSZALNE_ROD_TYG,
            pula - NIEPRZENOSZALNE_ROD_TYG,
          )
        : // Jedno z rodziców: 9 tygodni jest zarezerwowane dla drugiego rodzica i przepada,
          // jeśli go nie wykorzysta (np. 41 − 9 = 32 tygodnie, 43 − 9 = 34).
          pula - NIEPRZENOSZALNE_ROD_TYG;
  const rodO = pula === 0 ? 0 : oboje ? pula - rodM : 0;
  if (!oboje && pula > 0)
    ostrzezenia.push(
      `Gdy z urlopu rodzicielskiego korzysta tylko jedno z rodziców, przysługuje ${pula - NIEPRZENOSZALNE_ROD_TYG} tygodni — ${NIEPRZENOSZALNE_ROD_TYG} tygodni jest zarezerwowanych dla drugiego rodzica. Pełne ${pula} tygodni dostaniesz tylko w szczególnych sytuacjach (np. drugi rodzic nie żyje albo nie ma władzy rodzicielskiej).`,
    );

  const pM = clamp(Number(s.pracaM) || 0, 0, 50) / 100;
  const pO = clamp(Number(s.pracaO) || 0, 0, 50) / 100;
  const bM = Number(s.podstawaM) || 0;
  const bO = Number(s.podstawaO) || 0;

  // --- stawka 81,5% ---
  let rodzicielskiPct = P.stawki.rodzicielski / 100;
  let macierzynskiPct = P.stawki.macierzynski / 100;
  let uzywa815 = false;
  if (s.w815) {
    if (!adop && !oboje && pM === 0 && pula > 0) {
      uzywa815 = true;
      rodzicielskiPct = macierzynskiPct = P.stawki.wariant815 / 100;
    } else {
      ostrzezenia.push(
        "Stawka 81,5% wymaga, by jedno z rodziców (matka) wzięło cały urlop macierzyński i rodzicielski bez łączenia z pracą – wybrano więc standardowe 100% i 70%.",
      );
    }
  }

  const rodzic = (k) =>
    k === "M" ? (adop ? "Rodzic 1" : "Matka") : adop ? "Rodzic 2" : "Ojciec";
  const nazwaMac = adop
    ? "Urlop na warunkach urlopu macierzyńskiego"
    : "Urlop macierzyński";
  const linie = [];

  if (macM)
    linie.push(
      linia({
        kto: rodzic("M"),
        nazwa: nazwaMac,
        tyg: macM,
        pct: macierzynskiPct,
        podstawa: bM,
      }),
    );
  if (macO)
    linie.push(
      linia({
        kto: rodzic("O"),
        nazwa: nazwaMac,
        tyg: macO,
        pct: macierzynskiPct,
        podstawa: bO,
      }),
    );

  if (!adop && Number(s.uzupTyg) > 0) {
    const kto = s.uzupKto === "O" && oboje ? "O" : "M";
    linie.push(
      linia({
        kto: rodzic(kto),
        nazwa: "Uzupełniający urlop macierzyński",
        tyg: clamp(Number(s.uzupTyg), 1, P.uzupelniajacyMaxTyg),
        pct: 1,
        podstawa: kto === "M" ? bM : bO,
      }),
    );
  }
  if (rodM)
    linie.push(
      linia({
        kto: rodzic("M"),
        nazwa: "Urlop rodzicielski",
        tyg: rodM,
        pct: rodzicielskiPct,
        podstawa: bM,
        praca: pM,
      }),
    );
  if (rodO)
    linie.push(
      linia({
        kto: rodzic("O"),
        nazwa: "Urlop rodzicielski",
        tyg: rodO,
        pct: rodzicielskiPct,
        podstawa: bO,
        praca: pO,
      }),
    );
  if (oboje && s.ojcowski) {
    linie.push(
      linia({
        kto: rodzic("O"),
        nazwa: "Urlop ojcowski",
        tyg: OJCOWSKI_DNI / 7,
        pct: 1,
        podstawa: bO,
      }),
    );
  }

  // --- terminy ---
  if (!adop && s.dataPorodu) {
    const d = new Date(s.dataPorodu);
    if (!isNaN(d)) {
      const fmt = (x) => x.toLocaleDateString("pl-PL");
      const plus = (dd, f) => {
        const x = new Date(dd);
        f(x);
        return x;
      };
      if (!oboje)
        terminy.push(
          `Wniosek o zasiłek 81,5%: do ${fmt(plus(d, (x) => x.setDate(x.getDate() + P.termin815Dni)))}`,
        );
      if (oboje && s.ojcowski)
        terminy.push(
          `Urlop ojcowski: do ${fmt(plus(d, (x) => x.setMonth(x.getMonth() + 12)))}`,
        );
      terminy.push(
        `Urlop rodzicielski: najpóźniej do ${fmt(new Date(d.getFullYear() + 6, 11, 31))}`,
      );
    }
  }

  const sumaDla = (kto) =>
    r2(linie.filter((l) => l.kto === kto).reduce((a, l) => a + l.razem, 0));
  const kto = [...new Set(linie.map((l) => l.kto))];
  return {
    linie,
    razem: r2(linie.reduce((a, l) => a + l.razem, 0)),
    podzial: kto.map((k) => ({ kto: k, razem: sumaDla(k) })),
    ostrzezenia,
    terminy,
    uzywa815,
    meta: { maxMac, pula, macM, macO, rodM, rodO },
    brakPodstawy: !bM && !(oboje && bO),
  };
}
