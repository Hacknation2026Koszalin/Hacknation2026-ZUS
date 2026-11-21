// =====================================================================
// MOJE KONTO — hero z odliczaniem do kolejnego wniosku,
// pod spodem oś czasu w zygzaku (prawo–lewo) z checklistą przy każdym kroku
// =====================================================================
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import { ETAPY, KARTA_CIAZY, PROFIL_MOBYWATEL } from "../dane.js";
import { dzisISO, fmtDzien, ileDni, opisZa, tydzienCiazy } from "../terminy.js";
import { zbudujPlan } from "../plan.js";
import { pobierzWnioski } from "../wniosek/wnioski.js";
import Ikona from "../wniosek/Ikona.jsx";

const KLUCZ = "przewodnik-checklista";
const wczytaj = () => {
  try {
    return JSON.parse(localStorage.getItem(KLUCZ)) || {};
  } catch {
    return {};
  }
};
const zl = (v) => v.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " zł";

// --- tło hero (gradient identyfikacji + płynące linie) ---
function TloHero() {
  return (
    <svg className="mkhero-tlo" viewBox="0 0 1440 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="gZus" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#EAF205" />
          <stop offset="0.38" stopColor="#8FD201" />
          <stop offset="0.7" stopColor="#1FB0A6" />
          <stop offset="1" stopColor="#0B86D6" />
        </linearGradient>
        <linearGradient id="gNiebo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0B86D6" />
          <stop offset="0.45" stopColor="#025AC4" />
          <stop offset="1" stopColor="#023F8F" />
        </linearGradient>
      </defs>
      <rect width="1440" height="560" fill="url(#gNiebo)" />
      <path d="M0 0H520C470 110 490 230 580 320C680 420 740 470 710 560H0Z" fill="url(#gZus)" />
      <path d="M0 330C140 380 290 360 400 300C470 262 510 290 540 360L590 560H0Z" fill="#EAF205" opacity=".35" />
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

const ZNACZNIK = {
  krytyczny: ["Nie przegap!", "dzwonek"],
  szansa: ["Możesz już", "check"],
  info: ["Warto wiedzieć", "info"],
  porod: ["Wielki dzień", "serce"],
};

export default function Pulpit() {
  const { profil = PROFIL_MOBYWATEL, etap, zus, ustaw } = useSesja();
  const e = ETAPY.find((x) => x.id === etap) || ETAPY[1];
  const karta = KARTA_CIAZY;
  const dzis = dzisISO();
  const trudna = etap === "trudna";
  const wCiazy = etap === "ciaza" || !etap;
  const doPorodu = ileDni(dzis, karta.terminPorodu);
  const tc = tydzienCiazy(karta, dzis);
  const plan = zbudujPlan(karta, dzis);

  const [zrobione, setZrobione] = useState(wczytaj);
  const [wyslaneWnioski, setWyslaneWnioski] = useState([]);
  useEffect(() => {
    pobierzWnioski().then((l) => setWyslaneWnioski(l.filter((w) => w.osoba?.pesel === profil.pesel)));
  }, [profil.pesel]);

  const czyZrobione = (z) =>
    !!zrobione[z.id] || ((z.id === "zam" || z.powiazane === "zam") && wyslaneWnioski.length > 0);
  const przelacz = (id) =>
    setZrobione((s) => {
      const n = { ...s, [id]: !s[id] };
      try {
        localStorage.setItem(KLUCZ, JSON.stringify(n));
      } catch {
        /* bez zapisu */
      }
      return n;
    });

  const wszystkie = plan.flatMap((k) => k.zadania);
  const gotowe = wszystkie.filter(czyZrobione).length;

  // Kolejny wniosek do złożenia = najbliższy termin wniosku, który nie jest jeszcze zrobiony
  const kolejny = wszystkie
    .filter((z) => z.wniosek && !czyZrobione(z))
    .sort((a, b) => (a.termin < b.termin ? -1 : 1))[0];
  const zostalo = kolejny ? ileDni(dzis, kolejny.termin) : null;

  let ostatniaFaza = null;

  return (
    <div className="mk">
      {/* ===================== HERO ===================== */}
      <section className={`mkhero ${trudna ? "spokojny" : ""}`}>
        <TloHero />
        <div className="wrap mkhero-in">
          <div className="licznik">
            {kolejny ? (
              <>
                <div className="licznik-kolo">
                  <Tarcza zostalo={zostalo} okno={120} />
                  <div className="licznik-srodek">
                    <span className="licznik-liczba">{zostalo}</span>
                    <span className="licznik-dni">dni</span>
                    <span className="licznik-pod">na złożenie wniosku</span>
                  </div>
                </div>
                <Link to={kolejny.link || "/przewodnik/sprawy"} className="licznik-wstega">
                  <span className="licznik-wstega-ikona"><Ikona n="dokument" rozmiar={22} /></span>
                  <span>
                    <small>Kolejny wniosek</small>
                    <b>{kolejny.nazwaWniosku[0].toUpperCase() + kolejny.nazwaWniosku.slice(1)}</b>
                    <em>ostatni dzień: {fmtDzien(kolejny.termin)}</em>
                  </span>
                </Link>
              </>
            ) : (
              <div className="licznik-kolo">
                <div className="licznik-srodek"><Ikona n="check" rozmiar={80} /><span className="licznik-pod">Wszystkie wnioski złożone</span></div>
              </div>
            )}
          </div>

          <div className="mkhero-tekst">
            <button type="button" className="mkhero-etap" onClick={() => ustaw({ onboardingZakonczony: false, etap: null })}>
              {e.nazwa} <span>· zmień</span>
            </button>
            <h1>
              {trudna ? `${e.powitanie}, ${profil.imie}` : wCiazy ? <>Gratulacje,<br />{profil.imie}!</> : <>{e.powitanie}<br />{profil.imie}</>}
            </h1>
            <p className="mkhero-lead">
              {wCiazy && !trudna ? <>Za <b>{doPorodu} dni</b> powitasz swoje maleństwo. </> : null}
              {e.podtytul} Terminów pilnujemy za Ciebie.
            </p>
            <div className="mkhero-cta">
              {kolejny && <Link to={kolejny.link || "/przewodnik/sprawy"} className="h-btn h-btn-limonka">Złóż wniosek</Link>}
              <Link to="/przewodnik/swiadczenia" className="h-btn h-btn-bialy">Co mi przysługuje?</Link>
            </div>
          </div>
        </div>
        <Fale />
      </section>

      {/* ===================== PLAN: OŚ + CHECKLISTA ===================== */}
      <section className="plan-sekcja" aria-labelledby="plan-tytul">
        <div className="wrap">
          <header className="plan-glowa">
            <span className="plan-kicker">Twój plan</span>
            <h2 id="plan-tytul">Co i kiedy musisz zrobić</h2>
            <p>Liczymy wszystko od terminu porodu z karty ciąży — <b>{fmtDzien(karta.terminPorodu)}</b>. Odhaczaj, co już masz za sobą.</p>
            <div className="plan-postep">
              <div className="plan-postep-tor" role="progressbar" aria-valuemin={0} aria-valuemax={wszystkie.length} aria-valuenow={gotowe} aria-label="Postęp listy zadań">
                <div style={{ width: `${(gotowe / wszystkie.length) * 100}%` }} />
              </div>
              <span><b>{gotowe}</b> z {wszystkie.length} zrobione</span>
            </div>
          </header>

          <ol className="plan">
            <li className="plan-dzis">
              <span className="plan-dzis-kropka" />
              <span className="plan-dzis-txt">
                Dziś, {fmtDzien(dzis, { day: "numeric", month: "long" })}{wCiazy && ` · ${tc.tydzien}. tydzień ciąży`}
              </span>
            </li>
            {plan.map((k, i) => {
              const nowaFaza = k.faza !== ostatniaFaza;
              ostatniaFaza = k.faza;
              const zad = k.zadania;
              const ok = zad.length > 0 && zad.every(czyZrobione);
              const pilne = !k.minelo && k.za <= 30;
              const strona = i % 2 === 0 ? "prawo" : "lewo";
              return [
                nowaFaza && i > 0 && (
                  <li key={`f-${k.faza}`} className="plan-faza"><span>{k.faza}</span></li>
                ),
                <li key={k.id} className={`plan-krok ${strona} ${k.waga} ${pilne ? "pilne" : ""} ${ok ? "ok" : ""} ${k.minelo ? "minelo" : ""}`}>
                  <div className="plan-bok" aria-hidden="true">
                    <span className="plan-za">{opisZa(k.za)}</span>
                    <span className="plan-bok-pod">{k.faza === "Po porodzie" ? "jeśli poród będzie w terminie" : k.waga === "porod" ? "termin z karty ciąży" : ""}</span>
                  </div>

                  <div className="plan-wezel">
                    {ok ? <Ikona n="check" rozmiar={30} /> : (
                      <>
                        <b>{new Date(k.data).getDate()}</b>
                        <span>{fmtDzien(k.data, { month: "short" }).replace(".", "")}</span>
                      </>
                    )}
                  </div>

                  <article className="plan-tresc">
                    <span className="plan-znacznik">
                      <Ikona n={ZNACZNIK[k.waga][1]} rozmiar={14} /> {pilne && k.waga !== "krytyczny" ? "Pilne" : ZNACZNIK[k.waga][0]}
                    </span>
                    <p className="plan-data">
                      {fmtDzien(k.data)}{k.doData && ` – ${fmtDzien(k.doData)}`} · <span>{opisZa(k.za)}</span>
                    </p>
                    <h3>{k.tytul}</h3>
                    <p className="plan-opis">{k.opis}</p>
                    {zad.length > 0 && (
                      <ul className="plan-lista">
                        {zad.map((z) => {
                          const done = czyZrobione(z);
                          const auto = done && !zrobione[z.id];
                          return (
                            <li key={z.id} className={done ? "zrobione" : ""}>
                              <label>
                                <input type="checkbox" checked={done} disabled={auto} onChange={() => przelacz(z.id)} />
                                <span className="plan-check" aria-hidden="true"><Ikona n="check" rozmiar={16} /></span>
                                <span className="plan-zad">
                                  {z.t}
                                  {z.info && <small>{z.info}</small>}
                                  {auto && <small className="plan-auto">Wniosek wysłany — widzisz go w „Moich sprawach”.</small>}
                                </span>
                              </label>
                              {z.link && !done && (
                                <Link to={z.link} className="plan-akcja">{z.akcja} <Ikona n="strzalka" rozmiar={16} /></Link>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </article>
                </li>,
              ];
            })}
          </ol>
        </div>
      </section>

      {/* ===================== PASY INFO (zygzak) ===================== */}
      {zus?.ubezpieczenie && (
        <section className="pas pas-prawo">
          <div className="wrap pas-in">
            <div className="pas-tekst">
              <span className="plan-kicker">Twoje ubezpieczenie</span>
              <h2>Masz ubezpieczenie chorobowe — zasiłek Ci przysługuje</h2>
              <p>
                {zus.ubezpieczenie.tytul[0].toUpperCase() + zus.ubezpieczenie.tytul.slice(1)} od {new Date(zus.ubezpieczenie.od).toLocaleDateString("pl-PL")}.
                Zasiłek wypłaci {zus.ubezpieczenie.platnikPowyzej20 ? "Twój pracodawca" : "ZUS"}.
                {zus.eZLA?.length > 0 && ` Masz ${zus.eZLA.length} zwolnienia lekarskie z kodem B — za ten czas dostajesz 100% podstawy.`}
              </p>
              <Link to="/przewodnik/swiadczenia/zasilek-macierzynski" className="pas-link">Zobacz szczegóły zasiłku <Ikona n="strzalka" rozmiar={18} /></Link>
            </div>
            <div className="pas-wizual pas-kwota">
              <small>miesięcznie przy wariancie 81,5%</small>
              <b>{zl(zus.podstawaWymiaru * 0.815)}</b>
              <span>brutto, orientacyjnie · podstawa {zl(zus.podstawaWymiaru)}</span>
            </div>
          </div>
        </section>
      )}

      <section className="pas pas-lewo">
        <div className="wrap pas-in">
          <div className="pas-wizual pas-karta">
            <span className="pas-karta-pas" />
            <small>Karta ciąży</small>
            <b>{fmtDzien(karta.terminPorodu)}</b>
            <span>przewidywany termin porodu · {tc.tydzien}. tydzień</span>
            <div className="pas-karta-tor"><div style={{ width: `${tc.procent}%` }} /></div>
          </div>
          <div className="pas-tekst">
            <span className="plan-kicker">Od Twojego lekarza</span>
            <h2>Dane z karty ciąży wpisujemy za Ciebie</h2>
            <p>Termin porodu i liczbę dzieci bierzemy z karty ciąży — do terminów powyżej i do wniosku. Resztę danych medycznych widzisz tylko Ty.</p>
            <Link to="/przewodnik/karta-ciazy" className="pas-link">Otwórz kartę ciąży <Ikona n="strzalka" rozmiar={18} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
