// ZŁÓŻ WNIOSEK — tylko formularze do złożenia (wiedza jest w „Świadczeniach”).
// Każdy formularz otwiera ten sam kreator „prowadź mnie za rękę”.
import { useState } from "react";
import { useJezyk } from "../jezyk.js";
import { Link, Navigate, useParams } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import { DANE_ZUS_ZAPAS, PROFIL_MOBYWATEL } from "../dane.js";
import { DOKUMENTY_INNYCH, FORMULARZE, KATEGORIE, formularz, slug } from "../wniosek/formularze/index.js";
import Kreator from "../wniosek/Kreator.jsx";
import Ikona from "../wniosek/Ikona.jsx";
import { fmtZapisu, wersjaRobocza } from "../wniosek/robocze.js";

const kluczSzkicu = (f) => `wniosek-${f.symbol.toLowerCase()}-szkic`;
const maSzkic = (f) => {
  try {
    const s = JSON.parse(sessionStorage.getItem(kluczSzkicu(f)));
    return s && Object.keys(s.w || {}).length > 0;
  } catch {
    return false;
  }
};

function KartaWniosku({ f, powod, s }) {
  const a = f.adresat?.({ zus: s?.zus });
  const gdzie = a === "pracodawca" ? "u pracodawcy" : a === "usc" ? "w USC (gov.pl)" : "w ZUS";
  const robocza = wersjaRobocza((s?.profil || PROFIL_MOBYWATEL).pesel, f.symbol);
  const szkic = !robocza && maSzkic(f);
  return (
    <li>
      <Link to={`/przewodnik/wnioski/${slug(f)}`} className={`zw-karta ${powod ? "polecany" : ""}`}>
        <span className="zw-symbol">{f.symbol}</span>
        <span className="zw-tresc">
          <b>{f.tytul}</b>
          <span>{f.krotko}</span>
          <span className="zw-meta">
            <span><Ikona n="zegar" rozmiar={14} /> ok. {f.czas}</span>
            <span className={`zw-gdzie ${a === "pracodawca" ? "prac" : "zus"}`}>Składasz {gdzie}</span>
            {powod && <span className="zw-chip ok"><Ikona n="check" rozmiar={14} /> {powod}</span>}
            {robocza && <span className="zw-chip szkic"><Ikona n="plik" rozmiar={14} /> Wersja robocza z {fmtZapisu(robocza.zapisano)} · {robocza.gotowe}/{robocza.wszystkie} pól</span>}
            {szkic && <span className="zw-chip szkic">Masz zapisany szkic</span>}
          </span>
        </span>
        <span className="zw-strzalka" aria-hidden="true"><Ikona n="strzalka" rozmiar={20} /></span>
      </Link>
    </li>
  );
}

function prosba(d, profil) {
  return `Dzień dobry,\n\nproszę o przygotowanie i przekazanie do ZUS dokumentu ${d.symbol} („${d.tytul}”) w sprawie mojego zasiłku macierzyńskiego.\n\nZ góry dziękuję,\n${profil.imie} ${profil.nazwisko}`;
}

function KartaInnych({ d, profil, dotyczy }) {
  const [skopiowano, setSkopiowano] = useState(false);
  const kopiuj = async () => {
    try {
      await navigator.clipboard.writeText(prosba(d, profil));
      setSkopiowano(true);
      setTimeout(() => setSkopiowano(false), 2500);
    } catch {
      /* brak schowka */
    }
  };
  return (
    <li className={`zw-inni ${dotyczy ? "polecany" : ""}`}>
      <div className="zw-inni-glowa">
        <span className="zw-symbol szary">{d.symbol}</span>
        <div>
          <b>{d.tytul}</b>
          <span className="zw-kto"><Ikona n={d.ikona} rozmiar={14} /> Wypełnia: {d.kto}</span>
        </div>
        {dotyczy && <span className="zw-chip ok">Może Cię dotyczyć</span>}
      </div>
      <p>{d.poCo}</p>
      <details>
        <summary>Jak o nie poprosić?</summary>
        <ol>{d.kroki.map((k) => <li key={k}>{k}</li>)}</ol>
        <button type="button" className="wn-btn wn-btn-drugi wn-btn-maly" onClick={kopiuj}>
          <Ikona n={skopiowano ? "check" : "poczta"} rozmiar={16} /> {skopiowano ? "Skopiowano treść prośby" : "Skopiuj gotową prośbę (e-mail)"}
        </button>
      </details>
    </li>
  );
}

