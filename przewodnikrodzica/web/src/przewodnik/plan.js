// =====================================================================
// PLAN RODZICA — kroki na osi czasu + lista rzeczy do zrobienia.
// Jeśli znamy datę (termin porodu / urodzenia / przyjęcia), liczymy konkretne dni.
// Jeśli nie — pokazujemy terminy ustawowe, np. „do 21 dni po porodzie”.
//   przesuniecie: liczba dni od daty kluczowej (albo { miesiace: n })
//   kiedy: opis ustawowy, gdy nie znamy daty
//   waga: "krytyczny" | "szansa" | "info" | "porod"
// =====================================================================
import { dodajDni, dodajMiesiace, dzisISO, ileDni } from "./terminy.js";

const WNIOSEK = "/przewodnik/swiadczenia/zasilek-macierzynski/wniosek";

function krokiPorod(etap, odp, chor) {
  if (odp.rola === "tata") return krokiTata(etap, chor);
  const kroki = [];
  const zasilek = chor !== false;

  if ((etap === "planuje" || etap === "ciaza") && (odp.praca === "dzialalnosc" || odp.praca === "zlecenie") && odp.chorobowe !== "tak") {
    kroki.push({
      id: "chorobowe", faza: "Teraz", waga: "szansa", znacznik: "Teraz", kiedy: "najlepiej od razu",
      tytul: "Sprawdź ubezpieczenie chorobowe",
      opis: "Przy działalności i zleceniu jest dobrowolne. Bez niego nie ma zasiłku macierzyńskiego.",
      zadania: [
        { id: "chor-zglos", t: "Zgłoś się do dobrowolnego ubezpieczenia chorobowego", info: "Zasiłek chorobowy w ciąży przysługuje po 90 dniach takiego ubezpieczenia." },
      ],
    });
  }

  if (zasilek) kroki.push({
      id: "zaswiadczenie", faza: "Przed porodem", przesuniecie: -56, waga: "info",
      kiedy: "ok. 8 tygodni przed porodem",
      tytul: "Poproś lekarza o zaświadczenie",
      opis: "Zaświadczenie o przewidywanej dacie porodu przyda się do wniosku złożonego przed porodem.",
      zadania: [{ id: "zaswiadczenie", t: "Weź od lekarza lub położnej zaświadczenie o przewidywanej dacie porodu" }],
  });

  kroki.push(
    {
      id: "urlop", faza: "Przed porodem", przesuniecie: -42, waga: "szansa",
      kiedy: "najwcześniej 6 tygodni przed porodem",
      tytul: zasilek ? "Możesz zacząć urlop macierzyński" : "Przygotuj wniosek o świadczenie rodzicielskie",
      opis: zasilek
        ? "Mama może zacząć urlop i zasiłek do 6 tygodni przed przewidywanym porodem."
        : "Świadczenie rodzicielskie przysługuje od dnia porodu — wniosek złożysz w urzędzie gminy.",
      zadania: zasilek
        ? [
            { id: "wariant", t: "Zdecyduj: 81,5% przez cały rok czy 100% + 70%", link: "/przewodnik/kalkulator", akcja: "Porównaj w kalkulatorze" },
            { id: "zam", t: "Złóż wniosek o zasiłek macierzyński", link: WNIOSEK, akcja: "Złóż wniosek", wniosek: true, przesuniecie: 21, nazwaWniosku: "wniosek o zasiłek macierzyński 81,5%" },
            { id: "pracodawca", t: "Powiedz pracodawcy, od kiedy idziesz na urlop" },
          ]
        : [{ id: "rodz-dok", t: "Przygotuj dowód osobisty i odpis aktu urodzenia (po porodzie)" }],
    },
    {
      id: "porod", faza: "Poród", przesuniecie: 0, waga: "porod",
      kiedy: "dzień porodu",
      tytul: etap === "dziecko" ? "Narodziny dziecka" : "Termin porodu",
      opis: "Od tego dnia liczą się wszystkie kolejne terminy.",
      zadania: [],
    },
    {
      id: "21dni", faza: "Po porodzie", przesuniecie: 21, waga: "krytyczny",
      kiedy: "do 21 dni po porodzie",
      tytul: zasilek ? "21 dni po porodzie — dwa obowiązki" : "Zgłoś urodzenie dziecka",
      opis: zasilek ? "Najważniejszy termin. Po nim tracisz wariant 81,5%." : "Masz na to 21 dni od porodu.",
      zadania: [
        { id: "usc", t: "Zgłoś urodzenie w urzędzie stanu cywilnego (albo przez internet)", info: "Dziecko dostanie wtedy PESEL." },
        ...(zasilek ? [{ id: "zam815", t: "Jeśli wybierasz 81,5% — wniosek musi być już złożony", link: WNIOSEK, akcja: "Sprawdź wniosek", powiazane: "zam" }] : []),
      ],
    },
    {
      id: "800", faza: "Po porodzie", przesuniecie: { miesiace: 3 }, waga: "krytyczny",
      kiedy: "do 3 miesięcy po porodzie",
      tytul: "800+ z wyrównaniem od urodzenia",
      opis: "Wniosek złożony w tym czasie daje pieniądze od miesiąca narodzin dziecka.",
      zadania: [{ id: "w800", t: "Złóż wniosek o 800+ (eZUS, bank albo mObywatel)", wniosek: true, przesuniecie: { miesiace: 3 }, nazwaWniosku: "wniosek o 800+ z wyrównaniem" }],
    },
  );

  if (zasilek) {
    kroki.push(
      {
        id: "rodzicielski", faza: "Po porodzie", przesuniecie: 140, waga: "info",
        kiedy: "20 tygodni po porodzie",
        tytul: "Koniec urlopu macierzyńskiego",
        opis: "Potem urlop rodzicielski — przy wariancie 81,5% jest już zaplanowany.",
        zadania: [
          { id: "kto", t: "Ustalcie, kto i kiedy weźmie urlop rodzicielski (9 tygodni jest tylko dla drugiego rodzica)" },
          { id: "wn-rodz", t: "Przy wariancie 100% — wniosek o urlop rodzicielski 21 dni przed jego początkiem" },
        ],
      },
      {
        id: "ojcowski", faza: "Po porodzie", przesuniecie: { miesiace: 12 }, waga: "info",
        kiedy: "do 1. urodzin dziecka",
        tytul: "Ostatni dzień na urlop ojcowski",
        opis: "Tata ma 2 tygodnie do wykorzystania do 1. urodzin dziecka.",
        zadania: [{ id: "ojc", t: "Tata: wniosek o urlop ojcowski do pracodawcy" }],
      },
    );
  }

  // Dziecko już jest — kroki sprzed porodu nie mają sensu
  return etap === "dziecko" ? kroki.filter((k) => k.faza !== "Przed porodem" && k.faza !== "Teraz") : kroki;
}

