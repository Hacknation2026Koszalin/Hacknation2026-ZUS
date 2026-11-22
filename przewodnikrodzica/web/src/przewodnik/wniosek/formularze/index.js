// =====================================================================
// FORMULARZE ZUS dla rodziców — opisane tak samo jak ZAM, więc każdy
// przechodzi przez ten sam kreator „prowadź mnie za rękę”.
// Treść uproszczona na podstawie wzorów ZUS (prototyp, nie są to druki ZUS).
// =====================================================================
import { ZAM, fmtData } from "../formularz.js";
import {
  min3, nieZPrzyszlosci, poleDane, poleIban, poleOdbior, poleOkres, poleOswiadczenie, polePlatnik,
  poleSposobWyplaty, poleTelefon, polaDziecka, wiek, zdefiniuj,
} from "./wspolne.js";

const zDziecka = (s) => (s.etap === "dziecko" && s.dataPorodu ? { dataUrDziecka: s.dataPorodu } : {});

// ---------------------------------------------------------------------
// ZAS-26 — przyjęcie dziecka na wychowanie
// ---------------------------------------------------------------------
const ZAS26 = zdefiniuj({
  symbol: "ZAS-26",
  tytul: "Oświadczenie o przyjęciu dziecka na wychowanie",
  krotko: "Do zasiłku macierzyńskiego przy adopcji albo rodzinie zastępczej.",
  kiedy: ["Adoptujesz dziecko albo jesteś rodziną zastępczą (nie zawodową).", "Składasz razem z wnioskiem ZAM."],
  czas: "3 minuty",
  kategoria: "macierzynski",
  czesci: [
    { id: "dane", tytul: "Twoje dane" },
    { id: "przyjecie", tytul: "Przyjęcie dziecka" },
    { id: "dziecko", tytul: "Dziecko" },
    { id: "oswiadczenia", tytul: "Oświadczenie" },
  ],
  pola: [
    poleDane(), poleTelefon(), polePlatnik(),
    {
      id: "jako", czesc: "przyjecie", typ: "radio", wymagane: true,
      etykieta: "Jak przyjęłaś/przyjąłeś dziecko?",
      opcje: [
        { v: "zastepcza", t: "Jako rodzina zastępcza", opis: "Spokrewniona albo niezawodowa." },
        { v: "adopcja", t: "Złożyłam/złożyłem do sądu wniosek o przysposobienie (adopcję)" },
      ],
      podpowiedz: "Zasiłek przy adopcji przysługuje od dnia przyjęcia dziecka, gdy w sądzie jest już wniosek o przysposobienie. Zawodowa rodzina zastępcza zasiłku nie dostaje.",
    },
    {
      id: "dataPrzyjecia", czesc: "przyjecie", typ: "data", wymagane: true,
      etykieta: "Data przyjęcia dziecka na wychowanie",
      podpowiedz: (w, ctx) =>
        (ctx.zSesji?.dataPrzyjecia && w.dataPrzyjecia === ctx.zSesji.dataPrzyjecia ? "Wpisaliśmy datę, którą nam podałaś/podałeś. " : "") +
        "Dzień, w którym dziecko zamieszkało z Tobą — znajdziesz go w postanowieniu sądu albo dokumentach z ośrodka.",
      waliduj: nieZPrzyszlosci,
    },
    {
      id: "dataSad", czesc: "przyjecie", typ: "data", wymagane: true,
      etykieta: "Data złożenia w sądzie wniosku o przysposobienie",
      zalezyOd: ["jako"], widoczne: (w) => w.jako === "adopcja",
      nieDotyczy: "Dotyczy tylko adopcji.",
      podpowiedz: "Data z pieczęci sądu na Twoim wniosku albo z zaświadczenia o wszczęciu postępowania.",
      waliduj: nieZPrzyszlosci,
    },
    ...polaDziecka("dziecko"),
    poleOswiadczenie(),
  ],
  start: (s) => (s.dataPrzyjecia ? { dataPrzyjecia: s.dataPrzyjecia, jako: s.ankieta?.typOpieki === "zastepcza" ? "zastepcza" : undefined } : {}),
  poWyslaniu: () => "Oświadczenie dołączymy do Twojego wniosku o zasiłek",
  polecany: (s) => (s.etap === "adopcja" ? "Przyjmujesz dziecko na wychowanie" : null),
});

// ---------------------------------------------------------------------
// ZAS-33 — porzucenie dziecka przez matkę albo śmierć matki
// ---------------------------------------------------------------------
const ZAS33 = zdefiniuj({
  symbol: "ZAS-33",
  tytul: "Oświadczenie o porzuceniu dziecka przez matkę lub o śmierci matki",
  krotko: "Gdy tata albo ktoś z rodziny przejmuje zasiłek macierzyński.",
  kiedy: ["Jesteś tatą dziecka albo kimś z najbliższej rodziny.", "Mama porzuciła dziecko albo zmarła, a Ty się nim opiekujesz."],
  czas: "3 minuty",
  kategoria: "macierzynski",
  czesci: [
    { id: "dane", tytul: "Twoje dane" },
    { id: "powod", tytul: "Powód" },
    { id: "dziecko", tytul: "Dziecko" },
    { id: "oswiadczenia", tytul: "Oświadczenie" },
  ],
  pola: [
    poleDane(), poleTelefon(), polePlatnik(),
    {
      id: "powod", czesc: "powod", typ: "radio", wymagane: true,
      etykieta: "Z jakiego powodu opiekujesz się dzieckiem?",
      opcje: [
        { v: "porzucenie", t: "Matka porzuciła dziecko" },
        { v: "smierc", t: "Matka dziecka zmarła" },
      ],
      podpowiedz: "Wiemy, że to może być bardzo trudne. Wypełnij tylko to, co konieczne — możesz w każdej chwili przerwać, a dane zostaną zapisane.",
    },
    {
      id: "dataPorzucenia", czesc: "powod", typ: "data", wymagane: true,
      etykieta: "Data porzucenia dziecka",
      zalezyOd: ["powod"], widoczne: (w) => w.powod === "porzucenie",
      nieDotyczy: "Dotyczy tylko porzucenia dziecka.",
      podpowiedz: "Dzień, od którego mama nie opiekuje się dzieckiem.",
      waliduj: nieZPrzyszlosci,
    },
    {
      id: "opiekaOd", czesc: "powod", typ: "data", wymagane: true,
      etykieta: "Od kiedy opiekujesz się dzieckiem?",
      zalezyOd: ["powod"], widoczne: (w) => !!w.powod,
      podpowiedz: "Od tego dnia możesz dostać zasiłek macierzyński za pozostały okres.",
      waliduj: (v, w, ctx) => nieZPrzyszlosci(v, w, ctx) || (w.dataPorzucenia && v < w.dataPorzucenia ? "Opieka zwykle zaczyna się najwcześniej w dniu porzucenia." : null),
    },
    ...polaDziecka("dziecko"),
    poleOswiadczenie(),
  ],
  start: zDziecka,
  poWyslaniu: () => "Oświadczenie dołączymy do wniosku o zasiłek macierzyński",
  polecany: () => null,
});

// ---------------------------------------------------------------------
// ZAS-23 — skrócenie lub wstrzymanie zasiłku macierzyńskiego
// ---------------------------------------------------------------------
const POWODY23 = [
  { v: "praca14", t: "Wracam do pracy po co najmniej 14 tygodniach zasiłku po porodzie", opis: "Resztę zasiłku może przejąć tata dziecka." },
  { v: "szpitalJa", t: "Jestem w szpitalu (po co najmniej 8 tygodniach zasiłku po porodzie)" },
  { v: "szpitalDziecko", t: "Dziecko jest w szpitalu (po co najmniej 8 tygodniach zasiłku po porodzie)" },
  { v: "orzeczenie", t: "Mam orzeczenie o niezdolności do samodzielnej egzystencji lub o znacznej niepełnosprawności (po 8 tygodniach)" },
  { v: "wypisMatki", t: "Wracam do pracy, bo mama dziecka wyszła ze szpitala i wraca do zasiłku" },
  { v: "rezygnacja", t: "Rezygnuję z wychowania i oddaję dziecko do adopcji lub domu małego dziecka" },
];
const ZAS23 = zdefiniuj({
  symbol: "ZAS-23",
  tytul: "Wniosek o skrócenie lub wstrzymanie zasiłku macierzyńskiego",
  krotko: "Gdy wracasz do pracy wcześniej albo ktoś trafia do szpitala.",
  kiedy: ["Pobierasz zasiłek macierzyński i chcesz go przerwać.", "Np. wracasz do pracy po 14 tygodniach, a resztę urlopu bierze tata."],
  czas: "3 minuty",
  kategoria: "macierzynski",
  czesci: [
    { id: "dane", tytul: "Twoje dane" },
    { id: "zakres", tytul: "Od kiedy i dlaczego" },
    { id: "oswiadczenia", tytul: "Oświadczenie" },
  ],
  pola: [
    poleDane(), poleTelefon(), polePlatnik(),
    {
      id: "powod", czesc: "zakres", typ: "radio", wymagane: true,
      etykieta: "Dlaczego chcesz skrócić lub wstrzymać zasiłek?",
      opcje: POWODY23,
      podpowiedz: "Wybierz jeden powód. Od niego zależy, ile tygodni zasiłku musisz najpierw wykorzystać (14 albo 8 po porodzie).",
    },
    {
      id: "odKiedy", czesc: "zakres", typ: "data", wymagane: true,
      etykieta: "Od kiedy wstrzymać wypłatę zasiłku?",
      zalezyOd: ["powod"], widoczne: (w) => !!w.powod,
      podpowiedz: (w, ctx) =>
        w.powod === "praca14" && ctx.zSesji?.dataUr
          ? `14 tygodni po porodzie mija ${fmtData(new Date(new Date(ctx.zSesji.dataUr).getTime() + 98 * 864e5).toISOString().slice(0, 10))} — wcześniej nie możesz zrezygnować.`
          : "Pierwszy dzień, za który nie chcesz już dostawać zasiłku (np. dzień powrotu do pracy albo przyjęcia do szpitala).",
      waliduj: (v, w, ctx) => {
        const ur = ctx.zSesji?.dataUr;
        if (!ur) return null;
        const tyg = (new Date(v) - new Date(ur)) / (7 * 864e5);
        if (w.powod === "praca14" && tyg < 14) return "Najpierw musisz wykorzystać co najmniej 14 tygodni zasiłku po porodzie.";
        if (["szpitalJa", "szpitalDziecko", "orzeczenie"].includes(w.powod) && tyg < 8) return "Najpierw musisz wykorzystać co najmniej 8 tygodni zasiłku po porodzie.";
        return null;
      },
    },
    {
      id: "doKiedy", czesc: "zakres", typ: "data", wymagane: false,
      etykieta: "Do kiedy przysługiwał Ci zasiłek? (jeśli wiesz)",
      zalezyOd: ["powod"], widoczne: (w) => !!w.powod,
      podpowiedz: "Ostatni dzień zasiłku z decyzji lub informacji od pracodawcy. Jeśli nie wiesz — pomiń, sprawdzimy to.",
      waliduj: (v, w) => (w.odKiedy && v < w.odKiedy ? "Ta data nie może być wcześniejsza niż data wstrzymania." : null),
    },
    ...polaDziecka("zakres", { widoczne: (w) => w.powod === "rezygnacja", miejsce: false }).map((p) => ({ ...p, zalezyOd: ["powod"], nieDotyczy: "Dotyczy tylko rezygnacji z wychowania dziecka." })),
    poleOswiadczenie(),
  ],
  start: () => ({}),
  poWyslaniu: () => "Płatnik wstrzyma wypłatę od podanego dnia",
  polecany: (s) => (s.etap === "dziecko" && s.ankieta?.rola === "mama" ? "Gdy wrócisz do pracy wcześniej" : null),
});

