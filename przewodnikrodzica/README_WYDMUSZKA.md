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
