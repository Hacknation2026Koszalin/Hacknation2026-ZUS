// =====================================================================
// MOJE KONTO — strona główna po zalogowaniu.
// Hero (odliczanie do kolejnego wniosku) + „Co możesz zrobić” (krótkie karty)
// + Twoja sytuacja (z ankiety). Oś czasu jest w „Mojej ścieżce”.
// =====================================================================
import { useEffect, useRef, useState } from "react";
import { useJezyk } from "../jezyk.js";
import { Link, useNavigate } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import { DANE_ZUS_ZAPAS, ETAPY, PROFIL_MOBYWATEL } from "../dane.js";
import { dzisISO, fmtDzien, ileDni } from "../terminy.js";
import { zbudujPlan } from "../plan.js";
import { maChorobowe, nazwaEtapu, ocenSytuacje } from "../sytuacja.js";
import { STATUSY } from "../wniosek/wnioski.js";
import { useChecklista } from "../komponenty/OsCzasu.jsx";
import { DataModal, useDataKluczowa } from "../komponenty/DataKluczowa.jsx";
import { ZadluzenieModal, kwota, maZadluzenie } from "../komponenty/Zadluzenie.jsx";
import { OTWORZ_ZUSANNE } from "../komponenty/Zusanna.jsx";
import { useNadchodzace } from "../komponenty/Powiadomienia.jsx";
import StatusZwolnienia, { pokazZwolnienie } from "../komponenty/Zwolnienie.jsx";
import { KartaUmowy } from "../komponenty/Umowa.jsx";
import Ikona from "../wniosek/Ikona.jsx";


// --- tło hero (gradient identyfikacji + płynące linie) ---
function TloHero({ alarm }) {
  const [z1, z2, z3, z4] = alarm ? ["#FFB4A8", "#F0645A", "#D93A35", "#B3261E"] : ["#EAF205", "#8FD201", "#1FB0A6", "#0B86D6"];
  const [n1, n2, n3] = alarm ? ["#C62828", "#9E1C1C", "#6E1212"] : ["#0B86D6", "#025AC4", "#023F8F"];
  return (
    <svg className="mkhero-tlo" viewBox="0 0 1440 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="gZus" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor={z1} />
          <stop offset="0.38" stopColor={z2} />
          <stop offset="0.7" stopColor={z3} />
          <stop offset="1" stopColor={z4} />
        </linearGradient>
        <linearGradient id="gNiebo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={n1} />
          <stop offset="0.45" stopColor={n2} />
          <stop offset="1" stopColor={n3} />
        </linearGradient>
      </defs>
      <rect width="1440" height="560" fill="url(#gNiebo)" />
      <path d="M0 0H520C470 110 490 230 580 320C680 420 740 470 710 560H0Z" fill="url(#gZus)" />
      <path d="M0 330C140 380 290 360 400 300C470 262 510 290 540 360L590 560H0Z" fill={z1} opacity=".35" />
      <g fill="none" stroke="#fff" strokeWidth="1" opacity=".22">
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d={`M${880 + i * 9} -20C${760 + i * 14} 150 ${1180 - i * 6} 260 ${1010 + i * 10} 400S${880 + i * 12} 520 ${1020 + i * 8} 600`} />
        ))}
      </g>
    </svg>
  );
}

function Fale() {
  return (
    <svg className="mkhero-fale" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 70C220 30 420 100 720 70S1200 20 1440 60V120H0Z" fill="#8FD201" opacity=".35" />
      <path d="M0 85C260 55 520 115 800 85S1240 50 1440 80V120H0Z" fill="#7FD3F0" opacity=".45" />
      <path d="M0 100C300 75 560 120 860 98S1260 80 1440 95V120H0Z" fill="var(--m-bg)" />
    </svg>
  );
}

