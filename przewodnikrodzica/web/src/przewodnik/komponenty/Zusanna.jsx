// ZUSanna — wstęp do inteligentnego asystenta rodzica (prawy dolny róg).
// W prototypie odpowiada z gotowej bazy (dopasowanie słów kluczowych) i zna Twoją sytuację z sesji.
// Docelowo: model językowy + baza wiedzy ZUS, a w razie potrzeby umówienie e-wizyty.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import { DANE_ZUS_ZAPAS } from "../dane.js";
import { ocenSytuacje } from "../sytuacja.js";
import { fmtDzien } from "../terminy.js";
import { useNadchodzace } from "./Powiadomienia.jsx";
import Ikona from "../wniosek/Ikona.jsx";

export const OTWORZ_ZUSANNE = "zusanna-otworz";
const KLUCZ_DYMKA = "zusanna-dymek-zamkniety";

const SZYBKIE = ["Ile dostanę zasiłku?", "Jaki mam najbliższy termin?", "Jak złożyć wniosek?", "Urlop ojcowski", "Chcę porozmawiać z konsultantem"];

const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l");

function odpowiedz(pytanie, { sytuacja, ankieta, terminy, zus }) {
  const q = norm(pytanie);
  const ma = (...slowa) => slowa.some((s) => q.includes(s));

  if (ma("konsultant", "czlowiek", "zadzwon", "telefon", "kontakt", "e-wizyt", "ewizyt"))
    return { t: "Konsultanci ZUS odbierają pod numerem 22 560 16 00 (dni robocze 7:00–18:00). Możesz też umówić e-wizytę — rozmowę wideo — w eZUS lub mObywatelu.", link: ["Wszystkie kontakty", "/przewodnik/pomoc#kontakt-zus"] };
  if (ma("zadluz", "zaleg", "dlug", "skladk"))
    return zus.zadluzenie > 0
      ? { t: `Na Twoim koncie jest zaległość: ${zus.zadluzenie.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} zł. Dopóki jej nie spłacisz, nie wypłacimy zasiłku. Jeśli spłacisz całość w ciągu 6 miesięcy od dnia, w którym nabędziesz prawo do zasiłku, dostaniesz go za cały okres.` }
      : { t: "Nie widzę zaległości w składkach na Twoim koncie. 👍" };
  if (ma("termin", "kiedy", "do kiedy", "najblizsz", "zdazy"))
    return terminy[0]
      ? { t: `Najbliższy termin: ${terminy[0].t} — do ${fmtDzien(terminy[0].termin)} (zostało ${terminy[0].zostalo} dni).`, link: ["Zobacz całą ścieżkę", "/przewodnik/sciezka"] }
      : { t: "Gdy dodasz termin porodu (albo datę urodzenia dziecka), policzę dokładne daty. Bez niej pokazuję terminy ustawowe w Twojej ścieżce.", link: ["Moja ścieżka", "/przewodnik/sciezka"] };
  if (ma("ile", "kwot", "pieniad", "wysokos", "procent", "81"))
    return sytuacja.swiadczenie === "rodzicielskie"
      ? { t: "Bez ubezpieczenia chorobowego przysługuje Ci świadczenie rodzicielskie z gminy: 1000 zł miesięcznie przez rok." }
      : { t: "Masz dwie opcje: 81,5% podstawy przez cały rok (wniosek do 21 dni po porodzie) albo 100% przez urlop macierzyński i 70% przez rodzicielski. Kalkulator policzy to w złotówkach.", link: ["Otwórz kalkulator", "/przewodnik/kalkulator"] };
  if (ma("ojcowsk", "tata", "ojciec"))
    return { t: "Urlop ojcowski to 2 tygodnie do 1. urodzin dziecka, zasiłek 100%. Wniosek do pracodawcy składasz co najmniej 7 dni przed urlopem. Tata ma też 9 tygodni urlopu rodzicielskiego tylko dla siebie." };
  if (ma("rodzicielsk"))
    return { t: "Urlop rodzicielski trwa 41 tygodni (43 przy wieloraczkach). 9 tygodni jest zarezerwowane dla każdego z rodziców — nie można ich przekazać." };
  if (ma("macierzyns", "urlop"))
    return { t: "Urlop macierzyński trwa 20 tygodni przy jednym dziecku. Do 6 tygodni możesz wykorzystać jeszcze przed porodem.", link: ["Szczegóły zasiłku", "/przewodnik/swiadczenia/zasilek-macierzynski"] };
  if (ma("wniosek", "zloz", "zlozyc", "formularz"))
    return sytuacja.swiadczenie === "zasilek"
      ? { t: "Poprowadzę Cię przez wniosek o zasiłek macierzyński pole po polu. Dane z ZUS uzupełnimy za Ciebie.", link: ["Złóż wniosek", "/przewodnik/swiadczenia/zasilek-macierzynski/wniosek"] }
      : { t: "Wniosek o świadczenie rodzicielskie składasz w urzędzie gminy lub miasta, nie w ZUS." };
  if (ma("800"))
    return { t: "800+ złożysz w eZUS, mObywatelu albo bankowości. Jeśli zrobisz to w ciągu 3 miesięcy od urodzenia, dostaniesz wyrównanie od miesiąca narodzin." };
  if (ma("l4", "zwolnien", "chorob", "lekarz"))
    return sytuacja.chorobowe
      ? { t: "W ciąży zasiłek chorobowy wynosi 100% podstawy, gdy lekarz wpisze kod B. Przy umowie o pracę przysługuje po 30 dniach ubezpieczenia, przy dobrowolnym — po 90." }
      : { t: "Bez ubezpieczenia chorobowego zasiłek chorobowy nie przysługuje. Jeśli prowadzisz firmę, możesz przystąpić do dobrowolnego ubezpieczenia — zasiłek chorobowy będzie po 90 dniach." };
  if (ma("czesc", "hej", "dzien dobry", "witaj"))
    return { t: `Cześć${ankieta.rola === "tata" ? ", tato" : ""}! O co chcesz zapytać?` };
  return { t: "Jeszcze się uczę i nie znam odpowiedzi na to pytanie. Spróbuj zapytać inaczej albo wybierz temat poniżej. Mogę też podać kontakt do konsultanta." };
}

