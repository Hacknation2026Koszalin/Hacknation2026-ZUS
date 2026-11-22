// NA CO UWAŻAĆ — zagrożenia utraty uprawnień i zmiany wysokości świadczeń.
// Każde ryzyko ma `dotyczy(ctx)` — na górze pokazujemy te, które pasują do Twojej sytuacji.
import { Link } from "react-router-dom";
import { useJezyk } from "../jezyk.js";
import { useSesja } from "../SesjaContext.jsx";
import { DANE_ZUS_ZAPAS } from "../dane.js";
import { ocenSytuacje } from "../sytuacja.js";
import { P } from "../parametry.js";
import { maZadluzenie, kwota } from "../komponenty/Zadluzenie.jsx";
import { aktualneZwolnienie } from "../komponenty/Zwolnienie.jsx";
import Ikona from "../wniosek/Ikona.jsx";

const dzialalnosc = (c) => ["dzialalnosc", "zlecenie"].includes(c.ankieta.praca) || /działalność|zlecen/.test(c.zus.ubezpieczenie?.tytul || "");

const RYZYKA = [
  // ---- utrata prawa
  {
    grupa: "utrata", tytul: "Zaległość w składkach",
    tekst: () => `Jeśli w dniu powstania prawa do zasiłku masz zaległość wyższą niż ${P.progZadluzeniaProc}% minimalnego wynagrodzenia, zasiłek nie zostanie wypłacony, dopóki jej nie spłacisz. Spłata w ciągu 6 miesięcy — dostaniesz zasiłek za cały okres; później — tylko od dnia spłaty.`,
    dotyczy: (c) => maZadluzenie(c.zus) ? `Masz teraz zaległość: ${kwota(c.zus.zadluzenie)}.` : dzialalnosc(c) ? "Prowadzisz firmę lub pracujesz na zleceniu — pilnuj terminów składek." : null,
    link: ["Sprawdź stan składek", "/przewodnik/swiadczenia"],
  },
  {
    grupa: "utrata", tytul: "Spóźniona dobrowolna składka chorobowa",
    tekst: () => "Przy dobrowolnym ubezpieczeniu (firma, zlecenie) nieopłacenie składki w terminie albo w pełnej wysokości kończy ubezpieczenie chorobowe. Po ponownym zgłoszeniu znów czeka Cię 90 dni wyczekiwania na zasiłek chorobowy — a bez ubezpieczenia w dniu porodu nie dostaniesz zasiłku macierzyńskiego.",
    dotyczy: (c) => (c.ankieta.chorobowe === "tak" || c.zus.ubezpieczenie?.chorobowe === "dobrowolne" ? "Masz dobrowolne ubezpieczenie chorobowe." : null),
  },
  {
    grupa: "utrata", tytul: "Praca w czasie zwolnienia lekarskiego",
    tekst: () => "Wykonywanie pracy zarobkowej albo wykorzystywanie zwolnienia niezgodnie z jego celem oznacza utratę zasiłku chorobowego za cały okres tego zwolnienia. ZUS i pracodawca mogą to skontrolować.",
    dotyczy: (c) => (aktualneZwolnienie(c.zus) ? "Jesteś teraz na zwolnieniu lekarskim." : null),
  },
  {
    grupa: "utrata", tytul: "Koniec umowy o pracę w ciąży",
    tekst: () => "Gdy umowa się kończy, kończy się też ubezpieczenie chorobowe. Umowa na czas określony (dłuższa niż miesiąc), która skończyłaby się po 3. miesiącu ciąży, przedłuża się do porodu. Przy upadłości lub likwidacji pracodawcy przysługuje zasiłek w wysokości zasiłku macierzyńskiego.",
    dotyczy: (c) => (c.ustanie?.data ? "Podałaś datę końca umowy — zobacz kartę na pulpicie." : c.etap === "ciaza" && /umowa o pracę/.test(c.zus.ubezpieczenie?.tytul || "") ? "Jesteś w ciąży i masz umowę o pracę." : null),
    link: ["Dodaj datę końca umowy", null],
  },
  {
    grupa: "utrata", tytul: "Praca w czasie urlopu",
    tekst: () => "W czasie urlopu macierzyńskiego nie możesz pracować u pracodawcy, który go udzielił. Urlop rodzicielski możesz łączyć z pracą najwyżej na pół etatu — więcej oznacza ryzyko utraty zasiłku.",
    dotyczy: (c) => (c.sytuacja.swiadczenie === "zasilek" && ["ciaza", "dziecko"].includes(c.etap) ? "Będziesz na urlopie z zasiłkiem." : null),
  },
  {
    grupa: "utrata", tytul: "Niezgłoszone zmiany",
    tekst: () => "Zmiany, które wpływają na prawo do świadczeń (podjęcie pracy, wyjazd za granicę, zmiana opieki nad dzieckiem), musisz zgłosić płatnikowi lub ZUS. Świadczenie pobrane bez prawa trzeba zwrócić — z odsetkami.",
    dotyczy: () => null,
    link: ["Zgłoś zmianę danych (ZZD)", "/przewodnik/wnioski/zzd"],
  },
  // ---- zmiana wysokości / wymiaru
  {
    grupa: "wysokosc", tytul: "Wybór 81,5% albo 100% + 70%",
    tekst: () => `Wariant ${String(P.stawki.wariant815).replace(".", ",")}% wybierasz tylko we wniosku złożonym do ${P.termin815Dni} dni po porodzie. Potem zostaje ${P.stawki.macierzynski}% za macierzyński i ${P.stawki.rodzicielski}% za rodzicielski — przy pełnym roku to łącznie podobna kwota, ale inaczej rozłożona w czasie.`,
    dotyczy: (c) => (c.sytuacja.swiadczenie === "zasilek" && ["ciaza", "dziecko"].includes(c.etap) ? "Ten wybór czeka Cię przy wniosku ZAM." : null),
    link: ["Porównaj w kalkulatorze", "/przewodnik/kalkulator"],
  },
  {
    grupa: "wysokosc", tytul: "Niska lub świeżo zmieniona podstawa",
    tekst: () => "Zasiłek liczy się ze średniej z 12 miesięcy przed powstaniem prawa. Przy krótkim ubezpieczeniu — z pełnych miesięcy, które masz. W firmie liczy się zadeklarowana podstawa składek — jej podniesienie tuż przed porodem tylko częściowo podniesie zasiłek.",
    dotyczy: (c) => (dzialalnosc(c) ? "Sama/sam deklarujesz podstawę składek." : null),
  },
  {
    grupa: "wysokosc", tytul: "Łączenie urlopu rodzicielskiego z pracą",
    tekst: () => "Gdy pracujesz na część etatu, zasiłek jest proporcjonalnie niższy, a urlop proporcjonalnie dłuższy. Wariant 81,5% nie łączy się z pracą w czasie urlopu.",
    dotyczy: () => null,
  },
  // ---- terminy, które przepadają
  {
    grupa: "terminy", tytul: `${P.nieprzenoszalneTyg} tygodni urlopu rodzicielskiego dla drugiego rodzica`,
    tekst: () => `Każde z rodziców ma ${P.nieprzenoszalneTyg} tygodni tylko dla siebie. Jeśli drugi rodzic ich nie wykorzysta, przepadają — jedno z rodziców weźmie najwyżej ${P.rodzicielskiTyg.jedno - P.nieprzenoszalneTyg} tygodni.`,
    dotyczy: (c) => (["ciaza", "dziecko"].includes(c.etap) ? "Ustalcie, kto i kiedy bierze urlop." : null),
  },
  {
    grupa: "terminy", tytul: "Urlop ojcowski do 1. urodzin",
    tekst: () => `${P.ojcowskiDni} dni urlopu ojcowskiego trzeba wykorzystać, zanim dziecko skończy 12 miesięcy. Wniosek — 7 dni przed urlopem.`,
    dotyczy: (c) => (c.ankieta.rola === "tata" ? "Jesteś tatą — to Twój urlop." : null),
    link: ["Wniosek o urlop ojcowski", "/przewodnik/wnioski/url-o"],
  },
  {
    grupa: "terminy", tytul: "3 miesiące na 800+ i świadczenie rodzicielskie",
    tekst: () => "Wniosek do 3 miesięcy od urodzenia daje pieniądze od miesiąca (lub dnia) narodzin. Później — dopiero od miesiąca złożenia wniosku.",
    dotyczy: (c) => (["ciaza", "dziecko"].includes(c.etap) ? "Zaplanuj wnioski zaraz po porodzie." : null),
  },
  {
    grupa: "terminy", tytul: "Wniosek o świadczenie rehabilitacyjne przed końcem zasiłku",
    tekst: () => "Złóż go około 6 tygodni przed wyczerpaniem zasiłku chorobowego — inaczej możesz mieć przerwę w pieniądzach.",
    dotyczy: (c) => (aktualneZwolnienie(c.zus) ? "Jesteś na zwolnieniu — przy długiej chorobie pamiętaj o tym terminie." : null),
  },
];