export default function ZlozWniosek() {
  const sesja = useSesja();
  const s = { ...sesja, profil: sesja.profil || PROFIL_MOBYWATEL, zus: sesja.zus || DANE_ZUS_ZAPAS };
  const [szukaj, setSzukaj] = useState("");
  const [, t] = useJezyk();
  const q = szukaj.trim().toLowerCase();
  const pasuje = (f) => !q || `${f.symbol} ${f.tytul} ${f.krotko}`.toLowerCase().includes(q);
  const polecane = FORMULARZE.map((f) => [f, f.polecany?.(s)]).filter(([, p]) => p);

  return (
    <div className="wn zw">
      <div className="wrap">
        <span className="plan-kicker">Złóż wniosek</span>
        <h1>{t("Wnioski i oświadczenia")}</h1>
        <p className="wn-lead">Wybierz formularz — poprowadzimy Cię pole po polu. Dane z mObywatela i ZUS wpiszemy za Ciebie.</p>

        <label className="zw-szukaj">
          <Ikona n="lupa" rozmiar={18} />
          <span className="sr-only">Szukaj wniosku</span>
          <input type="search" placeholder="Szukaj, np. „zmiana konta”, „ZAS-23”, „podatek”" value={szukaj} onChange={(e) => setSzukaj(e.target.value)} />
        </label>

        {!q && polecane.length > 0 && (
          <section className="zw-sekcja">
            <h2><Ikona n="check" /> {t("Polecane dla Ciebie")}</h2>
            <ul className="zw-lista">{polecane.map(([f, p]) => <KartaWniosku key={f.symbol} f={f} powod={p} s={s} />)}</ul>
          </section>
        )}

        {KATEGORIE.map((k) => {
          const lista = FORMULARZE.filter((f) => f.kategoria === k.id && pasuje(f));
          if (!lista.length) return null;
          return (
            <section key={k.id} className="zw-sekcja">
              <h2><Ikona n={k.ikona} /> {k.nazwa}</h2>
              <ul className="zw-lista">{lista.map((f) => <KartaWniosku key={f.symbol} f={f} powod={null} s={s} />)}</ul>
            </section>
          );
        })}

        {q && !FORMULARZE.some(pasuje) && <p className="zw-pusto">Nie znaleźliśmy takiego wniosku. Spróbuj innego słowa albo zapytaj ZUSannę.</p>}

        <section className="zw-sekcja">
          <h2><Ikona n="teczka" /> Dokumenty, które wypełnia ktoś inny</h2>
          <p className="zw-opis">Tych nie składasz sam(a) — wystawia je pracodawca albo lekarz. Podpowiemy, jak o nie poprosić.</p>
          <ul className="zw-lista zw-lista-inni">
            {DOKUMENTY_INNYCH.filter(pasuje).map((d) => <KartaInnych key={d.symbol} d={d} profil={s.profil} dotyczy={d.dotyczy?.(s)} />)}
          </ul>
        </section>
      </div>
    </div>
  );
}

// /przewodnik/wnioski/:symbol — kreator dla wybranego formularza
export function KreatorFormularza() {
  const { symbol } = useParams();
  const f = formularz(symbol);
  if (!f) return <Navigate to="/przewodnik/wnioski" replace />;
  return <Kreator key={f.symbol} def={f} />;
}