// Tarcza z kreskami jak zegar — kreski „zużytych” dni gasną
function Tarcza({ zostalo, okno }) {
  const kresek = 60;
  const aktywne = Math.max(1, Math.round((Math.min(zostalo, okno) / okno) * kresek));
  return (
    <svg className="licznik-tarcza" viewBox="0 0 300 300" aria-hidden="true">
      <defs>
        <linearGradient id="gTar" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#CDEB00" />
          <stop offset=".5" stopColor="#8FD201" />
          <stop offset="1" stopColor="#025AC4" />
        </linearGradient>
      </defs>
      {Array.from({ length: kresek }, (_, i) => {
        const kat = (i / kresek) * 2 * Math.PI - Math.PI / 2;
        const [r1, r2] = i % 5 === 0 ? [118, 140] : [124, 140];
        return (
          <line key={i}
            x1={150 + r1 * Math.cos(kat)} y1={150 + r1 * Math.sin(kat)}
            x2={150 + r2 * Math.cos(kat)} y2={150 + r2 * Math.sin(kat)}
            stroke={i < aktywne ? "url(#gTar)" : "#DCE6F2"} strokeWidth={i % 5 === 0 ? 5 : 3} strokeLinecap="round" />
        );
      })}
    </svg>
  );
}


// Obrazki kart „Co możesz zrobić” — każda karta ma własną ilustrację pasującą do treści.
// [plik z web/public, kadr]. Chcesz zdjęcie? Wrzuć np. /karty/data.jpg i podmień ścieżkę.
const ZDJECIA = {
  data: ["/karty/data.svg", "50% 30%"],
  sciezka: ["/karty/sciezka.svg", "50% 8%"],
  sprawa: ["/karty/sprawa.svg", "50% 45%"],
  kalk: ["/karty/kalk.svg", "50% 50%"],
  wniosek: ["/karty/wniosek.svg", "50% 45%"],
  rodz: ["/karty/rodz.svg", "50% 50%"],
  wsparcie: ["/karty/wsparcie.svg", "50% 55%"],
  asystent: ["/karty/asystent.svg", "50% 50%"],
  zadluzenie: ["/karty/zadluzenie.svg", "50% 55%"],
  umowa: ["/karty/umowa.svg", "50% 50%"],
  pue: ["/karty/pue.svg", "50% 50%"],
  domyslne: ["/karty/domyslne.svg", "50% 50%"],
};

