import { ETAPY } from "./dane.js";

// =====================================================================
// SYTUACJA RODZICA — krótka ankieta po wyborze etapu + wnioski z niej.
// Zasada: pytamy TYLKO o to, czego nie wiemy z ZUS. Nie pytamy o zarobki
// (podstawę bierzemy z ZUS) ani o dane medyczne.
// =====================================================================

export const PYTANIA = {
  rola: {
    pytanie: "Kim jesteś dla dziecka?",
    opis: "Od tego zależy, jakie urlopy, zasiłki i inne świadczenia Ci przysługują.",
    opcje: [
      { v: "mama", t: "Mamą" },
      { v: "tata", t: "Tatą" },
      { v: "opiekun", t: "Opiekunem", opis: "adopcja albo rodzina zastępcza" },
    ],
  },
  etap: {
    pytanie: "Na jakim jesteś etapie?",
    opis: "Dopasujemy przewodnik do Twojej sytuacji. Wybór możesz później zmienić.",
    // opcje zależą od roli — patrz etapyDlaRoli()
  },
  praca: {
    pytanie: "Jak teraz pracujesz?",
    opis: "To decyduje, czy dostaniesz zasiłek z ZUS i gdzie złożysz wniosek. Jeśli masz kilka umów, wybierz główną.",
    opcje: [
      { v: "umowa", t: "Umowa o pracę" },
      { v: "dzialalnosc", t: "Własna działalność gospodarcza" },
      { v: "zlecenie", t: "Umowa zlecenie" },
      { v: "brak", t: "Nie pracuję", opis: "np. studiuję albo jestem bezrobotna / bezrobotny" },
      { v: "inna", t: "Inaczej", opis: "np. umowa o dzieło" },
    ],
  },
  chorobowe: {
    pytanie: "Czy opłacasz dobrowolne ubezpieczenie chorobowe?",
    opis: "Przy działalności i zleceniu jest ono dobrowolne — a to od niego zależy zasiłek macierzyński.",
    opcje: [
      { v: "tak", t: "Tak" },
      { v: "nie", t: "Nie" },
      { v: "nie_wiem", t: "Nie wiem", opis: "sprawdzimy to w danych z ZUS" },
    ],
  },
};

/** Jaką pracę widzi ZUS (żeby zaproponować odpowiedź, a nie kazać jej wpisywać). */
export function pracaZZus(zus) {
  const t = zus?.ubezpieczenie?.tytul || "";
  if (/umowa o pracę/i.test(t)) return "umowa";
  if (/działalno/i.test(t)) return "dzialalnosc";
  if (/zleceni/i.test(t)) return "zlecenie";
  return null;
}

/** Kolejne pytania zależą od odpowiedzi — pokazujemy tylko te potrzebne. */
export function listaPytan(odp) {
  const lista = ["rola", "etap", "praca"];
  if (odp.praca === "dzialalnosc" || odp.praca === "zlecenie") lista.push("chorobowe");
  return lista;
}

/** Czy osoba ma ubezpieczenie chorobowe (null = nie wiadomo). */
export function maChorobowe(odp, zus) {
  if (odp.praca === "umowa") return true;
  if (odp.praca === "brak" || odp.praca === "inna") return false;
  if (odp.chorobowe === "tak") return true;
  if (odp.chorobowe === "nie") return false;
  // „nie wiem” — patrzymy w dane z ZUS
  const z = zus?.ubezpieczenie?.chorobowe;
  if (z && z !== "brak") return true;
  return null;
}