// ---------------------------------------------------------------------
// ZAS-39 — matka pobiera zasiłek w 8 tygodniach po porodzie (do zasiłku opiekuńczego)
// ---------------------------------------------------------------------
const ZAS39 = zdefiniuj({
  symbol: "ZAS-39",
  tytul: "Oświadczenie: mama pobiera zasiłek macierzyński w 8 tygodniach po porodzie",
  krotko: "Do zasiłku opiekuńczego dla taty lub innej osoby opiekującej się noworodkiem.",
  kiedy: [
    "Opiekujesz się noworodkiem w ciągu 8 tygodni od porodu i chcesz zasiłek opiekuńczy.",
    "Mama pobiera zasiłek macierzyński, ale jest w szpitalu, porzuciła dziecko albo ma orzeczenie o niezdolności do samodzielnej egzystencji lub znacznej niepełnosprawności.",
  ],
  czas: "3 minuty",
  kategoria: "opiekunczy",
  czesci: [
    { id: "dane", tytul: "Twoje dane" },
    { id: "matka", tytul: "Dane mamy dziecka" },
    { id: "dziecko", tytul: "Dziecko" },
    { id: "oswiadczenia", tytul: "Oświadczenie" },
  ],
  pola: [
    poleDane(), poleTelefon(), polePlatnik(),
    {
      id: "imieMatki", czesc: "matka", typ: "tekst", wymagane: true,
      etykieta: "Imię i nazwisko mamy dziecka",
      podpowiedz: "Mama pobiera zasiłek macierzyński — dlatego potrzebujemy jej danych, żeby to sprawdzić.",
      waliduj: min3,
    },
    {
      id: "peselMatki", czesc: "matka", typ: "pesel", wymagane: true,
      etykieta: "PESEL mamy dziecka",
      podpowiedz: "11 cyfr. Jeśli mama nie ma numeru PESEL, wpisz go pomijając — urzędnik poprosi o dokument tożsamości.",
      waliduj: (v) => (/^\d{11}$/.test(v) ? null : "PESEL ma dokładnie 11 cyfr."),
    },
    {
      id: "powodMatki", czesc: "matka", typ: "radio", wymagane: true,
      etykieta: "Dlaczego mama nie może opiekować się dzieckiem?",
      opcje: [
        { v: "szpital", t: "Jest w szpitalu" },
        { v: "porzucenie", t: "Porzuciła dziecko" },
        { v: "orzeczenie", t: "Ma orzeczenie o niezdolności do samodzielnej egzystencji lub znacznej niepełnosprawności" },
      ],
      podpowiedz: "Tylko w tych sytuacjach możesz dostać zasiłek opiekuńczy, gdy mama pobiera zasiłek macierzyński.",
    },
    ...polaDziecka("dziecko", { miejsce: false, pesel: true }),
    poleOswiadczenie(),
  ],
  start: zDziecka,
  ostatniKrok: "Zasiłek opiekuńczy",
  poWyslaniu: () => "Dołącz też zaświadczenie lekarskie (e-ZLA) o opiece nad dzieckiem",
  polecany: (s) => (s.etap === "dziecko" && s.ankieta?.rola === "tata" ? "Gdy mama trafi do szpitala" : null),
});

// ---------------------------------------------------------------------
// ZAS-55 — zasiłek w wysokości zasiłku macierzyńskiego / wyrównawczy
// ---------------------------------------------------------------------
const ZAS55 = zdefiniuj({
  symbol: "ZAS-55",
  tytul: "Wniosek o zasiłek w wysokości zasiłku macierzyńskiego lub zasiłek wyrównawczy",
  krotko: "Gdy w ciąży straciłaś pracę przez upadłość lub likwidację firmy.",
  kiedy: [
    "Jesteś w ciąży, a pracodawca rozwiązał umowę z powodu upadłości lub likwidacji albo zmarł.",
    "Albo: jesteś na rehabilitacji zawodowej i zarabiasz mniej niż wcześniej (zasiłek wyrównawczy).",
  ],
  czas: "4 minuty",
  kategoria: "macierzynski",
  czesci: [
    { id: "dane", tytul: "Twoje dane" },
    { id: "zakres", tytul: "O co wnioskujesz" },
    { id: "wyplata", tytul: "Wypłata" },
    { id: "oswiadczenia", tytul: "Oświadczenie" },
  ],
  pola: [
    poleDane(), poleTelefon(), polePlatnik(),
    {
      id: "rodzaj", czesc: "zakres", typ: "radio", wymagane: true,
      etykieta: "O jaki zasiłek wnioskujesz?",
      opcje: [
        { v: "macierzynski", t: "Zasiłek w wysokości zasiłku macierzyńskiego", opis: "Straciłaś pracę w ciąży przez upadłość, likwidację lub śmierć pracodawcy." },
        { v: "wyrownawczy", t: "Zasiłek wyrównawczy", opis: "Na rehabilitacji zawodowej zarabiasz mniej niż przed nią." },
      ],
      podpowiedz: "Zasiłek w wysokości zasiłku macierzyńskiego dostajesz od dnia rozwiązania umowy do porodu. Potem przysługuje Ci zasiłek macierzyński.",
    },
    {
      id: "odKiedy", czesc: "zakres", typ: "data", wymagane: true,
      etykieta: "Od kiedy wnioskujesz o zasiłek?",
      zalezyOd: ["rodzaj"], widoczne: (w) => w.rodzaj === "macierzynski",
      nieDotyczy: "Dotyczy tylko zasiłku w wysokości zasiłku macierzyńskiego.",
      podpowiedz: "Zwykle dzień po rozwiązaniu umowy o pracę.",
    },
    {
      id: "zatrudnienie", czesc: "zakres", typ: "radio", wymagane: true,
      etykieta: "Czy zapewniono Ci inne zatrudnienie?",
      zalezyOd: ["rodzaj"], widoczne: (w) => w.rodzaj === "macierzynski",
      nieDotyczy: "Dotyczy tylko zasiłku w wysokości zasiłku macierzyńskiego.",
      opcje: [
        { v: "nie", t: "Nie zapewniono mi innego zatrudnienia" },
        { v: "tak", t: "Zapewniono mi inne zatrudnienie" },
      ],
      podpowiedz: "Jeśli dostałaś inną pracę, zasiłek może Ci nie przysługiwać — zaznacz zgodnie z prawdą.",
    },
    ...poleOkres("zakres", "wyr", { widoczne: (w) => w.rodzaj === "wyrownawczy", zalezyOd: ["rodzaj"], etykieta: "Okres zasiłku wyrównawczego" }).map((p) => ({ ...p, nieDotyczy: "Dotyczy tylko zasiłku wyrównawczego." })),
    poleSposobWyplaty("wyplata"),
    poleIban("wyplata"),
    poleOswiadczenie(),
  ],
  start: () => ({}),
  poWyslaniu: () => "Zasiłek wypłaci ZUS",
  polecany: () => null,
});

// ---------------------------------------------------------------------
// ZPM — ulga dla młodych przy zasiłku macierzyńskim
// ---------------------------------------------------------------------
const ZPM = zdefiniuj({
  symbol: "ZPM",
  tytul: "Wniosek o zwolnienie z podatku zasiłku macierzyńskiego (ulga dla młodych)",
  krotko: "Do 26. roku życia nie płacisz zaliczki na podatek od zasiłku.",
  kiedy: ["Masz mniej niż 26 lat i pobierasz zasiłek macierzyński z ZUS.", "Bez wniosku ZUS pobiera zaliczkę na podatek — odzyskasz ją dopiero w zeznaniu rocznym."],
  czas: "1 minuta",
  kategoria: "podatek",
  czesci: [
    { id: "dane", tytul: "Twoje dane" },
    { id: "oswiadczenia", tytul: "Oświadczenie" },
  ],
  pola: [
    poleDane(), poleTelefon(),
    {
      ...poleOswiadczenie("oswiadczenia",
        "Oświadczam, że spełniam warunki ulgi dla młodych (art. 21 ust. 1 pkt 148 ustawy o PIT) i proszę, żeby ZUS nie pobierał zaliczki na podatek od mojego zasiłku macierzyńskiego. Ulga obejmuje przychody do 85 528 zł w roku."),
      etykieta: "Spełniam warunki ulgi dla młodych",
      podpowiedz: (w, ctx) => {
        const l = wiek(ctx);
        return l === null ? "Ulga dotyczy osób do ukończenia 26 lat." : l < 26 ? `Masz ${l} lat — możesz skorzystać z ulgi. Zaznacz pole.` : `Masz ${l} lat — ulga dla młodych dotyczy osób do ukończenia 26 lat, więc ten wniosek Cię nie dotyczy.`;
      },
      waliduj: (v, w, ctx) => (wiek(ctx) >= 26 ? "Ulga dotyczy tylko osób, które nie skończyły 26 lat." : null),
    },
  ],
  start: () => ({}),
  ostatniKrok: "Zasiłek bez zaliczki na podatek",
  poWyslaniu: () => "ZUS przestanie pobierać zaliczkę od kolejnej wypłaty",
  polecany: (s) => {
    const ur = s.profil?.dataUrodzenia;
    if (!ur) return null;
    return new Date().getFullYear() - Number(ur.slice(0, 4)) < 26 ? "Masz mniej niż 26 lat" : null;
  },
});

