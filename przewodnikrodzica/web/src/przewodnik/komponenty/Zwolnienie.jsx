// STATUS ZWOLNIENIA LEKARSKIEGO — na podstawie e-ZLA, które ZUS już ma (nic nie wpisujesz).
import { dzisISO, fmtDzien, ileDni } from "../terminy.js";
import { maZadluzenie } from "./Zadluzenie.jsx";
import Ikona from "../wniosek/Ikona.jsx";
import { useJezyk } from "../jezyk.js";
import { maChorobowe, pracaZZus } from "../sytuacja.js";

const KODY = { B: "ciąża — zasiłek 100% podstawy", A: "przerwa w niezdolności do 60 dni", C: "nadużycie alkoholu", D: "gruźlica", E: "choroba zakaźna" };

const przesun = (iso, dni) => { const d = new Date(iso + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + dni); return d.toISOString().slice(0, 10); };

/** Forma pracy: najpierw to, co rodzic wybrał w ankiecie, potem dane z ZUS. */
function formaPracy(ankieta = {}, zus) {
  return ankieta.praca || pracaZZus(zus) || "umowa";
}

/** Kto wypłaca zasiłek chorobowy — zgodnie z wyborem „Jak teraz pracujesz?”. */
function ktoWyplaca(zus, ankieta) {
  const praca = formaPracy(ankieta, zus);
  const u = zus?.ubezpieczenie || {};
  if (praca === "umowa") {
    const nazwa = /umowa o pracę/.test(u.tytul || "") && u.platnik ? ` (${u.platnik})` : "";
    if (u.platnikPowyzej20 === false) return "Pierwsze 33 dni w roku — pracodawca, potem ZUS";
    return `Twój pracodawca${nazwa}`;
  }
  return "ZUS — na konto podane w eZUS";
}

/**
 * Zwolnienia z e-ZLA dopasowane do odpowiedzi z początku (rola, etap, praca, chorobowe)
 * i do daty porodu. Daty liczymy względem dzisiaj, żeby prototyp zawsze pokazywał sensowny stan:
 * obecne zwolnienie trwa 28 dni (dziś = 14. dzień) i kończy się najpóźniej dzień przed terminem porodu.
 */
export function zwolnieniaDlaSytuacji(zus, opcje = {}) {
  const { etap, ankieta = {}, data, dzis = dzisISO() } = opcje;
  if (!pokazZwolnienie({ etap, ankieta, data, dzis })) return [];
  if (etap === "planuje") return []; // nie ma ciąży — nie ma zwolnienia z kodem B
  if (maChorobowe(ankieta, zus) === false) return []; // bez ubezpieczenia chorobowego e-ZLA nie daje zasiłku
  const od = przesun(dzis, -13);
  let doDnia = przesun(od, 27);
  if (data && doDnia >= data) doDnia = przesun(data, -1); // poród kończy zwolnienie — zaczyna się urlop macierzyński
  const lista = [{ od, do: doDnia, kod: "B" }];
  // Przy dobrowolnym chorobowym zasiłek w ciąży jest dopiero po 90 dniach — wtedy pokazujemy tylko jedno wcześniejsze zwolnienie
  const poprzednie = formaPracy(ankieta, zus) === "umowa" ? 2 : 1;
  for (let i = 1; i <= poprzednie; i++) lista.push({ od: przesun(od, -28 * i), do: przesun(od, -28 * (i - 1) - 1), kod: "B" });
  return lista;
}

export const aktualneZwolnienie = (zus, opcje) => {
  const dzis = opcje?.dzis || dzisISO();
  const lista = opcje ? zwolnieniaDlaSytuacji(zus, opcje) : zus?.eZLA || [];
  return lista.find((z) => z.od <= dzis && z.do >= dzis);
};

// Kiedy pokazujemy status L4 — spójnie z etapem i wyborami z ankiety:
// tylko mama, przed porodem (planuję / w ciąży). Po porodzie zwolnienie zastępuje zasiłek macierzyński,
// tata/opiekun nie dostaje L4 z kodem B, przy adopcji i stracie nie dotyczy.
export function pokazZwolnienie({ etap, ankieta = {}, data, dzis = dzisISO() }) {
  if (ankieta.rola && ankieta.rola !== "mama") return false;
  if (!["ciaza", "planuje"].includes(etap)) return false;
  if (etap === "ciaza" && data && data <= dzis) return false; // termin porodu minął — pewnie już po porodzie
  return true;
}

// Termin do dzwonka / hero: koniec zwolnienia
export function terminZwolnienia(zus, opcje) {
  const z = aktualneZwolnienie(zus, opcje);
  if (!z) return null;
  return { id: "l4-koniec", t: "Koniec zwolnienia lekarskiego — potrzebujesz dłużej? Umów wizytę u lekarza", termin: z.do, link: "/przewodnik/pulpit#zl-tytul" };
}

