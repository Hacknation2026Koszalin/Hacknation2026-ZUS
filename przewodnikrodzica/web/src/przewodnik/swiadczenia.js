// Lista świadczeń i pomocy — wspólna dla strony „Wsparcie” i menu rozwijanego.
// status(sytuacja, ankieta) zwraca [klasa, tekst] znaczka.
export const SWIADCZENIA = [
  {
    id: "zasilek-macierzynski", nazwa: "Zasiłek macierzyński", ikona: "dokument",
    opis: "Pieniądze za czas urlopu macierzyńskiego, rodzicielskiego i ojcowskiego.",
    link: "/przewodnik/swiadczenia/zasilek-macierzynski",
    status: (s) => (s.swiadczenie === "zasilek" ? ["ok", "Przysługuje Ci"] : s.swiadczenie === "rodzicielskie" ? ["szary", "Nie przysługuje — brak ubezpieczenia chorobowego"] : ["uwaga", "Sprawdź"]),
  },
  {
    id: "chorobowy-ciaza", nazwa: "Zasiłek chorobowy w ciąży", ikona: "dokument",
    opis: "100% podstawy, gdy lekarz wystawi zwolnienie z kodem B. Przy umowie o pracę po 30 dniach ubezpieczenia, przy dobrowolnym po 90.",
    status: (s, a) => (a.rola !== "mama" ? ["szary", "Dotyczy mamy"] : s.chorobowe ? ["ok", "Przysługuje Ci"] : ["szary", "Wymaga ubezpieczenia chorobowego"]),
  },
  {
    id: "urlop-rodzicielski", nazwa: "Urlop rodzicielski", ikona: "zegar",
    opis: "41 tygodni do podziału między rodziców (43 przy wieloraczkach). 9 tygodni jest tylko dla każdego z rodziców.",
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

// Świadczenia z ubezpieczenia chorobowego — wstrzymane przy zaległości w składkach
export const WSTRZYMANE_PRZY_ZADLUZENIU = ["zasilek-macierzynski", "chorobowy-ciaza", "urlop-rodzicielski", "urlop-ojcowski", "zasilek-opiekunczy"];

export const POMOC = [
  { id: "kontakt-zus", nazwa: "Kontakt z ZUS", opis: "Centrum Obsługi Telefonicznej: 22 560 16 00 (dni robocze 7:00–18:00). E-wizytę umówisz w eZUS, mZUS albo mObywatelu.", ikona: "poczta" },
  { id: "mama-zus", nazwa: "Skrzynka mama@zus.pl", opis: "Napisz o swojej sprawie — pytania o zasiłki i formalności po narodzinach dziecka. Ogólne pytania: cot@zus.pl.", ikona: "poczta" },
  { id: "zusanna", nazwa: "Zapytaj ZUSannę", opis: "Asystentka w prawym dolnym rogu odpowie od razu — o terminy, kwoty i wnioski.", ikona: "dymek", akcja: "zusanna" },
  { id: "samouczek", nazwa: "Samouczek", opis: "Krótki pokaz, jak działa przewodnik i gdzie co znajdziesz.", ikona: "info", akcja: "samouczek" },
  { id: "wsparcie-psychologiczne", nazwa: "Wsparcie psychologiczne", opis: "Kryzysowy telefon zaufania dla dorosłych: 116 123. Możesz też poprosić lekarza rodzinnego o skierowanie do psychologa.", ikona: "serce" },
];