// ---------------------------------------------------------------------
// ZPO — inne ulgi podatkowe przy zasiłku macierzyńskim
// ---------------------------------------------------------------------
const lata = Array.from({ length: 6 }, (_, i) => String(new Date().getFullYear() - 2 + i));
const ZPO = zdefiniuj({
  symbol: "ZPO",
  tytul: "Oświadczenie o uldze podatkowej od zasiłku macierzyńskiego",
  krotko: "Ulga na powrót z zagranicy, dla rodzin 4+ albo dla pracujących seniorów.",
  kiedy: ["Pobierasz zasiłek macierzyński z ZUS.", "Wróciłaś/wróciłeś do Polski z zagranicy, wychowujesz co najmniej 4 dzieci albo pracujesz mimo wieku emerytalnego."],
  czas: "2 minuty",
  kategoria: "podatek",
  czesci: [
    { id: "dane", tytul: "Twoje dane" },
    { id: "ulga", tytul: "Ulga" },
    { id: "oswiadczenia", tytul: "Oświadczenie" },
  ],
  pola: [
    poleDane(), poleTelefon(),
    {
      id: "ulga", czesc: "ulga", typ: "radio", wymagane: true,
      etykieta: "Z jakiej ulgi chcesz skorzystać?",
      opcje: [
        { v: "powrot", t: "Ulga na powrót", opis: "Przeniosłaś/przeniosłeś miejsce zamieszkania do Polski po kilku latach za granicą." },
        { v: "4plus", t: "Ulga dla rodzin 4+", opis: "Wychowujesz co najmniej czworo dzieci." },
        { v: "senior", t: "Ulga dla pracujących seniorów", opis: "Masz wiek emerytalny, ale nie pobierasz emerytury." },
      ],
      podpowiedz: "Każda ulga zwalnia z podatku przychody do 85 528 zł w roku (łącznie z ulgą dla młodych).",
    },
    {
      id: "rokOd", czesc: "ulga", typ: "select", wymagane: true,
      etykieta: "Ulga na powrót — od którego roku?",
      zalezyOd: ["ulga"], widoczne: (w) => w.ulga === "powrot",
      nieDotyczy: "Dotyczy tylko ulgi na powrót.",
      opcje: lata.map((r) => ({ v: r, t: r })),
      podpowiedz: "Ulga na powrót działa przez 4 kolejne lata. Wybierz rok, w którym zaczynasz z niej korzystać.",
    },
    {
      id: "rokDo", czesc: "ulga", typ: "select", wymagane: true,
      etykieta: "Ulga na powrót — do którego roku?",
      zalezyOd: ["ulga", "rokOd"], widoczne: (w) => w.ulga === "powrot",
      nieDotyczy: "Dotyczy tylko ulgi na powrót.",
      opcje: lata.concat([String(+lata.at(-1) + 1), String(+lata.at(-1) + 2), String(+lata.at(-1) + 3)]).map((r) => ({ v: r, t: r })),
      podpowiedz: (w) => (w.rokOd ? `Najdłużej do ${+w.rokOd + 3} r. (4 lata).` : "Najpierw wybierz rok początkowy."),
      waliduj: (v, w) => (w.rokOd && (+v < +w.rokOd || +v > +w.rokOd + 3) ? `Wybierz rok od ${w.rokOd} do ${+w.rokOd + 3}.` : null),
    },
    poleOswiadczenie("oswiadczenia", "Oświadczam, że spełniam warunki wybranej ulgi (art. 21 ust. 1 pkt 152, 153 lub 154 ustawy o PIT) i proszę o jej uwzględnienie przy zaliczce na podatek od zasiłku macierzyńskiego. Jeśli przestanę spełniać warunki, poinformuję ZUS."),
  ],
  start: () => ({}),
  ostatniKrok: "Niższa zaliczka na podatek",
  poWyslaniu: () => "ZUS uwzględni ulgę od kolejnej wypłaty",
  polecany: () => null,
});

// ---------------------------------------------------------------------
// ZZD — zmiana danych (adres, nazwisko, konto)
// ---------------------------------------------------------------------
const zZakresu = (x) => (w) => (w.zakres || []).includes(x);
const ZZD = zdefiniuj({
  symbol: "ZZD",
  tytul: "Wniosek o zmianę danych osoby pobierającej zasiłek",
  krotko: "Zmiana adresu, nazwiska albo numeru konta do wypłaty.",
  kiedy: ["Pobierasz zasiłek (np. macierzyński) albo złożyłaś/złożyłeś o niego wniosek.", "Zmieniasz adres, nazwisko, imię albo konto — albo chcesz wypłaty na konto zamiast przekazu."],
  czas: "3 minuty",
  kategoria: "zmiany",
  czesci: [
    { id: "dane", tytul: "Twoje dane" },
    { id: "zakres", tytul: "Co zmieniasz" },
    { id: "adres", tytul: "Adres" },
    { id: "nazwisko", tytul: "Nazwisko lub imię" },
    { id: "konto", tytul: "Rachunek bankowy" },
    { id: "oswiadczenia", tytul: "Oświadczenie" },
  ],
  pola: [
    poleDane(), poleTelefon(),
    {
      id: "swiadczenie", czesc: "dane", typ: "wielokrotny", wymagane: true,
      etykieta: "Jakie świadczenie pobierasz (albo o jakie wnioskujesz)?",
      opcje: [
        { v: "macierzynski", t: "Zasiłek macierzyński (lub w wysokości zasiłku macierzyńskiego)" },
        { v: "chorobowy", t: "Zasiłek chorobowy" },
        { v: "opiekunczy", t: "Zasiłek opiekuńczy" },
        { v: "inne", t: "Inne (rehabilitacyjne, wyrównawczy, pogrzebowy)" },
      ],
      podpowiedz: "Możesz zaznaczyć kilka.",
    },
    {
      id: "zakres", czesc: "zakres", typ: "wielokrotny", wymagane: true,
      etykieta: "Czego dotyczy zmiana?",
      opcje: [
        { v: "adres", t: "Zmiana adresu zamieszkania" },
        { v: "koresp", t: "Adres do korespondencji (nowy lub zmiana)" },
        { v: "nazwisko", t: "Zmiana nazwiska lub imienia" },
        { v: "konto", t: "Rachunek bankowy (wypłata na konto lub nowy numer)" },
      ],
      podpowiedz: "Zaznacz wszystko, co się zmieniło. Wypełnisz tylko te części, które zaznaczysz — resztę wyłączymy.",
    },
    ...[["adres", "Nowy adres zamieszkania"], ["koresp", "Adres do korespondencji"]].flatMap(([k, nazwa]) => [
      {
        id: `${k}Ulica`, czesc: "adres", typ: "tekst", wymagane: true,
        etykieta: `${nazwa} — ulica i numer`, placeholder: "np. ul. Długa 5/12",
        zalezyOd: ["zakres"], widoczne: zZakresu(k), nieDotyczy: "Nie zaznaczono tej zmiany.",
        podpowiedz: k === "adres" ? "Adres, pod którym teraz mieszkasz." : "Adres, na który mamy wysyłać listy — jeśli inny niż zamieszkania.",
        waliduj: min3,
      },
      {
        id: `${k}Kod`, czesc: "adres", typ: "tekst", wymagane: true, inputMode: "numeric",
        etykieta: `${nazwa} — kod pocztowy`, placeholder: "00-000",
        zalezyOd: ["zakres"], widoczne: zZakresu(k), nieDotyczy: "Nie zaznaczono tej zmiany.",
        podpowiedz: "Format 00-000.",
        waliduj: (v) => (/^\d{2}-\d{3}$/.test(v.trim()) ? null : "Wpisz kod w formacie 00-000."),
      },
      {
        id: `${k}Miasto`, czesc: "adres", typ: "tekst", wymagane: true,
        etykieta: `${nazwa} — miejscowość`,
        zalezyOd: ["zakres"], widoczne: zZakresu(k), nieDotyczy: "Nie zaznaczono tej zmiany.",
        podpowiedz: "Miejscowość.",
        waliduj: (v) => (v.trim().length < 2 ? "Wpisz miejscowość." : null),
      },
    ]),
    {
      id: "noweNazwisko", czesc: "nazwisko", typ: "tekst", wymagane: false,
      etykieta: "Nazwisko po zmianie",
      zalezyOd: ["zakres"], widoczne: zZakresu("nazwisko"), nieDotyczy: "Nie zaznaczono zmiany nazwiska ani imienia.",
      podpowiedz: (w, ctx) => `Dotychczasowe nazwisko: ${ctx.profil?.nazwisko}. Jeśli zmieniasz tylko imię — pomiń.`,
    },
    {
      id: "noweImie", czesc: "nazwisko", typ: "tekst", wymagane: false,
      etykieta: "Imię po zmianie",
      zalezyOd: ["zakres"], widoczne: zZakresu("nazwisko"), nieDotyczy: "Nie zaznaczono zmiany nazwiska ani imienia.",
      podpowiedz: (w, ctx) => `Dotychczasowe imię: ${ctx.profil?.imie}. Jeśli zmieniasz tylko nazwisko — pomiń.`,
      waliduj: (v, w) => null,
    },
    {
      id: "kontoGdzie", czesc: "konto", typ: "radio", wymagane: true,
      etykieta: "Gdzie mamy przekazywać zasiłek?",
      zalezyOd: ["zakres"], widoczne: zZakresu("konto"), nieDotyczy: "Nie zaznaczono zmiany konta.",
      opcje: [
        { v: "pl", t: "Na konto w Polsce" },
        { v: "zagranica", t: "Na konto za granicą (oprócz USA)" },
      ],
      podpowiedz: "Konto w USA wymaga dodatkowych danych banku — w prototypie pokazujemy Polskę i inne kraje.",
    },
    {
      id: "iban", czesc: "konto", typ: "tekst", wymagane: true, inputMode: "numeric",
      etykieta: "Numer konta (26 cyfr)", placeholder: "00 0000 0000 0000 0000 0000 0000",
      zalezyOd: ["kontoGdzie"], widoczne: (w) => zZakresu("konto")(w) && w.kontoGdzie === "pl",
      nieDotyczy: "Dotyczy konta w Polsce.",
      podpowiedz: "Numer znajdziesz w aplikacji banku.",
      waliduj: (v) => (v.replace(/\D/g, "").length === 26 ? null : "Numer konta w Polsce ma 26 cyfr."),
    },
    {
      id: "ibanZagr", czesc: "konto", typ: "tekst", wymagane: true,
      etykieta: "Międzynarodowy numer konta (IBAN)", placeholder: "np. DE89 3704 0044 0532 0130 00",
      zalezyOd: ["kontoGdzie"], widoczne: (w) => zZakresu("konto")(w) && w.kontoGdzie === "zagranica",
      nieDotyczy: "Dotyczy konta za granicą.",
      podpowiedz: "Pełny numer IBAN z kodem kraju na początku.",
      waliduj: (v) => (/^[A-Z]{2}\d{2}[A-Z0-9 ]{10,32}$/i.test(v.trim()) ? null : "IBAN zaczyna się od 2 liter kraju i 2 cyfr."),
    },
    {
      id: "bic", czesc: "konto", typ: "tekst", wymagane: true,
      etykieta: "Kod banku BIC/SWIFT", placeholder: "np. COBADEFFXXX",
      zalezyOd: ["kontoGdzie"], widoczne: (w) => zZakresu("konto")(w) && w.kontoGdzie === "zagranica",
      nieDotyczy: "Dotyczy konta za granicą.",
      podpowiedz: "8 albo 11 znaków — znajdziesz go na stronie banku.",
      waliduj: (v) => (/^[A-Z0-9]{8}([A-Z0-9]{3})?$/i.test(v.trim()) ? null : "BIC ma 8 albo 11 znaków."),
    },
    {
      id: "wlasciciel", czesc: "konto", typ: "tekst", wymagane: true,
      etykieta: "Imię i nazwisko właściciela konta",
      zalezyOd: ["zakres"], widoczne: zZakresu("konto"), nieDotyczy: "Nie zaznaczono zmiany konta.",
      podpowiedz: "Najlepiej, żeby konto było na Ciebie.",
      waliduj: min3,
    },
    poleOswiadczenie(),
  ],
  start: (s) => (s.profil ? { wlasciciel: `${s.profil.imie} ${s.profil.nazwisko}` } : {}),
  ostatniKrok: "Zmiana w systemie ZUS",
  poWyslaniu: () => "Nowe dane zastosujemy przy kolejnej wypłacie",
  polecany: () => null,
});

