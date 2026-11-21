// =====================================================================
// PLAN RODZICA — oś czasu + lista rzeczy do zrobienia przy każdym kroku.
// Wszystkie daty liczone z terminu porodu z karty ciąży.
//   waga: "krytyczny" (po terminie coś tracisz) | "szansa" | "info" | "porod"
//   wniosek: true -> zadanie to złożenie wniosku (liczy się do odliczania w hero)
// =====================================================================
import { dodajDni, dodajMiesiace, dzisISO, ileDni } from "./terminy.js";

export function zbudujPlan(karta, dzis = dzisISO()) {
  const T = karta.terminPorodu;
  const kroki = [
    {
      id: "wizyta", faza: "W ciąży", data: karta.nastepnaWizyta, waga: "info",
      tytul: "Wizyta kontrolna u ginekologa",
      opis: "Dobry moment, żeby załatwić dokument potrzebny do wniosku.",
      zadania: [
        { id: "zaswiadczenie", t: "Poproś o zaświadczenie lekarskie o przewidywanej dacie porodu", info: "Dołączysz je do wniosku o zasiłek przed porodem." },
        { id: "gbs-umow", t: "Umów wymaz GBS na 35.–37. tydzień" },
      ],
    },
    {
      id: "urlop", faza: "W ciąży", data: dodajDni(T, -42), waga: "szansa",
      tytul: "Możesz zacząć urlop macierzyński",
      opis: "Najwcześniej 6 tygodni przed terminem porodu. Wniosek możesz złożyć już teraz.",
      zadania: [
        { id: "wariant", t: "Zdecyduj: 81,5% przez cały rok czy 100% + 70%", link: "/przewodnik/kalkulator", akcja: "Porównaj w kalkulatorze" },
        { id: "zam", t: "Złóż wniosek o zasiłek macierzyński", link: "/przewodnik/swiadczenia/zasilek-macierzynski/wniosek", akcja: "Złóż wniosek", wniosek: true, termin: dodajDni(T, 21), nazwaWniosku: "wniosek o zasiłek macierzyński 81,5%" },
        { id: "pracodawca", t: "Powiedz pracodawcy, od kiedy idziesz na urlop" },
      ],
    },
    {
      id: "gbs", faza: "W ciąży", data: dodajDni(T, -35), doData: dodajDni(T, -21), waga: "info",
      tytul: "Wymaz GBS i torba do szpitala",
      opis: "Ostatnie tygodnie przed porodem.",
      zadania: [
        { id: "gbs", t: "Zrób badanie GBS" },
        { id: "dokumenty", t: "Spakuj dokumenty: dowód osobisty, kartę ciąży, wyniki badań" },
      ],
    },
    {
      id: "porod", faza: "Poród", data: T, waga: "porod",
      tytul: "Przewidywany termin porodu",
      opis: "Po porodzie przeliczymy wszystkie kolejne terminy według prawdziwej daty.",
      zadania: [],
    },
    {
      id: "21dni", faza: "Po porodzie", data: dodajDni(T, 21), waga: "krytyczny",
      tytul: "21 dni po porodzie — dwa obowiązki",
      opis: "To najważniejszy termin. Po nim tracisz wariant 81,5%.",
      zadania: [
        { id: "usc", t: "Zgłoś urodzenie dziecka w urzędzie stanu cywilnego (albo przez internet)", info: "Dziecko dostanie wtedy PESEL." },
        { id: "zam815", t: "Jeśli wybierasz 81,5% — wniosek musi być już złożony", link: "/przewodnik/swiadczenia/zasilek-macierzynski/wniosek", akcja: "Sprawdź wniosek", powiazane: "zam" },
      ],
    },
    {
      id: "800", faza: "Po porodzie", data: dodajMiesiace(T, 3), waga: "krytyczny",
      tytul: "800+ z wyrównaniem od urodzenia",
      opis: "Wniosek złożony do 3 miesięcy od urodzenia — pieniądze od miesiąca narodzin dziecka.",
      zadania: [
        { id: "w800", t: "Złóż wniosek o 800+ (eZUS, bankowość internetowa albo mObywatel)", wniosek: true, termin: dodajMiesiace(T, 3), nazwaWniosku: "wniosek o 800+ z wyrównaniem" },
      ],
    },
    {
      id: "rodzicielski", faza: "Po porodzie", data: dodajDni(T, 140), waga: "info",
      tytul: "Koniec urlopu macierzyńskiego",
      opis: "20 tygodni od porodu. Potem urlop rodzicielski — przy wariancie 81,5% już zaplanowany.",
      zadania: [
        { id: "kto", t: "Ustalcie, kto i kiedy weźmie urlop rodzicielski (9 tygodni jest tylko dla taty)" },
        { id: "wn-rodz", t: "Przy wariancie 100% — wniosek o urlop rodzicielski do pracodawcy 21 dni wcześniej" },
      ],
    },
    {
      id: "ojcowski", faza: "Po porodzie", data: dodajMiesiace(T, 12), waga: "info",
      tytul: "Ostatni dzień na urlop ojcowski",
      opis: "Tata ma 2 tygodnie do wykorzystania do 1. urodzin dziecka.",
      zadania: [{ id: "ojc", t: "Tata: wniosek o urlop ojcowski do pracodawcy" }],
    },
  ];
  return kroki.map((k) => ({ ...k, za: ileDni(dzis, k.data), minelo: ileDni(dzis, k.doData || k.data) < 0 }));
}