export default function StatusZwolnienia({ zus, etap, data, ankieta = {} }) {
  const [, t] = useJezyk();
  const dzis = dzisISO();
  const lista = zwolnieniaDlaSytuacji(zus, { etap, ankieta, data, dzis }).sort((a, b) => (a.od < b.od ? 1 : -1));
  const bezChorobowego = maChorobowe(ankieta, zus) === false;
  const trwa = lista.find((z) => z.od <= dzis && z.do >= dzis);
  const startMacierzynskiego = etap === "ciaza" && data ? (() => { const d = new Date(data + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() - 42); return d.toISOString().slice(0, 10); })() : null;
  const historia = lista.filter((z) => z !== trwa);
  const alarm = maZadluzenie(zus);

  return (
    <section className={`zl-sekcja ${alarm ? "alarm" : ""}`} aria-labelledby="zl-tytul">
      <div className="wrap">
        <div className="sh-glowa">
          <span className="plan-kicker">Dane z e-ZLA</span>
          <h2 id="zl-tytul">{t("Status zwolnienia lekarskiego")}</h2>
        </div>

        {trwa ? (() => {
          const wszystkie = ileDni(trwa.od, trwa.do) + 1;
          const minelo = ileDni(trwa.od, dzis) + 1;
          const zostalo = ileDni(dzis, trwa.do);
          return (
            <div className="zl-karta">
              <div className="zl-gora">
                <span className="zl-ikona"><Ikona n={alarm ? "alert" : "dokument"} rozmiar={26} /></span>
                <div className="zl-tytul">
                  <span className={`zl-znaczek ${alarm ? "blad" : "ok"}`}>{alarm ? "Zasiłek wstrzymany" : "Trwa"}</span>
                  <b>Zwolnienie od {fmtDzien(trwa.od)} do {fmtDzien(trwa.do)}</b>
                  <small>Kod {trwa.kod}: {KODY[trwa.kod] || "—"}</small>
                </div>
                <div className="zl-licznik">
                  <span>{zostalo}</span>
                  <small>{zostalo === 1 ? "dzień" : "dni"} do końca</small>
                </div>
              </div>
              <div className="zl-tor" role="progressbar" aria-valuemin={0} aria-valuemax={wszystkie} aria-valuenow={minelo} aria-label={`Dzień ${minelo} z ${wszystkie}`}>
                <div style={{ width: `${(minelo / wszystkie) * 100}%` }} />
              </div>
              <p className="zl-dzien">{`Dzień ${minelo} z ${wszystkie}`}</p>

              <dl className="zl-info">
                <div>
                  <dt>{alarm ? "Wypłata" : "Kto wypłaca"}</dt>
                  <dd className={alarm ? "blad" : ""}>{alarm ? "Wstrzymana — spłać zaległość w składkach" : ktoWyplaca(zus, ankieta)}</dd>
                </div>
                {startMacierzynskiego && (
                  <div>
                    <dt>Co dalej</dt>
                    <dd>
                      {startMacierzynskiego <= dzis
                        ? <>Już teraz możesz zamiast zwolnienia przejść na urlop macierzyński — można go zacząć do 6 tygodni przed terminem porodu. Zwolnienie kończy się najpóźniej w dniu porodu.</>
                        : trwa.do >= startMacierzynskiego
                        ? <>Od {fmtDzien(startMacierzynskiego)} możesz zamiast zwolnienia zacząć urlop macierzyński (6 tygodni przed terminem porodu).</>
                        : <>Urlop macierzyński możesz zacząć od {fmtDzien(startMacierzynskiego)} — 6 tygodni przed terminem porodu.</>}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          );
        })() : (
          <div className="zl-karta zl-brak">
            <span className="zl-ikona"><Ikona n={bezChorobowego ? "info" : "check"} rozmiar={26} /></span>
            {bezChorobowego ? (
              <div><b>Zwolnienie lekarskie nie da Ci zasiłku</b><small>Nie masz ubezpieczenia chorobowego, więc ZUS nie wypłaci zasiłku chorobowego. Zapytaj o świadczenie rodzicielskie w gminie.</small></div>
            ) : etap === "planuje" ? (
              <div><b>Nie masz teraz zwolnienia lekarskiego</b><small>Gdy w ciąży lekarz wystawi e-ZLA, zobaczysz tu jego status i kto wypłaca zasiłek.</small></div>
            ) : (
              <div><b>Nie masz teraz zwolnienia lekarskiego</b><small>Gdy lekarz wystawi e-ZLA, zobaczysz tu jego status.</small></div>
            )}
          </div>
        )}

        {historia.length > 0 && (
          <details className="zl-historia">
            <summary>Poprzednie zwolnienia ({historia.length})</summary>
            <ul>
              {historia.map((z) => (
                <li key={z.od}>
                  <span>{fmtDzien(z.od)} – {fmtDzien(z.do)}</span>
                  <span>kod {z.kod} · {ileDni(z.od, z.do) + 1} dni</span>
                  <span className="zl-znaczek szary">{z.od > dzis ? "Zaplanowane" : "Zakończone"}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </section>
  );
}
