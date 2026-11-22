# Wydmuszka serwisu ZUS + miejsce na „Przewodnik młodego rodzica”

## Co podmienić w Waszym projekcie
Skopiujcie pliki z tej paczki w te same miejsca (nadpiszą stare):

```
client-app/
  index.html                 ← poprawione (lang="pl", usunięty przypadkowy tekst "JD ddd")
  vite.config.js             ← POPRAWKA: proxy na port 5117 (backend), było 5000
  src/
    App.jsx                  ← trasy (routing)
    main.jsx                 ← bez zmian
    index.css                ← cały wygląd, wersja na telefon
    data/nawigacja.js        ← menu, kafelki, stopka (zmieniacie treści tutaj)
    components/Layout.jsx    ← pasek "prototyp" + górny pasek + nagłówek + stopka
    components/TopBar.jsx
    components/Header.jsx    ← logo, wyszukiwarka, menu z rozwijanymi listami, menu na telefon
    components/Footer.jsx
    pages/Home.jsx           ← strona główna (wyróżniona karta przewodnika)
    pages/Podstrona.jsx      ← jedna wydmuszka dla wszystkich pozycji menu
    pages/Przewodnik.jsx     ← TU DOKLEJACIE NASZ MODUŁ
    pages/Logowanie.jsx      ← wybór logowania (jak na zrzucie): mObywatel / aplikacja ZUS
    pages/Szukaj.jsx
    pages/NotFound.jsx
przewodnikrodzica/
  Program.cs                 ← dodany endpoint GET /api/aktualnosci
```

Nie trzeba instalować nic nowego — używamy tylko react, react-dom i react-router-dom, które już macie.