// Tata: bez urlopu macierzyńskiego przed porodem; urlop ojcowski i 9 tygodni rodzicielskiego
function krokiTata(etap, chor) {
  const zasilek = chor !== false;
  const kroki = [
    {
      id: "porod", faza: "Poród", przesuniecie: 0, waga: "porod", kiedy: "dzień porodu",
      tytul: etap === "dziecko" ? "Narodziny dziecka" : "Termin porodu",
      opis: "Od tego dnia liczą się terminy Twoich urlopów.",
      zadania: [],
    },
    {
      id: "21dni", faza: "Po porodzie", przesuniecie: 21, waga: "krytyczny", kiedy: "do 21 dni po porodzie",
      tytul: "Zgłoś urodzenie dziecka",
      opis: "Urodzenie w urzędzie stanu cywilnego może zgłosić każde z rodziców.",
      zadania: [{ id: "usc", t: "Zgłoś urodzenie w urzędzie stanu cywilnego (albo przez internet)", info: "Dziecko dostanie wtedy PESEL." }],
    },
    {
      id: "800", faza: "Po porodzie", przesuniecie: { miesiace: 3 }, waga: "krytyczny", kiedy: "do 3 miesięcy po porodzie",
      tytul: "800+ z wyrównaniem od urodzenia",
      opis: "Wniosek może złożyć każde z rodziców — wystarczy jeden.",
      zadania: [{ id: "w800", t: "Złóż wniosek o 800+ (eZUS, bank albo mObywatel)", wniosek: true, przesuniecie: { miesiace: 3 }, nazwaWniosku: "wniosek o 800+ z wyrównaniem" }],
    },
  ];
  if (zasilek) {
    kroki.splice(1, 0, {
      id: "ojcowski-start", faza: "Po porodzie", przesuniecie: 0, waga: "szansa", kiedy: "od dnia porodu",
      tytul: "Możesz wziąć urlop ojcowski",
      opis: "2 tygodnie, w całości albo w dwóch częściach po tygodniu. Zasiłek: 100% podstawy. Wniosek składasz u pracodawcy co najmniej 7 dni przed urlopem.",
      zadania: [{ id: "ojc-plan", t: "Ustal z pracodawcą termin urlopu ojcowskiego" }],
    });
    kroki.push(
      {
        id: "rodzicielski", faza: "Po porodzie", przesuniecie: 140, waga: "info", kiedy: "po urlopie macierzyńskim partnerki",
        tytul: "9 tygodni urlopu rodzicielskiego tylko dla Ciebie",
        opis: "Tych tygodni nie można przekazać mamie — jeśli ich nie wykorzystasz, przepadną.",
        zadania: [{ id: "wn-rodz", t: "Wniosek o urlop rodzicielski do pracodawcy — 21 dni przed jego początkiem" }],
      },
      {
        id: "ojcowski", faza: "Po porodzie", przesuniecie: { miesiace: 12 }, waga: "krytyczny", kiedy: "do 1. urodzin dziecka",
        tytul: "Ostatni dzień urlopu ojcowskiego",
        opis: "Urlop ojcowski trzeba wykorzystać, zanim dziecko skończy 12 miesięcy.",
        zadania: [{ id: "ojc", t: "Złóż wniosek o urlop ojcowski u pracodawcy", wniosek: true, przesuniecie: { miesiace: 12 }, nazwaWniosku: "urlop ojcowski (do 1. urodzin dziecka)" }],
      },
    );
  }
  return kroki;
}