export default function Pulpit() {
  const sesja = useSesja();
  const [jezyk, t] = useJezyk();
  const { profil = PROFIL_MOBYWATEL, etap = "ciaza", zus = DANE_ZUS_ZAPAS, ankieta = {}, ustaw } = sesja;
  const nav = useNavigate();
  const e = ETAPY.find((x) => x.id === etap) || ETAPY[1];
  const strata = etap === "trudna";
  const wCiazy = etap === "ciaza";
  const { def, data } = useDataKluczowa();
  const [modal, setModal] = useState(false);
  const dzis = dzisISO();
  const zadluzony = maZadluzenie(zus) && !strata;
  const [modalZad, setModalZad] = useState(false);
  useEffect(() => {
    if (zadluzony && sessionStorage.getItem("zadluzenie-pokazane") !== "1") setModalZad(true);
  }, [zadluzony]);
  const zamknijZad = () => { setModalZad(false); sessionStorage.setItem("zadluzenie-pokazane", "1"); };
  const rzad = useRef(null);
  const [przewin, setPrzewin] = useState({ lewo: false, prawo: false });

  const chor = maChorobowe(ankieta, zus);
  const sytuacja = ocenSytuacje(ankieta, zus, etap);
  const plan = zbudujPlan({ etap, data, odp: ankieta, chor });
  const lista = useChecklista(profil.pesel);
  const doZrobienia = plan.flatMap((k) => k.zadania).filter((z) => !lista.czyZrobione(z)).length;

  // Kolejny wniosek = najbliższy wniosek, który nie jest jeszcze złożony
  // Kolejny krok = najbliższy nieodhaczony termin z Twojej ścieżki (ten sam, co w dzwonku)
  const nadchodzace = useNadchodzace();
  const kolejny = data ? nadchodzace[0] : plan.flatMap((k) => k.zadania).find((z) => !lista.czyZrobione(z));
  const zostalo = kolejny?.termin ? ileDni(dzis, kolejny.termin) : null;
  const nazwaKroku = kolejny ? (kolejny.wniosek && kolejny.nazwaWniosku ? kolejny.nazwaWniosku[0].toUpperCase() + kolejny.nazwaWniosku.slice(1) : kolejny.t) : "";
  const doPorodu = wCiazy && data ? ileDni(dzis, data) : null;
  const ostatniWniosek = lista.wnioski[0];

  // ---------- „Co możesz zrobić” — krótkie karty ----------
  const karty = [];
  if (def && !data)
    karty.push({ id: "data", kolor: "limonka", ikona: "kalendarz", tytul: `${def.dodaj} od lekarza`, opis: "Policzymy dokładne daty Twoich wniosków. To dobrowolne.", akcja: () => setModal(true), cta: "Dodaj datę" });
  karty.push({ id: "sciezka", kolor: "niebo", ikona: "dokument", tytul: "Zobacz, co i kiedy musisz zrobić", opis: doZrobienia ? `${doZrobienia} rzeczy na Twojej liście` : "Wszystko odhaczone!", link: "/przewodnik/sciezka", cta: "Moja ścieżka" });
  if (ostatniWniosek)
    karty.push({ id: "sprawa", kolor: "bialy", ikona: "poczta", tytul: "Status Twojej sprawy", opis: `${ostatniWniosek.nazwa}: ${(STATUSY[ostatniWniosek.status] || STATUSY.u_urzednika).tekst.toLowerCase()}`, link: "/przewodnik/sprawy", cta: "Moje sprawy" });
  if (sytuacja.swiadczenie === "zasilek" && !strata)
    karty.push({ id: "kalk", kolor: "turkus", ikona: "kalkulator", tytul: "Sprawdź, ile dostaniesz", opis: "81,5% przez cały rok czy 100% + 70%? Porównaj.", link: "/przewodnik/kalkulator", cta: "Kalkulator" });
  if (sytuacja.swiadczenie === "zasilek" && !ostatniWniosek && etap !== "planuje")
    karty.push({ id: "wniosek", kolor: "granat", ikona: "dokument", tytul: "Złóż wniosek z przewodnikiem", opis: "Poprowadzimy Cię pole po polu.", link: "/przewodnik/swiadczenia/zasilek-macierzynski/wniosek", cta: "Złóż wniosek" });
  if (sytuacja.swiadczenie === "rodzicielskie")
    karty.push({ id: "rodz", kolor: "turkus", ikona: "info", tytul: "Świadczenie rodzicielskie", opis: "Sprawdź, gdzie i kiedy złożyć wniosek.", link: "/przewodnik/swiadczenia#swiadczenie-rodzicielskie", cta: "Świadczenia" });
  if (strata)
    karty.push({ id: "wsparcie", kolor: "bialy", ikona: "serce", tytul: "Pomoc dla Ciebie", opis: "Kontakty do wsparcia psychologicznego.", link: "/przewodnik/pomoc#organizacje", cta: "Pomoc" });
  if (!strata && /umowa o pracę/.test(zus?.ubezpieczenie?.tytul || "") && !sesja.ustanie?.data)
    karty.push({ id: "umowa", kolor: "bialy", ikona: "teczka", tytul: "Kończy się Twoja umowa?", opis: "Dodaj datę — sprawdzimy, czy przedłuży się do porodu i co z zasiłkiem.", akcja: () => window.dispatchEvent(new Event("otworz-ustawienia")), cta: "Dodaj datę" });
  karty.push({ id: "pue", kolor: "bialy", ikona: "tarcza", tytul: "Sprawdź dane na koncie PUE/eZUS", opis: "Składki, zwolnienia i płatnik — a gdy coś się nie zgadza, zapytaj ZUS.", link: "/przewodnik/konto-pue", cta: "Konto PUE/eZUS" });
  karty.push({ id: "asystent", kolor: "gradient", ikona: "dymek", tytul: "Asystent ZUSanna podpowie Ci", opis: "Zapytaj własnymi słowami o urlopy, zasiłki i wnioski.", akcja: () => window.dispatchEvent(new Event(OTWORZ_ZUSANNE)), cta: "Zapytaj ZUSannę" });
  if (zadluzony)
    karty.unshift({ id: "zadluzenie", kolor: "bialy sh-zadluzenie", ikona: "alert", tytul: "Spłać zaległość, by dostać zasiłek", opis: `Zaległość w składkach: ${kwota(zus.zadluzenie)}.`, akcja: () => setModalZad(true), cta: "Co to oznacza?" });

  // Karuzela: 3 karty na widoku, strzałki przewijają o jedną kartę
  const aktualizujStrzalki = () => {
    const el = rzad.current;
    if (!el) return;
    setPrzewin({ lewo: el.scrollLeft > 4, prawo: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { aktualizujStrzalki(); window.addEventListener("resize", aktualizujStrzalki); return () => window.removeEventListener("resize", aktualizujStrzalki); }, [karty.length]);
  const przesun = (kier) => {
    const el = rzad.current;
    const karta = el?.querySelector(".sh-karta");
    if (el && karta) el.scrollBy({ left: kier * (karta.offsetWidth + 16), behavior: "smooth" });
  };

  return (
    <div className="mk">
      {/* ===================== HERO ===================== */}
      <section className={`mkhero ${strata ? "spokojny" : ""}`}>
        <TloHero alarm={zadluzony} />
        <div className="wrap mkhero-in">
          <div className="licznik">
            {zadluzony ? (
              <>
                <div className="licznik-kolo licznik-zad">
                  <div className="licznik-srodek">
                    <Ikona n="alert" rozmiar={64} />
                    <span className="licznik-pod licznik-pod-szer"><b>Zasiłek wstrzymany</b> do czasu spłaty zaległości</span>
                  </div>
                </div>
                <button type="button" className="licznik-wstega licznik-wstega-btn" onClick={() => setModalZad(true)}>
                  <span className="licznik-wstega-ikona"><Ikona n="alert" rozmiar={22} /></span>
                  <span>
                    <small>Zaległość w składkach</small>
                    <b>{kwota(zus.zadluzenie)}</b>
                    <em>Co to oznacza? Sprawdź</em>
                  </span>
                </button>
              </>
            ) : kolejny && zostalo !== null ? (
              <>
                <div className="licznik-kolo">
                  <Tarcza zostalo={zostalo} okno={zostalo <= 30 ? 30 : 120} />
                  <div className="licznik-srodek">
                    <span className="licznik-liczba">{zostalo}</span>
                    <span className="licznik-dni">dni</span>
                    <span className="licznik-pod">{kolejny.wniosek ? t("na złożenie wniosku") : t("do kolejnego kroku")}</span>
                  </div>
                </div>
                <Link to={kolejny.link || "/przewodnik/sciezka"} className="licznik-wstega" key={kolejny.id}>
                  <span className="licznik-wstega-ikona"><Ikona n="dokument" rozmiar={22} /></span>
                  <span>
                    <small>{kolejny.wniosek ? t("Kolejny wniosek") : t("Kolejny krok")}</small>
                    <b>{nazwaKroku}</b>
                    <em>ostatni dzień: {fmtDzien(kolejny.termin)}</em>
                  </span>
                </Link>
                <div className="licznik-akcje">
                  {def && data && (
                    <button type="button" className="licznik-zmien" onClick={() => setModal(true)}>
                      <Ikona n="kalendarz" rozmiar={16} /> {def.etykieta}: <b>{fmtDzien(data)}</b> <span>· zmień</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="licznik-kolo">
                  <div className="licznik-srodek">
                    <Ikona n={strata ? "serce" : etap === "planuje" ? "check" : "kalendarz"} rozmiar={84} />
                    <span className="licznik-pod licznik-pod-szer">
                      {strata ? "Jesteśmy tu, kiedy będziesz gotowa" : kolejny ? "Pokażemy, ile dni zostało do kolejnego kroku" : "Terminy ustawowe znajdziesz w Twojej ścieżce"}
                    </span>
                  </div>
                </div>
                {def && !data && !strata && (
                  <button type="button" className="licznik-wstega licznik-wstega-btn" onClick={() => setModal(true)}>
                    <span className="licznik-wstega-ikona niebieska"><Ikona n="kalendarz" rozmiar={22} /></span>
                    <span>
                      <small className="niebieski">Opcjonalnie</small>
                      <b>{def.dodaj}</b>
                      <em>i zobacz konkretne daty</em>
                    </span>
                  </button>
                )}
              </>
            )}
          </div>

          <div className="mkhero-tekst">
            <button type="button" className="mkhero-etap" onClick={() => { ustaw({ onboardingZakonczony: false }); nav("/przewodnik/witaj"); }}>
              {nazwaEtapu(etap, ankieta) || e.nazwa} <span>· zmień</span>
            </button>
            <h1>
              {strata ? <>{t(e.powitanie)},<br />{profil.imie}</> : wCiazy ? <>{t("Gratulacje")},<br />{profil.imie}!</> : <>{t(e.powitanie.replace(/!$/, ""))},<br />{profil.imie}!</>}
            </h1>
            <p className="mkhero-lead">
              {jezyk === "pl" && doPorodu !== null && doPorodu >= 0 ? <>Za <b>{doPorodu} dni</b> powitasz swoje maleństwo. </> : null}
              {zadluzony && <><b>Na Twoim koncie jest zaległość w składkach — dopóki jej nie spłacisz, zasiłek nie zostanie wypłacony.</b> </>}
              {jezyk === "pl" ? <>{e.podtytul} {!strata && "Terminów pilnujemy za Ciebie."}</> : t("lead-pulpit")}
            </p>
            <div className="mkhero-cta">
              <Link to="/przewodnik/sciezka" className="h-btn h-btn-limonka">{t("Moja ścieżka")}</Link>
              <Link to="/przewodnik/swiadczenia" className="h-btn h-btn-bialy">{t("Co mi przysługuje?")}</Link>
            </div>
          </div>
        </div>
        <Fale />
      </section>

      <KartaUmowy ustanie={sesja.ustanie} etap={etap} terminPorodu={sesja.terminPorodu} onZmien={() => window.dispatchEvent(new Event("otworz-ustawienia"))} />

      {/* ===================== STATUS ZWOLNIENIA (tylko gdy ma sens na tym etapie) ===================== */}
      {pokazZwolnienie({ etap, ankieta, data, dzis }) && <StatusZwolnienia zus={zus} etap={etap} data={data} ankieta={ankieta} />}

      {/* ===================== CO MOŻESZ ZROBIĆ ===================== */}
      <section className="sh-sekcja" aria-labelledby="sh-tytul">
        <div className="wrap">
          <div className="sh-glowa">
            <span className="plan-kicker">Na teraz</span>
            <h2 id="sh-tytul">{t("Co możesz zrobić")}</h2>
          </div>
          <div className="sh-karuzela">
          <button type="button" className="sh-strzalka lewo" onClick={() => przesun(-1)} disabled={!przewin.lewo} aria-label="Poprzednie karty"><Ikona n="wstecz" rozmiar={22} /></button>
          <ul className="sh-rzad" ref={rzad} onScroll={aktualizujStrzalki}>
            {karty.map((k) => {
              const [foto, pozycja] = ZDJECIA[k.id] || ZDJECIA.domyslne;
              const tresc = (
                <>
                  <span className="sh-foto" style={{ backgroundImage: `url(${foto})`, backgroundPosition: pozycja }} aria-hidden="true">
                    <span className="sh-ikona"><Ikona n={k.ikona} rozmiar={24} /></span>
                    {k.wkrotce && <span className="sh-wkrotce">Wkrótce</span>}
                  </span>
                  <span className="sh-tekst">
                    <b>{k.tytul}</b>
                    <span>{k.opis}</span>
                  </span>
                  {!k.wkrotce && <span className="sh-cta">{k.cta} <Ikona n="strzalka" rozmiar={16} /></span>}
                </>
              );
              return (
                <li key={k.id} className={`sh-karta sh-${k.kolor} ${k.wkrotce ? "sh-nieaktywna" : ""}`}>
                  {k.link ? <Link to={k.link}>{tresc}</Link> : k.akcja ? <button type="button" onClick={k.akcja}>{tresc}</button> : <div>{tresc}</div>}
                </li>
              );
            })}
          </ul>
          <button type="button" className="sh-strzalka prawo" onClick={() => przesun(1)} disabled={!przewin.prawo} aria-label="Następne karty"><Ikona n="strzalka" rozmiar={22} /></button>
          </div>
        </div>
      </section>

      <DataModal otwarty={modal} onZamknij={() => setModal(false)} />
      {modalZad && <ZadluzenieModal zus={zus} onZamknij={zamknijZad} />}
    </div>
  );
}
