// =====================================================================
// Terminy rodzica liczone z karty ciąży (termin porodu) i dzisiejszej daty.
// waga: "krytyczny" = nieprzekraczalny termin (po nim coś tracisz)
//       "szansa"    = od tego dnia możesz coś zrobić
//       "info"      = warto wiedzieć
// =====================================================================
const DZIEN = 86400000;
export const dzisISO = () => new Date().toISOString().slice(0, 10);
export const dodajDni = (iso, n) => new Date(new Date(iso).getTime() + n * DZIEN).toISOString().slice(0, 10);
export const dodajMiesiace = (iso, n) => {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.toISOString().slice(0, 10);
};
export const ileDni = (od, doDnia) => Math.round((new Date(doDnia) - new Date(od)) / DZIEN);
export const fmtDzien = (iso, opcje = { day: "numeric", month: "long", year: "numeric" }) =>
  new Date(iso).toLocaleDateString("pl-PL", opcje);

export function tydzienCiazy(karta, dzis = dzisISO()) {
  const dni = ileDni(karta.ostatniaMiesiaczka, dzis);
  return { tydzien: Math.floor(dni / 7), dzien: dni % 7, procent: Math.min(100, Math.max(0, (dni / 280) * 100)) };
}

export function policzTerminy(karta, dzis = dzisISO()) {
  const T = karta.terminPorodu;
  const lista = [
    { data: dzis, tytul: "Dziś", typ: "dzis" },
    {
      data: karta.nastepnaWizyta, tytul: "Wizyta u ginekologa", opis: "Następna kontrola według karty ciąży.",
      waga: "info", link: "/przewodnik/karta-ciazy", akcja: "Karta ciąży",
    },
    {
      data: dodajDni(T, -42), tytul: "Możesz zacząć urlop macierzyński",
      opis: "Najwcześniej 6 tygodni przed terminem porodu. Wniosek złożysz już teraz.",
      waga: "szansa", link: "/przewodnik/swiadczenia/zasilek-macierzynski", akcja: "Zobacz zasiłek",
    },
    {
      data: dodajDni(T, -35), doData: dodajDni(T, -21), tytul: "Wymaz GBS (35.–37. tydzień)",
      opis: "Badanie z karty ciąży — umów je z wyprzedzeniem.", waga: "info",
    },
    { data: T, tytul: "Przewidywany termin porodu", opis: "Według karty ciąży.", waga: "porod" },
    {
      data: dodajDni(T, 21), tytul: "Zgłoś urodzenie dziecka w USC",
      opis: "Masz na to 21 dni od porodu. Wtedy dziecko dostanie PESEL.", waga: "krytyczny", poPorodzie: true,
    },
    {
      data: dodajDni(T, 21), tytul: "Ostatni dzień na wniosek o zasiłek 81,5%",
      opis: "Po tym dniu wariant 81,5% przez cały rok przepada.", waga: "krytyczny", poPorodzie: true,
      link: "/przewodnik/swiadczenia/zasilek-macierzynski/wniosek", akcja: "Złóż wniosek",
    },
    {
      data: dodajMiesiace(T, 3), tytul: "Wniosek o 800+ z wyrównaniem",
      opis: "Złożysz go do 3 miesięcy od urodzenia — dostaniesz pieniądze od miesiąca narodzin.", waga: "krytyczny", poPorodzie: true,
    },
    {
      data: dodajDni(T, 140), tytul: "Koniec urlopu macierzyńskiego",
      opis: "20 tygodni od porodu. Potem urlop rodzicielski.", waga: "info", poPorodzie: true,
    },
    {
      data: dodajMiesiace(T, 12), tytul: "Ostatni dzień na urlop ojcowski",
      opis: "Tata ma 2 tygodnie do wykorzystania do 1. urodzin dziecka.", waga: "info", poPorodzie: true,
    },
  ];
  return lista
    .sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : a.typ === "dzis" ? -1 : 1))
    .map((t) => {
      const za = ileDni(dzis, t.data);
      const minelo = t.typ !== "dzis" && ileDni(dzis, t.doData || t.data) < 0;
      const pilne = !minelo && t.typ !== "dzis" && za <= 30;
      return { ...t, za, minelo, pilne };
    });
}

export const opisZa = (za) =>
  za === 0 ? "dziś" : za === 1 ? "jutro" : za < 0 ? `${-za} dni temu` : za < 100 ? `za ${za} dni` : `za ${Math.round(za / 30.4)} mies.`;
