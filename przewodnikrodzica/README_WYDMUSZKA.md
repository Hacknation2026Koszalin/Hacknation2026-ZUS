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
