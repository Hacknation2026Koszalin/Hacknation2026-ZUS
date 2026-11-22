// =====================================================================
// WERSJE ROBOCZE WNIOSKÓW — rodzic w każdej chwili zapisuje wniosek
// i wraca do niego później (z „Moich spraw”, z listy wniosków albo
// z ekranu startowego wniosku). Zapis w localStorage tej przeglądarki,
// osobno dla każdej osoby (PESEL) i każdego formularza.
// W prawdziwym wdrożeniu: zapis na koncie PUE/eZUS.
// =====================================================================
const KLUCZ = "przewodnik-robocze";
export const ZDARZENIE_ROBOCZE = "przewodnik-robocze-zmiana";

const czytaj = () => {
  try { return JSON.parse(localStorage.getItem(KLUCZ)) || []; } catch { return []; }
};
const pisz = (lista) => {
  try { localStorage.setItem(KLUCZ, JSON.stringify(lista)); } catch { /* bez zapisu */ }
  window.dispatchEvent(new Event(ZDARZENIE_ROBOCZE));
};

export const wersjeRobocze = (pesel) => czytaj().filter((r) => r.pesel === pesel).sort((a, b) => (a.zapisano < b.zapisano ? 1 : -1));
export const wersjaRobocza = (pesel, symbol) => czytaj().find((r) => r.pesel === pesel && r.symbol === symbol) || null;

export function zapiszWersjeRobocza(pesel, def, dane, postep) {
  const wpis = {
    pesel,
    symbol: def.symbol,
    nazwa: def.tytul,
    dane,
    gotowe: postep.gotowe,
    wszystkie: postep.wszystkie,
    zapisano: new Date().toISOString(),
  };
  pisz([wpis, ...czytaj().filter((r) => !(r.pesel === pesel && r.symbol === def.symbol))]);
  return wpis;
}

export function usunWersjeRobocza(pesel, symbol) {
  pisz(czytaj().filter((r) => !(r.pesel === pesel && r.symbol === symbol)));
}

/** Adres, pod którym wracasz do wniosku. */
export const linkDoWniosku = (symbol) =>
  symbol === "ZAM" ? "/przewodnik/swiadczenia/zasilek-macierzynski/wniosek" : `/przewodnik/wnioski/${symbol.toLowerCase()}`;

export const fmtZapisu = (iso) => new Date(iso).toLocaleString("pl-PL", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
