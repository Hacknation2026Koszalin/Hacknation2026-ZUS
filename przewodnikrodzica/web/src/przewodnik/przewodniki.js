// =====================================================================
// PRZEWODNIKI PO ŚWIADCZENIACH — ten sam układ dla każdego świadczenia:
// W skrócie · Czy mi przysługuje? · Ile dostanę? · Jak długo? · Kiedy złożyć? ·
// Gdzie złożyć? · Jakie dokumenty? · Na co uważać? · Pytania i podstawa prawna.
// Przeczytać może każdy — ramka „Dla Ciebie” tylko mówi, czy to Twoja sytuacja.
// Tekst: **pogrubienie**. Tabela: { tabela: [[nagłówki], [wiersz], ...] }.
// =====================================================================
import { P } from "./parametry.js";

const zl = (n) => (n || 0).toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " zł";
const proc = (v) => String(v).replace(".", ",") + "%";
const umowa = (c) => /umowa o pracę/.test(c.zus?.ubezpieczenie?.tytul || "");
const kto = (c) =>
  umowa(c)
    ? c.zus?.ubezpieczenie?.platnikPowyzej20
      ? `Twój pracodawca (${c.zus.ubezpieczenie.platnik}) zgłasza ponad 20 osób, więc to **on wypłaci zasiłek**.`
      : "Twój pracodawca zgłasza do 20 osób, więc **zasiłek wypłaci ZUS** — dokumenty składasz u pracodawcy, a on przekaże je do ZUS."
    : "Zasiłek **wypłaci ZUS** — wniosek złożysz przez eZUS.";

