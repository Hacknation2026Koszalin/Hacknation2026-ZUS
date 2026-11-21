// Struktura serwisu wzorowana na układzie zus.pl (stan: listopad 2026).
// Każda pozycja ma "slug" -> adres podstrony /:sekcja/:slug.
// Treści podstron to wydmuszki — doklejamy tylko "Przewodnik młodego rodzica".

const slug = (tekst) =>
  tekst
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const sekcja = (nazwa, pozycje) => ({
  nazwa,
  slug: slug(nazwa),
  pozycje: pozycje.map((p) => ({ nazwa: p, slug: slug(p) })),
});

export const MENU = [
  sekcja("Świadczenia", [
    "Emerytury",
    "Kapitał początkowy",
    "Renty",
    "Świadczenia z tytułu wypadków oraz chorób zawodowych",
    "Świadczenia przedemerytalne",
    "Świadczenia dla rodzin",
    "Zasiłki",
    "Zasiłki dla osób pracujących / zamieszkałych za granicą",
    "Prewencja i rehabilitacja",
    "Inne świadczenia z ZUS",
  ]),
  sekcja("Firmy", [
    "Rodzaje ubezpieczeń",
    "Zgłoszenie płatnika / firmy",
    "Wyrejestrowanie płatnika / firmy",
    "Zmiana / korekta danych",
    "Rozliczenia z ZUS",
    "Ulgi / umorzenia",
    "Sposób przekazywania dokumentów",
    "Program Płatnik",
    "Kontrola",
  ]),
  sekcja("Pracujący", [
    "System ubezpieczeń społecznych w Polsce",
    "Ubezpieczenie zdrowotne w Polsce",
    "Nianie",
    "Osobista opieka nad dzieckiem",
    "Twoje konto w ZUS",
    "Pracujący w UE, EOG, Szwajcarii",
    "Elektroniczne zwolnienia lekarskie (e-ZLA)",
  ]),
  sekcja("Lekarze", [
    "Zaświadczenia ZUS ZLA",
    "Wzory formularzy",
    "Orzekanie o niezdolności do pracy",
    "Publikacje",
    "Szkolenia",
  ]),
  sekcja("Wzory formularzy", [
    "Najpopularniejsze",
    "Emerytury, renty",
    "Zasiłki",
    "Kapitał początkowy",
    "Pracujący",
    "Firmy",
    "Wnioski i zaświadczenia lekarskie",
    "Pełnomocnictwo",
  ]),
  sekcja("Baza wiedzy", [
    "Katalog usług",
    "Składki, wskaźniki, odsetki",
    "Statystyka",
    "Biblioteka",
    "O portalu eZUS",
    "Słownik",
    "Edukacja",
  ]),
  sekcja("O ZUS", [
    "Aktualności",
    "Komunikaty",
    "O nas",
    "Kontakt",
    "Dla mediów",
    "Praca w ZUS",
  ]),
];

// Kafelki "Najczęściej szukane" na stronie głównej
export const NAJCZESCIEJ = [
  { tytul: "Zasiłek macierzyński", opis: "Kto może go dostać i jak złożyć wniosek", do: "/przewodnik" },
  { tytul: "Zasiłek chorobowy", opis: "Zwolnienie lekarskie, także w ciąży", do: "/swiadczenia/zasilki" },
  { tytul: "Świadczenia dla rodzin", opis: "800 plus, Dobry Start, Aktywny Rodzic", do: "/swiadczenia/swiadczenia-dla-rodzin" },
  { tytul: "Emerytury", opis: "Warunki i wysokość emerytury", do: "/swiadczenia/emerytury" },
  { tytul: "Wzory formularzy", opis: "Wnioski do pobrania i wypełnienia", do: "/wzory-formularzy/najpopularniejsze" },
  { tytul: "e-ZLA", opis: "Elektroniczne zwolnienia lekarskie", do: "/pracujacy/elektroniczne-zwolnienia-lekarskie-e-zla" },
];

// Kafelki "Załatw sprawę"
export const ZALATW = [
  { tytul: "Zaloguj do eZUS", opis: "Twoje konto, wnioski i wiadomości", do: "/logowanie", ikona: "🔐" },
  { tytul: "Zarezerwuj e-wizytę", opis: "Rozmowa z pracownikiem przez internet", do: "/o-zus/kontakt", ikona: "🎥" },
  { tytul: "Zadzwoń do nas", opis: "Centrum Obsługi Telefonicznej", do: "/o-zus/kontakt", ikona: "📞" },
  { tytul: "Znajdź placówkę", opis: "Oddziały i inspektoraty", do: "/o-zus/kontakt", ikona: "📍" },
];

export const STOPKA = [
  { naglowek: "Na skróty", linki: [["Wzory formularzy", "/wzory-formularzy/najpopularniejsze"], ["Katalog usług", "/baza-wiedzy/katalog-uslug"], ["Słownik", "/baza-wiedzy/slownik"]] },
  { naglowek: "O ZUS", linki: [["Aktualności", "/o-zus/aktualnosci"], ["O nas", "/o-zus/o-nas"], ["Praca w ZUS", "/o-zus/praca-w-zus"]] },
  { naglowek: "Kontakt", linki: [["Kontakt", "/o-zus/kontakt"], ["Dla mediów", "/o-zus/dla-mediow"]] },
  { naglowek: "Dla rodziców", linki: [["Przewodnik młodego rodzica", "/przewodnik"], ["Zasiłki", "/swiadczenia/zasilki"], ["Świadczenia dla rodzin", "/swiadczenia/swiadczenia-dla-rodzin"]] },
];

// Gdy backend /api/aktualnosci nie odpowiada, pokazujemy to:
export const AKTUALNOSCI_ZAPAS = [
  { id: 1, data: "2026-11-21", tytul: "Nowy Przewodnik młodego rodzica", lead: "Sprawdź, jakie świadczenia Ci przysługują w ciąży i po porodzie." },
  { id: 2, data: "2026-10-24", tytul: "Zmiany we wnioskach o zasiłek macierzyński", lead: "Wnioski ZUR i ZAO połączono z wnioskiem ZAM." },
  { id: 3, data: "2026-10-01", tytul: "Zarezerwuj wizytę w placówce", lead: "Przyjdź na wybraną godzinę bez czekania w kolejce." },
];

export const znajdzPozycje = (sekcjaSlug, pozycjaSlug) => {
  const s = MENU.find((m) => m.slug === sekcjaSlug);
  return { sekcja: s, pozycja: s?.pozycje.find((p) => p.slug === pozycjaSlug) };
};
