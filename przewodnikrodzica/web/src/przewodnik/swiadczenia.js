// Lista świadczeń i pomocy — wspólna dla strony „Wsparcie” i menu rozwijanego.
// status(sytuacja, ankieta) zwraca [klasa, tekst] znaczka.
export const SWIADCZENIA = [
  {
    id: "zasilek-macierzynski", nazwa: "Zasiłek macierzyński", ikona: "dokument",
    opis: "Pieniądze za czas urlopu macierzyńskiego, rodzicielskiego i ojcowskiego.",
    status: (s) => (s.swiadczenie === "zasilek" ? ["ok", "Przysługuje Ci"] : s.swiadczenie === "rodzicielskie" ? ["szary", "Nie przysługuje — brak ubezpieczenia chorobowego"] : ["uwaga", "Sprawdź"]),
  },
  {
    id: "chorobowy-ciaza", nazwa: "Zasiłek chorobowy w ciąży", ikona: "dokument",
    opis: "100% podstawy, gdy lekarz wystawi zwolnienie z kodem B. Przy umowie o pracę po 30 dniach ubezpieczenia, przy dobrowolnym po 90.",
    status: (s, a) => (a.rola !== "mama" ? ["szary", "Dotyczy mamy"] : s.chorobowe ? ["ok", "Przysługuje Ci"] : ["szary", "Wymaga ubezpieczenia chorobowego"]),
  },
  {
    id: "swiadczenie-rehabilitacyjne", nazwa: "Świadczenie rehabilitacyjne", ikona: "serce",
    opis: "Gdy skończy się zasiłek chorobowy (w ciąży po 270 dniach), a lekarz orzecznik ZUS uzna, że dalsze leczenie przywróci Ci zdolność do pracy. Do 12 miesięcy: 90% podstawy przez 3 miesiące, potem 75% — a w ciąży 100%. Wniosek ZNp-7 składasz w ZUS.",
    status: (s) => (s.chorobowe ? ["info", "Gdy wyczerpiesz zasiłek chorobowy"] : ["szary", "Wymaga ubezpieczenia chorobowego"]),
  },
  {
    id: "zasilek-wysokosc-macierzynskiego", nazwa: "Zasiłek w wysokości zasiłku macierzyńskiego", ikona: "dokument",
    opis: "Gdy w ciąży straciłaś pracę, bo pracodawca ogłosił upadłość, jest likwidowany albo zmarł. Dostajesz go od dnia po rozwiązaniu umowy do dnia porodu — potem przysługuje zasiłek macierzyński. Wypłaca ZUS, wniosek ZAS-55.",
    status: (s, a) => (a.rola && a.rola !== "mama" ? ["szary", "Dotyczy mamy w ciąży"] : a.ustanie?.powod === "upadlosc" ? ["ok", "Może Ci przysługiwać"] : ["info", "Gdy stracisz pracę przez upadłość lub likwidację"]),
  },
  {
    id: "urlop-rodzicielski", nazwa: "Urlop rodzicielski", ikona: "zegar",
    opis: "41 tygodni do podziału między rodziców (43 przy wieloraczkach). 9 tygodni jest tylko dla każdego z rodziców — jeśli korzysta jedno, ma 32 tygodnie (34).",
    status: (s) => (s.chorobowe ? ["ok", "Przysługuje Ci"] : ["szary", "Wymaga ubezpieczenia chorobowego"]),
  },
  {
    id: "urlop-ojcowski", nazwa: "Urlop ojcowski", ikona: "zegar",
    opis: "2 tygodnie dla taty do 1. urodzin dziecka. Zasiłek: 100% podstawy.",
    status: (s, a) => (a.rola === "tata" ? (s.chorobowe ? ["ok", "Przysługuje Ci"] : ["szary", "Wymaga ubezpieczenia chorobowego"]) : ["info", "Dla taty"]),
  },
  {
    id: "swiadczenie-rodzicielskie", nazwa: "Świadczenie rodzicielskie", ikona: "info",
    opis: "Dla osób bez ubezpieczenia chorobowego. Wniosek składasz w urzędzie gminy lub miasta, nie w ZUS.",
    status: (s) => (s.swiadczenie === "rodzicielskie" ? ["ok", "Przysługuje Ci"] : ["szary", "Nie dotyczy — masz zasiłek"]),
  },
  {
    id: "800-plus", nazwa: "800+", ikona: "dokument",
    opis: "Na każde dziecko do 18. roku życia. Wniosek do 3 miesięcy od urodzenia daje wyrównanie od miesiąca narodzin.",
    status: () => ["ok", "Przysługuje Ci"],
  },
  {
    id: "zasilek-opiekunczy", nazwa: "Zasiłek opiekuńczy", ikona: "serce",
    opis: "Gdy opiekujesz się chorym dzieckiem. Do 60 dni w roku na dziecko do 14 lat.",
    status: (s) => (s.chorobowe ? ["info", "Na później"] : ["szary", "Wymaga ubezpieczenia chorobowego"]),
  },
];

