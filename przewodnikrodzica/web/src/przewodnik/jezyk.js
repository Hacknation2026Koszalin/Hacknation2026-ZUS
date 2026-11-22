// =====================================================================
// JĘZYKI: PL / EN / UK — tłumaczenia interfejsu (menu, nagłówki, przyciski).
// Treści merytoryczne (przewodniki, formularze) są na razie po polsku —
// przy EN/UK pokazujemy o tym komunikat. Nowy tekst = nowy klucz w SLOWNIK.
// =====================================================================
import { useEffect, useState } from "react";
import { ustawJezykStrony } from "./tlumaczDOM.js";

export const JEZYKI = [
  ["pl", "PL", "Polski"],
  ["en", "ANG", "English"],
  ["uk", "UKR", "Українська"],
];

const KLUCZ = "przewodnik-jezyk";
const ZDARZENIE = "przewodnik-jezyk-zmiana";

const SLOWNIK = {
  // menu konta
  "Moje konto": { en: "My account", uk: "Мій кабінет" },
  "Moja ścieżka": { en: "My path", uk: "Мій шлях" },
  "Świadczenia": { en: "Benefits", uk: "Виплати" },
  "Złóż wniosek": { en: "Apply", uk: "Подати заяву" },
  "Kalkulator": { en: "Calculator", uk: "Калькулятор" },
  "Moje sprawy": { en: "My cases", uk: "Мої справи" },
  "Pomoc": { en: "Help", uk: "Допомога" },
  "Wyloguj się": { en: "Log out", uk: "Вийти" },
  "Menu": { en: "Menu", uk: "Меню" },
  "Zamknij": { en: "Close", uk: "Закрити" },
  "Zobacz wszystko": { en: "See all", uk: "Переглянути все" },
  "Ustawienia": { en: "Settings", uk: "Налаштування" },
  "Samouczek": { en: "Tutorial", uk: "Інструкція" },
  "Dostępność": { en: "Accessibility", uk: "Доступність" },
  "Powiadomienia": { en: "Notifications", uk: "Сповіщення" },
  "Wersja demonstracyjna": { en: "Demo version", uk: "Демоверсія" },
  "Zakład Ubezpieczeń Społecznych": { en: "Social Insurance Institution (ZUS)", uk: "Управління соціального страхування (ZUS)" },
  // nagłówek publiczny
  "Kontakt": { en: "Contact", uk: "Контакти" },
  "Szukaj": { en: "Search", uk: "Пошук" },
  "Zarejestruj w PUE/eZUS": { en: "Register in PUE/eZUS", uk: "Зареєструватися в PUE/eZUS" },
  "Zaloguj do PUE/eZUS": { en: "Log in to PUE/eZUS", uk: "Увійти до PUE/eZUS" },
  "Zaloguj do Przewodnika Młodego Rodzica": { en: "Log in to the Young Parent Guide", uk: "Увійти до Путівника молодих батьків" },
  "Unia Europejska": { en: "European Union", uk: "Європейський Союз" },
  // pulpit
  "Co możesz zrobić": { en: "What you can do", uk: "Що ви можете зробити" },
  "Status zwolnienia lekarskiego": { en: "Sick leave status", uk: "Статус лікарняного" },
  "Kolejny krok": { en: "Next step", uk: "Наступний крок" },
  "Kolejny wniosek": { en: "Next application", uk: "Наступна заява" },
  "do kolejnego kroku": { en: "to the next step", uk: "до наступного кроку" },
  "na złożenie wniosku": { en: "to apply", uk: "щоб подати заяву" },
  "dni": { en: "days", uk: "днів" },
  "Co mi przysługuje?": { en: "What am I entitled to?", uk: "Що мені належить?" },
  "Gratulacje": { en: "Congratulations", uk: "Вітаємо" },
  "Witaj wśród rodziców": { en: "Welcome to parenthood", uk: "Ласкаво просимо до батьківства" },
  "Jesteśmy z Tobą": { en: "We are with you", uk: "Ми з вами" },
  "Cześć": { en: "Hi", uk: "Привіт" },
  "lead-pulpit": {
    pl: "Przeprowadzimy Cię przez wszystko, co Ci przysługuje. Terminów pilnujemy za Ciebie.",
    en: "We will guide you through everything you are entitled to and keep track of the deadlines for you.",
    uk: "Ми проведемо вас через усе, що вам належить, і стежитимемо за термінами замість вас.",
  },
  // strony
  "Co Ci przysługuje": { en: "What you are entitled to", uk: "Що вам належить" },
  "Gdzie szukać pomocy": { en: "Where to find help", uk: "Де шукати допомогу" },
  "Wnioski i oświadczenia": { en: "Applications and statements", uk: "Заяви та декларації" },
  "Przeczytaj przewodnik": { en: "Read the guide", uk: "Читати путівник" },
  "Polecane dla Ciebie": { en: "Recommended for you", uk: "Рекомендовано для вас" },
  "Na co uważać": { en: "What to watch out for", uk: "На що звернути увагу" },
  // stopka
  "stopka-opis": {
    pl: "Przewodnik młodego rodzica pomaga sprawdzić, jakie urlopy i zasiłki Ci przysługują, i prowadzi przez wnioski krok po kroku. To prototyp przygotowany na HackNation 2026 — nie jest serwisem Zakładu Ubezpieczeń Społecznych.",
    en: "The Young Parent Guide helps you check which leave and benefits you are entitled to and guides you through applications step by step. This is a HackNation 2026 prototype — not an official ZUS service.",
    uk: "Путівник молодих батьків допомагає перевірити, які відпустки та допомоги вам належать, і крок за кроком веде через заяви. Це прототип HackNation 2026 — не офіційний сервіс ZUS.",
  },
  "Uprawnienia rodziców — oficjalne źródła": { en: "Parents' rights — official sources", uk: "Права батьків — офіційні джерела" },
  // ZUSanna
  "Jak mogę Ci pomóc?": { en: "How can I help you?", uk: "Чим я можу допомогти?" },
  "Jestem ZUSanna, Twoja asystentka rodzica.": { en: "I'm ZUSanna, your parent assistant.", uk: "Я ZUSanna, ваша помічниця для батьків." },
  "Zapytaj własnymi słowami…": { en: "Ask in your own words…", uk: "Запитайте своїми словами…" },
  // komunikat o treściach
  "tylko-po-polsku": {
    en: "The interface is in English. Long legal texts and official forms stay in Polish — we explain them in plain language.",
    uk: "Інтерфейс українською. Довгі юридичні тексти та офіційні форми залишаються польською — ми пояснюємо їх простою мовою.",
  },
};

const czytaj = () => {
  try {
    return localStorage.getItem(KLUCZ) || "pl";
  } catch {
    return "pl";
  }
};

let aktualny = czytaj();
if (typeof document !== "undefined") { document.documentElement.lang = aktualny; ustawJezykStrony(aktualny); }

export function ustawJezyk(k) {
  aktualny = k;
  try {
    localStorage.setItem(KLUCZ, k);
  } catch {
    /* nic */
  }
  document.documentElement.lang = k;
  window.dispatchEvent(new Event(ZDARZENIE));
  ustawJezykStrony(k);
}

/** Tłumaczenie: klucz to polski tekst (albo nazwa klucza z wersją `pl`). */
export function t(tekst, jezyk = aktualny) {
  const w = SLOWNIK[tekst];
  if (!w) return tekst;
  return w[jezyk] || w.pl || tekst;
}

export function useJezyk() {
  const [j, setJ] = useState(aktualny);
  useEffect(() => {
    const f = () => setJ(aktualny);
    window.addEventListener(ZDARZENIE, f);
    return () => window.removeEventListener(ZDARZENIE, f);
  }, []);
  return [j, (tekst) => t(tekst, j)];
}
