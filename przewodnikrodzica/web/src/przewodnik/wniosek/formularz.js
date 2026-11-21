// =====================================================================
// DEFINICJA WNIOSKU — uproszczony wzór na bazie ZUS ZAM (prototyp)
// =====================================================================
// Każde pole to jeden obiekt. Najważniejsze klucze:
//   widoczne(w, ctx)  -> czy pole w ogóle dotyczy tej osoby
//                        (jeśli NIE, pole jest wyszarzone „Nie dotyczy”
//                         i NIGDY nie jest wymagane)
//   wymagane          -> true / false / funkcja
//   waliduj(v, w, ctx)-> zwraca tekst błędu albo null
//   podpowiedz        -> tekst w dymku przewodnika (może być funkcją)
//   zalezyOd          -> od których pól zależy widoczność
// w   = wpisane wartości { idPola: wartość }
// ctx = { profil, zus, dzis }  (dane z mObywatela i ZUS)
// =====================================================================

export const dniMiedzy = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
export const dodajDni = (iso, n) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
export const fmtData = (iso) => (iso ? iso.split("-").reverse().join(".") : "");
export const zl = (n) =>
  n.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " zł";

const urodzenie = (w) => w.powod === "urodzenie";
const przyjecie = (w) => w.powod === "adopcja" || w.powod === "rodzina_zastepcza";
const urodzone = (w) => urodzenie(w) && w.urodzone === "tak";
const przedPorodem = (w) => urodzenie(w) && w.urodzone === "nie";
const pracodawcaWyplaca = (ctx) => !!ctx.zus?.ubezpieczenie?.platnikPowyzej20;

export const CZESCI = [
  { id: "rodzaj", tytul: "Rodzaj wniosku" },
  { id: "dane", tytul: "Twoje dane" },
  { id: "powod", tytul: "Kto składa i dlaczego" },
  { id: "dziecko", tytul: "Dziecko" },
  { id: "okres", tytul: "Okres i wysokość zasiłku" },
  { id: "wyplata", tytul: "Wypłata" },
  { id: "zalaczniki", tytul: "Załączniki" },
  { id: "oswiadczenia", tytul: "Oświadczenia" },
];

