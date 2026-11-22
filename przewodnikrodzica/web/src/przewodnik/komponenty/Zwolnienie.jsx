// STATUS ZWOLNIENIA LEKARSKIEGO — na podstawie e-ZLA, które ZUS już ma (nic nie wpisujesz).
import { dzisISO, fmtDzien, ileDni } from "../terminy.js";
import { maZadluzenie } from "./Zadluzenie.jsx";
import Ikona from "../wniosek/Ikona.jsx";

const KODY = { B: "ciąża — zasiłek 100% podstawy", A: "przerwa w niezdolności do 60 dni", C: "nadużycie alkoholu", D: "gruźlica", E: "choroba zakaźna" };

function ktoWyplaca(zus) {
  const u = zus?.ubezpieczenie || {};
  if (/umowa o pracę/.test(u.tytul || "")) {
    return u.platnikPowyzej20
      ? `Twój pracodawca (${u.platnik})`
      : "Pierwsze 33 dni w roku — pracodawca, potem ZUS";
  }
  return "ZUS — na konto podane w eZUS";
}

export const aktualneZwolnienie = (zus, dzis = dzisISO()) => (zus?.eZLA || []).find((z) => z.od <= dzis && z.do >= dzis);

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
  const z = aktualneZwolnienie(zus, opcje.dzis);
  if (!z || !pokazZwolnienie(opcje)) return null;
  return { id: "l4-koniec", t: "Koniec zwolnienia lekarskiego — potrzebujesz dłużej? Umów wizytę u lekarza", termin: z.do, link: "/przewodnik/pulpit#zl-tytul" };
}

export default function StatusZwolnienia({ zus, etap, data }) {
  const dzis = dzisISO();
  const lista = [...(zus?.eZLA || [])].sort((a, b) => (a.od < b.od ? 1 : -1));
  const trwa = lista.find((z) => z.od <= dzis && z.do >= dzis);
  const startMacierzynskiego = etap === "ciaza" && data ? (() => { const d = new Date(data + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() - 42); return d.toISOString().slice(0, 10); })() : null;
  const historia = lista.filter((z) => z !== trwa);
  const alarm = maZadluzenie(zus);

  return (
    <section className={`zl-sekcja ${alarm ? "alarm" : ""}`} aria-labelledby="zl-tytul">
      <div className="wrap">
        <div className="sh-glowa">
          <span className="plan-kicker">Dane z e-ZLA</span>
          <h2 id="zl-tytul">Status zwolnienia lekarskiego</h2>
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
              <p className="zl-dzien">Dzień {minelo} z {wszystkie}</p>

              <dl className="zl-info">
                <div>
                  <dt>{alarm ? "Wypłata" : "Kto wypłaca"}</dt>
                  <dd className={alarm ? "blad" : ""}>{alarm ? "Wstrzymana — spłać zaległość w składkach" : ktoWyplaca(zus)}</dd>
                </div>
                {startMacierzynskiego && (
                  <div>
                    <dt>Co dalej</dt>
                    <dd>
                      {trwa.do >= startMacierzynskiego
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
            <span className="zl-ikona"><Ikona n="check" rozmiar={26} /></span>
            <div><b>Nie masz teraz zwolnienia lekarskiego</b><small>Gdy lekarz wystawi e-ZLA, zobaczysz tu jego status.</small></div>
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
