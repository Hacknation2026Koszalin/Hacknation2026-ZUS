import { useMemo, useState } from "react";
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
  const { zus } = useSesja();
  const [f, setF] = useState(START);
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

  const wczytaj = (z) => ustaw({ ...START, kwotaTyp: "brutto", ...z.stan });
  const zusPodstawa = zus?.podstawaWymiaru;

  return (
    <div className="wrap page kalk">
      <h1>Kalkulator zasiłku macierzyńskiego</h1>
      <p className="lead">
        Sprawdź, jak długo i w jakiej wysokości przysługuje zasiłek – dla
        jednego rodzica lub obojga.
      </p>

      <div className="kalk-zestawy" role="group" aria-label="Gotowe przykłady">
        <span className="muted small">Wczytaj przykład:</span>
        {ZESTAWY.map((z) => (
          <button
            key={z.id}
            type="button"
            className="kalk-chip"
            onClick={() => wczytaj(z)}
          >
            {z.nazwa}
          </button>
        ))}
      </div>

      <div className="kalk-uklad">
        <form className="kalk-formularz" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="karta kalk-sekcja">
            <legend className="karta-h">Dziecko</legend>
            <Radio
              name="sytuacja"
              wart={f.sytuacja}
              onChange={(v) => ustaw({ sytuacja: v })}
              opcje={[
                ["urodzenie", "Urodzenie dziecka"],
                ["przysposobienie", "Przyjęcie dziecka na wychowanie"],
              ]}
            />
            <Pole etykieta="Liczba dzieci">
              <select
                value={f.dzieci}
                onChange={(e) => ustaw({ dzieci: Number(e.target.value) })}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n === 5 ? "5 lub więcej" : n}
                  </option>
                ))}
              </select>
            </Pole>
            {!adop && (
              <>
                <Pole etykieta="Data porodu (opcjonalnie, do wyliczenia terminów)">
                  <input
                    type="date"
                    value={f.dataPorodu}
                    onChange={(e) => ustaw({ dataPorodu: e.target.value })}
                  />
                </Pole>
                <Check
                  wart={f.zaZyciem}
                  onChange={(v) => ustaw({ zaZyciem: v })}
                >
                  Mam zaświadczenie „Za życiem” (dłuższy urlop rodzicielski)
                </Check>
              </>
            )}
            {adop && (
              <>
                <Radio
                  name="typ"
                  wart={f.typAdopcji}
                  onChange={(v) => ustaw({ typAdopcji: v })}
                  opcje={[
                    ["zastepcza", "Rodzina zastępcza niezawodowa"],
                    ["przysposobienie", "Wniosek o przysposobienie"],
                  ]}
                />
                <Pole etykieta="Wiek dziecka (lata)">
                  <input
                    type="number"
                    min="0"
                    max="18"
                    value={f.wiek}
                    onChange={(e) => ustaw({ wiek: e.target.value })}
                  />
                </Pole>
                {f.typAdopcji === "zastepcza" && (
                  <Check
                    wart={f.odroczenie}
                    onChange={(v) => ustaw({ odroczenie: v })}
                  >
                    Odroczony obowiązek szkolny
                  </Check>
                )}
              </>
            )}
          </fieldset>

          <fieldset className="karta kalk-sekcja">
            <legend className="karta-h">Kto korzysta</legend>
            <Radio
              name="tryb"
              wart={f.tryb}
              onChange={(v) => ustaw({ tryb: v })}
              opcje={[
                ["matka", `Tylko ${nazwaM.toLowerCase()}`],
                ["oboje", "Oboje rodzice"],
              ]}
            />
            {oboje && !adop && (
              <Check wart={f.ojcowski} onChange={(v) => ustaw({ ojcowski: v })}>
                Ojciec bierze 14 dni urlopu ojcowskiego
              </Check>
            )}
            {!adop && (
              <div className="kalk-rzad">
                <Pole etykieta="Uzupełniający urlop macierzyński (tygodnie)">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={f.uzupTyg}
                    onChange={(e) => ustaw({ uzupTyg: e.target.value })}
                  />
                </Pole>
                {oboje && Number(f.uzupTyg) > 0 && (
                  <Pole etykieta="Kto go weźmie">
                    <select
                      value={f.uzupKto}
                      onChange={(e) => ustaw({ uzupKto: e.target.value })}
                    >
                      <option value="M">{nazwaM}</option>
                      <option value="O">{nazwaO}</option>
                    </select>
                  </Pole>
                )}
              </div>
            )}
          </fieldset>

          <fieldset className="karta kalk-sekcja">
            <legend className="karta-h">Podstawa wymiaru zasiłku</legend>
            <Radio
              name="kwota"
              wart={f.kwotaTyp}
              onChange={(v) => ustaw({ kwotaTyp: v })}
              opcje={[
                ["brutto", "Znam średnie wynagrodzenie brutto"],
                ["podstawa", "Znam podstawę wymiaru"],
              ]}
            />
            <div className="kalk-rzad">
              <Pole
                etykieta={`${nazwaM}: ${f.kwotaTyp === "brutto" ? "brutto z 12 miesięcy (zł)" : "podstawa (zł)"}`}
              >
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  value={f.kwotaTyp === "brutto" ? f.brutto : f.podstawaM}
                  onChange={(e) =>
                    ustaw(
                      f.kwotaTyp === "brutto"
                        ? { brutto: e.target.value }
                        : { podstawaM: e.target.value },
                    )
                  }
                />
              </Pole>
              {oboje && (
                <Pole
                  etykieta={`${nazwaO}: ${f.kwotaTyp === "brutto" ? "brutto (zł)" : "podstawa (zł)"}`}
                >
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={f.kwotaTyp === "brutto" ? f.bruttoO : f.podstawaO}
                    onChange={(e) =>
                      ustaw(
                        f.kwotaTyp === "brutto"
                          ? { bruttoO: e.target.value }
                          : { podstawaO: e.target.value },
                      )
                    }
                  />
                </Pole>
              )}
            </div>
            {f.kwotaTyp === "brutto" && (
              <p className="muted small">
                Podstawa = średnia z 12 miesięcy pomniejszona o składki
                pracownika (13,71%).
              </p>
            )}
            {zusPodstawa > 0 && (
              <button
                type="button"
                className="link"
                onClick={() =>
                  ustaw({ kwotaTyp: "podstawa", podstawaM: zusPodstawa })
                }
              >
                Użyj podstawy z ZUS ({zl(zusPodstawa)})
              </button>
            )}
          </fieldset>

          {oboje && (
            <fieldset className="karta kalk-sekcja">
              <legend className="karta-h">Podział urlopów</legend>
              <Suwak
                etykieta={`Urlop macierzyński ${nazwaM.toLowerCase()}`}
                min={macMin}
                max={maxMac}
                wart={Math.min(Math.max(f.macMatka, macMin), maxMac)}
                onChange={(v) => ustaw({ macMatka: v })}
                opis={`${nazwaM}: ${Math.min(Math.max(f.macMatka, macMin), maxMac)} tyg. · ${nazwaO}: ${maxMac - Math.min(Math.max(f.macMatka, macMin), maxMac)} tyg.`}
              />
              {pula > 0 && (
                <Suwak
                  etykieta="Urlop rodzicielski"
                  min={NIEPRZENOSZALNE_ROD_TYG}
                  max={pula - NIEPRZENOSZALNE_ROD_TYG}
                  wart={Math.min(
                    Math.max(f.rodMatka, NIEPRZENOSZALNE_ROD_TYG),
                    pula - NIEPRZENOSZALNE_ROD_TYG,
                  )}
                  onChange={(v) => ustaw({ rodMatka: v })}
                  opis={`${nazwaM}: ${Math.min(Math.max(f.rodMatka, NIEPRZENOSZALNE_ROD_TYG), pula - NIEPRZENOSZALNE_ROD_TYG)} tyg. · ${nazwaO}: ${pula - Math.min(Math.max(f.rodMatka, NIEPRZENOSZALNE_ROD_TYG), pula - NIEPRZENOSZALNE_ROD_TYG)} tyg. (każde z rodziców ma min. ${NIEPRZENOSZALNE_ROD_TYG})`}
                />
              )}
            </fieldset>
          )}

          <fieldset className="karta kalk-sekcja">
            <legend className="karta-h">
              Praca w czasie urlopu rodzicielskiego
            </legend>
            <p className="muted small">
              Można pracować do połowy etatu – urlop wydłuża się, a zasiłek jest
              wypłacany proporcjonalnie.
            </p>
            <Suwak
              etykieta={`${nazwaM}: wymiar pracy`}
              min={0}
              max={50}
              krok={5}
              wart={f.pracaM}
              onChange={(v) => ustaw({ pracaM: v })}
              opis={`${f.pracaM}% etatu`}
            />
            {oboje && (
              <Suwak
                etykieta={`${nazwaO}: wymiar pracy`}
                min={0}
                max={50}
                krok={5}
                wart={f.pracaO}
                onChange={(v) => ustaw({ pracaO: v })}
                opis={`${f.pracaO}% etatu`}
              />
            )}
            {!oboje && !adop && (
              <Check wart={f.w815} onChange={(v) => ustaw({ w815: v })}>
                Złożę wniosek o zasiłek 81,5% (w ciągu 21 dni po porodzie, cały
                urlop bez pracy)
              </Check>
            )}
          </fieldset>
        </form>

        <section className="kalk-wynik" aria-live="polite" aria-label="Wynik">
          <div className="karta kalk-sticky">
            {wynik.blad ? (
              <p className="status czerwony">{wynik.blad}</p>
            ) : wynik.brakPodstawy ? (
              <p className="muted">
                Wpisz wynagrodzenie lub podstawę wymiaru, aby zobaczyć wynik.
              </p>
            ) : (
              <>
                <p className="karta-h">Łącznie zasiłek</p>
                <p className="kalk-duza">{zl(wynik.razem)}</p>
                {wynik.podzial.length > 1 && (
                  <p className="muted small">
                    {wynik.podzial
                      .map((p) => `${p.kto}: ${zl(p.razem)}`)
                      .join(" · ")}
                  </p>
                )}
                {wynik.uzywa815 && (
                  <p className="status zielony">Zastosowano stawkę 81,5%</p>
                )}

                <div className="kalk-tabela-wrap">
                  <table className="kalk-tabela">
                    <thead>
                      <tr>
                        <th>Urlop</th>
                        <th>Czas</th>
                        <th>Stawka</th>
                        <th>Miesięcznie</th>
                        <th>Razem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wynik.linie.map((l, i) => (
                        <tr key={i}>
                          <td>
                            <b>{l.nazwa}</b>
                            <br />
                            <span className="muted small">{l.kto}</span>
                          </td>
                          <td>
                            {l.dni <= 14
                              ? `${l.dni} dni`
                              : `${l.tygodnie.toLocaleString("pl-PL")} tyg.`}
                          </td>
                          <td>
                            {proc(l.procent)}
                            {l.praca ? (
                              <>
                                <br />
                                <span className="muted small">
                                  × {proc(1 - l.praca)} etatu
                                </span>
                              </>
                            ) : null}
                          </td>
                          <td>
                            {zl(l.miesiecznie)}
                            {l.zPracy ? (
                              <>
                                <br />
                                <span className="muted small">
                                  + ok. {zl(l.zPracy)} z pracy
                                </span>
                              </>
                            ) : null}
                          </td>
                          <td>
                            <b>{zl(l.razem)}</b>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {wynik.ostrzezenia.map((o) => (
                  <p key={o} className="status zolty">
                    ⚠ {o}
                  </p>
                ))}
                {wynik.terminy.length > 0 && (
                  <ul className="terminy">
                    {wynik.terminy.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                )}
                <p className="muted small">
                  To symulacja orientacyjna. Zasiłek za pełny miesiąc liczony
                  jest z 30 dni; ostateczną kwotę ustala ZUS lub płatnik
                  składek.
                </p>
              </>
            )}
          </div>
        </section>
      </div>
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
            checked={wart === v}
            onChange={() => onChange(v)}
          />
          <span>{n}</span>
        </label>
      ))}
    </div>
  );
}

function Suwak({ etykieta, min, max, krok = 1, wart, onChange, opis }) {
  return (
    <label className="kalk-pole">
      <span>{etykieta}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={krok}
        value={wart}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="muted small">{opis}</span>
    </label>
  );
}
