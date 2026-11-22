import { useEffect, useMemo, useRef, useState } from "react";
import { useSesja } from "../SesjaContext.jsx";
import {
  oblicz,
  podstawaZBrutto,
  maxMacierzynski,
  pulaRodzicielski,
  MIN_MATKA_MAC_TYG,
  NIEPRZENOSZALNE_ROD_TYG,
} from "../kalkulatorZasilku.js";
import "../kalkulator.css";

// Gotowe „zestawy” do szybkiej symulacji – podmień na zestawy z materiałów projektu.
const ZESTAWY = [
  {
    id: "z1",
    nazwa: "Matka, 1 dziecko, 8 000 zł brutto",
    stan: { tryb: "matka", dzieci: 1, brutto: 8000 },
  },
  {
    id: "z2",
    nazwa: "Oboje rodzice, 1 dziecko, podział po równo",
    stan: {
      tryb: "oboje",
      dzieci: 1,
      brutto: 7000,
      bruttoO: 7000,
      macMatka: 20,
      rodMatka: 22,
      ojcowski: true,
    },
  },
  {
    id: "z3",
    nazwa: "Bliźnięta, oboje, ojciec z urlopem ojcowskim",
    stan: {
      tryb: "oboje",
      dzieci: 2,
      brutto: 6500,
      bruttoO: 9000,
      macMatka: 25,
      rodMatka: 20,
      ojcowski: true,
    },
  },
  {
    id: "z4",
    nazwa: "Matka łączy pracę (50% etatu) z urlopem rodzicielskim",
    stan: { tryb: "matka", dzieci: 1, brutto: 7500, pracaM: 50 },
  },
  {
    id: "z5",
    nazwa: "Dziecko z zaświadczeniem „Za życiem”",
    stan: {
      tryb: "oboje",
      dzieci: 1,
      zaZyciem: true,
      brutto: 7000,
      bruttoO: 7000,
      macMatka: 20,
      rodMatka: 40,
      ojcowski: true,
    },
  },
  {
    id: "z6",
    nazwa: "Rodzina zastępcza niezawodowa, dziecko 3 lata",
    stan: {
      sytuacja: "przysposobienie",
      typAdopcji: "zastepcza",
      wiek: 3,
      tryb: "matka",
      brutto: 6000,
    },
  },
];

const START = {
  sytuacja: "urodzenie",
  typAdopcji: "zastepcza",
  wiek: 2,
  odroczenie: false,
  dzieci: 1,
  zaZyciem: false,
  dataPorodu: "",
  tryb: "matka",
  kwotaTyp: "brutto",
  brutto: "",
  bruttoO: "",
  podstawaM: "",
  podstawaO: "",
  macMatka: 20,
  rodMatka: 20,
  ojcowski: true,
  uzupTyg: 0,
  uzupKto: "M",
  pracaM: 0,
  pracaO: 0,
  w815: false,
};