// ---------------------------------------------------------------------
// ZPW — wniosek o wydanie zaświadczenia
// ---------------------------------------------------------------------
const RODZAJE_ZPW = [
  { v: "prawo", t: "O prawie do zasiłku chorobowego lub świadczenia rehabilitacyjnego" },
  { v: "kwoty", t: "O kwotach wypłaconych świadczeń", opis: "Np. do kredytu albo urzędu." },
  { v: "poUstaniu", t: "O złożeniu wniosku o świadczenia za okres po ustaniu ubezpieczenia" },
  { v: "wyplatyPoUstaniu", t: "O świadczeniach wypłaconych za okres po ustaniu ubezpieczenia" },
  { v: "dzielenie", t: "O okresach zasiłku macierzyńskiego przy dzieleniu się urlopem rodzicielskim", opis: "Gdy drugi rodzic chce przejąć część urlopu." },
  { v: "niepobieranie", t: "O niepobieraniu zasiłku macierzyńskiego z ZUS" },
  { v: "inne", t: "W innej sprawie" },
];
const zKwot = (w) => ["kwoty", "poUstaniu", "wyplatyPoUstaniu"].includes(w.rodzaj);
const zDzieckiem = (w) => ["dzielenie", "niepobieranie"].includes(w.rodzaj);
const ZPW = zdefiniuj({
  symbol: "ZPW",
  tytul: "Wniosek o wydanie zaświadczenia w sprawie zasiłku",
  krotko: "Np. zaświadczenie o wypłaconym zasiłku albo okresach urlopu rodzicielskiego.",
  kiedy: ["Potrzebujesz papieru z ZUS — do banku, urzędu, pracodawcy drugiego rodzica.", "Np. gdy tata chce przejąć część urlopu rodzicielskiego."],
  czas: "3 minuty",
  kategoria: "zmiany",
  czesci: [
    { id: "dane", tytul: "Twoje dane" },
    { id: "zakres", tytul: "Jakie zaświadczenie" },
    { id: "odbior", tytul: "Cel i odbiór" },
  ],
  pola: [
    poleDane(), poleTelefon(),
    {
      id: "rodzaj", czesc: "zakres", typ: "radio", wymagane: true,
      etykieta: "Jakie zaświadczenie potrzebujesz?", opcje: RODZAJE_ZPW,
      podpowiedz: "Rodzice najczęściej wybierają „o okresach zasiłku macierzyńskiego przy dzieleniu się urlopem” — drugi rodzic daje je swojemu pracodawcy.",
    },
    {
      id: "swiadczenia", czesc: "zakres", typ: "wielokrotny", wymagane: true,
      etykieta: "Których świadczeń dotyczy?",
      zalezyOd: ["rodzaj"], widoczne: (w) => zKwot(w) || w.rodzaj === "prawo",
      nieDotyczy: "Nie dotyczy wybranego zaświadczenia.",
      opcje: [
        { v: "macierzynski", t: "Zasiłek macierzyński" },
        { v: "chorobowy", t: "Zasiłek chorobowy" },
        { v: "opiekunczy", t: "Zasiłek opiekuńczy" },
        { v: "rehabilitacyjne", t: "Świadczenie rehabilitacyjne" },
        { v: "inne", t: "Inne (wyrównawczy, pogrzebowy, w wysokości macierzyńskiego)" },
      ],
      podpowiedz: "Zaznacz jedno lub kilka.",
    },
    {
      id: "dziecko", czesc: "zakres", typ: "tekst", wymagane: true,
      etykieta: "Imię, nazwisko i data urodzenia dziecka",
      placeholder: "np. Zosia Testowa, 10.11.2026",
      zalezyOd: ["rodzaj"], widoczne: zDzieckiem, nieDotyczy: "Dotyczy tylko zaświadczeń o zasiłku macierzyńskim na dziecko.",
      podpowiedz: "Na które dziecko pobierasz (albo nie pobierasz) zasiłek.",
      waliduj: min3,
    },
    {
      id: "opisInne", czesc: "zakres", typ: "obszar", wymagane: true,
      etykieta: "Czego ma dotyczyć zaświadczenie?",
      zalezyOd: ["rodzaj"], widoczne: (w) => w.rodzaj === "inne", nieDotyczy: "Dotyczy tylko innej sprawy.",
      podpowiedz: "Napisz krótko własnymi słowami.",
      waliduj: min3,
    },
    ...poleOkres("zakres", "", { zalezyOd: ["rodzaj"], widoczne: (w) => !!w.rodzaj }),
    {
      id: "egzemplarze", czesc: "zakres", typ: "liczba", wymagane: true, min: 1, max: 10,
      etykieta: "Ile egzemplarzy?",
      zalezyOd: ["rodzaj"], widoczne: (w) => !!w.rodzaj,
      podpowiedz: "Zwykle wystarczy 1. Elektroniczne zaświadczenie w eZUS możesz wydrukować wiele razy.",
      waliduj: (v) => (+v >= 1 && +v <= 10 ? null : "Wpisz liczbę od 1 do 10."),
    },
    {
      id: "cel", czesc: "odbior", typ: "obszar", wymagane: true, wiersze: 2,
      etykieta: "Do czego potrzebujesz zaświadczenia?",
      placeholder: "np. dla pracodawcy męża — urlop rodzicielski",
      podpowiedz: "Np. „dla pracodawcy drugiego rodzica”, „do banku”, „do urzędu pracy”.",
      waliduj: min3,
    },
    poleOdbior("odbior"),
  ],
  start: () => ({ egzemplarze: "1" }),
  ostatniKrok: "Zaświadczenie gotowe",
  poWyslaniu: () => "Zaświadczenie dostaniesz w wybrany sposób",
  polecany: (s) => (s.etap === "dziecko" ? "Gdy dzielicie się urlopem rodzicielskim" : null),
});

// ---------------------------------------------------------------------
// ZAS-58 — wyjaśnienia, decyzja albo skarga
// ---------------------------------------------------------------------
const ZAS58 = zdefiniuj({
  symbol: "ZAS-58",
  tytul: "Wniosek o wyjaśnienia, decyzję albo skarga w sprawie zasiłku",
  krotko: "Coś się nie zgadza z zasiłkiem? Zapytaj, poproś o decyzję albo złóż skargę.",
  kiedy: ["Zasiłek przyszedł w innej kwocie, niż się spodziewasz, albo nie przyszedł wcale.", "Chcesz oficjalną decyzję ZUS albo złożyć skargę."],
  czas: "4 minuty",
  kategoria: "zmiany",
  czesci: [
    { id: "dane", tytul: "Twoje dane" },
    { id: "sprawa", tytul: "Twoja sprawa" },
    { id: "odbior", tytul: "Odpowiedź" },
  ],
  pola: [
    poleDane(), poleTelefon(),
    {
      id: "rodzaj", czesc: "sprawa", typ: "radio", wymagane: true,
      etykieta: "Czego potrzebujesz?",
      opcje: [
        { v: "wyjasnienia", t: "Wyjaśnień", opis: "Chcę zrozumieć, skąd taka kwota albo termin." },
        { v: "decyzja", t: "Decyzji ZUS", opis: "Oficjalne rozstrzygnięcie — można się od niego odwołać do sądu." },
        { v: "skarga", t: "Chcę złożyć skargę", opis: "Np. na sposób obsługi albo opóźnienie." },
      ],
      podpowiedz: "Nie wiesz? Zacznij od „Wyjaśnień”. O decyzję możesz poprosić np. wtedy, gdy nie zgadzasz się z kwotą wyliczoną przez pracodawcę.",
    },
    {
      id: "swiadczenie", czesc: "sprawa", typ: "select", wymagane: true,
      etykieta: "Którego świadczenia dotyczy sprawa?",
      opcje: [
        { v: "macierzynski", t: "Zasiłek macierzyński" },
        { v: "chorobowy", t: "Zasiłek chorobowy" },
        { v: "opiekunczy", t: "Zasiłek opiekuńczy" },
        { v: "wyrownawczy", t: "Zasiłek wyrównawczy" },
        { v: "rehabilitacyjne", t: "Świadczenie rehabilitacyjne" },
        { v: "pogrzebowy", t: "Zasiłek pogrzebowy" },
      ],
      podpowiedz: "Wybierz jedno.",
    },
    {
      id: "ktoWyplaca", czesc: "sprawa", typ: "radio", wymagane: true,
      etykieta: "Kto wypłaca to świadczenie?",
      opcje: [
        { v: "platnik", t: "Pracodawca (płatnik składek)" },
        { v: "zus", t: "ZUS" },
        { v: "nie_wiem", t: "Nie wiem" },
      ],
      podpowiedz: (w, ctx) => (ctx.zus?.ubezpieczenie?.platnikPowyzej20 ? `Z Twojego konta wynika, że wypłaca ${ctx.zus.ubezpieczenie.platnik}.` : "Z Twojego konta wynika, że zasiłek wypłaca ZUS."),
    },
    ...poleOkres("sprawa", "", { etykieta: "Za jaki okres" }).map((p) => ({ ...p, wymagane: false, podpowiedz: p.podpowiedz + " Jeśli sprawa nie dotyczy okresu — pomiń." })),
    {
      id: "opis", czesc: "sprawa", typ: "obszar", wymagane: true, wiersze: 5,
      etykieta: "Opisz sprawę",
      placeholder: "Co się stało, czego oczekujesz…",
      podpowiedz: "Napisz własnymi słowami: co się nie zgadza i czego oczekujesz. Nie musisz używać przepisów.",
      waliduj: (v) => (v.trim().length < 20 ? "Opisz sprawę w kilku zdaniach (min. 20 znaków)." : null),
    },
    {
      id: "zalaczniki", czesc: "sprawa", typ: "plik", wymagane: false,
      etykieta: "Załącznik (jeśli masz)",
      podpowiedz: "Np. pasek wynagrodzenia albo pismo od pracodawcy. Nieobowiązkowe.",
    },
    poleOdbior("odbior"),
  ],
  start: () => ({}),
  ostatniKrok: "Odpowiedź ZUS",
  poWyslaniu: () => "ZUS odpowie zwykle w ciągu 30 dni",
  polecany: () => null,
});

// ---------------------------------------------------------------------
// ZAS-59 — niezrealizowane świadczenie po zmarłym
// ---------------------------------------------------------------------
const ZAS59 = zdefiniuj({
  symbol: "ZAS-59",
  tytul: "Wniosek o wypłatę zasiłku należnego osobie zmarłej",
  krotko: "Gdy bliska osoba zmarła i nie zdążyła dostać należnego zasiłku.",
  kiedy: ["Osoba zmarła miała prawo do zasiłku (np. macierzyńskiego), ale nie dostała go w całości.", "Składa małżonek, dzieci, rodzice albo inna osoba uprawniona."],
  czas: "3 minuty",
  kategoria: "zmiany",
  czesci: [
    { id: "dane", tytul: "Twoje dane" },
    { id: "zmarly", tytul: "Osoba zmarła" },
    { id: "wyplata", tytul: "Wypłata" },
    { id: "oswiadczenia", tytul: "Oświadczenie" },
  ],
  pola: [
    poleDane(), poleTelefon(),
    {
      id: "imieZmarlego", czesc: "zmarly", typ: "tekst", wymagane: true,
      etykieta: "Imię i nazwisko osoby zmarłej",
      podpowiedz: "Bardzo nam przykro z powodu Twojej straty. Wypełnij formularz w swoim tempie — dane się zapisują.",
      waliduj: min3,
    },
    {
      id: "peselZmarlego", czesc: "zmarly", typ: "pesel", wymagane: true,
      etykieta: "PESEL osoby zmarłej",
      podpowiedz: "Znajdziesz go np. w akcie zgonu.",
      waliduj: (v) => (/^\d{11}$/.test(v) ? null : "PESEL ma dokładnie 11 cyfr."),
    },
    {
      id: "pokrewienstwo", czesc: "zmarly", typ: "select", wymagane: true,
      etykieta: "Kim była dla Ciebie ta osoba?",
      opcje: [
        { v: "malzonek", t: "Małżonkiem" },
        { v: "rodzic", t: "Mamą lub tatą" },
        { v: "dziecko", t: "Dzieckiem" },
        { v: "inna", t: "Inną osobą z rodziny" },
      ],
      podpowiedz: "Najpierw prawo do wypłaty mają małżonek i dzieci, potem rodzice.",
    },
    {
      id: "dataZgonu", czesc: "zmarly", typ: "data", wymagane: true,
      etykieta: "Data zgonu",
      podpowiedz: "Data z aktu zgonu. Wniosek trzeba złożyć w ciągu 12 miesięcy od śmierci.",
      waliduj: (v, w, ctx) => nieZPrzyszlosci(v, w, ctx) || ((new Date(ctx.dzis) - new Date(v)) / 864e5 > 365 ? "Minęło ponad 12 miesięcy — prawo do wypłaty mogło wygasnąć. Skontaktuj się z ZUS." : null),
    },
    poleSposobWyplaty("wyplata"),
    poleIban("wyplata"),
    poleOswiadczenie(),
  ],
  start: () => ({}),
  poWyslaniu: () => "ZUS ustali, komu przysługuje wypłata",
  polecany: () => null,
});