export const PRZEWODNIKI = {
  // -------------------------------------------------------------------
  "zasilek-macierzynski": {
    tytul: "Zasiłek macierzyński",
    lead: "Pieniądze, które dostajesz zamiast wynagrodzenia, gdy opiekujesz się dzieckiem — w czasie urlopu macierzyńskiego, rodzicielskiego i ojcowskiego.",
    dlaCiebie: (c) => {
      const p = c.zus?.podstawaWymiaru || 0;
      if (c.sytuacja.swiadczenie !== "zasilek")
        return { status: ["szary", "Raczej nie przysługuje"], tekst: "Nie masz teraz ubezpieczenia chorobowego, więc zasiłku macierzyńskiego nie dostaniesz. Sprawdź **świadczenie rodzicielskie** (1000 zł miesięcznie)." };
      return {
        status: ["ok", "Przysługuje Ci"],
        tekst: `Masz ubezpieczenie chorobowe (${c.zus.ubezpieczenie.chorobowe}, ${c.zus.ubezpieczenie.tytul}). ${kto(c)}`,
        kwoty: [[`${proc(P.stawki.wariant815)} przez cały czas`, zl(p * P.stawki.wariant815 / 100)], [`${P.stawki.macierzynski}% za macierzyński`, zl(p * P.stawki.macierzynski / 100)], [`potem ${P.stawki.rodzicielski}% za rodzicielski`, zl(p * P.stawki.rodzicielski / 100)]],
        dopisek: `Miesięcznie, brutto, orientacyjnie — od podstawy ${zl(p)}.`,
      };
    },
    skrot: ["Dostajesz go, jeśli masz **ubezpieczenie chorobowe** i urodziłaś dziecko albo przyjęłaś je na wychowanie.", "Urlop macierzyński trwa **20 tygodni** (przy jednym dziecku), a po nim możesz wziąć **41 tygodni** urlopu rodzicielskiego.", "Masz dwa warianty: **81,5%** przez cały czas albo **100%** za macierzyński i **70%** za rodzicielski.", "Na wybór wariantu 81,5% masz **21 dni od porodu**."],
    komu: ["Zasiłek przysługuje, jeśli w dniu porodu (albo przyjęcia dziecka) masz ubezpieczenie chorobowe — przy umowie o pracę zawsze, przy działalności lub zleceniu tylko dobrowolne.", "Przy zasiłku macierzyńskim **nie ma okresu wyczekiwania** — nie musisz mieć ubezpieczenia przez określony czas.", "Dostaniesz go też, gdy przyjmiesz dziecko na wychowanie (adopcja) albo jako niezawodowa rodzina zastępcza — co do zasady na dziecko do 7 lat (do 10 lat przy odroczonym obowiązku szkolnym)."],
    ile: ["Zasiłek liczymy od **podstawy wymiaru** — zwykle średniego wynagrodzenia z ostatnich 12 miesięcy po odjęciu składek.", { tabela: [["Wariant", "Za urlop macierzyński", "Za urlop rodzicielski"], ["Wniosek do 21 dni po porodzie", "81,5%", "81,5%"], ["Wniosek o rodzicielski później", "100%", "70%"]] }, "Zasiłek nie może być niższy niż świadczenie rodzicielskie."],
    jakDlugo: [{ tabela: [["Dzieci przy jednym porodzie", "Urlop macierzyński", "Urlop rodzicielski"], ["1", "20 tygodni", "41 tygodni"], ["2", "31 tygodni", "43 tygodnie"], ["3", "33 tygodnie", "43 tygodnie"], ["4", "35 tygodni", "43 tygodnie"], ["5 i więcej", "37 tygodni", "43 tygodnie"]] }, "Z urlopu rodzicielskiego **9 tygodni jest tylko dla mamy i 9 tylko dla taty**. Mama musi wykorzystać co najmniej 14 tygodni urlopu macierzyńskiego."],
    kiedy: ["Urlop możesz zacząć **do 6 tygodni przed przewidywaną datą porodu**.", "Wariant 81,5% — wniosek **najpóźniej 21 dni po porodzie**.", "Przy wariancie 100% o urlop rodzicielski poprosisz osobno, najpóźniej 21 dni przed jego rozpoczęciem."],
    gdzie: ["**Umowa o pracę** — u pracodawcy. Jeśli zgłasza ponad 20 osób, sam wypłaca zasiłek; jeśli mniej — przekazuje dokumenty do ZUS.", "**Działalność albo zlecenie** — w ZUS, najprościej przez eZUS (wniosek ZAM)."],
    dokumenty: ["wniosek ZAM (od 24.10.2026 obejmuje też dawne ZUR i ZAO),", "przed porodem: zaświadczenie lekarskie o przewidywanej dacie porodu,", "po porodzie: skrócony odpis aktu urodzenia (albo dane z rejestru),", "przy adopcji lub rodzinie zastępczej: dokument z sądu lub ośrodka (ZAS-26)."],
    uwaga: ["**21 dni po porodzie** — potem wariant 81,5% przepada.", "W czasie urlopu macierzyńskiego nie pracujesz u pracodawcy, który go udzielił. Rodzicielski możesz łączyć z pracą do połowy etatu.", "Zaległość w składkach powyżej 1% minimalnego wynagrodzenia wstrzymuje wypłatę do spłaty."],
    pytania: [["Czy tata może przejąć część urlopu?", "Tak. Urlop rodzicielski rodzice dzielą między siebie, a 9 tygodni przysługuje tylko tacie. W określonych sytuacjach tata może przejąć też część macierzyńskiego."], ["Co, jeśli dziecko jest w szpitalu po porodzie?", "Przysługuje uzupełniający urlop macierzyński — do 15 tygodni, zależnie od wagi dziecka, tygodnia ciąży i czasu w szpitalu."]],
    prawo: "Ustawa z 25 czerwca 1999 r. o świadczeniach pieniężnych z ubezpieczenia społecznego w razie choroby i macierzyństwa (art. 29–31); Kodeks pracy (art. 180–182³).",
    wniosek: { link: "/przewodnik/wnioski/zam", tekst: "Złóż wniosek ZAM" },
  },

  // -------------------------------------------------------------------
  "chorobowy-ciaza": {
    tytul: "Zasiłek chorobowy w ciąży",
    lead: "Pieniądze za czas zwolnienia lekarskiego w ciąży — 100% podstawy, gdy lekarz wpisze na zwolnieniu kod B.",
    dlaCiebie: (c) =>
      c.sytuacja.chorobowe
        ? { status: ["ok", "Przysługuje Ci"], tekst: `Masz ubezpieczenie chorobowe. Na zwolnieniu w ciąży dostaniesz **100% podstawy** — orientacyjnie ${zl(c.zus?.podstawaWymiaru)} miesięcznie. ${kto(c)}` }
        : { status: ["szary", "Nie przysługuje"], tekst: "Nie masz ubezpieczenia chorobowego. Przy działalności albo zleceniu możesz do niego przystąpić — zasiłek dostaniesz po 90 dniach." },
    skrot: ["W ciąży zasiłek chorobowy wynosi **100% podstawy** (kod B na zwolnieniu).", "Trwa do **270 dni** — dłużej niż zwykłe 182 dni.", "Przy umowie o pracę przysługuje po **30 dniach** ubezpieczenia, przy dobrowolnym — po **90 dniach**."],
    komu: ["Masz ubezpieczenie chorobowe: przy umowie o pracę obowiązkowe, przy zleceniu albo działalności — dobrowolne.", "Minął **okres wyczekiwania**: 30 dni nieprzerwanego ubezpieczenia obowiązkowego albo 90 dni dobrowolnego.", "Lekarz wystawił zwolnienie (e-ZLA) — w ciąży z kodem B."],
    ile: ["**100% podstawy wymiaru** przez cały okres zwolnienia w ciąży.", "Przy umowie o pracę za pierwsze 33 dni zwolnienia w roku płaci pracodawca (wynagrodzenie chorobowe) — w ciąży też 100%. Od 34. dnia to zasiłek chorobowy."],
    jakDlugo: ["W ciąży — **do 270 dni**.", "Jeśli po tym czasie nadal nie możesz pracować, możesz wnioskować o **świadczenie rehabilitacyjne**."],
    kiedy: ["Wniosku nie składasz — wystarczy e-ZLA od lekarza, które trafia do ZUS i pracodawcy automatycznie.", "Zwolnienie musi zostać wystawione najpóźniej w dniu, od którego obowiązuje (wyjątek: do 3 dni wstecz)."],
    gdzie: ["Umowa o pracę — wypłaca pracodawca (powyżej 20 osób) albo ZUS (do 20 osób, na podstawie zaświadczenia Z-3 od pracodawcy).", "Zlecenie — ZUS, na podstawie Z-3a od zleceniodawcy.", "Działalność — ZUS, na podstawie danych o Twoich składkach."],
    dokumenty: ["e-ZLA (lekarz wystawia elektronicznie),", "zaświadczenie płatnika Z-3 lub Z-3a — gdy zasiłek wypłaca ZUS (przygotowuje pracodawca lub zleceniodawca)."],
    uwaga: ["**Praca w czasie zwolnienia** albo wykorzystywanie go niezgodnie z celem = utrata zasiłku za cały okres zwolnienia. ZUS może to skontrolować.", "Przerwa w opłacaniu dobrowolnej składki chorobowej kończy ubezpieczenie — znowu czeka Cię 90 dni wyczekiwania.", "Zaległość w składkach (działalność) powyżej 1% minimalnego wynagrodzenia wstrzymuje wypłatę."],
    pytania: [["Czy L4 w ciąży obniża potem zasiłek macierzyński?", "Nie — zasiłek macierzyński liczy się od podstawy z 12 miesięcy sprzed powstania prawa do zasiłku chorobowego, jeśli między nimi nie ma przerwy."]],
    prawo: "Ustawa zasiłkowa: art. 4 (okres wyczekiwania), art. 8 (270 dni w ciąży), art. 11 ust. 2 pkt 2 (100% w ciąży), art. 17 (utrata prawa).",
  },

  // -------------------------------------------------------------------
  "swiadczenie-rehabilitacyjne": {
    tytul: "Świadczenie rehabilitacyjne",
    lead: "Gdy skończy się zasiłek chorobowy, a nadal nie możesz pracować — ale dalsze leczenie rokuje powrót do pracy.",
    dlaCiebie: (c) =>
      c.sytuacja.chorobowe
        ? { status: ["info", "Może Cię dotyczyć później"], tekst: "Masz ubezpieczenie chorobowe. Świadczenie rehabilitacyjne jest **po wyczerpaniu zasiłku chorobowego** (w ciąży po 270 dniach)." }
        : { status: ["szary", "Nie dotyczy"], tekst: "Świadczenie przysługuje osobom, które wyczerpały zasiłek chorobowy — a do niego potrzebne jest ubezpieczenie chorobowe." },
    skrot: ["Przysługuje po wyczerpaniu zasiłku chorobowego, jeśli dalsze leczenie lub rehabilitacja **rokuje odzyskanie zdolności do pracy**.", "Trwa **do 12 miesięcy**.", "Wynosi **90%** podstawy przez 3 miesiące, potem **75%** — a gdy niezdolność przypada w ciąży, **100%**."],
    komu: ["Wyczerpałaś/wyczerpałeś zasiłek chorobowy (w ciąży — 270 dni).", "Nadal nie możesz pracować, ale lekarz orzecznik ZUS uzna, że dalsze leczenie przywróci Ci zdolność do pracy."],
    ile: [{ tabela: [["Okres", "Wysokość"], ["Pierwsze 3 miesiące", "90% podstawy"], ["Kolejne miesiące", "75% podstawy"], ["Niezdolność w okresie ciąży", "100% podstawy"]] }],
    jakDlugo: ["Na okres potrzebny do odzyskania zdolności do pracy — **maksymalnie 12 miesięcy**."],
    kiedy: ["Wniosek złóż **około 6 tygodni przed końcem zasiłku chorobowego** — żeby nie było przerwy w wypłacie."],
    gdzie: ["Zawsze w **ZUS** (także przez eZUS) — świadczenie wypłaca ZUS, nie pracodawca.", "O prawie decyduje lekarz orzecznik ZUS."],
    dokumenty: ["wniosek ZNp-7,", "zaświadczenie o stanie zdrowia od lekarza prowadzącego (N-9),", "wywiad zawodowy (N-10) — wypełnia pracodawca."],
    uwaga: ["Spóźniony wniosek = przerwa w pieniądzach między końcem zasiłku a decyzją.", "Praca zarobkowa w trakcie świadczenia = utrata prawa za cały okres.", "Jeśli orzecznik uzna, że nie odzyskasz zdolności do pracy — zamiast świadczenia możesz ubiegać się o rentę."],
    pytania: [["Czy muszę być na badaniu?", "Lekarz orzecznik może wydać orzeczenie na podstawie dokumentacji albo wezwać Cię na badanie."]],
    prawo: "Ustawa zasiłkowa: art. 18–22 (świadczenie rehabilitacyjne).",
  },

  // -------------------------------------------------------------------
  "zasilek-wysokosc-macierzynskiego": {
    tytul: "Zasiłek w wysokości zasiłku macierzyńskiego",
    lead: "Ochrona mamy w ciąży, która straciła pracę, bo pracodawca ogłosił upadłość, jest likwidowany albo zmarł.",
    dlaCiebie: (c) =>
      c.ustanie?.powod === "upadlosc"
        ? { status: ["ok", "Może Ci przysługiwać"], tekst: "Podałaś, że umowa kończy się przez upadłość lub likwidację pracodawcy. Od dnia po jej rozwiązaniu do porodu możesz dostać ten zasiłek." }
        : { status: ["info", "Dotyczy szczególnej sytuacji"], tekst: "Ten zasiłek przysługuje tylko, gdy w ciąży umowa skończyła się przez upadłość, likwidację lub śmierć pracodawcy. Datę końca umowy możesz dodać w ustawieniach." },
    skrot: ["Dla kobiety w ciąży, z którą rozwiązano umowę o pracę z powodu **upadłości lub likwidacji** pracodawcy (albo umowa wygasła po jego śmierci).", "Wypłaca **ZUS** — od dnia po rozwiązaniu umowy **do dnia porodu**.", "Wysokość — jak zasiłek macierzyński (100% podstawy)."],
    komu: ["Jesteś w ciąży w dniu rozwiązania umowy.", "Umowa skończyła się z powodu upadłości lub likwidacji pracodawcy albo jego śmierci.", "Nie zapewniono Ci innego zatrudnienia."],
    ile: ["**100% podstawy wymiaru** — liczonej jak przy zasiłku macierzyńskim."],
    jakDlugo: ["Od dnia następującego po rozwiązaniu umowy **do dnia porodu**. Po porodzie złożysz wniosek o zasiłek macierzyński."],
    kiedy: ["Po rozwiązaniu umowy — im wcześniej, tym szybciej dostaniesz pieniądze."],
    gdzie: ["W **ZUS**, najprościej przez eZUS."],
    dokumenty: ["wniosek ZAS-55,", "świadectwo pracy,", "zaświadczenie lekarskie potwierdzające ciążę."],
    uwaga: ["Jeśli dostaniesz inną pracę — poinformuj ZUS; zasiłek może przestać przysługiwać.", "Inny powód końca umowy (np. wypowiedzenie) nie daje prawa do tego zasiłku — sprawdź, czy umowa na czas określony nie przedłuży się do porodu (art. 177 § 3 Kodeksu pracy)."],
    pytania: [["Mam umowę na czas określony, która kończy się w ciąży. Czy to ten zasiłek?", "Nie. Taka umowa (dłuższa niż miesiąc), która skończyłaby się po 3. miesiącu ciąży, przedłuża się do dnia porodu — zostajesz ubezpieczona."]],
    prawo: "Ustawa zasiłkowa: art. 30 ust. 3; Kodeks pracy: art. 177.",
    wniosek: { link: "/przewodnik/wnioski/zas-55", tekst: "Złóż wniosek ZAS-55" },
  },

  // -------------------------------------------------------------------
  "urlop-rodzicielski": {
    tytul: "Urlop rodzicielski",
    lead: "Czas z dzieckiem po urlopie macierzyńskim — do podziału między rodziców, także z pracą na część etatu.",
    dlaCiebie: (c) =>
      c.sytuacja.chorobowe
        ? { status: ["ok", "Przysługuje Ci"], tekst: `Masz ubezpieczenie chorobowe, więc za urlop rodzicielski dostaniesz zasiłek (${P.stawki.rodzicielski}% albo ${proc(P.stawki.wariant815)} w wariancie jednej stawki).` }
        : { status: ["szary", "Bez zasiłku"], tekst: "Bez ubezpieczenia chorobowego nie dostaniesz zasiłku za urlop rodzicielski — sprawdź świadczenie rodzicielskie." },
    skrot: [`**${P.rodzicielskiTyg.jedno} tygodni** przy jednym dziecku, **${P.rodzicielskiTyg.wiele}** przy wieloraczkach.`, `**${P.nieprzenoszalneTyg} tygodni** jest tylko dla każdego z rodziców — nie można ich przekazać.`, "Możesz łączyć urlop z pracą **do połowy etatu**.", `Z zaświadczeniem „Za życiem” — ${P.rodzicielskiTyg.zaZyciemJedno} tygodni (${P.rodzicielskiTyg.zaZyciemWiele} przy wieloraczkach).`],
    komu: ["Pracownik na umowie o pracę — po urlopie macierzyńskim.", "Zasiłek za ten czas dostaje każdy, kto ma ubezpieczenie chorobowe (także zlecenie i działalność)."],
    ile: [{ tabela: [["Sytuacja", "Zasiłek"], ["Wariant jednej stawki (wniosek do 21 dni po porodzie)", "81,5%"], ["Wniosek o rodzicielski później", "70%"], ["Łączenie z pracą", "zasiłek proporcjonalnie niższy"]] }],
    jakDlugo: ["Do końca roku kalendarzowego, w którym dziecko kończy **6 lat**.", "W maksymalnie **5 częściach**, w wielokrotności tygodnia.", "Jeśli korzysta tylko jedno z rodziców — **32 tygodnie** (34 przy wieloraczkach)."],
    kiedy: ["Wniosek u pracodawcy — **najpóźniej 21 dni przed** rozpoczęciem urlopu.", "Od razu po macierzyńskim w całości — wniosek do 21 dni po porodzie (wtedy 81,5%)."],
    gdzie: ["Urlop — u pracodawcy (wniosek URL-R).", "Zasiłek — u płatnika zasiłku (pracodawca powyżej 20 osób albo ZUS), wniosek ZAM."],
    dokumenty: ["wniosek o urlop rodzicielski do pracodawcy,", "wniosek ZAM o zasiłek (gdy wypłaca ZUS),", "skrócony odpis aktu urodzenia (jeśli płatnik go nie ma)."],
    uwaga: ["Niewykorzystane **9 tygodni** drugiego rodzica **przepadają**.", "Praca w czasie urlopu powyżej pół etatu jest niedozwolona — możesz stracić zasiłek.", "Spóźniony wniosek (mniej niż 21 dni) — pracodawca nie musi udzielić urlopu w tym terminie."],
    pytania: [["Czy rodzice mogą być na rodzicielskim jednocześnie?", "Tak — łączny wymiar nie może jednak przekroczyć puli urlopu."]],
    prawo: "Kodeks pracy: art. 182¹ᵃ–182¹ᵉ; ustawa zasiłkowa: art. 29, 31.",
    wniosek: { link: "/przewodnik/wnioski/url-r", tekst: "Złóż wniosek o urlop" },
  },

  // -------------------------------------------------------------------
  "urlop-ojcowski": {
    tytul: "Urlop ojcowski",
    lead: "Dwa tygodnie tylko dla taty — do pierwszych urodzin dziecka, z zasiłkiem 100%.",
    dlaCiebie: (c) =>
      c.ankieta?.rola === "tata"
        ? c.sytuacja.chorobowe
          ? { status: ["ok", "Przysługuje Ci"], tekst: `Masz ubezpieczenie chorobowe — za ${P.ojcowskiDni} dni urlopu dostaniesz **100% podstawy**.` }
          : { status: ["szary", "Bez zasiłku"], tekst: "Bez ubezpieczenia chorobowego nie dostaniesz zasiłku za urlop ojcowski." }
        : { status: ["info", "Dla taty"], tekst: "Ten urlop przysługuje tacie dziecka. Możesz przeczytać, jak działa — i podpowiedzieć partnerowi." },
    skrot: [`**${P.ojcowskiDni} dni** (2 tygodnie) dla taty.`, "Do ukończenia przez dziecko **12 miesięcy**.", "Zasiłek **100% podstawy**.", "Możesz wziąć naraz albo w 2 częściach po tygodniu."],
    komu: ["Tata dziecka, który jest pracownikiem — urlop.", "Tata z ubezpieczeniem chorobowym (także zlecenie, działalność) — zasiłek za ten czas."],
    ile: ["**100% podstawy wymiaru**."],
    jakDlugo: ["2 tygodnie, do pierwszych urodzin dziecka. Przy adopcji obowiązują osobne terminy — liczone od przyjęcia dziecka."],
    kiedy: ["Wniosek u pracodawcy **najpóźniej 7 dni przed** urlopem."],
    gdzie: ["Urlop — u pracodawcy (URL-O).", "Zasiłek — u płatnika (pracodawca powyżej 20 osób albo ZUS), wniosek ZAM (od 24.10.2026 zastąpił ZAO)."],
    dokumenty: ["wniosek o urlop ojcowski,", "skrócony odpis aktu urodzenia,", "wniosek ZAM o zasiłek (gdy wypłaca ZUS)."],
    uwaga: ["Po 12. miesiącu życia dziecka urlop **przepada**.", "Urlop ojcowski to nie to samo co urlop rodzicielski — tata ma oba."],
    pytania: [["Czy pracodawca może odmówić?", "Nie, jeśli złożysz wniosek co najmniej 7 dni wcześniej."]],
    prawo: "Kodeks pracy: art. 182³; ustawa zasiłkowa: art. 29 ust. 1 pkt 4.",
    wniosek: { link: "/przewodnik/wnioski/url-o", tekst: "Złóż wniosek o urlop ojcowski" },
  },

  // -------------------------------------------------------------------
  "swiadczenie-rodzicielskie": {
    tytul: "Świadczenie rodzicielskie",
    lead: "Dla rodziców, którzy nie dostaną zasiłku macierzyńskiego — np. bez pracy, studentów, na umowie o dzieło.",
    dlaCiebie: (c) =>
      c.sytuacja.swiadczenie === "rodzicielskie"
        ? { status: ["ok", "Przysługuje Ci"], tekst: `Nie masz ubezpieczenia chorobowego, więc przysługuje Ci **${P.swiadczenieRodzicielskie} zł miesięcznie** przez rok (przy jednym dziecku).` }
        : { status: ["szary", "Nie dotyczy — masz zasiłek"], tekst: "Masz ubezpieczenie chorobowe, więc dostaniesz zasiłek macierzyński. Świadczenie rodzicielskie jest dla osób bez zasiłku." },
    skrot: [`**${P.swiadczenieRodzicielskie} zł miesięcznie** (netto, bez podatku).`, "Przez **52 tygodnie** przy jednym dziecku — dłużej przy wieloraczkach.", "Wniosek składasz w **gminie lub mieście**, nie w ZUS."],
    komu: ["Mama lub tata dziecka, którzy nie pobierają zasiłku macierzyńskiego ani wynagrodzenia za urlop.", "Także przy adopcji i rodzinie zastępczej (dziecko do 7 lat, do 10 przy odroczonym obowiązku szkolnym).", "Dochód rodziny nie ma znaczenia."],
    ile: [`**${P.swiadczenieRodzicielskie} zł** miesięcznie.`],
    jakDlugo: [{ tabela: [["Dzieci przy jednym porodzie", "Okres"], ["1", "52 tygodnie"], ["2", "65 tygodni"], ["3", "67 tygodni"], ["4", "69 tygodni"], ["5 i więcej", "71 tygodni"]] }],
    kiedy: ["Wniosek **do 3 miesięcy od porodu** — wtedy dostaniesz pieniądze od dnia urodzenia. Później — od miesiąca złożenia wniosku."],
    gdzie: ["Urząd gminy lub miasta (ośrodek pomocy społecznej) albo przez internet (emp@tia)."],
    dokumenty: ["wniosek o świadczenie rodzicielskie,", "skrócony odpis aktu urodzenia (albo dane z rejestru)."],
    uwaga: ["Po 3 miesiącach od porodu tracisz pieniądze za pierwsze miesiące.", "Jeśli podejmiesz pracę z ubezpieczeniem chorobowym i dostaniesz zasiłek — świadczenie się kończy."],
    pytania: [["Czy tata może dostać świadczenie?", "Tak, w określonych sytuacjach — np. gdy mama zrezygnuje z niego po 14 tygodniach."]],
    prawo: "Ustawa z 28 listopada 2003 r. o świadczeniach rodzinnych: art. 17c.",
  },

  // -------------------------------------------------------------------
  "800-plus": {
    tytul: "800+",
    lead: "Świadczenie wychowawcze na każde dziecko do 18. roku życia, niezależnie od dochodu.",
    dlaCiebie: () => ({ status: ["ok", "Przysługuje Ci"], tekst: "Na każde dziecko do 18 lat, bez względu na dochód. Złóż wniosek do 3 miesięcy od urodzenia, żeby dostać pieniądze od miesiąca narodzin." }),
    skrot: ["**800 zł** miesięcznie na każde dziecko do **18 lat**.", "Bez kryterium dochodowego.", "Wniosek tylko elektronicznie — wypłaca **ZUS**."],
    komu: ["Mama, tata, opiekun prawny lub faktyczny dziecka, rodzina zastępcza.", "Dziecko mieszka w Polsce (przy pracy za granicą stosuje się koordynację)."],
    ile: ["**800 zł** miesięcznie na dziecko."],
    jakDlugo: ["Do ukończenia przez dziecko **18 lat**."],
    kiedy: ["Wniosek **do 3 miesięcy od urodzenia** — wtedy dostaniesz wyrównanie od miesiąca narodzin."],
    gdzie: ["Przez **eZUS**, aplikację **mObywatel**, bankowość elektroniczną albo portal Emp@tia."],
    dokumenty: ["wniosek o 800+ składany elektronicznie — zwykle bez załączników."],
    uwaga: ["Spóźniony wniosek = brak pieniędzy za pierwsze miesiące.", "Wyjazd za granicę lub praca drugiego rodzica za granicą — zgłoś ZUS (koordynacja świadczeń).", "Zmiany w sytuacji (np. dziecko zamieszka z drugim rodzicem) zgłaszaj od razu."],
    pytania: [["Czy 800+ wpływa na inne świadczenia?", "Nie wlicza się do dochodu przy większości świadczeń."]],
    prawo: "Ustawa z 11 lutego 2016 r. o pomocy państwa w wychowywaniu dzieci.",
    wniosek: { link: "/przewodnik/wnioski/sw-800", tekst: "Złóż wniosek o 800+" },
  },

  // -------------------------------------------------------------------
  "zasilek-opiekunczy": {
    tytul: "Zasiłek opiekuńczy",
    lead: "Pieniądze za czas, gdy zostajesz w domu, żeby opiekować się chorym dzieckiem — albo zdrowym, gdy zamknięto żłobek lub przedszkole.",
    dlaCiebie: (c) =>
      c.sytuacja.chorobowe
        ? { status: ["info", "Na później"], tekst: "Masz ubezpieczenie chorobowe — gdy dziecko zachoruje, za opiekę dostaniesz **80% podstawy**." }
        : { status: ["szary", "Wymaga ubezpieczenia chorobowego"], tekst: "Zasiłek opiekuńczy przysługuje tylko osobom z ubezpieczeniem chorobowym." },
    skrot: ["**80% podstawy**.", "Na chore dziecko do **14 lat** — do **60 dni w roku** (łącznie dla obojga rodziców).", "Na zdrowe dziecko do 8 lat — np. przy nagłym zamknięciu żłobka, przedszkola lub szkoły, porodzie lub chorobie drugiego rodzica."],
    komu: ["Masz ubezpieczenie chorobowe (bez okresu wyczekiwania).", "Nie ma innego członka rodziny, który może zapewnić opiekę (nie dotyczy dziecka do 2 lat)."],
    ile: ["**80% podstawy wymiaru**."],
    jakDlugo: ["Do **60 dni w roku kalendarzowym** łącznie na dzieci do 14 lat (i do 14 dni na starsze dzieci i innych członków rodziny — w ramach tego samego limitu)."],
    kiedy: ["Lekarz wystawia e-ZLA na opiekę nad dzieckiem — złóż też oświadczenie Z-15A."],
    gdzie: ["U pracodawcy (powyżej 20 osób wypłaca on) albo w ZUS (eZUS)."],
    dokumenty: ["e-ZLA na opiekę (od lekarza),", "oświadczenie Z-15A."],
    uwaga: ["Limit 60 dni jest **wspólny dla obojga rodziców**.", "Praca w czasie opieki = utrata zasiłku.", "Brak oświadczenia Z-15A wstrzymuje wypłatę."],
    pytania: [["Czy dostanę zasiłek, gdy jestem na urlopie rodzicielskim?", "Nie — w tym czasie opiekujesz się już dzieckiem."]],
    prawo: "Ustawa zasiłkowa: art. 32–35.",
  },
};