/** Wnioski z ankiety: co przysługuje, kto wypłaca, gdzie złożyć wniosek. */
export function ocenSytuacje(odp = {}, zus, etap) {
  const chor = maChorobowe(odp, zus);
  const platnik20 = zus?.ubezpieczenie?.platnikPowyzej20;
  const wynik = { chorobowe: chor, punkty: [] };

  if (etap === "trudna") {
    wynik.tytul = chor === false ? "Przysługuje Ci wsparcie z gminy" : "Przysługuje Ci urlop i zasiłek";
    wynik.punkty.push(
      chor === false
        ? "Bez ubezpieczenia chorobowego zasiłku z ZUS nie ma. Zapytaj w urzędzie gminy o świadczenie rodzicielskie i jednorazową pomoc."
        : "Jeśli wydano akt urodzenia albo zaświadczenie o martwym urodzeniu, mamie przysługuje 8 tygodni urlopu macierzyńskiego i zasiłek. W innych sytuacjach — zwolnienie lekarskie i zasiłek chorobowy.",
      "Nie musisz załatwiać wszystkiego od razu. Szczegóły zawsze potwierdzi ZUS.",
    );
    return wynik;
  }

  if (chor === true) {
    wynik.swiadczenie = "zasilek";
    wynik.tytul = "Przysługuje Ci zasiłek macierzyński z ZUS";
    if (odp.praca === "umowa") {
      wynik.punkty.push(
        "Przy umowie o pracę masz obowiązkowe ubezpieczenie chorobowe. Zasiłek macierzyński nie wymaga okresu wyczekiwania, a zasiłek chorobowy w ciąży (L4) przysługuje po 30 dniach nieprzerwanego ubezpieczenia.",
        platnik20 === true
          ? "Twój pracodawca zgłasza ponad 20 osób, więc to on wypłaci zasiłek. Dokumenty składasz u niego."
          : platnik20 === false
            ? "Pracodawca zgłasza do 20 osób, więc zasiłek wypłaci ZUS. Dokumenty składasz u pracodawcy, a on przekaże je do ZUS."
            : "Dokumenty składasz u pracodawcy.",
      );
    } else {
      wynik.punkty.push(
        "Masz dobrowolne ubezpieczenie chorobowe, więc zasiłek macierzyński Ci przysługuje. Zasiłek chorobowy w ciąży (L4) — dopiero po 90 dniach nieprzerwanego ubezpieczenia.",
        "Wniosek (ZAM) złożysz w ZUS — najprościej przez eZUS.",
      );
    }
    if (odp.rola === "tata") wynik.punkty.push("Jako tata masz też 2 tygodnie urlopu ojcowskiego i 9 tygodni urlopu rodzicielskiego tylko dla siebie.");
  } else if (chor === false) {
    wynik.swiadczenie = "rodzicielskie";
    wynik.tytul = "Przysługuje Ci świadczenie rodzicielskie";
    wynik.punkty.push(
      "Bez ubezpieczenia chorobowego nie dostaniesz zasiłku macierzyńskiego z ZUS.",
      "Zamiast niego możesz dostać świadczenie rodzicielskie — wniosek składasz w urzędzie gminy lub miasta.",
    );
    if (odp.praca === "dzialalnosc" || odp.praca === "zlecenie")
      wynik.punkty.push("Jeśli zgłosisz się do dobrowolnego ubezpieczenia chorobowego jeszcze przed porodem, zasiłek macierzyński będzie Ci przysługiwał.");
  } else {
    wynik.swiadczenie = "sprawdz";
    wynik.tytul = "Sprawdzimy, co Ci przysługuje";
    wynik.punkty.push("Nie widzimy w danych ZUS, czy masz ubezpieczenie chorobowe. Sprawdź to w eZUS albo zapytaj w ZUS.");
  }
  wynik.punkty.push("Kwotę policzymy z podstawy z ZUS — nie musisz podawać zarobków.");
  return wynik;
}

// ---------- data, od której liczymy terminy (zawsze OPCJONALNA) ----------
export function kluczowaData(etap) {
  switch (etap) {
    case "ciaza":
      return { klucz: "terminPorodu", etykieta: "Planowany termin porodu", dodaj: "Dodaj termin porodu", przyszla: true,
        pomoc: "Datę znajdziesz w karcie ciąży albo na zaświadczeniu od lekarza lub położnej." };
    case "dziecko":
      return { klucz: "dataPorodu", etykieta: "Data urodzenia dziecka", dodaj: "Dodaj datę urodzenia", przyszla: false,
        pomoc: "Znajdziesz ją w akcie urodzenia dziecka." };
    case "adopcja":
      return { klucz: "dataPrzyjecia", etykieta: "Data przyjęcia dziecka", dodaj: "Dodaj datę przyjęcia", przyszla: null,
        pomoc: "Dzień, w którym dziecko zamieszkało z Tobą." };
    default:
      return null; // planuję / strata — terminy bez dat
  }
}

// ---------- etapy zależne od roli ----------

/** Lista etapów do wyboru: mama widzi „Jestem w ciąży”, tata „Spodziewam się dziecka”, opiekun — adopcję i rodzinę zastępczą. */
export function etapyDlaRoli(rola) {
  if (rola === "opiekun")
    return [
      { v: "adopcja", etap: "adopcja", nazwa: "Adoptuję dziecko", podtytul: "Przyjmuję dziecko na wychowanie i wystąpiłam / wystąpiłem do sądu o przysposobienie.", ikona: "/house.svg" },
      { v: "zastepcza", etap: "adopcja", nazwa: "Jestem rodziną zastępczą", podtytul: "Przyjmuję dziecko do rodziny zastępczej.", ikona: "/heart.svg" },
    ];
  const IKONY = { planuje: "/plant.svg", ciaza: "/pregnant.svg", dziecko: "/girl.svg", adopcja: "/house.svg", trudna: "/heart.svg" };
  return ETAPY.map((e) => ({
    v: e.id,
    etap: e.id,
    nazwa: rola === "tata" && e.nazwaTata ? e.nazwaTata : e.nazwa,
    podtytul: rola === "tata" && e.podtytulTata ? e.podtytulTata : e.podtytul,
    ikona: IKONY[e.id],
  }));
}

/** Nazwa etapu do pokazania w aplikacji (z uwzględnieniem roli). */
export function nazwaEtapu(etap, odp = {}) {
  const lista = etapyDlaRoli(odp.rola);
  const e = lista.find((x) => x.v === (odp.typOpieki || etap)) || lista.find((x) => x.etap === etap);
  return e?.nazwa || ETAPY.find((x) => x.id === etap)?.nazwa || "";
}