// ---------------------------------------------------------------------
// WNIOSKI O URLOPY — składasz u pracodawcy (zaprojektowane od zera,
// na podstawie Kodeksu pracy; ZUS nie ma tu wzoru)
// ---------------------------------------------------------------------
const tylkoUmowa = (s) => /umowa o pracę/.test(s.zus?.ubezpieczenie?.tytul || "");
const poleDzieckoUr = (czesc) => ({
  id: "dataUrDziecka", czesc, typ: "data", wymagane: true,
  etykieta: "Data urodzenia dziecka",
  podpowiedz: (w, ctx) => (ctx.zSesji?.dataUr && w.dataUrDziecka === ctx.zSesji.dataUr ? "Wpisaliśmy datę, którą nam podałaś/podałeś." : "Z aktu urodzenia."),
  waliduj: nieZPrzyszlosci,
});
const za21 = (ctx) => new Date(new Date(ctx.dzis).getTime() + 21 * 864e5).toISOString().slice(0, 10);
const za7 = (ctx) => new Date(new Date(ctx.dzis).getTime() + 7 * 864e5).toISOString().slice(0, 10);
const pracodawcaPole = () => ({
  ...polePlatnik(),
  etykieta: "Twój pracodawca",
  podpowiedz: "Wniosek o urlop trafi do działu kadr Twojego pracodawcy. Dane wzięliśmy z Twojego konta w ZUS.",
});
const doPracodawcy = { adresat: () => "pracodawca", ostatniKrok: "Decyzja pracodawcy", kategoria: "urlopy" };

const URL_M = zdefiniuj({
  ...doPracodawcy,
  symbol: "URL-M",
  tytul: "Wniosek o urlop macierzyński",
  krotko: "Część urlopu przed porodem albo urlop na warunkach macierzyńskiego.",
  kiedy: ["Chcesz zacząć urlop macierzyński przed porodem (najwcześniej 6 tygodni przed terminem).", "Albo przyjmujesz dziecko na wychowanie (urlop na warunkach urlopu macierzyńskiego).", "Po porodzie urlop zaczyna się sam — wystarczy odpis aktu urodzenia."],
  termin: "Przed dniem, od którego chcesz urlop. Po porodzie — dostarcz pracodawcy odpis aktu urodzenia.",
  dokumenty: ["Zaświadczenie lekarskie o przewidywanej dacie porodu (przy urlopie przed porodem)", "Skrócony odpis aktu urodzenia — po porodzie", "Przy adopcji: dokument z sądu o przyjęciu dziecka"],
  czas: "3 minuty",
  czesci: [
    { id: "dane", tytul: "Twoje dane i pracodawca" },
    { id: "urlop", tytul: "Urlop" },
    { id: "zalaczniki", tytul: "Załączniki" },
    { id: "oswiadczenia", tytul: "Oświadczenie" },
  ],
  pola: [
    poleDane(), poleTelefon(), pracodawcaPole(),
    {
      id: "rodzaj", czesc: "urlop", typ: "radio", wymagane: true,
      etykieta: "O jaki urlop wnioskujesz?",
      opcje: [
        { v: "przed", t: "Część urlopu macierzyńskiego przed porodem", opis: "Najwcześniej 6 tygodni przed przewidywaną datą porodu." },
        { v: "porod", t: "Urlop macierzyński od dnia porodu", opis: "Informujesz pracodawcę o porodzie." },
        { v: "przyjecie", t: "Urlop na warunkach urlopu macierzyńskiego", opis: "Adopcja albo rodzina zastępcza." },
      ],
      podpowiedz: "Urlop macierzyński przy jednym dziecku trwa 20 tygodni. Co najmniej 14 tygodni po porodzie musi wykorzystać mama.",
    },
    {
      id: "termin", czesc: "urlop", typ: "data", wymagane: true,
      etykieta: "Przewidywana data porodu",
      zalezyOd: ["rodzaj"], widoczne: (w) => w.rodzaj === "przed",
      nieDotyczy: "Dotyczy tylko urlopu przed porodem.",
      podpowiedz: (w, ctx) => (ctx.zSesji?.termin && w.termin === ctx.zSesji.termin ? "Wpisaliśmy termin, który nam podałaś." : "Z zaświadczenia od lekarza lub położnej."),
    },
    {
      id: "dataUr", czesc: "urlop", typ: "data", wymagane: true,
      etykieta: "Data porodu",
      zalezyOd: ["rodzaj"], widoczne: (w) => w.rodzaj === "porod",
      nieDotyczy: "Dotyczy tylko urlopu od dnia porodu.",
      podpowiedz: "Dzień, w którym urodziło się dziecko.",
      waliduj: nieZPrzyszlosci,
    },
    {
      id: "dataPrzyjecia", czesc: "urlop", typ: "data", wymagane: true,
      etykieta: "Data przyjęcia dziecka",
      zalezyOd: ["rodzaj"], widoczne: (w) => w.rodzaj === "przyjecie",
      nieDotyczy: "Dotyczy tylko adopcji i rodziny zastępczej.",
      podpowiedz: "Urlop przysługuje na dziecko do 7 lat (przy odroczonym obowiązku szkolnym do 10 lat).",
    },
    {
      id: "od", czesc: "urlop", typ: "data", wymagane: true,
      etykieta: "Od kiedy chcesz urlop?",
      zalezyOd: ["rodzaj"], widoczne: (w) => !!w.rodzaj,
      podpowiedz: (w) => (w.rodzaj === "przed" && w.termin ? `Najwcześniej od ${fmtData(new Date(new Date(w.termin).getTime() - 42 * 864e5).toISOString().slice(0, 10))} (6 tygodni przed terminem).` : "Pierwszy dzień urlopu."),
      waliduj: (v, w) => {
        if (w.rodzaj === "przed" && w.termin && (new Date(w.termin) - new Date(v)) / 864e5 > 42) return "Najwcześniej 6 tygodni przed przewidywaną datą porodu.";
        if (w.rodzaj === "przed" && w.termin && v > w.termin) return "Urlop przed porodem musi zacząć się przed terminem porodu.";
        if (w.rodzaj === "porod" && w.dataUr && v !== w.dataUr) return `Urlop po porodzie zaczyna się w dniu porodu: ${fmtData(w.dataUr)}.`;
        return null;
      },
    },
    {
      id: "liczbaDzieci", czesc: "urlop", typ: "select", wymagane: true,
      etykieta: "Ile dzieci przy jednym porodzie / przyjęciu?",
      zalezyOd: ["rodzaj"], widoczne: (w) => !!w.rodzaj,
      opcje: [{ v: "1", t: "1 dziecko — 20 tygodni" }, { v: "2", t: "2 dzieci — 31 tygodni" }, { v: "3", t: "3 dzieci — 33 tygodnie" }, { v: "4", t: "4 dzieci — 35 tygodni" }, { v: "5", t: "5 i więcej — 37 tygodni" }],
      podpowiedz: "Od tego zależy długość urlopu.",
    },
    {
      id: "zalTermin", czesc: "zalaczniki", typ: "plik", wymagane: true,
      etykieta: "Zaświadczenie lekarskie o przewidywanej dacie porodu",
      zalezyOd: ["rodzaj"], widoczne: (w) => w.rodzaj === "przed",
      nieDotyczy: "Potrzebne tylko przy urlopie przed porodem.",
      podpowiedz: "Zdjęcie albo PDF — w prototypie nic nie jest wysyłane.",
    },
    {
      id: "zalAkt", czesc: "zalaczniki", typ: "plik", wymagane: false,
      etykieta: "Skrócony odpis aktu urodzenia",
      zalezyOd: ["rodzaj"], widoczne: (w) => w.rodzaj === "porod",
      nieDotyczy: "Dołączysz po porodzie.",
      podpowiedz: "Jeśli jeszcze go nie masz — pomiń i donieś później.",
    },
    poleOswiadczenie("oswiadczenia", "Dane we wniosku są zgodne z prawdą. O zmianach (np. wcześniejszym porodzie) poinformuję pracodawcę."),
  ],
  start: (s) => ({ ...(s.terminPorodu ? { termin: s.terminPorodu, rodzaj: s.etap === "ciaza" ? "przed" : undefined } : {}), ...(s.dataPorodu ? { dataUr: s.dataPorodu } : {}) }),
  poWyslaniu: () => "Zasiłek za ten czas: wniosek ZAM",
  polecany: (s) => (tylkoUmowa(s) && s.etap === "ciaza" && s.ankieta?.rola === "mama" ? "Jeśli chcesz urlop przed porodem" : null),
});

