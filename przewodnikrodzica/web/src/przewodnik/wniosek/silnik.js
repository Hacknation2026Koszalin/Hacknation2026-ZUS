// =====================================================================
// SILNIK WNIOSKU — reguły „co jest wymagane” w jednym miejscu
// =====================================================================
// Zasada 1: pole, które NIE dotyczy osoby (niewidoczne), nigdy nie jest wymagane.
// Zasada 2: pominięcie pola („Pomiń”) NIE zdejmuje wymagania —
//           wniosku nie da się wysłać, dopóki brakuje wymaganych pól.
// Zasada 3: przed wysłaniem usuwamy wartości pól, które przestały dotyczyć osoby
//           (np. ktoś wpisał numer konta, a potem wybrał przekaz pocztowy).
// =====================================================================
import { POLA, fmtData } from "./formularz.js";

export const pusty = (v) => v === undefined || v === null || v === "" || v === false || (Array.isArray(v) && v.length === 0);

export const czyWidoczne = (pole, w, ctx) => !pole.widoczne || pole.widoczne(w, ctx);

export const czyWymagane = (pole, w, ctx) =>
  czyWidoczne(pole, w, ctx) &&
  (typeof pole.wymagane === "function" ? pole.wymagane(w, ctx) : !!pole.wymagane);

/** Zwraca tekst błędu albo null. */
export function blad(pole, w, ctx) {
  if (!czyWidoczne(pole, w, ctx)) return null;
  const v = w[pole.id];
  if (pusty(v)) return czyWymagane(pole, w, ctx) ? pole.komunikatPusty || "To pole jest wymagane." : null;
  if (pole.opcje) {
    const o = pole.opcje.find((o) => o.v === v);
    const wyl = o?.wylaczona?.(w, ctx);
    if (wyl) return wyl;
  }
  return pole.waliduj ? pole.waliduj(v, w, ctx) : null;
}

// Każda funkcja przyjmuje listę pól danego formularza (domyślnie ZAM)
export const widocznePola = (w, ctx, pola = POLA) => pola.filter((p) => czyWidoczne(p, w, ctx));

/** Pola, które blokują wysłanie (wymagane i puste albo z błędem). */
export const braki = (w, ctx, pola = POLA) => widocznePola(w, ctx, pola).filter((p) => blad(p, w, ctx));

/** Czy wszystkie pola, od których zależy dane pole, mają już odpowiedź. */
// (pole nadrzędne, które samo „nie dotyczy”, też liczy się jako rozstrzygnięte)
export const zaleznosciUzupelnione = (pole, w, ctx, pola = POLA) =>
  (pole.zalezyOd || []).every((id) => {
    const nad = pola.find((p) => p.id === id);
    return !pusty(w[id]) || (nad && !czyWidoczne(nad, w, ctx));
  });

/** Usuwa wartości pól, które nie dotyczą osoby (powtarzamy, bo zależności bywają łańcuchowe). */
export function wyczysc(w, ctx, pola = POLA) {
  let wynik = { ...w };
  for (let i = 0; i < 5; i++) {
    const nowy = Object.fromEntries(
      Object.entries(wynik).filter(([id]) => {
        const p = pola.find((p) => p.id === id);
        return p && czyWidoczne(p, wynik, ctx);
      }),
    );
    if (Object.keys(nowy).length === Object.keys(wynik).length) return nowy;
    wynik = nowy;
  }
  return wynik;
}

/** Postęp: ile wymaganych pól jest poprawnie wypełnionych. */
export function postep(w, ctx, pola = POLA) {
  const wym = widocznePola(w, ctx, pola).filter((p) => czyWymagane(p, w, ctx));
  const ok = wym.filter((p) => !blad(p, w, ctx));
  return { gotowe: ok.length, wszystkie: wym.length };
}

/** Wartość pola w czytelnej postaci (do przeglądu i dla urzędnika). */
export function pokazWartosc(pole, v, profil) {
  if (pusty(v)) return "— (nie podano)";
  switch (pole.typ) {
    case "radio":
    case "select":
      return pole.opcje.find((o) => o.v === v)?.t || v;
    case "wielokrotny":
      return v.map((x) => pole.opcje.find((o) => o.v === x)?.t || x).join("; ");
    case "data":
      return fmtData(v);
    case "potwierdz":
      if (pole.podsumowanie) return pole.podsumowanie;
      return profil ? `Potwierdzone: ${profil.imie} ${profil.nazwisko}, PESEL ${profil.pesel}` : "Potwierdzone";
    case "zgoda":
      return "Tak";
    case "plik":
      return `Plik: ${v}`;
    default:
      return String(v);
  }
}