## Jak uruchomić
1. Backend: w folderze `przewodnikrodzica` → `dotnet run` (startuje na http://localhost:5117).
2. Frontend: w folderze `client-app` → `npm install` (raz), potem `npm run dev`.
3. Otwórz adres, który pokaże Vite (zwykle http://localhost:5173).
4. Jeśli przy „Aktualnościach” widać „dane z API .NET” — frontend i backend są połączone.

## Adresy
- `/` strona główna
- `/przewodnik` — punkt startowy naszego modułu
- `/logowanie` — wybór sposobu logowania (symulacja, bez haseł)
- `/swiadczenia/zasilki`, `/firmy/kontrola` itd. — wydmuszki z menu
- `/szukaj?q=macierzyński` — wyszukiwarka (podpowiada przewodnik)

## Jak dokleić „Przewodnik młodego rodzica”
1. Załóżcie folder `client-app/src/przewodnik/` i trzymajcie w nim wszystkie ekrany modułu.
2. Zróbcie w nim komponent `PrzewodnikApp.jsx` z własnymi trasami (logowanie mObywatel, przewodnik powitalny, pulpit, kalkulator…).
3. W `App.jsx` zamieńcie `<Przewodnik />` na `<PrzewodnikApp />` w trasie `/przewodnik/*`.
4. Logika kalkulatora idzie do backendu .NET jako `POST /api/kalkulator` — dokładnie tak jak `/api/aktualnosci`.

## Ważne
- Na górze każdej strony jest pasek „Prototyp na HackNation 2026 — to nie jest serwis ZUS”. Zostawcie go: strona naśladuje układ prawdziwego serwisu, więc musi być jasne, że to prototyp.
- Nie używamy logo ani grafik ZUS — jest neutralny znak „Z”. Jeśli chcecie prawdziwe materiały, zapytajcie mentora ZUS.
- Logowanie nie ma pól na hasło ani dane — to tylko symulacja kliknięć.

## NOWE: logowanie mObywatel + przewodnik powitalny (folder `client-app/src/przewodnik/`)

Ścieżka po kliknięciu „Zaloguj się przez mObywatel”:

| Adres | Ekran | Co się dzieje |
|---|---|---|
| `/przewodnik` | Start | karta przewodnika, przycisk „Zaloguj się przez mObywatel” |
| `/przewodnik/logowanie` | Wybór logowania | aktywny tylko mObywatel, reszta wyszarzona |
| `/przewodnik/mobywatel` | Potwierdzenie w telefonie | kod QR + kod 6 cyfr; po 5 s albo po kliknięciu „Symulacja: potwierdziłam” → dalej |
| `/przewodnik/zgoda` | Zgoda na dane | dane z mObywatela (GET `/api/symulacja/mobywatel`), „Zgadzam się” |
| `/przewodnik/pobieranie` | Pobieranie z ZUS | 3 pozycje odhaczają się po kolei (GET `/api/symulacja/zus/{pesel}`) |
| `/przewodnik/witaj` | Przewodnik powitalny | „Cześć, Anna! Na jakim jesteś etapie?” → 7 slajdów → „Gotowe!”; Pomiń, Wstecz, Dalej, kropki, strzałki na klawiaturze, Esc |
| `/przewodnik/pulpit` | Pulpit | po zamknięciu przewodnik „wlatuje” do ikony ? (pulsuje 2 razy); ? otwiera przewodnik ponownie |

- Stan logowania jest w `SesjaContext.jsx` (sessionStorage — znika po zamknięciu karty). Wylogowanie: kółko z inicjałami.
- Dane osoby są zmyślone (Anna Testowa, PESEL z celowo błędną cyfrą kontrolną).
- Teksty slajdów i etapów zmieniacie w `przewodnik/dane.js`.
- Zakładki Moja ścieżka, Świadczenia, Kalkulator, Moje sprawy, Wsparcie mają na razie stronę „w budowie” (`WBudowie.jsx`) — podmieniacie je po kolei.
- Usunięty stary plik `pages/Przewodnik.jsx` — skasujcie go też u siebie.

---

## NOWE: wniosek o zasiłek macierzyński (przewodnik „jak w grze”)

Nowe pliki (skopiuj do swojego projektu w te same miejsca):

```
client-app/src/przewodnik/wniosek/formularz.js   ← lista pól wniosku i reguły (TU zmieniasz treść)
client-app/src/przewodnik/wniosek/silnik.js      ← co jest wymagane / co nie dotyczy
client-app/src/przewodnik/wniosek/wnioski.js     ← wysyłanie do .NET (albo zapis w przeglądarce)
client-app/src/przewodnik/wniosek/WniosekZAM.jsx ← cały przebieg: start → przewodnik → przegląd → podpis → wysłano
client-app/src/przewodnik/wniosek/Papier.jsx     ← „papierowy” formularz
client-app/src/przewodnik/wniosek/Ikona.jsx      ← ikony
client-app/src/przewodnik/wniosek/wniosek.css    ← wygląd (kolory #025AC4 i #8FD201)
client-app/src/przewodnik/ekrany/Swiadczenia.jsx
client-app/src/przewodnik/ekrany/ZasilekMacierzynski.jsx
client-app/src/przewodnik/ekrany/MojeSprawy.jsx
client-app/src/przewodnik/ekrany/Urzednik.jsx
```
Zmienione: `PrzewodnikApp.jsx` (nowe adresy), `ekrany/Pulpit.jsx` (skróty), `przewodnikrodzica/Program.cs` (endpointy /api/wnioski).

Adresy:
- `/przewodnik/swiadczenia` → lista świadczeń
- `/przewodnik/swiadczenia/zasilek-macierzynski` → opis + „Złóż wniosek”
- `/przewodnik/swiadczenia/zasilek-macierzynski/wniosek` → wniosek z przewodnikiem
- `/przewodnik/sprawy` → Moje sprawy
- `/przewodnik/urzednik` → widok urzędnika (tryb demo)

Przycisk „Pobierz wersję PDF” szuka pliku `client-app/public/formularze/ZAM.pdf`.
Pobierz pusty wniosek ZAM ze strony zus.pl i wrzuć go tam (utwórz folder `public/formularze`).

### Pokaz dla jury (2 okna obok siebie)
1. Okno lewe: zaloguj się jako Anna → Świadczenia → Zasiłek macierzyński → Złóż wniosek → Prowadź mnie.
2. Celowo kliknij „Nie wiem — pomiń” przy zaświadczeniu → na końcu zobaczysz „Zostało 1 pole”.
3. Uzupełnij → przegląd → akceptuj → podpisz.
4. Okno prawe: `/przewodnik/urzednik` → „Poproś o uzupełnienie”, zaznacz zaświadczenie, napisz wiadomość.
5. Okno lewe: Moje sprawy samo się odświeży → „Popraw wniosek” → przewodnik prowadzi TYLKO po tym jednym polu.

Działa bez backendu (zapis w przeglądarce). Z backendem wnioski trzymane są w pamięci .NET i znikają po jego restarcie.

---

## NOWE: wygląd „Moje konto” + Karta ciąży

- Po zalogowaniu znika menu serwisu i baner „Prototyp…” — zostaje jedno menu rodzica (`components/Layout.jsx`, `przewodnik/komponenty/PasekModulu.jsx`).
- „Pulpit” = **Moje konto** (`ekrany/Pulpit.jsx`): hero z gratulacjami i odliczaniem, alarmy, oś terminów.
- Terminy liczy `przewodnik/terminy.js` z terminu porodu w karcie ciąży.
- **Karta ciąży**: `/przewodnik/karta-ciazy` (`ekrany/KartaCiazy.jsx`, dane w `dane.js` → `KARTA_CIAZY`, backend `GET /api/symulacja/karta-ciazy/{pesel}`).
- Kolory i gradient: `przewodnik/wyglad.css` (na górze zmienne `--m-...`).
- Czcionka Inter jest dociągana w `index.html` (bez internetu użyje systemowej).

---

## NOWE: „Moje konto” w zygzaku
- Hero: zamiast kół o ciąży — odliczanie dni do **kolejnego wniosku** (najbliższy termin wniosku, który nie jest jeszcze złożony; po wysłaniu ZAM przeskakuje na 800+).
- Pod spodem oś czasu prawo–lewo z checklistą przy każdym kroku. Kroki i zadania: `przewodnik/plan.js`. Odhaczenia zapisują się w przeglądarce.
- Na dole dwa szerokie pasy (ubezpieczenie i karta ciąży), na zmianę tekst/obraz.

---

## NOWE (21.11, wieczór): uproszczenie i mniej danych

- **Krótka ankieta po wyborze etapu** (`przewodnik/sytuacja.js`): kim jesteś dla dziecka, jak pracujesz, a przy działalności/zleceniu — czy masz dobrowolne chorobowe. Odpowiedź o pracy podpowiadamy z danych ZUS. Na końcu podsumowanie: zasiłek macierzyński czy świadczenie rodzicielskie, kto wypłaca, gdzie złożyć wniosek.
- **Nagłówek z logo, „Dostępność” i wyszukiwarką** wraca w strefie konta — bez przycisków logowania i bez menu serwisu (`components/TopBar.jsx`, `components/Header.jsx`, `components/Layout.jsx`).
- **Wybór etapu:** lepsza hierarchia, bez prostokąta na zdjęciu i bez napisu „Przewodnik młodego rodzica”. Nowe nazwy: „Dziecko już się urodziło”, „Straciliśmy dziecko”.
- **Karta ciąży usunięta** (strona, zakładka, dane, endpoint w .NET). Zamiast niej **opcjonalna data** (termin porodu / data urodzenia / data przyjęcia) — okno `komponenty/DataKluczowa.jsx`, trzymana tylko w sesji przeglądarki.
- **Oś czasu przeniesiona do „Mojej ścieżki”** (`ekrany/Sciezka.jsx`, `komponenty/OsCzasu.jsx`, kroki w `plan.js`). Bez daty pokazuje terminy ustawowe („do 21 dni po porodzie”), z datą — konkretne dni.
- **Moje konto:** hero + „Co możesz zrobić” (wysokie karty, przewijane w bok) + „Twoja sytuacja”.
- Wniosek ZAM i kalkulator same wpisują rolę i datę, jeśli osoba je podała.

## Zmiany v3
- Po zalogowaniu pierwsze pytanie: „Kim jesteś dla dziecka?” (Mamą / Tatą / Opiekunem). Tata widzi „Spodziewam się dziecka”, opiekun — adopcję lub rodzinę zastępczą. Bez „Pomiń” w pytaniach; „Pomiń samouczek” tylko na slajdach.
- Poprawiony tekst o okresie wyczekiwania (macierzyński bez wyczekiwania, L4 w ciąży po 30/90 dniach).
- Zębatka w menu: ustawienia (data, odpowiedzi, czyszczenie danych, wyloguj). Zmiana daty także w hero.
- Usunięty wózek z menu i blok „Twoja sytuacja” z pulpitu.
- Zakładka „Świadczenia” połączona z „Wsparciem”: menu rozwija się po najechaniu, strona /przewodnik/wsparcie zawiera wszystkie świadczenia i kontakty.
- Karty „Co możesz zrobić” na całą szerokość, każda ze zdjęciem (podmiana w Pulpit.jsx → ZDJECIA).
- Asystent: „Asystent ZUSanna podpowie Ci”. Nowa stopka konta (components/StopkaKonta.jsx).

## Zmiany v4
- Wariant zaległości w składkach: hero „Zasiłek wstrzymany” + okno z zasadami (1% min. wynagrodzenia, 6 miesięcy, raty/odroczenie). Włączasz w Ustawienia → Tryb demonstracyjny.
- Menu z ikonami; „Wsparcie” → „Pomoc” (jedna lista bez podziału); „Wyloguj się” zamiast inicjałów; dzwonek z terminami na 30 dni.
- Powiadomienia przeglądarki (raz dziennie przy wejściu, 3/7/14 dni przed) + eksport terminów do kalendarza (.ics, link Google). Pliki: komponenty/Powiadomienia.jsx, kalendarz.js.
- Ułatwienia dostępu (WCAG 2.1 AA): wielkość tekstu, wysoki kontrast, odstępy, podkreślone linki, bez animacji, widoczny fokus. Przycisk „Dostępność” w górnym pasku i w ustawieniach. Plik: komponenty/Dostepnosc.jsx.
- ZUSanna — czat w prawym dolnym rogu, od razu wita „Cześć! Jak mogę Ci pomóc?”. Odpowiedzi z gotowej bazy (bez AI w prototypie). Plik: komponenty/Zusanna.jsx.
- Karty „Co możesz zrobić”: 3 na widoku + karuzela ze strzałkami.
- Stopka: oficjalne źródła o uprawnieniach (ZUS, MRPiPS, PIP).

## Zmiany v5
- Automatyczne wylogowanie po 15 min bez aktywności: licznik w menu (kliknięcie przedłuża), minutę przed końcem okno z odliczaniem. Test: `sessionStorage.setItem("czas-sesji-s","70")`. Plik: komponenty/CzasSesji.jsx.
- „Status zwolnienia lekarskiego” pod karuzelą (dane z e-ZLA: trwa/zakończone, dzień X z N, kto wypłaca). Plik: komponenty/Zwolnienie.jsx. Dane demo: zwolnienie 9.11–6.12.2026.
- Hero pokazuje najbliższy krok ze ścieżki (ten sam co w dzwonku), a nie zawsze wniosek. „Dodaj do kalendarza” tylko w dzwonku i w ustawieniach.
- Menu: osobno „Świadczenia” (rozwijane) i „Pomoc” (kontakty, mama@zus.pl, ZUSanna, samouczek).
- Licznik zawsze okrągły (aspect-ratio 1:1).
- Zaległość w składkach: czerwony pasek na każdej stronie, czerwony hero, wstrzymane świadczenia i zwolnienie na czerwono.

## Zmiany v6
- Status zwolnienia od razu pod hero; widoczny tylko dla mamy przed porodem (planuję / w ciąży, termin jeszcze nie minął). Koniec L4 trafia do dzwonka i licznika; przy terminie porodu podpowiedź o starcie urlopu macierzyńskiego (6 tyg. przed).
- Po zalogowaniu: bez górnego paska i bez wyszukiwarki. W nagłówku: czas sesji, powiadomienia, ustawienia, samouczek, dostępność (ikona ludzika), języki PL / ANG / UKR. „Wyloguj się” zostaje w pasku menu.
- Kafelki białe, na hover zielone, nowy cień. ZUSanna zielona, ze zdjęciem (public/zusanna.jpg — wycinek z powitanie.jpg).

## Zmiany v7 — „Złóż wniosek”
- Nowa zakładka „Złóż wniosek” (/przewodnik/wnioski): tylko formularze; „Świadczenia” zostają z wiedzą.
- Jeden kreator dla wszystkich formularzy: wniosek/Kreator.jsx (dawny WniosekZAM), definicje w wniosek/formularze/index.js, wspólne klocki w formularze/wspolne.js.
- Kreatory: ZAM, ZAS-26, ZAS-33, ZAS-23, ZAS-55, ZAS-39, ZPM, ZPO, ZPW, ZZD, ZAS-58, ZAS-59.
- Z-3, Z-3a, ZAS-15, ZAS-24, ZAS-40 wypełnia pracodawca/płatnik/lekarz — pokazujemy, jak o nie poprosić (z gotową treścią e-maila).
- Polecane formularze wg etapu, roli i wieku. Numer sprawy ma prefiks formularza (np. ZZD-2026-…). Urzędnik i Moje sprawy obsługują każdy typ.
- Nowy formularz = nowy obiekt w formularze/index.js (pola: radio, select, wielokrotny, tekst, obszar, liczba, data, pesel, plik, potwierdz, zgoda).

## Zmiany v8
- Menu konta jako hamburger na telefonie/tablecie (≤1000 px). Bez mini napisów nad tytułami.
- Kwestionariusz: bez tekstu o danych ZUS, licznik „Krok X z N” na dole, więcej miejsca pod przyciskami.
- Samouczek: 8 slajdów ze zrzutami (public/samouczek/*.png, zaznaczone miejsce) i oś 1–2–3. Zrzuty odtworzysz skryptem Playwright (zaznaczenie zielone).
- Kreator: w trybie „prowadź mnie” jedno pole na nieruchomej scenie (strona się nie przewija); na końcu cały formularz do poprawy.
- Świadczenia: świadczenie rehabilitacyjne, zasiłek w wysokości zasiłku macierzyńskiego (ZAS-55), panel „Twoje składki w ZUS” (stan na dzień powstania prawa + symulacja zaświadczenia).
- Kalkulator: przy jednym rodzicu 32/34 tyg. rodzicielskiego (9 tyg. dla drugiego rodzica) + ostrzeżenie.
- Pomoc: organizacje non-profit (wcześniak, hospicja perinatalne, strata dziecka) — swiadczenia.js → ORGANIZACJE.
- Koniec umowy o pracę (Ustawienia): data + powód → karta na pulpicie (przedłużenie do porodu, ZAS-55, zasiłek po ustaniu).
- Wnioski o urlopy do pracodawcy: URL-M, URL-R, URL-O, URL-W. Każdy formularz pokazuje: gdzie trafi (pracodawca/ZUS — wg liczby ubezpieczonych u płatnika), termin i dokumenty. Widok pracodawcy: /przewodnik/pracodawca.

## Zmiany v9
- USC-1: wniosek o odpis aktu urodzenia (skrócony / zupełny / wielojęzyczny), opłata skarbowa liczona na żywo (zwolnienie m.in. do spraw w ZUS), forma ePUAP / poczta / osobiście. Adresat: urząd stanu cywilnego (symulacja usługi gov.pl).
- Panel administracyjny: /przewodnik/admin (Ustawienia → Tryb demonstracyjny → „Przełącz na panel administracyjny” albo link w stopce). Parametry w przewodnik/parametry.js: stawki, tygodnie urlopów, „Za życiem”, wiek dziecka przy adopcji, minimalne wynagrodzenie i próg zaległości, świadczenie rodzicielskie, czas sesji, włączanie funkcji, komunikat dla użytkowników. Data „obowiązuje od”, historia zmian, eksport/import JSON, podgląd skutków zmiany. W prototypie zapis w localStorage — docelowo API + logowanie pracownika ZUS.
- Samouczek: bez górnego paska postępu, większe powitanie, mniejsze tytuły slajdów, więcej miejsca pod zrzutem.
- Link PIP: pip.gov.pl/dla-pracodawcow/porady.

## Zmiany v10
- Pasek postępu formularza przykleja się pod menu (nie nad nim).
- Przewodnik dla każdego świadczenia (ten sam układ co zasiłek macierzyński): przewodnik/przewodniki.js + ekrany/PrzewodnikSwiadczenia.jsx, trasa /przewodnik/swiadczenia/:id. Czytać może każdy; ramka „Dla Ciebie” pokazuje status.
- „Na co uważać” (/przewodnik/ryzyka): utrata prawa, zmiana wysokości, terminy, które przepadają — z oznaczeniem „Dotyczy Ciebie”.
- Ustawienia renderowane w <body> (nie chowają się pod nagłówkiem), nagłówek z „×” i przyciski zawsze widoczne.
- Kalkulator w stylu reszty strony. Usunięty dopisek w stopce.

## Zmiany v11
- Nagłówek strony publicznej jak na zus.pl (Kontakt, język, dostępność, BIP, PUE/eZUS, Szukaj, UE) + zielony przycisk „Zaloguj do Przewodnika Młodego Rodzica”. Górny pasek usunięty.
- Języki PL / ANG / UKR (przewodnik/jezyk.js): menu, nagłówki, pulpit, stopka, ZUSanna, główne strony. Przewodniki i formularze — na razie po polsku (komunikat).
- Tryb „prowadź mnie”: znów cały formularz z przyciemnionym tłem i podświetlonym polem; stronę przesuwa tylko przewodnik (kółko myszy zablokowane).
- SW-800: wniosek o 800+ (do ZUS, wypłata tylko na konto).
- Kalkulator: od razu liczy z podstawy z ZUS, pigułki z ✓, suwaki z przyciskami −/+, zaznaczony wybrany przykład.
- Poprawki: kółka osi wyśrodkowane, przycisk „Złóż wniosek” w przewodnikach, zielone linki i logo bez tła w stopce, bez „Nowość”, tekstów o hasłach i „według danych ZUS”.

## Zmiany v12
- **Status zwolnienia** zależy od odpowiedzi z ankiety: forma pracy (kto wypłaca), ubezpieczenie chorobowe (bez niego — informacja, że zasiłku nie będzie), etap „Planuję” (brak L4 z kodem B) i termin porodu (zwolnienie kończy się dzień przed porodem). Daty liczone względem dzisiaj (`zwolnieniaDlaSytuacji` w `komponenty/Zwolnienie.jsx`).
- **Nagłówek publiczny**: bez „Szukaj”, „Unia Europejska” i „Zarejestruj w PUE/eZUS” — wszystko się mieści.
- **Okno długu „Co mam zrobić?”** renderowane w `<body>` (portal) — wcześniej dziedziczyło biały tekst z czerwonego paska.
- **Konto PUE/eZUS** (`/przewodnik/konto-pue`, `ekrany/KontoPUE.jsx`): symulacja połączenia, dane z konta (dane osobowe, ubezpieczenia, składki 6 mies., e-ZLA), „Nie zgadza się?” przy każdej danej i formularz „Zapytaj ZUS” z odpowiedzią konsultanta (symulacja).
- **Karuzela**: każda karta ma własną ilustrację (`web/public/karty/*.svg`). Zdjęcie można podmienić w `ZDJECIA` w `Pulpit.jsx`.
- **Tłumaczenia**: tłumacz strony (`tlumaczDOM.js` + słownik `tlumaczenia.js`) tłumaczy wszystkie teksty ze słownika, także daty i teksty z liczbami (wzorce). Nowy tekst = nowy wiersz `PL|EN|UK`.
- **Moje sprawy**: zakładki statusów z licznikami (w trakcie / do poprawy / przyjęte / zakończone), filtry (szukaj, kategoria, gdzie złożono, data, kolejność), widok „Według kategorii”, przykładowe sprawy z PUE/eZUS.
- **Dostępność**: kontrast żółty na czarnym i czarny na żółtym, kolory dla daltonistów (czerwony–zielony, niebieski–żółty), czytanie na głos (strona / po kliknięciu), czytelna czcionka, linijka do czytania, duży kursor, wyraźny fokus, ukrywanie obrazków, link do tłumacza PJM, ogłaszanie zmiany strony czytnikom ekranu.
- **Kalkulator**: jeden panel na środku z numerowanymi krokami, liczniki −/+, pasek podziału urlopu między rodziców, wynik na dole i pływający pasek „Łącznie ok. … · Zobacz wynik”.
- **Kalkulator**: wybór „100% + 70%” albo „81,5% przez cały rok” jako opcje do wyboru (zamiast pola wyboru).
- **Wersje robocze wniosków** (`wniosek/robocze.js`): przycisk „Zapisz wersję roboczą” w pasku każdego kreatora (także w trybie prowadzenia), „Zapisz i dokończ później” na ekranach braków i podglądu. Po pierwszym zapisie zmiany zapisują się same. Wersje robocze widać w „Moich sprawach” (Dokończ / Usuń), na liście wniosków i na ekranie startowym wniosku.
