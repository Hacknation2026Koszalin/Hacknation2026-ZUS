// Strona świadczenia (szablon): spis treści + 9 sekcji + „Złóż wniosek” / „Pobierz PDF”
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import { DANE_ZUS_ZAPAS } from "../dane.js";
import { zl } from "../wniosek/formularz.js";
import Ikona from "../wniosek/Ikona.jsx";

const SEKCJE = [
  ["skrot", "W skrócie"],
  ["komu", "Czy mi przysługuje?"],
  ["ile", "Ile dostanę?"],
  ["jak-dlugo", "Jak długo?"],
  ["kiedy", "Kiedy złożyć?"],
  ["gdzie", "Gdzie złożyć?"],
  ["dokumenty", "Jakie dokumenty?"],
  ["uwaga", "Na co uważać?"],
  ["pytania", "Pytania i podstawa prawna"],
];

export default function ZasilekMacierzynski() {
  const { zus = DANE_ZUS_ZAPAS } = useSesja();
  const [aktywna, setAktywna] = useState(SEKCJE[0][0]);
  const p = zus.podstawaWymiaru;
  const u = zus.ubezpieczenie;

  // Podświetlanie sekcji w spisie treści podczas przewijania
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (wpisy) => wpisy.forEach((e) => e.isIntersecting && setAktywna(e.target.id)),
      { rootMargin: "-20% 0px -70% 0px" },
    );
    SEKCJE.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const spis = (
    <ol>
      {SEKCJE.map(([id, t]) => (
        <li key={id}><a href={`#${id}`} className={aktywna === id ? "akt" : ""}>{t}</a></li>
      ))}
    </ol>
  );

  return (
    <div className="wn">
      <div className="wrap">
        <nav className="wn-okruszki" aria-label="Jesteś tutaj">
          <Link to="/przewodnik/swiadczenia">Świadczenia</Link> <span aria-hidden="true">/</span> <span>Zasiłek macierzyński</span>
        </nav>
        <div className="sw-uklad">
          <aside className="sw-spis" aria-label="Spis treści">
            <b>Na tej stronie</b>
            {spis}
          </aside>

          <article className="sw-tresc">
            <details className="sw-spis-mobile">
              <summary>Spis treści</summary>
              {spis}
            </details>

            <h1>Zasiłek macierzyński</h1>
            <p className="wn-lead">Pieniądze, które dostajesz zamiast wynagrodzenia, gdy opiekujesz się dzieckiem — w czasie urlopu macierzyńskiego i rodzicielskiego.</p>

            <div className="sw-dla-ciebie">
              <h2>
                <span className="sw-odznaka"><Ikona n="check" rozmiar={16} /> Przysługuje Ci</span>
                Dla Ciebie
              </h2>
              <p style={{ margin: 0 }}>
                Masz ubezpieczenie chorobowe ({u.chorobowe}, {u.tytul} od {u.od.split("-").reverse().join(".")}).
                Twój pracodawca zgłasza ponad 20 osób, więc to <b>on wypłaci zasiłek</b>.
              </p>
              <div className="sw-kwoty">
                <div className="sw-kwota"><small>81,5% przez cały czas</small><b>{zl(p * 0.815)}</b></div>
                <div className="sw-kwota"><small>100% za macierzyński</small><b>{zl(p)}</b></div>
                <div className="sw-kwota"><small>potem 70% za rodzicielski</small><b>{zl(p * 0.7)}</b></div>
              </div>
              <p className="sw-dopisek">Miesięcznie, brutto, orientacyjnie — od podstawy {zl(p)}. Dokładnie policzysz w Kalkulatorze.</p>
            </div>

            <section id="skrot">
              <h2>W skrócie</h2>
              <ul>
                <li>Dostajesz go, jeśli masz <b>ubezpieczenie chorobowe</b> i urodziłaś dziecko albo przyjęłaś je na wychowanie.</li>
                <li>Urlop macierzyński trwa <b>20 tygodni</b> (przy jednym dziecku), a po nim możesz wziąć <b>41 tygodni</b> urlopu rodzicielskiego.</li>
                <li>Masz dwa warianty: <b>81,5%</b> przez cały czas albo <b>100%</b> za macierzyński i <b>70%</b> za rodzicielski.</li>
                <li>Na wybór wariantu 81,5% masz <b>21 dni od porodu</b>.</li>
              </ul>
            </section>

            <section id="komu">
              <h2>Czy mi przysługuje?</h2>
              <p>Zasiłek przysługuje, jeśli w dniu porodu (albo przyjęcia dziecka) masz ubezpieczenie chorobowe:</p>
              <ul>
                <li>przy umowie o pracę — masz je zawsze (obowiązkowo),</li>
                <li>przy działalności gospodarczej lub umowie zlecenia — tylko jeśli opłacasz je dobrowolnie.</li>
              </ul>
              <p>Przy zasiłku macierzyńskim <b>nie ma okresu wyczekiwania</b> — nie musisz mieć ubezpieczenia przez określony czas.</p>
              <p>Zasiłek dostaniesz też, gdy przyjmiesz dziecko na wychowanie (adopcja) albo jako rodzina zastępcza — co do zasady, gdy dziecko ma do 7 lat (do 10 lat, jeśli ma odroczony obowiązek szkolny).</p>
            </section>

            <section id="ile">
              <h2>Ile dostanę?</h2>
              <p>Zasiłek liczymy od <b>podstawy wymiaru</b> — to zwykle Twoje średnie wynagrodzenie z ostatnich 12 miesięcy po odjęciu składek na ubezpieczenia społeczne.</p>
              <table className="sw-tabela">
                <thead><tr><th>Wariant</th><th>Za urlop macierzyński</th><th>Za urlop rodzicielski</th></tr></thead>
                <tbody>
                  <tr><td>Wniosek do 21 dni po porodzie</td><td>81,5%</td><td>81,5%</td></tr>
                  <tr><td>Wniosek o rodzicielski później</td><td>100%</td><td>70%</td></tr>
                </tbody>
              </table>
              <p>Zasiłek nie może być niższy niż kwota świadczenia rodzicielskiego.</p>
            </section>

            <section id="jak-dlugo">
              <h2>Jak długo?</h2>
              <table className="sw-tabela">
                <thead><tr><th>Dzieci przy jednym porodzie</th><th>Urlop macierzyński</th><th>Urlop rodzicielski</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>20 tygodni</td><td>41 tygodni</td></tr>
                  <tr><td>2</td><td>31 tygodni</td><td>43 tygodnie</td></tr>
                  <tr><td>3</td><td>33 tygodnie</td><td>43 tygodnie</td></tr>
                  <tr><td>4</td><td>35 tygodni</td><td>43 tygodnie</td></tr>
                  <tr><td>5 i więcej</td><td>37 tygodni</td><td>43 tygodnie</td></tr>
                </tbody>
              </table>
              <p>Z urlopu rodzicielskiego <b>9 tygodni jest tylko dla mamy i 9 tygodni tylko dla taty</b> — nie można ich przekazać drugiemu rodzicowi. Mama musi wykorzystać co najmniej 14 tygodni urlopu macierzyńskiego.</p>
            </section>

            <section id="kiedy">
              <h2>Kiedy złożyć?</h2>
              <ul>
                <li>Możesz zacząć urlop <b>do 6 tygodni przed przewidywaną datą porodu</b>.</li>
                <li>Jeśli chcesz wariant 81,5% — złóż wniosek <b>najpóźniej 21 dni po porodzie</b>.</li>
                <li>Jeśli wybierzesz 100% — o urlop rodzicielski poprosisz osobno, najpóźniej 21 dni przed jego rozpoczęciem.</li>
              </ul>
            </section>

            <section id="gdzie">
              <h2>Gdzie złożyć?</h2>
              <ul>
                <li><b>Masz umowę o pracę</b> — u pracodawcy. Jeśli zgłasza on do ubezpieczenia ponad 20 osób, sam wypłaca zasiłek. Jeśli mniej — przekazuje dokumenty do ZUS, a zasiłek wypłaca ZUS.</li>
                <li><b>Prowadzisz działalność albo masz umowę zlecenia</b> — w ZUS, najprościej przez eZUS (wniosek ZAM).</li>
              </ul>
              <div className="wn-alert">
                <Ikona n="info" />
                <div><b>Twoja sytuacja:</b> umowa o pracę, pracodawca zgłasza ponad 20 osób — dokumenty złożysz u niego. W prototypie pokazujemy wniosek ZAM, żeby zaprezentować przewodnik po formularzu.</div>
              </div>
            </section>

            <section id="dokumenty">
              <h2>Jakie dokumenty?</h2>
              <ul>
                <li>wniosek (ZAM w ZUS albo wniosek o urlop u pracodawcy),</li>
                <li>przed porodem: zaświadczenie lekarskie o przewidywanej dacie porodu,</li>
                <li>po porodzie: skrócony odpis aktu urodzenia dziecka (albo dane z rejestru stanu cywilnego),</li>
                <li>przy adopcji lub rodzinie zastępczej: dokument z sądu lub ośrodka o przyjęciu dziecka.</li>
              </ul>
            </section>

            <section id="uwaga">
              <h2>Na co uważać?</h2>
              <ul>
                <li><b>21 dni po porodzie</b> — po tym terminie wariant 81,5% nie jest już dostępny.</li>
                <li>W czasie urlopu macierzyńskiego nie możesz pracować u pracodawcy, który udzielił Ci urlopu. Urlop rodzicielski możesz łączyć z pracą do połowy etatu.</li>
                <li>Prowadzisz działalność? Zaległości w składkach powyżej 1% minimalnego wynagrodzenia wstrzymują wypłatę zasiłku, dopóki ich nie spłacisz.</li>
                <li>Każdą zmianę, która wpływa na prawo do zasiłku, zgłoś pracodawcy albo ZUS.</li>
              </ul>
            </section>

            <section id="pytania" className="sw-faq">
              <h2>Pytania i podstawa prawna</h2>
              <details>
                <summary>Czy tata może przejąć część urlopu?</summary>
                <p>Tak. Urlop rodzicielski rodzice mogą dzielić między siebie, a 9 tygodni przysługuje tylko tacie. W określonych sytuacjach tata może też przejąć część urlopu macierzyńskiego.</p>
              </details>
              <details>
                <summary>Pracuję na umowie zlecenia. Czy dostanę zasiłek?</summary>
                <p>Tak, jeśli opłacasz dobrowolne ubezpieczenie chorobowe. Wniosek składasz wtedy w ZUS.</p>
              </details>
              <details>
                <summary>Co, jeśli dziecko urodziło się przedwcześnie i jest w szpitalu?</summary>
                <p>Urlop może zostać wydłużony o czas pobytu dziecka w szpitalu (zasiłek macierzyński uzupełniający). Szczegóły ustalisz z pracodawcą lub ZUS.</p>
              </details>
              <p className="sw-zrodlo">
                Podstawa prawna: ustawa z 25 czerwca 1999 r. o świadczeniach pieniężnych z ubezpieczenia społecznego w razie choroby i macierzyństwa (rozdział o zasiłku macierzyńskim); Kodeks pracy (przepisy o urlopach związanych z rodzicielstwem).
                Treść uproszczona na potrzeby prototypu — przed decyzją sprawdź aktualne informacje na zus.pl.
              </p>
            </section>

            <div className="sw-cta">
              <p><b>Gotowa?</b> Poprowadzimy Cię przez wniosek pole po polu. Dane z mObywatela wpiszemy za Ciebie.</p>
              <Link to="/przewodnik/swiadczenia/zasilek-macierzynski/wniosek" className="wn-btn wn-btn-glowny wn-btn-duzy">
                Złóż wniosek <Ikona n="strzalka" />
              </Link>
              <a href="/formularze/ZAM.pdf" download className="wn-btn wn-btn-drugi wn-btn-duzy">
                <Ikona n="pdf" /> Pobierz wersję PDF
              </a>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