export const POLA = [
  // ---------- Część 1 ----------
  {
    id: "rodzaj", czesc: "rodzaj", typ: "radio", wymagane: true,
    etykieta: "Rodzaj wniosku",
    opcje: [
      { v: "pierwszorazowy", t: "Wniosek pierwszorazowy" },
      { v: "kontynuacja", t: "Wniosek o kontynuację świadczenia" },
    ],
    podpowiedz:
      "Składasz wniosek o zasiłek na to dziecko pierwszy raz? Zaznacz „pierwszorazowy”. „Kontynuację” wybierasz, gdy prosisz o dalszą część zasiłku, np. za urlop rodzicielski po macierzyńskim.",
  },

  // ---------- Część 2 ----------
  {
    id: "dane", czesc: "dane", typ: "potwierdz", wymagane: true,
    etykieta: "Dane osoby, która składa wniosek",
    komunikatPusty: "Sprawdź dane i kliknij „Dane są poprawne”.",
    podpowiedz:
      "Te dane pobraliśmy z mObywatela, więc nie musisz ich przepisywać. Sprawdź je i kliknij „Dane są poprawne”. Jeśli coś się nie zgadza (np. adres), trzeba to zmienić w urzędzie gminy — tutaj dane tylko odczytujemy.",
  },
  {
    id: "telefon", czesc: "dane", typ: "tekst", wymagane: false, inputMode: "tel",
    etykieta: "Numer telefonu",
    placeholder: "np. 600 100 200",
    podpowiedz:
      "Podaj, jeśli chcesz, żeby urzędnik mógł szybko zadzwonić, gdy czegoś zabraknie. To pole nie jest wymagane — możesz je spokojnie pominąć.",
    waliduj: (v) => (/^\+?[\d\s-]{9,15}$/.test(v) ? null : "Wpisz numer z 9 cyfr, np. 600 100 200."),
  },

  // ---------- Część 3 ----------
  {
    id: "kto", czesc: "powod", typ: "radio", wymagane: true,
    etykieta: "Kim jesteś dla dziecka?",
    opcje: [
      { v: "mama", t: "Mamą dziecka" },
      { v: "tata", t: "Tatą dziecka" },
      { v: "inna", t: "Inną osobą z najbliższej rodziny", opis: "Np. gdy mama nie może opiekować się dzieckiem." },
    ],
    podpowiedz:
      "Zasiłek macierzyński pobiera zwykle mama. Tata albo inna bliska osoba może go przejąć w określonych sytuacjach — np. gdy mama wykorzysta 14 tygodni i zrezygnuje z reszty albo jest w szpitalu.",
  },
  {
    id: "powod", czesc: "powod", typ: "radio", wymagane: true,
    etykieta: "Z jakiego powodu składasz wniosek?",
    opcje: [
      { v: "urodzenie", t: "Urodzenie dziecka" },
      { v: "adopcja", t: "Przyjęcie dziecka na wychowanie (adopcja)", opis: "Gdy złożono do sądu wniosek o przysposobienie." },
      { v: "rodzina_zastepcza", t: "Przyjęcie dziecka jako rodzina zastępcza" },
    ],
    podpowiedz:
      "Od tej odpowiedzi zależą dalsze pola. Pola, które Cię nie dotyczą, wyłączymy automatycznie — nie będziesz musiała ich wypełniać.",
  },

  // ---------- Część 4 ----------
  {
    id: "urodzone", czesc: "dziecko", typ: "radio", wymagane: true,
    etykieta: "Czy dziecko już się urodziło?",
    zalezyOd: ["powod"], widoczne: urodzenie,
    nieDotyczy: "Dotyczy tylko urodzenia dziecka.",
    opcje: [
      { v: "tak", t: "Tak, dziecko już jest" },
      { v: "nie", t: "Nie, jestem w ciąży" },
    ],
    podpowiedz:
      "Jeśli jesteś w ciąży, możesz złożyć wniosek już teraz. Mama może zacząć zasiłek najwcześniej 6 tygodni przed przewidywaną datą porodu.",
    waliduj: (v, w) =>
      v === "nie" && w.kto && w.kto !== "mama"
        ? "Przed porodem zasiłek może pobierać tylko mama. Zmień odpowiedź w polu „Kim jesteś dla dziecka?” albo zaznacz „Tak”."
        : null,
  },
  {
    id: "termin", czesc: "dziecko", typ: "data", wymagane: true,
    etykieta: "Przewidywana data porodu",
    zalezyOd: ["powod", "urodzone"], widoczne: przedPorodem,
    nieDotyczy: "Dotyczy tylko osoby, która jest w ciąży.",
    podpowiedz:
      "Wpisz datę z zaświadczenia od lekarza lub położnej. Od niej liczymy, od kiedy najwcześniej możesz zacząć zasiłek.",
    waliduj: (v, w, ctx) => (v < ctx.dzis ? "Przewidywana data porodu nie może być w przeszłości." : null),
  },
  {
    id: "dataUr", czesc: "dziecko", typ: "data", wymagane: true,
    etykieta: "Data urodzenia dziecka",
    zalezyOd: ["powod", "urodzone"], widoczne: (w) => urodzone(w) || przyjecie(w),
    nieDotyczy: "Dziecko jeszcze się nie urodziło.",
    podpowiedz: "Datę urodzenia znajdziesz w akcie urodzenia dziecka.",
    waliduj: (v, w, ctx) => (v > ctx.dzis ? "Data urodzenia nie może być z przyszłości." : null),
  },
  {
    id: "imieDziecka", czesc: "dziecko", typ: "tekst", wymagane: true,
    etykieta: "Imię i nazwisko dziecka",
    zalezyOd: ["powod", "urodzone"], widoczne: (w) => urodzone(w) || przyjecie(w),
    nieDotyczy: "Dziecko jeszcze się nie urodziło.",
    podpowiedz: "Wpisz imię i nazwisko dziecka tak, jak w akcie urodzenia.",
    waliduj: (v) => (v.trim().length < 3 ? "Wpisz imię i nazwisko." : null),
  },
  {
    id: "peselDziecka", czesc: "dziecko", typ: "pesel", wymagane: false,
    etykieta: "PESEL dziecka",
    zalezyOd: ["powod", "urodzone"], widoczne: (w) => urodzone(w) || przyjecie(w),
    nieDotyczy: "Dziecko jeszcze się nie urodziło.",
    podpowiedz:
      "PESEL nadaje urząd stanu cywilnego przy rejestracji urodzenia. Jeśli dziecko jeszcze go nie ma — pomiń, to pole nie jest wymagane.",
    waliduj: (v) => (/^\d{11}$/.test(v) ? null : "PESEL ma dokładnie 11 cyfr."),
  },
  {
    id: "dataPrzyjecia", czesc: "dziecko", typ: "data", wymagane: true,
    etykieta: "Data przyjęcia dziecka na wychowanie",
    zalezyOd: ["powod"], widoczne: przyjecie,
    nieDotyczy: "Dotyczy tylko adopcji i rodziny zastępczej.",
    podpowiedz: "Dzień, w którym dziecko zamieszkało z Tobą. Znajdziesz go w dokumentach z sądu lub ośrodka.",
  },
  {
    id: "liczbaDzieci", czesc: "dziecko", typ: "select", wymagane: true,
    etykieta: "Ile dzieci urodziło się (lub ma się urodzić) przy jednym porodzie?",
    zalezyOd: ["powod"], widoczne: urodzenie,
    nieDotyczy: "Dotyczy tylko urodzenia dziecka.",
    opcje: [
      { v: "1", t: "1 dziecko" },
      { v: "2", t: "2 dzieci (bliźnięta)" },
      { v: "3", t: "3 dzieci" },
      { v: "4", t: "4 dzieci" },
      { v: "5", t: "5 i więcej" },
    ],
    podpowiedz:
      "Od tego zależy długość zasiłku: 1 dziecko — 20 tygodni, bliźnięta — 31, trojaczki — 33, czworaczki — 35, pięcioro i więcej — 37 tygodni.",
  },

  // ---------- Część 5 ----------
  {
    id: "odKiedy", czesc: "okres", typ: "data", wymagane: true,
    etykieta: "Od kiedy chcesz dostawać zasiłek?",
    zalezyOd: ["powod"], widoczne: (w) => !!w.powod,
    podpowiedz: (w) =>
      przedPorodem(w)
        ? "Zwykle jest to dzień porodu. Możesz zacząć wcześniej — najwcześniej 6 tygodni przed przewidywaną datą porodu" +
          (w.termin ? `, czyli od ${fmtData(dodajDni(w.termin, -42))}.` : ".")
        : przyjecie(w)
          ? "Zwykle jest to dzień przyjęcia dziecka na wychowanie."
          : "Jeśli nie zaczęłaś zasiłku przed porodem, wpisz datę porodu.",
    waliduj: (v, w) => {
      if (przedPorodem(w) && w.termin && v < dodajDni(w.termin, -42))
        return `Najwcześniej możesz zacząć 6 tygodni przed porodem, czyli od ${fmtData(dodajDni(w.termin, -42))}.`;
      if (urodzone(w) && w.dataUr && v > w.dataUr)
        return `Po porodzie zasiłek zaczyna się w dniu porodu: ${fmtData(w.dataUr)}.`;
      if (przyjecie(w) && w.dataPrzyjecia && v < w.dataPrzyjecia)
        return "Zasiłek nie może zacząć się przed dniem przyjęcia dziecka.";
      return null;
    },
  },
  {
    id: "wariant", czesc: "okres", typ: "radio", wymagane: true,
    etykieta: "Jak chcesz dostawać zasiłek?",
    zalezyOd: ["powod"], widoczne: (w) => !!w.powod,
    opcje: [
      {
        v: "815", t: "81,5% przez cały czas — od razu razem z urlopem rodzicielskim",
        opis: "Jeden wniosek na macierzyński i rodzicielski. Co miesiąc ta sama kwota.",
        wylaczona: (w, ctx) =>
          urodzone(w) && w.dataUr && dniMiedzy(w.dataUr, ctx.dzis) > 21
            ? "Minęło więcej niż 21 dni od porodu — ten wariant nie jest już dostępny."
            : null,
      },
      {
        v: "100", t: "100% za urlop macierzyński, o rodzicielskim zdecyduję później",
        opis: "Za urlop rodzicielski dostaniesz potem 70%.",
      },
    ],
    podpowiedz: (w, ctx) => {
      const p = ctx.zus?.podstawaWymiaru;
      const kw = p
        ? ` Dla Ciebie orientacyjnie (brutto, miesięcznie): 81,5% ≈ ${zl(p * 0.815)}; albo 100% ≈ ${zl(p)}, a potem 70% ≈ ${zl(p * 0.7)}.`
        : "";
      return "Wariant 81,5% musisz wybrać najpóźniej 21 dni po porodzie." + kw + " Nie wiesz, co wybrać? Porównaj oba w Kalkulatorze.";
    },
  },
  {
    id: "praca", czesc: "okres", typ: "radio", wymagane: true,
    etykieta: "Czy w czasie urlopu rodzicielskiego chcesz pracować na część etatu?",
    zalezyOd: ["wariant"], widoczne: (w) => w.wariant === "815",
    nieDotyczy: "Dotyczy tylko wariantu z urlopem rodzicielskim od razu.",
    opcje: [
      { v: "nie", t: "Nie" },
      { v: "tak", t: "Tak, do połowy etatu" },
    ],
    podpowiedz:
      "Urlop rodzicielski możesz łączyć z pracą do połowy etatu. Zasiłek będzie wtedy niższy, a urlop dłuższy. Jeśli nie wiesz, zaznacz „Nie” — możesz to zmienić później.",
  },
  {
    id: "wymiar", czesc: "okres", typ: "select", wymagane: true,
    etykieta: "W jakim wymiarze etatu chcesz pracować?",
    zalezyOd: ["praca"], widoczne: (w) => w.wariant === "815" && w.praca === "tak",
    nieDotyczy: "Dotyczy tylko łączenia urlopu z pracą.",
    opcje: [
      { v: "1/8", t: "1/8 etatu" },
      { v: "1/4", t: "1/4 etatu" },
      { v: "3/8", t: "3/8 etatu" },
      { v: "1/2", t: "1/2 etatu" },
    ],
    podpowiedz: "Wybierz, ile chcesz pracować. Maksymalnie pół etatu.",
  },

  // ---------- Część 6 ----------
  {
    id: "sposob", czesc: "wyplata", typ: "radio", wymagane: true,
    etykieta: "Jak chcesz dostawać pieniądze?",
    widoczne: (w, ctx) => !pracodawcaWyplaca(ctx),
    nieDotyczy: (w, ctx) =>
      `Zasiłek wypłaci Twój pracodawca (${ctx.zus?.ubezpieczenie?.platnik || "płatnik składek"}), bo zgłasza do ubezpieczenia ponad 20 osób. Nie musisz podawać konta.`,
    opcje: [
      { v: "konto", t: "Na konto w banku" },
      { v: "poczta", t: "Przekazem pocztowym na adres zamieszkania" },
    ],
    podpowiedz: "Najszybciej i najwygodniej jest na konto.",
  },
  {
    id: "iban", czesc: "wyplata", typ: "tekst", wymagane: true, inputMode: "numeric",
    etykieta: "Numer konta (26 cyfr)",
    placeholder: "00 0000 0000 0000 0000 0000 0000",
    zalezyOd: ["sposob"], widoczne: (w, ctx) => !pracodawcaWyplaca(ctx) && w.sposob === "konto",
    nieDotyczy: (w, ctx) => (pracodawcaWyplaca(ctx) ? "Zasiłek wypłaci pracodawca." : "Wybrano wypłatę przekazem pocztowym."),
    podpowiedz: "Numer konta znajdziesz w aplikacji banku. Konto musi należeć do Ciebie.",
    waliduj: (v) => (v.replace(/\D/g, "").length === 26 ? null : "Numer konta ma 26 cyfr."),
  },

  // ---------- Część 7 ----------
  {
    id: "akt", czesc: "zalaczniki", typ: "radio", wymagane: true,
    etykieta: "Potwierdzenie urodzenia dziecka",
    zalezyOd: ["powod", "urodzone"], widoczne: urodzone,
    nieDotyczy: (w) => (przedPorodem(w) ? "Dziecko jeszcze się nie urodziło." : "Dotyczy tylko urodzenia dziecka."),
    opcje: [
      { v: "rejestr", t: "ZUS sprawdzi urodzenie w rejestrze (symulacja)" },
      { v: "plik", t: "Dołączę skrócony odpis aktu urodzenia" },
    ],
    podpowiedz: "Najprościej, jeśli dane o urodzeniu pobierzemy z rejestru. W prototypie to symulacja.",
  },
  {
    id: "plikAkt", czesc: "zalaczniki", typ: "plik", wymagane: true,
    etykieta: "Skrócony odpis aktu urodzenia",
    zalezyOd: ["akt"], widoczne: (w) => urodzone(w) && w.akt === "plik",
    nieDotyczy: "Nie trzeba — dane sprawdzimy w rejestrze.",
    podpowiedz: "Wybierz plik (zdjęcie lub PDF). W prototypie nic nie jest wysyłane — zapamiętujemy tylko nazwę pliku.",
  },
  {
    id: "zaswiadczenie", czesc: "zalaczniki", typ: "plik", wymagane: true,
    etykieta: "Zaświadczenie lekarskie o przewidywanej dacie porodu",
    zalezyOd: ["powod", "urodzone"], widoczne: przedPorodem,
    nieDotyczy: "Dotyczy tylko wniosku złożonego przed porodem.",
    podpowiedz: "Dostajesz je od lekarza lub położnej. W prototypie wybierz dowolny plik — nic nie jest wysyłane.",
  },
  {
    id: "dokSad", czesc: "zalaczniki", typ: "plik", wymagane: true,
    etykieta: "Dokument z sądu lub ośrodka o przyjęciu dziecka",
    zalezyOd: ["powod"], widoczne: przyjecie,
    nieDotyczy: "Dotyczy tylko adopcji i rodziny zastępczej.",
    podpowiedz: "Np. zaświadczenie o wszczęciu postępowania o przysposobienie albo postanowienie o umieszczeniu dziecka w rodzinie zastępczej.",
  },

  // ---------- Część 8 ----------
  {
    id: "pouczenie", czesc: "oswiadczenia", typ: "zgoda", wymagane: true,
    etykieta: "Zapoznałam się / zapoznałem się z pouczeniem",
    komunikatPusty: "Przeczytaj pouczenie i zaznacz pole.",
    tresc:
      "Musisz poinformować ZUS lub pracodawcę o zmianach, które mają wpływ na prawo do zasiłku — np. o podjęciu pracy w czasie urlopu macierzyńskiego. Zasiłek pobrany w okresie, za który Ci nie przysługiwał, trzeba będzie zwrócić.",
    podpowiedz: "Rozwiń pouczenie, przeczytaj je i zaznacz pole. To ostatni krok przed sprawdzeniem wniosku.",
  },
];

// Numery pól jak na papierowym formularzu (stałe, niezależne od widoczności)
POLA.forEach((p, i) => (p.nr = i + 1));

export const tekstPodpowiedzi = (pole, w, ctx) =>
  typeof pole.podpowiedz === "function" ? pole.podpowiedz(w, ctx) : pole.podpowiedz;

export const tekstNieDotyczy = (pole, w, ctx) =>
  typeof pole.nieDotyczy === "function" ? pole.nieDotyczy(w, ctx) : pole.nieDotyczy || "Nie dotyczy.";