const URL_R = zdefiniuj({
  ...doPracodawcy,
  symbol: "URL-R",
  tytul: "Wniosek o urlop rodzicielski",
  krotko: "41 tygodni do podziału (43 przy wieloraczkach), także z pracą na część etatu.",
  kiedy: ["Po urlopie macierzyńskim chcesz zostać z dzieckiem dłużej.", "Każdemu z rodziców przysługuje 9 tygodni, których nie można przekazać drugiemu."],
  termin: "Najpóźniej 21 dni przed rozpoczęciem urlopu. Jeśli chcesz go od razu po macierzyńskim w całości (zasiłek 81,5%) — do 21 dni po porodzie.",
  dokumenty: ["Skrócony odpis aktu urodzenia (jeśli pracodawca go nie ma)", "Wniosek ZAM o zasiłek — osobno, u płatnika zasiłku"],
  czas: "4 minuty",
  czesci: [
    { id: "dane", tytul: "Twoje dane i pracodawca" },
    { id: "dziecko", tytul: "Dziecko" },
    { id: "urlop", tytul: "Urlop" },
    { id: "oswiadczenia", tytul: "Oświadczenie" },
  ],
  pola: [
    poleDane(), poleTelefon(), pracodawcaPole(),
    { ...polaDziecka("dziecko", { miejsce: false })[0] },
    poleDzieckoUr("dziecko"),
    {
      id: "kiedyUrlop", czesc: "urlop", typ: "radio", wymagane: true,
      etykieta: "Kiedy chcesz urlop rodzicielski?",
      opcje: [
        { v: "odrazu", t: "Bezpośrednio po urlopie macierzyńskim, w całości", opis: "Wtedy możesz mieć zasiłek 81,5% za cały okres." },
        { v: "pozniej", t: "Później albo w częściach", opis: "Do 6. roku życia dziecka, maks. w 5 częściach." },
      ],
      podpowiedz: "Najczęściej wybierasz pierwszą opcję razem z wnioskiem ZAM 81,5%.",
    },
    ...poleOkres("urlop", "", { etykieta: "Okres urlopu" }).map((p) =>
      p.id === "od"
        ? { ...p, podpowiedz: (w, ctx) => (w.kiedyUrlop === "pozniej" ? `Najwcześniej od ${fmtData(za21(ctx))} — wniosek składasz 21 dni wcześniej.` : "Dzień po końcu urlopu macierzyńskiego."), waliduj: (v, w, ctx) => (w.kiedyUrlop === "pozniej" && v < za21(ctx) ? `Wniosek trzeba złożyć 21 dni przed urlopem — najwcześniej od ${fmtData(za21(ctx))}.` : null) }
        : { ...p, waliduj: (v, w) => (w.od && v < w.od ? "Data „do” nie może być wcześniejsza niż „od”." : w.od && (new Date(v) - new Date(w.od)) / 864e5 > 43 * 7 ? "Urlop rodzicielski to najwyżej 41 tygodni (43 przy wieloraczkach)." : null) },
    ),
    {
      id: "praca", czesc: "urlop", typ: "radio", wymagane: true,
      etykieta: "Czy chcesz łączyć urlop z pracą?",
      opcje: [{ v: "nie", t: "Nie" }, { v: "tak", t: "Tak, do połowy etatu" }],
      podpowiedz: "Możesz pracować do połowy etatu — urlop wydłuży się proporcjonalnie, a zasiłek będzie niższy. Przy łączeniu z pracą wniosek składasz 21 dni wcześniej.",
    },
    {
      id: "wymiar", czesc: "urlop", typ: "select", wymagane: true,
      etykieta: "W jakim wymiarze chcesz pracować?",
      zalezyOd: ["praca"], widoczne: (w) => w.praca === "tak", nieDotyczy: "Nie łączysz urlopu z pracą.",
      opcje: [{ v: "1/8", t: "1/8 etatu" }, { v: "1/4", t: "1/4 etatu" }, { v: "3/8", t: "3/8 etatu" }, { v: "1/2", t: "1/2 etatu" }],
      podpowiedz: "Maksymalnie pół etatu. Pracodawca może odmówić tylko z ważnych powodów organizacyjnych.",
    },
    {
      id: "drugiRodzic", czesc: "urlop", typ: "radio", wymagane: true,
      etykieta: "Czy drugi rodzic też weźmie część urlopu rodzicielskiego?",
      opcje: [{ v: "tak", t: "Tak" }, { v: "nie", t: "Nie" }, { v: "nie_wiem", t: "Jeszcze nie wiemy" }],
      podpowiedz: "Każdy rodzic ma 9 tygodni tylko dla siebie — jeśli drugi rodzic ich nie wykorzysta, przepadną. Jedno z rodziców może więc wziąć najwyżej 32 tygodnie (34 przy wieloraczkach).",
    },
    poleOswiadczenie("oswiadczenia", "Dane są zgodne z prawdą. Poinformuję pracodawcę, jeśli zmieni się okres urlopu albo drugi rodzic weźmie jego część."),
  ],
  start: (s) => (s.dataPorodu ? { dataUrDziecka: s.dataPorodu } : {}),
  poWyslaniu: () => "Pamiętaj o wniosku o zasiłek za ten czas",
  polecany: (s) => (tylkoUmowa(s) && ["ciaza", "dziecko"].includes(s.etap) ? "Złóż razem z ZAM (21 dni)" : null),
});

const URL_O = zdefiniuj({
  ...doPracodawcy,
  symbol: "URL-O",
  tytul: "Wniosek o urlop ojcowski",
  krotko: "2 tygodnie dla taty do 1. urodzin dziecka, zasiłek 100%.",
  kiedy: ["Jesteś tatą dziecka, które nie skończyło 12 miesięcy.", "Możesz wziąć 2 tygodnie naraz albo dwa razy po tygodniu."],
  termin: "Najpóźniej 7 dni przed rozpoczęciem urlopu.",
  dokumenty: ["Skrócony odpis aktu urodzenia dziecka", "Wniosek o zasiłek za ten czas (ZAM) — u płatnika zasiłku"],
  czas: "2 minuty",
  czesci: [
    { id: "dane", tytul: "Twoje dane i pracodawca" },
    { id: "dziecko", tytul: "Dziecko" },
    { id: "urlop", tytul: "Urlop" },
    { id: "oswiadczenia", tytul: "Oświadczenie" },
  ],
  pola: [
    poleDane(), poleTelefon(), pracodawcaPole(),
    { ...polaDziecka("dziecko", { miejsce: false })[0] },
    poleDzieckoUr("dziecko"),
    {
      id: "dlugosc", czesc: "urlop", typ: "radio", wymagane: true,
      etykieta: "Ile urlopu chcesz teraz wziąć?",
      opcje: [{ v: "2", t: "2 tygodnie naraz" }, { v: "1", t: "1 tydzień (drugi wezmę później)" }],
      podpowiedz: "Urlop ojcowski to 14 dni. Możesz go podzielić na 2 części po tygodniu.",
    },
    {
      id: "od", czesc: "urlop", typ: "data", wymagane: true,
      etykieta: "Od kiedy chcesz urlop?",
      zalezyOd: ["dlugosc"], widoczne: (w) => !!w.dlugosc,
      podpowiedz: (w, ctx) => `Najwcześniej od ${fmtData(za7(ctx))} (wniosek 7 dni wcześniej)` + (w.dataUrDziecka ? `, najpóźniej tak, by skończyć przed ${fmtData(new Date(new Date(w.dataUrDziecka).setFullYear(new Date(w.dataUrDziecka).getFullYear() + 1)).toISOString().slice(0, 10))}.` : "."),
      waliduj: (v, w, ctx) => {
        if (v < za7(ctx)) return `Wniosek trzeba złożyć 7 dni wcześniej — najwcześniej od ${fmtData(za7(ctx))}.`;
        if (w.dataUrDziecka) {
          const roczek = new Date(w.dataUrDziecka); roczek.setFullYear(roczek.getFullYear() + 1);
          const koniec = new Date(new Date(v).getTime() + (Number(w.dlugosc) * 7 - 1) * 864e5);
          if (koniec >= roczek) return "Urlop musi się skończyć, zanim dziecko skończy 12 miesięcy.";
        }
        return null;
      },
    },
    poleOswiadczenie("oswiadczenia", "Jestem ojcem dziecka. Dane są zgodne z prawdą."),
  ],
  start: (s) => (s.dataPorodu ? { dataUrDziecka: s.dataPorodu } : {}),
  poWyslaniu: () => "Zasiłek ojcowski: 100% podstawy — złóż też ZAM",
  polecany: (s) => (tylkoUmowa(s) && s.ankieta?.rola === "tata" && ["ciaza", "dziecko"].includes(s.etap) ? "Masz 2 tygodnie tylko dla siebie" : null),
});

const URL_W = zdefiniuj({
  ...doPracodawcy,
  symbol: "URL-W",
  tytul: "Wniosek o urlop wychowawczy",
  krotko: "Do 36 miesięcy opieki nad dzieckiem — bezpłatny, ze składkami z budżetu.",
  kiedy: ["Pracujesz co najmniej 6 miesięcy (liczy się cały staż pracy).", "Dziecko nie skończyło jeszcze 6 lat (licząc do końca roku kalendarzowego)."],
  termin: "Najpóźniej 21 dni przed rozpoczęciem urlopu.",
  dokumenty: ["Skrócony odpis aktu urodzenia", "Oświadczenie drugiego rodzica o korzystaniu (lub nie) z urlopu wychowawczego"],
  czas: "4 minuty",
  czesci: [
    { id: "dane", tytul: "Twoje dane i pracodawca" },
    { id: "dziecko", tytul: "Dziecko" },
    { id: "urlop", tytul: "Urlop" },
    { id: "oswiadczenia", tytul: "Oświadczenie" },
  ],
  pola: [
    poleDane(), poleTelefon(), pracodawcaPole(),
    { ...polaDziecka("dziecko", { miejsce: false })[0] },
    poleDzieckoUr("dziecko"),
    {
      id: "staz", czesc: "urlop", typ: "radio", wymagane: true,
      etykieta: "Czy masz co najmniej 6 miesięcy stażu pracy?",
      opcje: [{ v: "tak", t: "Tak" }, { v: "nie", t: "Nie" }],
      podpowiedz: "Liczy się cały dotychczasowy staż, nie tylko u obecnego pracodawcy.",
      waliduj: (v) => (v === "nie" ? "Urlop wychowawczy przysługuje po 6 miesiącach stażu pracy." : null),
    },
    ...poleOkres("urlop", "", { etykieta: "Okres urlopu" }).map((p) =>
      p.id === "od"
        ? { ...p, podpowiedz: (w, ctx) => `Najwcześniej od ${fmtData(za21(ctx))} — wniosek składasz 21 dni wcześniej.`, waliduj: (v, w, ctx) => (v < za21(ctx) ? `Wniosek trzeba złożyć 21 dni przed urlopem — najwcześniej od ${fmtData(za21(ctx))}.` : null) }
        : { ...p, waliduj: (v, w) => (w.od && v < w.od ? "Data „do” nie może być wcześniejsza niż „od”." : w.od && (new Date(v) - new Date(w.od)) / 864e5 > 36 * 31 ? "Urlop wychowawczy to najwyżej 36 miesięcy." : w.dataUrDziecka && +v.slice(0, 4) > +w.dataUrDziecka.slice(0, 4) + 6 ? "Urlop przysługuje najdłużej do końca roku, w którym dziecko kończy 6 lat." : null) },
    ),
    {
      id: "czesc", czesc: "urlop", typ: "select", wymagane: true,
      etykieta: "Która to część urlopu?",
      opcje: [1, 2, 3, 4, 5].map((n) => ({ v: String(n), t: `${n}. część` })),
      podpowiedz: "Urlop wychowawczy możesz wykorzystać w maksymalnie 5 częściach.",
    },
    {
      id: "drugiRodzic", czesc: "urlop", typ: "radio", wymagane: true,
      etykieta: "Czy drugi rodzic będzie w tym samym czasie na urlopie wychowawczym?",
      opcje: [{ v: "nie", t: "Nie" }, { v: "tak", t: "Tak" }],
      podpowiedz: "Rodzice mogą być jednocześnie na urlopie wychowawczym najwyżej 4 miesiące. Każdy z rodziców ma 1 miesiąc tylko dla siebie.",
    },
    poleOswiadczenie("oswiadczenia", "Dane są zgodne z prawdą. W czasie urlopu wychowawczego nie dostaję wynagrodzenia — składki emerytalne i rentowe opłaca za mnie budżet państwa."),
  ],
  start: (s) => (s.dataPorodu ? { dataUrDziecka: s.dataPorodu } : {}),
  poWyslaniu: () => "Sprawdź też dodatki z gminy na czas urlopu",
  polecany: () => null,
});


