// Dane SYMULOWANE. Osoba jest zmyślona; PESEL ma celowo błędną cyfrę kontrolną,
// więc nie może należeć do prawdziwej osoby.

export const PROFIL_MOBYWATEL = {
  imie: "Anna",
  nazwisko: "Testowa",
  pesel: "92071512345",
  dataUrodzenia: "1992-07-15",
  obywatelstwo: "polskie",
  adres: "ul. Przykładowa 12/3, 85-001 Bydgoszcz",
};

// To, co "zwraca ZUS" po zalogowaniu (gdy backend /api/symulacja/zus nie działa)
export const DANE_ZUS_ZAPAS = {
  ubezpieczenie: {
    tytul: "umowa o pracę",
    od: "2021-03-01",
    chorobowe: "obowiązkowe",
    okresWyczekiwaniaSpelniony: true,
    platnik: "Przykładowa Firma sp. z o.o.",
    platnikPowyzej20: true,
  },
  podstawaWymiaru: 6904.7,
  eZLA: [
    { od: "2026-08-04", do: "2026-08-31", kod: "B" },
    { od: "2026-09-01", do: "2026-09-28", kod: "B" },
  ],
  zadluzenie: 0,
};

export const ETAPY = [
  { id: "planuje", ikona: "🌱", nazwa: "Planuję dziecko", powitanie: "Dobrze, że sprawdzasz wcześniej", podtytul: "Pokażemy, co warto zrobić, zanim zajdziesz w ciążę." },
  { id: "ciaza", ikona: "🤰", nazwa: "Jestem w ciąży", powitanie: "Gratulacje!", podtytul: "Przeprowadzimy Cię przez wszystko, co Ci przysługuje." },
  { id: "dziecko", ikona: "👶", nazwa: "Dziecko już jest", powitanie: "Witaj wśród rodziców!", podtytul: "Zadbamy, żeby żaden termin Ci nie umknął." },
  { id: "adopcja", ikona: "🏡", nazwa: "Adopcja lub rodzina zastępcza", powitanie: "Witaj w rodzinie!", podtytul: "Pokażemy, jakie urlopy i zasiłki Ci przysługują." },
  { id: "trudna", ikona: "🤍", nazwa: "Przeżywam trudną sytuację", powitanie: "Jesteśmy tu, żeby pomóc", podtytul: "Zajmiemy się formalnościami krok po kroku, w Twoim tempie." },
];

// Slajdy przewodnika powitalnego (po wyborze etapu)
export const SLAJDY = [
  { id: "dane", ikona: "🗂️", tytul: "Twoje dane z ZUS", tekst: "Tu widzisz, czy masz ubezpieczenie chorobowe i od jakiej kwoty liczymy zasiłek.", mini: "Ubezpieczenie chorobowe ✓" },
  { id: "sciezka", ikona: "🗓️", tytul: "Twoja ścieżka", tekst: "Oś czasu z terminami — nie przegapisz np. 21 dni na wniosek o zasiłek 81,5%.", mini: "Do 21 dni po porodzie: wniosek" },
  { id: "kalkulator", ikona: "🧮", tytul: "Kalkulator", tekst: "Sprawdź, ile i jak długo dostaniesz — dla mamy, taty albo obojga.", mini: "5 627 zł / miesiąc" },
  { id: "swiadczenia", ikona: "📚", tytul: "Świadczenia", tekst: "Każde świadczenie opisane prostym językiem, z informacją, czy Ci przysługuje.", mini: "Urlop rodzicielski — przysługuje" },
  { id: "wniosek", ikona: "✍️", tytul: "Złóż wniosek", tekst: "Poprowadzimy Cię przez formularz pole po polu. Dane z mObywatela wpiszemy za Ciebie.", mini: "[ Złóż wniosek ]" },
  { id: "sprawy", ikona: "📬", tytul: "Moje sprawy", tekst: "Tu sprawdzisz, co wysłałaś i na jakim etapie jest sprawa.", mini: "Wniosek ZAM — w trakcie" },
  { id: "pomoc", ikona: "❓", tytul: "Pomoc zawsze pod ?", tekst: "Ten przewodnik, słowniczek i kontakt z ZUS znajdziesz pod ikoną ? w prawym górnym rogu.", mini: "?" },
];
