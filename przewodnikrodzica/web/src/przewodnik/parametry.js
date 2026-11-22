// =====================================================================
// PARAMETRY NARZĘDZIA — jedno miejsce na wartości z przepisów.
// Zmienia je administrator w panelu (/przewodnik/admin), bez zmian w kodzie.
// W prototypie zapis trafia do pamięci przeglądarki; docelowo — do bazy przez API.
// =====================================================================

export const DOMYSLNE = {
  obowiazujeOd: "2026-01-01",
  stawki: { macierzynski: 100, wariant815: 81.5, rodzicielski: 70 },
  macierzynskiTyg: { 1: 20, 2: 31, 3: 33, 4: 35, 5: 37 },
  rodzicielskiTyg: { jedno: 41, wiele: 43, zaZyciemJedno: 65, zaZyciemWiele: 67 },
  nieprzenoszalneTyg: 9,
  minMatkaTyg: 14,
  ojcowskiDni: 14,
  uzupelniajacyMaxTyg: 15,
  termin815Dni: 21,
  skladkiPracownika: 13.71,
  minimalneWynagrodzenie: 4806,
  progZadluzeniaProc: 1,
  swiadczenieRodzicielskie: 1000,
  wiekDziecka: { przysposobienie: 14, zastepcza: 7, zastepczaOdroczenie: 10 },
  czasSesjiMin: 15,
  funkcje: { zusanna: true, powiadomienia: true, organizacje: true, trybDemo: true },
  komunikat: "",
};

const KLUCZ = "przewodnik-parametry";
const KLUCZ_HIST = "przewodnik-parametry-historia";
const ZDARZENIE = "przewodnik-parametry-zmiana";

const scal = (baza, nad) => {
  if (!nad || typeof nad !== "object") return structuredClone(baza);
  const wynik = Array.isArray(baza) ? [...baza] : { ...baza };
  for (const k of Object.keys(baza)) {
    if (baza[k] && typeof baza[k] === "object" && !Array.isArray(baza[k])) wynik[k] = scal(baza[k], nad[k]);
    else if (nad[k] !== undefined) wynik[k] = nad[k];
  }
  return wynik;
};

const wczytaj = () => {
  try {
    return scal(DOMYSLNE, JSON.parse(localStorage.getItem(KLUCZ)));
  } catch {
    return structuredClone(DOMYSLNE);
  }
};

/** Aktualne parametry (obiekt jest podmieniany w miejscu, więc importy widzą zmiany). */
export const P = wczytaj();

const odswiezP = (nowe) => {
  for (const k of Object.keys(P)) delete P[k];
  Object.assign(P, nowe);
};

export function naZmiane(fn) {
  window.addEventListener(ZDARZENIE, fn);
  return () => window.removeEventListener(ZDARZENIE, fn);
}

export function historia() {
  try {
    return JSON.parse(localStorage.getItem(KLUCZ_HIST)) || [];
  } catch {
    return [];
  }
}

/** Zapis nowych parametrów + wpis w historii zmian. */
export function zapiszParametry(nowe, opis = "Zmiana parametrów") {
  const scalone = scal(DOMYSLNE, nowe);
  try {
    localStorage.setItem(KLUCZ, JSON.stringify(scalone));
    localStorage.setItem(KLUCZ_HIST, JSON.stringify([{ kiedy: new Date().toISOString(), opis, kto: "administrator (demo)" }, ...historia()].slice(0, 30)));
  } catch {
    /* brak pamięci przeglądarki */
  }
  odswiezP(scalone);
  window.dispatchEvent(new Event(ZDARZENIE));
}

export function przywrocDomyslne() {
  try {
    localStorage.removeItem(KLUCZ);
  } catch {
    /* nic */
  }
  zapiszParametry(structuredClone(DOMYSLNE), "Przywrócono wartości domyślne");
}

/** Lista ścieżek, które różnią się od domyślnych (do znaczków „zmienione”). */
export function zmienione(obj = P, baza = DOMYSLNE, prefiks = "") {
  return Object.keys(baza).flatMap((k) =>
    baza[k] && typeof baza[k] === "object"
      ? zmienione(obj[k] || {}, baza[k], `${prefiks}${k}.`)
      : obj[k] !== baza[k] ? [`${prefiks}${k}`] : [],
  );
}