// ---------------------------------------------------------------------
// USC — odpis aktu urodzenia (symulacja usługi z gov.pl / rejestr stanu cywilnego)
// ---------------------------------------------------------------------
const CEL_ZUS = ["zus", "zasilek", "800"];
const USC_ODPIS = zdefiniuj({
  symbol: "USC-1",
  tytul: "Wniosek o odpis aktu urodzenia dziecka",
  krotko: "Odpis skrócony, zupełny albo wielojęzyczny — z rejestru stanu cywilnego.",
  kiedy: ["Potrzebujesz odpisu aktu urodzenia, np. dla pracodawcy, do paszportu albo za granicę.", "Pierwszy odpis skrócony dostajesz bezpłatnie z urzędu po zarejestrowaniu urodzenia."],
  termin: "Bez terminu. Urząd wydaje odpis od ręki albo w kilka dni.",
  dokumenty: ["Nic nie dołączasz, jeśli odpis dotyczy Ciebie albo Twojego dziecka", "Dowód opłaty skarbowej — jeśli jest wymagana"],
  czas: "3 minuty",
  kategoria: "usc",
  adresat: () => "usc",
  ostatniKrok: "Odpis gotowy",
  czesci: [
    { id: "dane", tytul: "Twoje dane" },
    { id: "akt", tytul: "Czyj akt" },
    { id: "odpis", tytul: "Rodzaj odpisu" },
    { id: "odbior", tytul: "Odbiór i opłata" },
    { id: "oswiadczenia", tytul: "Oświadczenie" },
  ],
  pola: [
    poleDane(), poleTelefon(),
    {
      id: "czyj", czesc: "akt", typ: "radio", wymagane: true,
      etykieta: "Czyj akt urodzenia?",
      opcje: [
        { v: "dziecko", t: "Mojego dziecka" },
        { v: "moj", t: "Mój" },
      ],
      podpowiedz: "Rodzic może dostać odpis aktu dziecka bez dodatkowych dokumentów.",
    },
    { ...polaDziecka("akt", { miejsce: true })[0], zalezyOd: ["czyj"], widoczne: (w) => w.czyj === "dziecko", nieDotyczy: "Odpis dotyczy Ciebie." },
    { ...polaDziecka("akt")[1], zalezyOd: ["czyj"], widoczne: (w) => w.czyj === "dziecko", nieDotyczy: "Odpis dotyczy Ciebie." },
    {
      id: "miejsceUrDziecka", czesc: "akt", typ: "tekst", wymagane: true,
      etykieta: "Miejsce urodzenia (miejscowość)",
      zalezyOd: ["czyj"], widoczne: (w) => !!w.czyj,
      podpowiedz: "Od miejsca urodzenia zależy, który urząd stanu cywilnego sporządził akt. Wniosek możesz złożyć w każdym USC.",
      waliduj: (v) => (v.trim().length < 2 ? "Wpisz miejscowość." : null),
    },
    {
      id: "rodzajOdpisu", czesc: "odpis", typ: "radio", wymagane: true,
      etykieta: "Jakiego odpisu potrzebujesz?",
      opcje: [
        { v: "skrocony", t: "Skrócony", opis: "Aktualne dane z aktu — wystarcza w większości spraw (pracodawca, ZUS, 800+). Opłata 22 zł." },
        { v: "zupelny", t: "Zupełny", opis: "Pełna treść aktu z późniejszymi zmianami, np. zmianą nazwiska. Opłata 33 zł." },
        { v: "wielojezyczny", t: "Wielojęzyczny skrócony", opis: "Do użycia za granicą (wybrane kraje). Tylko papierowy." },
      ],
      podpowiedz: "Nie wiesz, który wybrać? Do spraw w Polsce zwykle wystarczy skrócony.",
    },
    {
      id: "egzemplarze", czesc: "odpis", typ: "liczba", wymagane: true, min: 1, max: 5,
      etykieta: "Ile egzemplarzy?",
      podpowiedz: "Każdy egzemplarz to osobna opłata (gdy jest wymagana).",
      waliduj: (v) => (+v >= 1 && +v <= 5 ? null : "Wpisz liczbę od 1 do 5."),
    },
    {
      id: "cel", czesc: "odbior", typ: "select", wymagane: true,
      etykieta: "Do czego potrzebujesz odpisu?",
      opcje: [
        { v: "zus", t: "Do sprawy w ZUS (np. zasiłek macierzyński)" },
        { v: "pracodawca", t: "Dla pracodawcy (urlop, kadry)" },
        { v: "dokument", t: "Do dowodu osobistego lub paszportu" },
        { v: "zagranica", t: "Do sprawy za granicą" },
        { v: "inny", t: "Inny cel" },
      ],
      podpowiedz: (w) =>
        CEL_ZUS.includes(w.cel) || w.cel === "dokument" || w.cel === "pracodawca"
          ? "W tej sprawie odpis jest zwolniony z opłaty skarbowej."
          : "Od celu zależy, czy zapłacisz opłatę skarbową. Do spraw w ZUS, pracy i dokumentów tożsamości odpis jest bezpłatny.",
    },
    {
      id: "forma", czesc: "odbior", typ: "radio", wymagane: true,
      etykieta: "W jakiej formie chcesz dostać odpis?",
      opcje: [
        { v: "epuap", t: "Elektronicznie — na skrzynkę ePUAP", opis: "Plik podpisany kwalifikowanym podpisem. Ważny tylko w wersji elektronicznej.", wylaczona: (w) => (w.rodzajOdpisu === "wielojezyczny" ? "Wielojęzyczny odpis wydawany jest tylko na papierze." : null) },
        { v: "poczta", t: "Pocztą na adres zamieszkania" },
        { v: "osobiscie", t: "Odbiór osobisty w urzędzie stanu cywilnego" },
      ],
      podpowiedz: "Elektroniczny odpis wyślesz od razu dalej, np. do ZUS przez eZUS.",
    },
    {
      id: "oplata", czesc: "odbior", typ: "potwierdz", wymagane: true,
      etykieta: "Opłata skarbowa",
      zrodlo: "wyliczenie na podstawie wniosku",
      wiersze: (ctx, w = {}) => {
        const zw = ["zus", "pracodawca", "dokument"].includes(w.cel);
        const cena = w.rodzajOdpisu === "zupelny" ? 33 : w.rodzajOdpisu === "wielojezyczny" ? 17 : 22;
        const n = Math.max(1, +w.egzemplarze || 1);
        return [
          ["Odpis", `${{ skrocony: "skrócony", zupelny: "zupełny", wielojezyczny: "wielojęzyczny" }[w.rodzajOdpisu] || "—"} × ${n}`],
          ["Do zapłaty", zw ? "0 zł — zwolnione z opłaty" : `${cena * n} zł`],
        ];
      },
      podsumowanie: "Zapoznano się z opłatą",
      komunikatPusty: "Sprawdź wysokość opłaty i kliknij „Dane są poprawne”.",
      podpowiedz: (w) => {
        const zw = ["zus", "pracodawca", "dokument"].includes(w.cel);
        const cena = w.rodzajOdpisu === "zupelny" ? 33 : w.rodzajOdpisu === "wielojezyczny" ? 17 : 22;
        const n = Math.max(1, +w.egzemplarze || 1);
        return zw ? "Do zapłaty: 0 zł — ten cel jest zwolniony z opłaty skarbowej. Kliknij „Dane są poprawne”." : `Do zapłaty: ${cena * n} zł (${n} × ${cena} zł). W prototypie płatność jest symulowana. Kliknij „Dane są poprawne”.`;
      },
    },
    poleOswiadczenie("oswiadczenia", "Dane we wniosku są zgodne z prawdą. Odpis dotyczy mnie albo mojego dziecka."),
  ],
  start: (s) => ({ czyj: "dziecko", egzemplarze: "1", rodzajOdpisu: "skrocony", ...(s.dataPorodu ? { dataUrDziecka: s.dataPorodu } : {}) }),
  poWyslaniu: (ctx) => "Urząd stanu cywilnego przygotuje odpis — dostaniesz powiadomienie",
  polecany: (s) => (s.etap === "dziecko" ? "Potrzebny do zasiłku i urlopów" : null),
});


// ---------------------------------------------------------------------
// 800+ — świadczenie wychowawcze (wniosek składany elektronicznie do ZUS)
// ---------------------------------------------------------------------
const SW800 = zdefiniuj({
  symbol: "SW-800",
  tytul: "Wniosek o świadczenie wychowawcze 800+",
  krotko: "800 zł miesięcznie na każde dziecko do 18 lat — bez kryterium dochodowego.",
  kiedy: ["Masz dziecko poniżej 18 lat, które mieszka z Tobą.", "Złóż wniosek do 3 miesięcy od urodzenia — dostaniesz pieniądze od miesiąca narodzin."],
  termin: "Do 3 miesięcy od urodzenia dziecka — wtedy z wyrównaniem od miesiąca narodzin.",
  dokumenty: ["Zwykle żadnych — ZUS sprawdzi dane w rejestrach", "Gdy ktoś z rodziny pracuje lub mieszka za granicą — informacja o tym (koordynacja)"],
  czas: "4 minuty",
  kategoria: "rodzina",
  adresat: () => "zus",
  ostatniKrok: "Informacja o przyznaniu",
  czesci: [
    { id: "dane", tytul: "Twoje dane" },
    { id: "dziecko", tytul: "Dziecko" },
    { id: "rodzina", tytul: "Rodzina" },
    { id: "wyplata", tytul: "Wypłata" },
    { id: "oswiadczenia", tytul: "Oświadczenia" },
  ],
  pola: [
    poleDane(), poleTelefon(),
    {
      id: "emailKontakt", czesc: "dane", typ: "tekst", wymagane: true, inputMode: "email",
      etykieta: "Adres e-mail",
      placeholder: "np. anna@example.com",
      podpowiedz: "Na ten adres ZUS wyśle informację o przyznaniu 800+.",
      waliduj: (v) => (/^\S+@\S+\.\S+$/.test(v.trim()) ? null : "Wpisz poprawny adres e-mail."),
    },
    { ...polaDziecka("dziecko", { miejsce: false })[0] },
    { ...polaDziecka("dziecko")[1] },
    {
      id: "peselDziecka", czesc: "dziecko", typ: "pesel", wymagane: true,
      etykieta: "PESEL dziecka",
      podpowiedz: "PESEL dziecko dostaje po zarejestrowaniu urodzenia w urzędzie stanu cywilnego.",
      waliduj: (v) => (/^\d{11}$/.test(v) ? null : "PESEL ma dokładnie 11 cyfr."),
    },
    {
      id: "mieszka", czesc: "dziecko", typ: "radio", wymagane: true,
      etykieta: "Czy dziecko mieszka z Tobą i jest na Twoim utrzymaniu?",
      opcje: [{ v: "tak", t: "Tak" }, { v: "nie", t: "Nie" }],
      podpowiedz: "800+ dostaje osoba, z którą dziecko mieszka i która je utrzymuje.",
      waliduj: (v) => (v === "nie" ? "800+ przysługuje osobie, z którą dziecko mieszka. Wniosek powinna złożyć ta osoba." : null),
    },
    {
      id: "drugiRodzic", czesc: "rodzina", typ: "tekst", wymagane: false,
      etykieta: "Imię i nazwisko drugiego rodzica",
      podpowiedz: "Nieobowiązkowe, jeśli drugi rodzic jest nieznany albo nie żyje.",
    },
    {
      id: "zagranica", czesc: "rodzina", typ: "radio", wymagane: true,
      etykieta: "Czy ktoś z Twojej rodziny pracuje, mieszka lub dostaje świadczenia za granicą?",
      opcje: [{ v: "nie", t: "Nie" }, { v: "tak", t: "Tak" }],
      podpowiedz: "Chodzi o kraje UE, EOG, Szwajcarię i Wielką Brytanię. Wtedy ZUS ustala, które państwo wypłaca świadczenie (koordynacja).",
    },
    {
      id: "kraj", czesc: "rodzina", typ: "tekst", wymagane: true,
      etykieta: "Kto i w jakim kraju?",
      placeholder: "np. mąż pracuje w Niemczech",
      zalezyOd: ["zagranica"], widoczne: (w) => w.zagranica === "tak", nieDotyczy: "Nikt z rodziny nie jest za granicą.",
      podpowiedz: "Krótko: kto, w jakim kraju, czy pracuje albo pobiera tam świadczenia.",
      waliduj: min3,
    },
    { ...poleIban("wyplata"), zalezyOd: [], widoczne: undefined, podpowiedz: "800+ wypłacamy tylko na konto w banku. Konto musi należeć do Ciebie." },
    poleOswiadczenie("oswiadczenia", "Oświadczam, że dane są zgodne z prawdą. Poinformuję ZUS o każdej zmianie, która może wpłynąć na prawo do świadczenia (np. dziecko zamieszka z drugim rodzicem albo ktoś z rodziny wyjedzie do pracy za granicę)."),
  ],
  start: (s) => (s.dataPorodu ? { dataUrDziecka: s.dataPorodu } : {}),
  poWyslaniu: () => "Informację o przyznaniu dostaniesz na eZUS i e-mailem",
  polecany: (s) => (s.etap === "dziecko" ? "Masz 3 miesiące od urodzenia" : null),
});