const GRUPY = [
  ["utrata", "Kiedy możesz stracić prawo do świadczenia", "alert"],
  ["wysokosc", "Co zmienia wysokość lub długość świadczenia", "kalkulator"],
  ["terminy", "Terminy, które przepadają", "zegar"],
];

export default function Ryzyka() {
  const sesja = useSesja();
  const [, t] = useJezyk();
  const zus = sesja.zus || DANE_ZUS_ZAPAS;
  const ankieta = sesja.ankieta || {};
  const ctx = { zus, ankieta, etap: sesja.etap, ustanie: sesja.ustanie, sytuacja: ocenSytuacje(ankieta, zus, sesja.etap) };
  const lista = RYZYKA.map((r) => ({ ...r, powod: r.dotyczy(ctx) }));
  const twoje = lista.filter((r) => r.powod);

  const Karta = ({ r }) => (
    <li className={`ry-karta ${r.powod ? "twoje" : ""}`}>
      <b>{r.tytul}</b>
      <p>{r.tekst()}</p>
      {r.powod && <span className="ry-twoje"><Ikona n="alert" rozmiar={14} /> Dotyczy Ciebie: {r.powod}</span>}
      {r.link && (r.link[1]
        ? <Link to={r.link[1]} className="ry-link">{r.link[0]} →</Link>
        : <button type="button" className="wn-link ry-link" onClick={() => window.dispatchEvent(new Event("otworz-ustawienia"))}>{r.link[0]} →</button>)}
    </li>
  );

  return (
    <div className="wn ry">
      <div className="wrap">
        <h1>{t("Na co uważać")}</h1>
        <p className="wn-lead">Sytuacje, w których możesz stracić świadczenie albo dostać mniej — i terminy, których nie warto przegapić.</p>

        {twoje.length > 0 && (
          <section className="ry-sekcja ry-twoja">
            <h2><Ikona n="check" /> W Twojej sytuacji zwróć uwagę na ({twoje.length})</h2>
            <ul className="ry-lista">{twoje.map((r) => <Karta key={r.tytul} r={r} />)}</ul>
          </section>
        )}

        {GRUPY.map(([g, nazwa, ik]) => (
          <section key={g} className="ry-sekcja">
            <h2><Ikona n={ik} /> {nazwa}</h2>
            <ul className="ry-lista">{lista.filter((r) => r.grupa === g).map((r) => <Karta key={r.tytul} r={r} />)}</ul>
          </section>
        ))}
      </div>
    </div>
  );
}
