// =====================================================================
// Klocki powtarzające się w formularzach ZUS (dane osoby, płatnik,
// telefon, rachunek, oświadczenie, dziecko, sposób odbioru odpowiedzi).
// Każdy klocek to funkcja — zwraca NOWY obiekt pola, bo numery pól
// nadajemy osobno w każdym formularzu.
// =====================================================================
import { fmtData } from "../formularz.js";

export const dzis = () => new Date().toISOString().slice(0, 10);
export const nieZPrzyszlosci = (v, w, ctx) => (v > ctx.dzis ? "Ta data nie może być z przyszłości." : null);
export const min3 = (v) => (String(v).trim().length < 3 ? "Wpisz co najmniej 3 znaki." : null);
export const iban26 = (v) => (v.replace(/\D/g, "").length === 26 ? null : "Numer konta w Polsce ma 26 cyfr.");
export const wiek = (ctx) => {
  const ur = ctx.profil?.dataUrodzenia;
  if (!ur) return null;
  const [r, m, d] = ur.split("-").map(Number);
  const [R, M, D] = ctx.dzis.split("-").map(Number);
  return R - r - (M < m || (M === m && D < d) ? 1 : 0);
};

/** Nadaje numery pól jak na papierowym formularzu. */
export function zdefiniuj(def) {
  def.pola.forEach((p, i) => (p.nr = i + 1));
  return def;
}

export const poleDane = (czesc = "dane") => ({
  id: "dane", czesc, typ: "potwierdz", wymagane: true,
  etykieta: "Twoje dane",
  komunikatPusty: "Sprawdź dane i kliknij „Dane są poprawne”.",
  podpowiedz:
    "Imię, nazwisko, PESEL i adres pobraliśmy z mObywatela — nie musisz ich przepisywać. Sprawdź je i kliknij „Dane są poprawne”.",
});

export const poleTelefon = (czesc = "dane") => ({
  id: "telefon", czesc, typ: "tekst", wymagane: false, inputMode: "tel",
  etykieta: "Numer telefonu",
  placeholder: "np. 600 100 200",
  podpowiedz: "Nieobowiązkowe. Jeśli podasz numer, urzędnik szybciej się z Tobą skontaktuje, gdy czegoś zabraknie.",
  waliduj: (v) => (/^\+?[\d\s-]{9,15}$/.test(v) ? null : "Wpisz numer z 9 cyfr, np. 600 100 200."),
});

export const polePlatnik = (czesc = "dane") => ({
  id: "platnik", czesc, typ: "potwierdz", wymagane: true,
  etykieta: "Dane płatnika składek (kto wypłaca zasiłek)",
  zrodlo: "Twoje konto w ZUS",
  wiersze: (ctx) => {
    const u = ctx.zus?.ubezpieczenie || {};
    return [
      ["Nazwa", u.platnik || "—"],
      ["NIP", u.nip || "526-000-12-34 (demo)", true],
      ["Tytuł ubezpieczenia", `${u.tytul || "—"}${u.od ? ` od ${fmtData(u.od)}` : ""}`],
    ];
  },
  podsumowanie: "Potwierdzone — dane płatnika z konta ZUS",
  komunikatPusty: "Sprawdź dane płatnika i kliknij „Dane są poprawne”.",
  podpowiedz:
    "Płatnik składek to zwykle Twój pracodawca albo zleceniodawca. Jeśli prowadzisz firmę — to Ty. Dane wzięliśmy z Twojego konta w ZUS.",
});

export const poleSposobWyplaty = (czesc = "wyplata", obowiazkowe = true) => ({
  id: "sposob", czesc, typ: "radio", wymagane: obowiazkowe,
  etykieta: "Jak chcesz dostać pieniądze?",
  opcje: [
    { v: "konto", t: "Na konto w banku", opis: "Najszybciej i najwygodniej." },
    { v: "poczta", t: "Przekazem pocztowym na adres zamieszkania" },
  ],
  podpowiedz: "Jeśli nie podasz konta, ZUS wyśle pieniądze przekazem pocztowym na Twój adres.",
});

export const poleIban = (czesc = "wyplata") => ({
  id: "iban", czesc, typ: "tekst", wymagane: true, inputMode: "numeric",
  etykieta: "Numer konta (26 cyfr)",
  placeholder: "00 0000 0000 0000 0000 0000 0000",
  zalezyOd: ["sposob"], widoczne: (w) => w.sposob === "konto",
  nieDotyczy: "Wybrano przekaz pocztowy.",
  podpowiedz: "Numer znajdziesz w aplikacji banku. Konto musi należeć do Ciebie.",
  waliduj: iban26,
});