// Każde świadczenie ma przewodnik (przewodniki.js) — czytać może każdy
SWIADCZENIA.forEach((s) => (s.link = `/przewodnik/swiadczenia/${s.id}`));

// Świadczenia z ubezpieczenia chorobowego — wstrzymane przy zaległości w składkach
export const WSTRZYMANE_PRZY_ZADLUZENIU = ["zasilek-macierzynski", "chorobowy-ciaza", "urlop-rodzicielski", "urlop-ojcowski", "zasilek-opiekunczy"];

export const POMOC = [
  { id: "kontakt-zus", nazwa: "Kontakt z ZUS", opis: "Centrum Obsługi Telefonicznej: 22 560 16 00 (dni robocze 7:00–18:00). E-wizytę umówisz w eZUS, mZUS albo mObywatelu.", ikona: "poczta" },
  { id: "mama-zus", nazwa: "Skrzynka mama@zus.pl", opis: "Napisz o swojej sprawie — pytania o zasiłki i formalności po narodzinach dziecka. Ogólne pytania: cot@zus.pl.", ikona: "poczta" },
  { id: "zusanna", nazwa: "Zapytaj ZUSannę", opis: "Asystentka w prawym dolnym rogu odpowie od razu — o terminy, kwoty i wnioski.", ikona: "dymek", akcja: "zusanna" },
  { id: "samouczek", nazwa: "Samouczek", opis: "Krótki pokaz, jak działa przewodnik i gdzie co znajdziesz.", ikona: "info", akcja: "samouczek" },
  { id: "ryzyka", nazwa: "Na co uważać", opis: "Kiedy możesz stracić świadczenie albo dostać mniej — i terminy, które przepadają.", ikona: "alert", link: "/przewodnik/ryzyka" },
  { id: "organizacje", nazwa: "Fundacje i hospicja perinatalne", opis: "Bezpłatne wsparcie po stracie dziecka, przy wcześniaku, poronieniu i ciężkiej chorobie dziecka.", ikona: "serce" },
  { id: "wsparcie-psychologiczne", nazwa: "Wsparcie psychologiczne", opis: "Kryzysowy telefon zaufania dla dorosłych: 116 123. Możesz też poprosić lekarza rodzinnego o skierowanie do psychologa.", ikona: "serce" },
];

// Organizacje non-profit, które bezpłatnie pomagają rodzicom w szczególnych sytuacjach.
// Lista przykładowa (sprawdzona w listopadzie 2026) — przed wdrożeniem uzgodnij ją z ZUS
// i aktualizuj w panelu administracyjnym.
export const ORGANIZACJE = [
  {
    sytuacja: "Wcześniak",
    nazwa: "Fundacja Wcześniak Rodzice-Rodzicom",
    opis: "Organizacja pożytku publicznego założona przez rodziców wcześniaka. Bezpłatna wypożyczalnia sprzętu (np. monitorów oddechu) i „Niezbędnik rodzica wcześniaka”.",
    link: "https://www.wczesniak.pl",
  },
  {
    sytuacja: "Ciężko chore dziecko",
    nazwa: "Fundacja Warszawskie Hospicjum dla Dzieci — hospicjum perinatalne",
    opis: "Opieka od diagnozy w ciąży, przez poród, po wsparcie w żałobie. Konsultacje psychologiczne dla rodziców są bezpłatne. Tel. 509 797 324.",
    link: "https://perinatalne.pl",
  },
  {
    sytuacja: "Ciężko chore dziecko",
    nazwa: "Fundacja Gajusz (Łódź)",
    opis: "Hospicjum perinatalne, domowe i stacjonarne dla dzieci — pomaga bezpłatnie. Tel. 722 003 003.",
  },
  {
    sytuacja: "Ciężko chore dziecko",
    nazwa: "Pomorze Dzieciom",
    opis: "Hospicjum domowe dla dzieci, hospicjum perinatalne i centrum wsparcia po stracie — pomoc bezpłatna.",
  },
  {
    sytuacja: "Poronienie i strata dziecka",
    nazwa: "Fundacja Przetrwać Cierpienie",
    opis: "Wspiera rodziców po poronieniu i stracie dziecka, informuje o ich prawach (np. do pochówku).",
  },
  {
    sytuacja: "Poronienie i strata dziecka",
    nazwa: "Fundacja Ernesta",
    opis: "Bezpłatna pomoc psychologiczna, prawna i medyczna dla rodziców po stracie dziecka.",
  },
  {
    sytuacja: "Lista hospicjów perinatalnych w Polsce",
    nazwa: "pacjent.gov.pl — wykaz hospicjów perinatalnych",
    opis: "Oficjalna lista placówek w każdym województwie, z adresami i telefonami.",
    link: "https://pacjent.gov.pl",
  },
];