// ---------------------------------------------------------------------
// Dokumenty, które wypełnia ktoś inny — pokazujemy, jak o nie poprosić
// ---------------------------------------------------------------------
export const DOKUMENTY_INNYCH = [
  {
    symbol: "Z-3", kto: "Pracodawca", ikona: "teczka",
    tytul: "Zaświadczenie płatnika składek (pracownicy)",
    poCo: "ZUS wylicza z niego wysokość zasiłku, gdy wypłaca go ZUS (firma do 20 osób).",
    kroki: ["Poproś kadry albo księgowość o Z-3 do zasiłku macierzyńskiego.", "Pracodawca wysyła je do ZUS elektronicznie — zwykle nie musisz nic nosić.", "Sprawdź w eZUS, czy dokument dotarł."],
    dotyczy: (s) => /umowa o pracę/.test(s.zus?.ubezpieczenie?.tytul || "") && !s.zus?.ubezpieczenie?.platnikPowyzej20,
  },
  {
    symbol: "Z-3a", kto: "Zleceniodawca / płatnik", ikona: "teczka",
    tytul: "Zaświadczenie płatnika składek (umowa zlecenie i inne)",
    poCo: "Jak Z-3, ale dla osób na zleceniu, w spółdzielni, na kontrakcie.",
    kroki: ["Poproś zleceniodawcę o Z-3a do zasiłku macierzyńskiego.", "Płatnik przekazuje je do ZUS.", "Pamiętaj: zasiłek przysługuje, jeśli płacisz dobrowolną składkę chorobową."],
    dotyczy: (s) => s.ankieta?.praca === "zlecenie",
  },
  {
    symbol: "ZAS-15", kto: "Pracodawca", ikona: "zegar",
    tytul: "Zaświadczenie o urlopie macierzyńskim, rodzicielskim lub ojcowskim",
    poCo: "Potwierdza ZUS-owi, na jaki okres dostałaś/dostałeś urlop — albo że z niego zrezygnowałaś/zrezygnowałeś.",
    kroki: ["Złóż u pracodawcy wniosek o urlop.", "Poproś, żeby wysłał do ZUS zaświadczenie ZAS-15.", "Bez niego ZUS może nie znać okresu urlopu i wstrzymać wypłatę."],
    dotyczy: (s) => /umowa o pracę/.test(s.zus?.ubezpieczenie?.tytul || ""),
  },
  {
    symbol: "ZAS-24", kto: "Płatnik zasiłku", ikona: "dokument",
    tytul: "Zaświadczenie o okresach wypłaconego zasiłku macierzyńskiego",
    poCo: "Gdy rodzice dzielą się zasiłkiem i mają różnych płatników — drugi płatnik wie, ile już wykorzystano.",
    kroki: ["Poproś swojego płatnika (pracodawcę albo ZUS) o ZAS-24.", "Przekaż je drugiemu rodzicowi.", "Drugi rodzic dołącza je do swojego wniosku ZAM."],
    dotyczy: (s) => s.etap === "dziecko",
  },
  {
    symbol: "ZAS-40", kto: "Lekarz w szpitalu", ikona: "serce",
    tytul: "Zaświadczenie lekarskie o pobycie mamy w szpitalu",
    poCo: "Pozwala przekazać zasiłek tacie na czas, gdy mama jest w szpitalu — i wrócić do niej po wypisie.",
    kroki: ["Poproś lekarza prowadzącego w szpitalu o ZAS-40.", "Tata dołącza je do wniosku ZAM.", "Po wypisie lekarz wpisuje datę wyjścia — zasiłek wraca do mamy."],
    dotyczy: (s) => s.etap === "dziecko",
  },
];

// ---------------------------------------------------------------------
// Rejestr
// ---------------------------------------------------------------------
export const KATEGORIE = [
  { id: "rodzina", nazwa: "Świadczenia na dziecko", ikona: "serce" },
  { id: "usc", nazwa: "Akt urodzenia — urząd stanu cywilnego", ikona: "dokument" },
  { id: "urlopy", nazwa: "Urlopy — składasz u pracodawcy", ikona: "teczka" },
  { id: "macierzynski", nazwa: "Zasiłek macierzyński", ikona: "dokument" },
  { id: "opiekunczy", nazwa: "Opieka nad dzieckiem", ikona: "serce" },
  { id: "podatek", nazwa: "Podatek od zasiłku", ikona: "kalkulator" },
  { id: "zmiany", nazwa: "Zmiany, zaświadczenia i sprawy", ikona: "teczka" },
];

const zamZPoleceniem = {
  ...ZAM,
  uwagaStart: undefined,
  kiedy: ["Urodzisz albo urodziłaś dziecko, adoptujesz je lub przyjmujesz do rodziny zastępczej.", "Masz ubezpieczenie chorobowe."],
  polecany: (s) => (["ciaza", "dziecko", "adopcja"].includes(s.etap) ? "Najważniejszy wniosek na Twoim etapie" : null),
};

export const FORMULARZE = [SW800, USC_ODPIS, URL_M, URL_R, URL_O, URL_W, zamZPoleceniem, ZAS26, ZAS33, ZAS23, ZAS55, ZAS39, ZPM, ZPO, ZPW, ZZD, ZAS58, ZAS59];

// GDZIE ZŁOŻYĆ: wnioski o zasiłek trafiają do płatnika zasiłku — pracodawcy, gdy zgłasza
// ponad 20 osób do ubezpieczenia chorobowego; w innym wypadku do ZUS.
const doPlatnikaZasilku = (ctx) => (ctx.zus?.ubezpieczenie?.platnikPowyzej20 ? "pracodawca" : "zus");
const DO_PLATNIKA = ["ZAM", "ZAS-26", "ZAS-33", "ZAS-23", "ZAS-39"];
const INFO = {
  ZAM: {
    termin: "Przed porodem — najwcześniej 6 tygodni przed terminem. Jeśli chcesz 81,5% za cały rok: najpóźniej 21 dni po porodzie.",
    dokumenty: ["Skrócony odpis aktu urodzenia (albo dane z rejestru)", "Zaświadczenie lekarskie o terminie porodu — gdy składasz przed porodem", "Gdy wypłaca ZUS: zaświadczenie płatnika Z-3 (wysyła pracodawca)"],
  },
  "ZAS-26": { termin: "Razem z wnioskiem ZAM.", dokumenty: ["Postanowienie sądu albo zaświadczenie o wszczęciu postępowania o przysposobienie"] },
  "ZAS-33": { termin: "Razem z wnioskiem ZAM, gdy przejmujesz zasiłek.", dokumenty: ["Akt zgonu mamy albo dokument potwierdzający porzucenie dziecka"] },
  "ZAS-23": { termin: "Przed dniem, od którego chcesz wstrzymać zasiłek.", dokumenty: ["Przy pobycie w szpitalu: zaświadczenie ze szpitala (np. ZAS-40)"] },
  "ZAS-39": { termin: "Razem z e-ZLA na opiekę nad dzieckiem.", dokumenty: ["Zaświadczenie lekarskie e-ZLA o opiece", "Zaświadczenie ze szpitala o pobycie mamy (gdy dotyczy)"] },
  "ZAS-55": { termin: "Po rozwiązaniu umowy — im wcześniej, tym szybciej dostaniesz pieniądze.", dokumenty: ["Świadectwo pracy", "Zaświadczenie lekarskie o ciąży"] },
  ZPM: { termin: "W dowolnym momencie — ulga działa od kolejnej wypłaty." },
  ZPO: { termin: "W dowolnym momencie — ulga działa od kolejnej wypłaty." },
  ZPW: { termin: "Gdy potrzebujesz zaświadczenia." },
  ZZD: { termin: "Jak najszybciej po zmianie danych." },
  "ZAS-58": { termin: "Gdy masz wątpliwości co do zasiłku. Na decyzję możesz złożyć odwołanie do sądu w ciągu miesiąca." },
  "ZAS-59": { termin: "W ciągu 12 miesięcy od śmierci osoby uprawnionej." },
};
FORMULARZE.forEach((f) => {
  if (!f.adresat) f.adresat = DO_PLATNIKA.includes(f.symbol) ? doPlatnikaZasilku : () => "zus";
  Object.assign(f, { ...INFO[f.symbol], ...Object.fromEntries(Object.entries(f).filter(([k]) => ["termin", "dokumenty"].includes(k))) });
});

// Krótkie nazwy do menu
const MENU = {
  "SW-800": "800+ na dziecko", "USC-1": "Odpis aktu urodzenia", "URL-M": "Urlop macierzyński", "URL-R": "Urlop rodzicielski", "URL-O": "Urlop ojcowski", "URL-W": "Urlop wychowawczy",
  ZAM: "Zasiłek macierzyński", "ZAS-26": "Przyjęcie dziecka na wychowanie", "ZAS-33": "Porzucenie lub śmierć mamy",
  "ZAS-23": "Skrócenie lub wstrzymanie zasiłku", "ZAS-55": "Utrata pracy w ciąży", "ZAS-39": "Opieka nad noworodkiem",
  ZPM: "Ulga dla młodych (PIT)", ZPO: "Inne ulgi podatkowe", ZPW: "Zaświadczenie z ZUS", ZZD: "Zmiana adresu lub konta",
  "ZAS-58": "Wyjaśnienia, decyzja, skarga", "ZAS-59": "Zasiłek po osobie zmarłej",
};
FORMULARZE.forEach((f) => (f.menu = MENU[f.symbol] || f.tytul));

export const formularz = (symbol) => FORMULARZE.find((f) => f.symbol.toLowerCase() === String(symbol).toLowerCase());
export const slug = (f) => f.symbol.toLowerCase();