const zl = (v) =>
  (v ?? 0).toLocaleString("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " zł";
const proc = (p) =>
  (p * 100).toLocaleString("pl-PL", { maximumFractionDigits: 1 }) + "%";

export default function Kalkulator() {
  const { zus, terminPorodu, dataPorodu, ankieta } = useSesja();
  // Jeśli osoba podała wcześniej datę albo rolę — wpisujemy je z góry
  const [f, setF] = useState(() => ({
    ...START,
    // Od razu liczymy z podstawy z ZUS — wynik widać bez wpisywania czegokolwiek
    ...(zus?.podstawaWymiaru ? { kwotaTyp: "podstawa", podstawaM: zus.podstawaWymiaru } : {}),
    dataPorodu: terminPorodu || dataPorodu || "",
    tryb: ankieta?.rola === "tata" ? "oboje" : START.tryb,
  }));
  const ustaw = (patch) => setF((s) => ({ ...s, ...patch }));
  const adop = f.sytuacja === "przysposobienie";
  const oboje = f.tryb === "oboje";
  const nazwaM = adop ? "Rodzic 1" : "Matka";
  const nazwaO = adop ? "Rodzic 2" : "Ojciec";

  const maxMac = maxMacierzynski(f.dzieci);
  const macMin = adop ? 0 : MIN_MATKA_MAC_TYG;
  const pula = pulaRodzicielski(f.dzieci, !adop && f.zaZyciem);

  // podstawa wymiaru: wpisana wprost albo policzona z brutto
  const podstawaM =
    f.kwotaTyp === "brutto"
      ? podstawaZBrutto(f.brutto)
      : Number(f.podstawaM) || 0;
  const podstawaO =
    f.kwotaTyp === "brutto"
      ? podstawaZBrutto(f.bruttoO || f.brutto)
      : Number(f.podstawaO || f.podstawaM) || 0;

  const wynik = useMemo(
    () => oblicz({ ...f, podstawaM, podstawaO }),
    [f, podstawaM, podstawaO],
  );

  const [zestaw, setZestaw] = useState(null);
  const wczytaj = (z) => { setZestaw(z.id); ustaw({ ...START, kwotaTyp: "brutto", ...z.stan }); };
  const zusPodstawa = zus?.podstawaWymiaru;

  // Pasek z wynikiem na dole ekranu — znika, gdy widać już pełny wynik
  const wynikRef = useRef(null);
  const [wynikWidac, setWynikWidac] = useState(false);
  useEffect(() => {
    const el = wynikRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setWynikWidac(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const doWyniku = () => wynikRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const macM = Math.min(Math.max(f.macMatka, macMin), maxMac);
  const rodM = Math.min(Math.max(f.rodMatka, NIEPRZENOSZALNE_ROD_TYG), Math.max(NIEPRZENOSZALNE_ROD_TYG, pula - NIEPRZENOSZALNE_ROD_TYG));
  return (
    <div className="wrap page kalk kk">
      <div className="kk-glowa">
        <h1>Kalkulator zasiłku macierzyńskiego</h1>
        <p className="lead">Ustaw kilka rzeczy krok po kroku. Wynik zobaczysz na dole — zmienia się od razu.</p>
        <label className="kk-przyklad">
          <span>Albo wczytaj przykład:</span>
          <select value={zestaw || ""} onChange={(e) => { const z = ZESTAWY.find((x) => x.id === e.target.value); if (z) wczytaj(z); }}>
            <option value="">— wybierz przykład —</option>
            {ZESTAWY.map((z) => <option key={z.id} value={z.id}>{z.nazwa}</option>)}
          </select>
        </label>
      </div>

      <form className="kk-karta" onSubmit={(e) => e.preventDefault()} aria-label="Ustawienia kalkulatora">
        <Krok nr={1} tytul="Dziecko" opis="Urodzenie czy przyjęcie na wychowanie i ile dzieci.">
          <Radio name="sytuacja" wart={f.sytuacja} onChange={(v) => ustaw({ sytuacja: v })}
            opcje={[["urodzenie", "Urodzenie dziecka"], ["przysposobienie", "Przyjęcie na wychowanie"]]} />
          <div className="kk-siatka">
            <Pole etykieta="Liczba dzieci">
              <Licznik wart={f.dzieci} min={1} max={5} onChange={(v) => ustaw({ dzieci: v })} format={(n) => (n === 5 ? "5+" : n)} />
            </Pole>
            {!adop && (
              <Pole etykieta="Data porodu (do terminów)">
                <input type="date" value={f.dataPorodu} onChange={(e) => ustaw({ dataPorodu: e.target.value })} />
              </Pole>
            )}
            {adop && (
              <Pole etykieta="Wiek dziecka (lata)">
                <Licznik wart={Number(f.wiek) || 0} min={0} max={18} onChange={(v) => ustaw({ wiek: v })} />
              </Pole>
            )}
          </div>
          {!adop && <Check wart={f.zaZyciem} onChange={(v) => ustaw({ zaZyciem: v })}>Mam zaświadczenie „Za życiem” (dłuższy urlop rodzicielski)</Check>}
          {adop && (
            <>
              <Radio name="typ" wart={f.typAdopcji} onChange={(v) => ustaw({ typAdopcji: v })}
                opcje={[["zastepcza", "Rodzina zastępcza niezawodowa"], ["przysposobienie", "Wniosek o przysposobienie"]]} />
              {f.typAdopcji === "zastepcza" && <Check wart={f.odroczenie} onChange={(v) => ustaw({ odroczenie: v })}>Odroczony obowiązek szkolny</Check>}
            </>
          )}
        </Krok>

        <Krok nr={2} tytul="Kto bierze urlop" opis="Jeden rodzic czy oboje — urlop można podzielić.">
          <Radio name="tryb" wart={f.tryb} onChange={(v) => ustaw({ tryb: v })}
            opcje={[["matka", `Tylko ${nazwaM.toLowerCase()}`], ["oboje", "Oboje rodzice"]]} />
          {oboje && !adop && <Check wart={f.ojcowski} onChange={(v) => ustaw({ ojcowski: v })}>{nazwaO} bierze też 2 tygodnie urlopu ojcowskiego</Check>}
          {!oboje && !adop && (
            <div className="kk-wariant">
              <span className="kk-wariant-pyt">Jak chcesz dostawać zasiłek?</span>
              <Radio name="wariant" wart={f.w815 ? "815" : "100"} onChange={(v) => ustaw({ w815: v === "815" })}
                opcje={[["100", "100% za macierzyński, potem 70%"], ["815", "81,5% przez cały rok"]]} />
              <span className="kk-pomoc">81,5% wybierasz tylko we wniosku złożonym w ciągu 21 dni po porodzie. Później zostaje wariant 100% + 70%.</span>
            </div>
          )}
        </Krok>

        <Krok nr={3} tytul="Ile zarabiasz" opis={zusPodstawa > 0 ? "Wpisaliśmy podstawę z danych ZUS — możesz ją zmienić." : "Średnie wynagrodzenie brutto z 12 miesięcy albo podstawa wymiaru."}>
          <Radio name="kwota" wart={f.kwotaTyp} onChange={(v) => ustaw({ kwotaTyp: v })}
            opcje={[["podstawa", "Podstawa wymiaru"], ["brutto", "Wynagrodzenie brutto"]]} />
          <div className="kk-siatka">
            <Pole etykieta={`${nazwaM} — ${f.kwotaTyp === "brutto" ? "brutto miesięcznie" : "podstawa"}`}>
              <span className="kk-zl">
                <input type="number" min="0" step="0.01" inputMode="decimal"
                  value={f.kwotaTyp === "brutto" ? f.brutto : f.podstawaM}
                  onChange={(e) => ustaw(f.kwotaTyp === "brutto" ? { brutto: e.target.value } : { podstawaM: e.target.value })} />
                <span aria-hidden="true">zł</span>
              </span>
            </Pole>
            {oboje && (
              <Pole etykieta={`${nazwaO} — ${f.kwotaTyp === "brutto" ? "brutto miesięcznie" : "podstawa"}`}>
                <span className="kk-zl">
                  <input type="number" min="0" step="0.01" inputMode="decimal"
                    value={f.kwotaTyp === "brutto" ? f.bruttoO : f.podstawaO}
                    onChange={(e) => ustaw(f.kwotaTyp === "brutto" ? { bruttoO: e.target.value } : { podstawaO: e.target.value })} />
                  <span aria-hidden="true">zł</span>
                </span>
              </Pole>
            )}
          </div>
          {f.kwotaTyp === "brutto" && <p className="kk-pomoc">Podstawa = średnia z 12 miesięcy minus składki pracownika (13,71%).</p>}
          {zusPodstawa > 0 && Number(f.podstawaM) !== zusPodstawa && (
            <button type="button" className="kk-link" onClick={() => ustaw({ kwotaTyp: "podstawa", podstawaM: zusPodstawa })}>Wróć do podstawy z ZUS ({zl(zusPodstawa)})</button>
          )}
        </Krok>

        {oboje && (
          <Krok nr={4} tytul="Podział urlopu" opis="Przesuwaj albo klikaj − / +. Każdy rodzic ma swoją nieprzenoszalną część.">
            <Podzial etykieta="Urlop macierzyński" nazwaM={nazwaM} nazwaO={nazwaO} min={macMin} max={maxMac} wart={macM} onChange={(v) => ustaw({ macMatka: v })} razem={maxMac} />
            {pula > 0 && (
              <Podzial etykieta="Urlop rodzicielski" nazwaM={nazwaM} nazwaO={nazwaO} min={NIEPRZENOSZALNE_ROD_TYG} max={pula - NIEPRZENOSZALNE_ROD_TYG} wart={rodM} onChange={(v) => ustaw({ rodMatka: v })} razem={pula}
                uwaga={`Każde z rodziców ma co najmniej ${NIEPRZENOSZALNE_ROD_TYG} tygodni tylko dla siebie.`} />
            )}
          </Krok>
        )}

        <Krok nr={oboje ? 5 : 4} tytul="Praca i dodatkowy urlop" opcjonalny opis="Pomiń, jeśli nie planujesz pracy w czasie urlopu.">
          <Suwak etykieta={`${nazwaM}: praca w czasie urlopu rodzicielskiego`} min={0} max={50} krok={5} wart={f.pracaM} onChange={(v) => ustaw({ pracaM: v })} opis="% etatu — do połowy etatu urlop się wydłuża, zasiłek jest proporcjonalny" jednostka="%" />
          {oboje && <Suwak etykieta={`${nazwaO}: praca w czasie urlopu rodzicielskiego`} min={0} max={50} krok={5} wart={f.pracaO} onChange={(v) => ustaw({ pracaO: v })} opis="% etatu" jednostka="%" />}
          {!adop && (
            <div className="kk-siatka">
              <Pole etykieta="Uzupełniający urlop macierzyński (wcześniak / szpital), tygodnie">
                <Licznik wart={Number(f.uzupTyg) || 0} min={0} max={15} onChange={(v) => ustaw({ uzupTyg: v })} />
              </Pole>
              {oboje && Number(f.uzupTyg) > 0 && (
                <Pole etykieta="Kto go weźmie">
                  <select value={f.uzupKto} onChange={(e) => ustaw({ uzupKto: e.target.value })}>
                    <option value="M">{nazwaM}</option>
                    <option value="O">{nazwaO}</option>
                  </select>
                </Pole>
              )}
            </div>
          )}
        </Krok>
      </form>

      {/* ===================== WYNIK (na dole) ===================== */}
      <section className="kk-wynik" ref={wynikRef} aria-labelledby="kk-wynik-tytul">
        <h2 id="kk-wynik-tytul" className="kk-wynik-tytul"><span className="kk-nr kk-nr-wynik" aria-hidden="true">=</span> Twój wynik</h2>
        <div className="kk-wynik-karta" aria-live="polite">
          {wynik.blad ? (
            <p className="status czerwony">{wynik.blad}</p>
          ) : wynik.brakPodstawy ? (
            <p className="kk-pusty">Wpisz wynagrodzenie albo podstawę w kroku 3, a zobaczysz wynik.</p>
          ) : (
            <>
              <div className="kk-suma">
                <div>
                  <small>Łącznie dostaniesz około</small>
                  <p className="kk-duza">{zl(wynik.razem)}</p>
                  {wynik.uzywa815 && <span className="kk-znak">✓ stawka 81,5% przez cały okres</span>}
                </div>
                {wynik.podzial.length > 1 && (
                  <ul className="kk-osoby">
                    {wynik.podzial.map((p) => <li key={p.kto}><small>{p.kto}</small><b>{zl(p.razem)}</b></li>)}
                  </ul>
                )}
              </div>

              <div className="kalk-tabela-wrap">
                <table className="kalk-tabela kk-tabela">
                  <caption className="sr-only">Zasiłek w podziale na urlopy</caption>
                  <thead><tr><th scope="col">Urlop</th><th scope="col">Jak długo</th><th scope="col">Stawka</th><th scope="col">Miesięcznie</th><th scope="col">Razem</th></tr></thead>
                  <tbody>
                    {wynik.linie.map((l, i) => (
                      <tr key={i}>
                        <td><b>{l.nazwa}</b><br /><span className="muted small">{l.kto}</span></td>
                        <td>{l.dni <= 14 ? `${l.dni} dni` : `${l.tygodnie.toLocaleString("pl-PL")} tyg.`}</td>
                        <td>{proc(l.procent)}{l.praca ? <><br /><span className="muted small">× {proc(1 - l.praca)} etatu</span></> : null}</td>
                        <td>{zl(l.miesiecznie)}{l.zPracy ? <><br /><span className="muted small">+ ok. {zl(l.zPracy)} z pracy</span></> : null}</td>
                        <td><b>{zl(l.razem)}</b></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {wynik.ostrzezenia.map((o) => <p key={o} className="status zolty">⚠ {o}</p>)}
              {wynik.terminy.length > 0 && (
                <div className="kk-terminy"><b>Terminy</b><ul className="terminy">{wynik.terminy.map((t) => <li key={t}>{t}</li>)}</ul></div>
              )}
              <p className="muted small">To symulacja orientacyjna. Zasiłek za pełny miesiąc liczony jest z 30 dni; ostateczną kwotę ustala ZUS lub płatnik składek.</p>
            </>
          )}
        </div>
      </section>

      {!wynikWidac && !wynik.blad && !wynik.brakPodstawy && (
        <button type="button" className="kk-pasek" onClick={doWyniku}>
          <span>Łącznie ok. <b>{zl(wynik.razem)}</b></span>
          <span className="kk-pasek-cta">Zobacz wynik ↓</span>
        </button>
      )}
    </div>
  );
}

// Jeden krok kalkulatora (numer, tytuł, opis i pola)
function Krok({ nr, tytul, opis, children, opcjonalny }) {
  return (
    <fieldset className="kk-krok">
      <legend className="kk-krok-glowa">
        <span className="kk-nr" aria-hidden="true">{nr}</span>
        <span><b>{tytul}</b>{opcjonalny && <em> (opcjonalnie)</em>}{opis && <small>{opis}</small>}</span>
      </legend>
      <div className="kk-krok-tresc">{children}</div>
    </fieldset>
  );
}

// Liczba z przyciskami − / +
function Licznik({ wart, min, max, onChange, format = (n) => n }) {
  const v = Math.min(Math.max(Number(wart) || 0, min), max);
  return (
    <span className="kk-licznik">
      <button type="button" aria-label="Mniej" onClick={() => onChange(Math.max(min, v - 1))} disabled={v <= min}>−</button>
      <output aria-live="polite">{format(v)}</output>
      <button type="button" aria-label="Więcej" onClick={() => onChange(Math.min(max, v + 1))} disabled={v >= max}>+</button>
    </span>
  );
}

// Podział tygodni między rodziców — pasek pokazuje, ile ma każde z nich
function Podzial({ etykieta, nazwaM, nazwaO, min, max, wart, onChange, razem, uwaga }) {
  const v = Math.min(Math.max(wart, min), max);
  const procM = (v / razem) * 100;
  return (
    <div className="kk-podzial">
      <div className="kk-podzial-glowa"><b>{etykieta}</b><span className="muted small">razem {razem} tyg.</span></div>
      <div className="kk-podzial-pasek" aria-hidden="true">
        <span className="m" style={{ width: `${procM}%` }}>{procM >= 14 && `${nazwaM}: ${v} tyg.`}</span>
        <span className="o" style={{ width: `${100 - procM}%` }}>{100 - procM >= 14 && `${nazwaO}: ${razem - v} tyg.`}</span>
      </div>
      <div className="kalk-suwak-rzad">
        <button type="button" aria-label={`Mniej tygodni dla: ${nazwaM}`} onClick={() => onChange(Math.max(min, v - 1))} disabled={v <= min}>−</button>
        <input type="range" min={min} max={max} value={v} aria-label={`${etykieta}: tygodnie dla ${nazwaM}`} aria-valuetext={`${nazwaM} ${v} tygodni, ${nazwaO} ${razem - v} tygodni`} onChange={(e) => onChange(Number(e.target.value))} />
        <button type="button" aria-label={`Więcej tygodni dla: ${nazwaM}`} onClick={() => onChange(Math.min(max, v + 1))} disabled={v >= max}>+</button>
      </div>
      {uwaga && <span className="muted small">{uwaga}</span>}
    </div>
  );
}

function Pole({ etykieta, children }) {
  return (
    <label className="kalk-pole">
      <span>{etykieta}</span>
      {children}
    </label>
  );
}

function Check({ wart, onChange, children }) {
  return (
    <label className="kalk-check">
      <input
        type="checkbox"
        checked={wart}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{children}</span>
    </label>
  );
}

function Radio({ name, wart, onChange, opcje }) {
  return (
    <div className="kalk-radio" role="radiogroup">
      {opcje.map(([v, n]) => (
        <label key={v} className={wart === v ? "aktywny" : ""}>
          <input
            type="radio"
            name={name}
            className="sr-only"
            checked={wart === v}
            onChange={() => onChange(v)}
          />
          {wart === v && <span aria-hidden="true">✓ </span>}
          <span>{n}</span>
        </label>
      ))}
    </div>
  );
}

// Suwak z przyciskami − / + (łatwiej trafić niż w sam suwak, zwłaszcza na telefonie)
function Suwak({ etykieta, min, max, krok = 1, wart, onChange, opis, jednostka = "" }) {
  const v = Math.min(Math.max(Number(wart) || 0, min), max);
  return (
    <div className="kalk-pole kalk-suwak">
      <span>{etykieta}</span>
      <div className="kalk-suwak-rzad">
        <button type="button" aria-label="Mniej" onClick={() => onChange(Math.max(min, v - krok))} disabled={v <= min}>−</button>
        <input type="range" min={min} max={max} step={krok} value={v} aria-label={etykieta} onChange={(e) => onChange(Number(e.target.value))} />
        <button type="button" aria-label="Więcej" onClick={() => onChange(Math.min(max, v + krok))} disabled={v >= max}>+</button>
        <b className="kalk-suwak-wart">{v}{jednostka}</b>
      </div>
      <span className="muted small">{opis}</span>
    </div>
  );
}