export default function Zusanna() {
  const { profil, zus = DANE_ZUS_ZAPAS, ankieta = {}, etap } = useSesja();
  const terminy = useNadchodzace();
  const sytuacja = ocenSytuacje(ankieta, zus, etap);
  const [otwarte, setOtwarte] = useState(false);
  const [dymek, setDymek] = useState(() => sessionStorage.getItem(KLUCZ_DYMKA) !== "1");
  const [tekst, setTekst] = useState("");
  const [pisze, setPisze] = useState(false);
  const [wiad, setWiad] = useState(() => [{ od: "z", t: `Cześć${profil?.imie ? `, ${profil.imie}` : ""}! Jak mogę Ci pomóc?` }]);
  const lista = useRef(null);
  const pole = useRef(null);

  useEffect(() => {
    const f = () => { setOtwarte(true); setDymek(false); };
    window.addEventListener(OTWORZ_ZUSANNE, f);
    return () => window.removeEventListener(OTWORZ_ZUSANNE, f);
  }, []);
  useEffect(() => { lista.current?.scrollTo({ top: lista.current.scrollHeight, behavior: "smooth" }); }, [wiad, pisze]);
  useEffect(() => {
    if (!otwarte) return;
    pole.current?.focus();
    const esc = (e) => e.key === "Escape" && setOtwarte(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [otwarte]);

  const zamknijDymek = () => { setDymek(false); sessionStorage.setItem(KLUCZ_DYMKA, "1"); };
  const otworz = () => { setOtwarte(true); zamknijDymek(); };

  const wyslij = (t) => {
    const p = t.trim();
    if (!p || pisze) return;
    setWiad((w) => [...w, { od: "u", t: p }]);
    setTekst("");
    setPisze(true);
    setTimeout(() => {
      setWiad((w) => [...w, { od: "z", ...odpowiedz(p, { sytuacja, ankieta, terminy, zus }) }]);
      setPisze(false);
    }, 650);
  };

  return (
    <div className="zs">
      {otwarte && (
        <section className="zs-okno" role="dialog" aria-label="Asystentka ZUSanna">
          <header className="zs-glowa">
            <img className="zs-awatar" src="/zusanna.jpg" alt="" width="44" height="44" />
            <span><b>ZUSanna</b><small>Asystentka rodzica · wersja testowa</small></span>
            <button type="button" onClick={() => setOtwarte(false)} aria-label="Zamknij czat">×</button>
          </header>
          <div className="zs-lista" ref={lista} aria-live="polite">
            {wiad.map((m, i) => (
              <div key={i} className={`zs-wiad ${m.od === "u" ? "ty" : ""}`}>
                {m.od !== "u" && <img src="/zusanna.jpg" alt="" className="zs-wiad-foto" />}
                <p>{m.t}</p>
                {m.link && <Link to={m.link[1]} onClick={() => setOtwarte(false)}>{m.link[0]} <Ikona n="strzalka" rozmiar={14} /></Link>}
              </div>
            ))}
            {pisze && <div className="zs-wiad zs-pisze" aria-label="ZUSanna pisze"><span /><span /><span /></div>}
            {wiad.length < 3 && !pisze && (
              <div className="zs-szybkie">
                {SZYBKIE.map((s) => <button key={s} type="button" onClick={() => wyslij(s)}>{s}</button>)}
              </div>
            )}
          </div>
          <form className="zs-pole" onSubmit={(e) => { e.preventDefault(); wyslij(tekst); }}>
            <label htmlFor="zs-input" className="sr-only">Napisz pytanie</label>
            <input id="zs-input" ref={pole} value={tekst} onChange={(e) => setTekst(e.target.value)} placeholder="Zapytaj własnymi słowami…" autoComplete="off" />
            <button type="submit" aria-label="Wyślij" disabled={!tekst.trim()}><Ikona n="wyslij" rozmiar={18} /></button>
          </form>
          <p className="zs-uwaga">Odpowiedzi są uproszczone. Nie podawaj tu danych wrażliwych.</p>
        </section>
      )}

      {!otwarte && dymek && (
        <div className="zs-dymek" role="status">
          <button type="button" className="zs-dymek-tresc" onClick={otworz}>
            <img src="/zusanna.jpg" alt="" className="zs-dymek-foto" />
            <span className="zs-dymek-tekst">
              <b>Cześć! Jak mogę Ci pomóc?</b>
              <span>Jestem ZUSanna, Twoja asystentka rodzica.</span>
            </span>
          </button>
          <button type="button" className="zs-dymek-x" onClick={zamknijDymek} aria-label="Ukryj powitanie">×</button>
        </div>
      )}

      <button type="button" className={`zs-start ${otwarte ? "otwarte" : ""}`} onClick={() => (otwarte ? setOtwarte(false) : otworz())} aria-expanded={otwarte} aria-label={otwarte ? "Zamknij ZUSannę" : "Otwórz asystentkę ZUSannę"}>
        {otwarte ? <span aria-hidden="true">×</span> : <img src="/zusanna.jpg" alt="" className="zs-start-foto" />}
      </button>
    </div>
  );
}
