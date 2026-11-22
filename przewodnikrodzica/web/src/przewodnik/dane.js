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
    { od: "2026-11-09", do: "2026-12-06", kod: "B" },
  ],
  zadluzenie: 0,
};

export const ETAPY = [
  { id: "planuje", ikona: "🌱", nazwa: "Planuję dziecko", powitanie: "Dobrze, że sprawdzasz wcześniej", podtytul: "Pokażemy, co warto zrobić, zanim zajdziesz w ciążę." },
  { id: "ciaza", ikona: "🤰", nazwa: "Jestem w ciąży", powitanie: "Gratulacje!", podtytul: "Przeprowadzimy Cię przez wszystko, co Ci przysługuje.",
    nazwaTata: "Spodziewam się dziecka", podtytulTata: "Partnerka jest w ciąży. Pokażemy, co przysługuje Tobie jako tacie." },
  { id: "dziecko", ikona: "👶", nazwa: "Dziecko już się urodziło", powitanie: "Witaj wśród rodziców!", podtytul: "Zadbamy, żeby żaden termin po porodzie Ci nie umknął." },
  { id: "adopcja", ikona: "🏡", nazwa: "Adopcja lub rodzina zastępcza", powitanie: "Witaj w rodzinie!", podtytul: "Pokażemy, jakie urlopy i zasiłki Ci przysługują." },
  { id: "trudna", ikona: "🤍", nazwa: "Straciliśmy dziecko", powitanie: "Jesteśmy z Tobą", podtytul: "Poronienie lub martwe urodzenie. Pomożemy z urlopem i formalnościami, w Twoim tempie." },
];

// Slajdy przewodnika powitalnego (po wyborze etapu)
// Samouczek: każdy slajd ma zrzut ekranu z zaznaczonym miejscem (public/samouczek/*.png)
export const SLAJDY = [
  { id: "konto", krotko: "Konto", tytul: "Moje konto", gdzie: "Menu → Moje konto", obraz: "/samouczek/konto.png", tekst: "Na górze widzisz licznik do najbliższego kroku i to, co trzeba zrobić. Niżej — status zwolnienia lekarskiego i skróty." },
  { id: "sciezka", krotko: "Ścieżka", tytul: "Moja ścieżka", gdzie: "Menu → Moja ścieżka", obraz: "/samouczek/sciezka.png", tekst: "Oś czasu z terminami — nie przegapisz np. 21 dni na wniosek o zasiłek 81,5%. Odhaczaj, co już zrobione." },
  { id: "swiadczenia", krotko: "Świadczenia", tytul: "Świadczenia", gdzie: "Menu → Świadczenia", obraz: "/samouczek/swiadczenia.png", tekst: "Wszystkie świadczenia opisane prostym językiem — przy każdym widzisz, czy Ci przysługuje." },
  { id: "wniosek", krotko: "Wnioski", tytul: "Złóż wniosek", gdzie: "Menu → Złóż wniosek", obraz: "/samouczek/wnioski.png", tekst: "Wybierz formularz, a poprowadzimy Cię pole po polu. Podpowiemy też, czy składasz go u pracodawcy, czy w ZUS." },
  { id: "kalkulator", krotko: "Kalkulator", tytul: "Kalkulator", gdzie: "Menu → Kalkulator", obraz: "/samouczek/kalkulator.png", tekst: "Sprawdź, ile i jak długo dostaniesz — dla mamy, taty albo obojga, także przy pracy na część etatu." },
  { id: "sprawy", krotko: "Sprawy", tytul: "Moje sprawy", gdzie: "Menu → Moje sprawy", obraz: "/samouczek/sprawy.png", tekst: "Tu sprawdzisz, co wysłałaś/wysłałeś i na jakim etapie jest sprawa — u pracodawcy albo w ZUS." },
  { id: "ikony", krotko: "Ikony", tytul: "Ikony w nagłówku", gdzie: "Prawy górny róg", obraz: "/samouczek/ikony.png", tekst: "Czas do wylogowania, powiadomienia o terminach, ustawienia (np. zmiana daty), ten samouczek pod „?” i ułatwienia dostępu." },
  { id: "zusanna", krotko: "ZUSanna", tytul: "Zapytaj ZUSannę", gdzie: "Prawy dolny róg", obraz: "/samouczek/zusanna.png", tekst: "Masz pytanie? Napisz własnymi słowami — ZUSanna podpowie, a w razie potrzeby da kontakt do konsultanta." },
];