export const poleOswiadczenie = (czesc = "oswiadczenia", tresc) => ({
  id: "oswiadczenie", czesc, typ: "zgoda", wymagane: true,
  etykieta: "Oświadczam, że dane są zgodne z prawdą",
  komunikatPusty: "Przeczytaj pouczenie i zaznacz pole.",
  tresc:
    tresc ||
    "Dane w formularzu muszą być zgodne z prawdą. Jeśli się zmienią, musisz poinformować o tym płatnika zasiłku (pracodawcę albo ZUS). Zasiłek pobrany bez prawa do niego trzeba zwrócić.",
  podpowiedz: "Rozwiń pouczenie, przeczytaj je i zaznacz pole. To ostatni krok przed sprawdzeniem formularza.",
});

export const polaDziecka = (czesc = "dziecko", { miejsce = true, pesel = false, widoczne } = {}) => [
  {
    id: "imieDziecka", czesc, typ: "tekst", wymagane: true, widoczne,
    etykieta: "Imię i nazwisko dziecka",
    podpowiedz: "Tak jak w akcie urodzenia. Jeśli dzieci jest więcej, kolejne wpiszesz niżej.",
    waliduj: min3,
  },
  {
    id: "dataUrDziecka", czesc, typ: "data", wymagane: true, widoczne,
    etykieta: "Data urodzenia dziecka",
    podpowiedz: (w, ctx) =>
      ctx.zSesji?.dataUr && w.dataUrDziecka === ctx.zSesji.dataUr
        ? "Wpisaliśmy datę, którą nam podałaś/podałeś — sprawdź, czy się zgadza."
        : "Datę znajdziesz w akcie urodzenia.",
    waliduj: nieZPrzyszlosci,
  },
  ...(miejsce
    ? [{
        id: "miejsceUrDziecka", czesc, typ: "tekst", wymagane: true, widoczne,
        etykieta: "Miejsce urodzenia dziecka",
        placeholder: "np. Bydgoszcz",
        podpowiedz: "Miejscowość z aktu urodzenia.",
        waliduj: (v) => (v.trim().length < 2 ? "Wpisz miejscowość." : null),
      }]
    : []),
  ...(pesel
    ? [{
        id: "peselDziecka", czesc, typ: "pesel", wymagane: false, widoczne,
        etykieta: "PESEL dziecka",
        podpowiedz: "Nieobowiązkowe, jeśli dziecko nie ma jeszcze numeru PESEL.",
        waliduj: (v) => (/^\d{11}$/.test(v) ? null : "PESEL ma dokładnie 11 cyfr."),
      }]
    : []),
  {
    id: "wiecejDzieci", czesc, typ: "obszar", wymagane: false, widoczne, wiersze: 3,
    etykieta: "Kolejne dzieci (jeśli dotyczy)",
    placeholder: "Imię i nazwisko, data i miejsce urodzenia — każde dziecko w nowej linii",
    podpowiedz: "Dotyczy np. bliźniąt albo rodzeństwa przyjętego razem. Jeśli to jedno dziecko — pomiń.",
  },
];

export const poleOdbior = (czesc = "odbior") => ({
  id: "odbior", czesc, typ: "radio", wymagane: true,
  etykieta: "Jak chcesz dostać odpowiedź?",
  opcje: [
    { v: "pue", t: "Na moim koncie w eZUS (PUE ZUS)", opis: "Najszybciej — dostaniesz powiadomienie." },
    { v: "poczta", t: "Pocztą na adres z formularza" },
    { v: "placowka", t: "Odbiorę w placówce ZUS (osobiście albo przez osobę upoważnioną)" },
  ],
  podpowiedz: "Najwygodniej na koncie w eZUS — odpowiedź zobaczysz tam od razu, bez czekania na list.",
});

export const poleOkres = (czesc, prefiks = "", { widoczne, zalezyOd, etykieta = "Za jaki okres?" } = {}) => [
  {
    id: `${prefiks}od`, czesc, typ: "data", wymagane: true, widoczne, zalezyOd,
    etykieta: `${etykieta} — od`,
    podpowiedz: "Pierwszy dzień okresu, którego dotyczy sprawa.",
  },
  {
    id: `${prefiks}do`, czesc, typ: "data", wymagane: true, widoczne, zalezyOd,
    etykieta: `${etykieta} — do`,
    podpowiedz: "Ostatni dzień okresu.",
    waliduj: (v, w) => (w[`${prefiks}od`] && v < w[`${prefiks}od`] ? "Data „do” nie może być wcześniejsza niż „od”." : null),
  },
];