function krokiAdopcja(chor) {
  return [
    {
      id: "przyjecie", faza: "Przyjęcie dziecka", przesuniecie: 0, waga: "porod",
      kiedy: "dzień przyjęcia dziecka",
      tytul: "Przyjęcie dziecka na wychowanie",
      opis: "Od tego dnia liczą się terminy urlopów.",
      zadania: [{ id: "ad-dok", t: "Przygotuj dokument z sądu lub ośrodka o przyjęciu dziecka" }],
    },
    {
      id: "ad-urlop", faza: "Przyjęcie dziecka", przesuniecie: 0, waga: "szansa",
      kiedy: "od dnia przyjęcia",
      tytul: chor === false ? "Świadczenie rodzicielskie" : "Urlop na warunkach urlopu macierzyńskiego",
      opis: chor === false
        ? "Bez ubezpieczenia chorobowego wniosek o świadczenie rodzicielskie złożysz w urzędzie gminy."
        : "20 tygodni przy jednym dziecku. Za ten czas dostajesz zasiłek macierzyński.",
      zadania: chor === false ? [] : [{ id: "zam", t: "Złóż wniosek o urlop i zasiłek", link: WNIOSEK, akcja: "Złóż wniosek", wniosek: true, przesuniecie: 21, nazwaWniosku: "wniosek o zasiłek macierzyński" }],
    },
    ...(chor === false ? [] : [{
      id: "ad-rodz", faza: "Potem", przesuniecie: 140, waga: "info",
      kiedy: "20 tygodni od przyjęcia",
      tytul: "Urlop rodzicielski",
      opis: "Po urlopie na warunkach macierzyńskiego możecie wziąć urlop rodzicielski.",
      zadania: [{ id: "ad-kto", t: "Ustalcie, kto weźmie urlop rodzicielski" }],
    }]),
  ];
}

function krokiStrata(chor) {
  return [
    {
      id: "st-dok", faza: "Kiedy poczujesz się gotowa", waga: "info", kiedy: "bez pośpiechu",
      tytul: "Dokumenty",
      opis: "Akt urodzenia albo zaświadczenie o martwym urodzeniu wystawia szpital lub urząd stanu cywilnego.",
      zadania: [{ id: "st-akt", t: "Odbierz akt urodzenia lub zaświadczenie o martwym urodzeniu" }],
    },
    {
      id: "st-urlop", faza: "Kiedy poczujesz się gotowa", waga: "szansa", kiedy: "8 tygodni po porodzie",
      tytul: chor === false ? "Wsparcie z gminy" : "Urlop i zasiłek macierzyński",
      opis: chor === false
        ? "Zapytaj w urzędzie gminy o świadczenie rodzicielskie i jednorazową pomoc."
        : "Mamie przysługuje 8 tygodni urlopu i zasiłku. Wniosek złożysz u pracodawcy albo w ZUS.",
      zadania: chor === false ? [] : [{ id: "st-wn", t: "Złóż wniosek u pracodawcy albo w ZUS" }],
    },
    {
      id: "st-wsparcie", faza: "Kiedy poczujesz się gotowa", waga: "info", kiedy: "zawsze",
      tytul: "Pomoc dla Ciebie",
      opis: "Nie musisz przechodzić przez to sama. Znajdziesz kontakty do wsparcia psychologicznego.",
      zadania: [{ id: "st-pomoc", t: "Zobacz, gdzie szukać wsparcia", link: "/przewodnik/pomoc", akcja: "Pomoc" }],
    },
  ];
}

const policz = (data, przes) =>
  przes === undefined || !data ? null : typeof przes === "object" ? dodajMiesiace(data, przes.miesiace) : dodajDni(data, przes);

/** Krótka etykieta węzła, gdy nie znamy daty (np. „−6 tyg.”, „+21 dni”). */
export function etykietaWzgledna(przes) {
  if (przes === undefined) return null;
  if (typeof przes === "object") return `+${przes.miesiace} mies.`;
  if (przes === 0) return "0";
  if (Math.abs(przes) % 7 === 0 && Math.abs(przes) >= 28) return `${przes < 0 ? "−" : "+"}${Math.abs(przes) / 7} tyg.`;
  return `${przes < 0 ? "−" : "+"}${Math.abs(przes)} dni`;
}

/**
 * etap: planuje | ciaza | dziecko | adopcja | trudna
 * data: data kluczowa (ISO) albo null
 */
export function zbudujPlan({ etap = "ciaza", data = null, odp = {}, chor = true, dzis = dzisISO() }) {
  const kroki = etap === "adopcja" ? krokiAdopcja(chor) : etap === "trudna" ? krokiStrata(chor) : krokiPorod(etap, odp, chor);
  return kroki.map((k) => {
    const d = policz(data, k.przesuniecie);
    const zadania = k.zadania.map((z) => ({ ...z, termin: policz(data, z.przesuniecie) }));
    return { ...k, zadania, data: d, za: d ? ileDni(dzis, d) : null, minelo: d ? ileDni(dzis, d) < 0 : false };
  });
}
