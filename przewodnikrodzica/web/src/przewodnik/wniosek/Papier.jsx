// =====================================================================
// „Papierowy” formularz: wygląda jak wniosek, ale pola są aktywne.
// W trybie „Prowadź mnie” tylko JEDNO pole jest podświetlone, reszta
// jest przyciemniona i zablokowana (atrybut inert).
// =====================================================================
import { ZAM, tekstNieDotyczy } from "./formularz.js";
import { blad, czyWidoczne, czyWymagane, zaleznosciUzupelnione } from "./silnik.js";
import Ikona from "./Ikona.jsx";

function Wejscie({ pole, w, ctx, ustaw, bledne }) {
  const id = `in-${pole.id}`;
  const v = w[pole.id] ?? "";
  const opisBledu = bledne ? `blad-${pole.id}` : undefined;
  const wspolne = { id, "aria-invalid": bledne || undefined, "aria-describedby": opisBledu };

  switch (pole.typ) {
    case "radio":
      return (
        <div className="wn-opcje" role="radiogroup" aria-labelledby={`et-${pole.id}`} aria-describedby={opisBledu}>
          {pole.opcje.map((o, i) => {
            const wyl = o.wylaczona?.(w, ctx);
            return (
              <label key={o.v} className={`wn-opcja ${v === o.v ? "zazn" : ""} ${wyl ? "wyl" : ""}`}>
                <input
                  type="radio"
                  name={pole.id}
                  id={i === 0 ? id : undefined}
                  value={o.v}
                  checked={v === o.v}
                  disabled={!!wyl}
                  onChange={() => ustaw(pole.id, o.v)}
                />
                <span className="wn-kratka" aria-hidden="true">{v === o.v ? "X" : ""}</span>
                <span>
                  <b>{o.t}</b>
                  {o.opis && <small>{o.opis}</small>}
                  {wyl && <small className="wn-wyl-powod">{wyl}</small>}
                </span>
              </label>
            );
          })}
        </div>
      );
    case "select":
      return (
        <select {...wspolne} value={v} onChange={(e) => ustaw(pole.id, e.target.value)}>
          <option value="">— wybierz —</option>
          {pole.opcje.map((o) => (
            <option key={o.v} value={o.v}>{o.t}</option>
          ))}
        </select>
      );
    case "wielokrotny": {
      const lista = Array.isArray(v) ? v : [];
      const przelacz = (x) => ustaw(pole.id, lista.includes(x) ? lista.filter((y) => y !== x) : [...lista, x]);
      return (
        <div className="wn-opcje" role="group" aria-labelledby={`et-${pole.id}`} aria-describedby={opisBledu}>
          {pole.opcje.map((o, i) => (
            <label key={o.v} className={`wn-opcja ${lista.includes(o.v) ? "zazn" : ""}`}>
              <input type="checkbox" id={i === 0 ? id : undefined} checked={lista.includes(o.v)} onChange={() => przelacz(o.v)} />
              <span className="wn-kratka" aria-hidden="true">{lista.includes(o.v) ? "X" : ""}</span>
              <span>
                <b>{o.t}</b>
                {o.opis && <small>{o.opis}</small>}
              </span>
            </label>
          ))}
        </div>
      );
    }
    case "obszar":
      return <textarea {...wspolne} rows={pole.wiersze || 4} placeholder={pole.placeholder} value={v} onChange={(e) => ustaw(pole.id, e.target.value)} />;
    case "liczba":
      return <input {...wspolne} type="number" min={pole.min ?? 1} max={pole.max ?? 99} inputMode="numeric" value={v} onChange={(e) => ustaw(pole.id, e.target.value)} />;
    case "data":
      return <input {...wspolne} type="date" value={v} onChange={(e) => ustaw(pole.id, e.target.value)} />;
    case "pesel":
      return (
        <input
          {...wspolne}
          className="wn-kratki"
          inputMode="numeric"
          maxLength={11}
          autoComplete="off"
          value={v}
          onChange={(e) => ustaw(pole.id, e.target.value.replace(/\D/g, ""))}
        />
      );
    case "plik":
      return v ? (
        <div className="wn-plik">
          <Ikona n="plik" /> <b>{v}</b>
          <button type="button" className="wn-link" onClick={() => ustaw(pole.id, "")}>Usuń</button>
        </div>
      ) : (
        <input {...wspolne} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => ustaw(pole.id, e.target.files?.[0]?.name || "")} />
      );
    case "potwierdz": {
      const p = ctx.profil || {};
      // Pole może pokazać własne wiersze (np. dane płatnika z ZUS) — domyślnie dane z mObywatela
      const wiersze = pole.wiersze
        ? pole.wiersze(ctx)
        : [["Imię i nazwisko", `${p.imie} ${p.nazwisko}`], ["PESEL", p.pesel, true], ["Adres zamieszkania", p.adres]];
      return (
        <div className="wn-potw">
          <dl>
            {wiersze.map(([dt, dd, mono]) => (
              <div key={dt}><dt>{dt}</dt><dd className={mono ? "wn-mono" : undefined}>{dd}</dd></div>
            ))}
          </dl>
          <p className="wn-zrodlo">Źródło: {pole.zrodlo || "mObywatel"} (symulacja)</p>
          {v ? (
            <p className="wn-potw-ok"><Ikona n="check" /> Dane potwierdzone <button type="button" className="wn-link" onClick={() => ustaw(pole.id, false)}>Cofnij</button></p>
          ) : (
            <button type="button" id={id} className="wn-btn wn-btn-drugi" onClick={() => ustaw(pole.id, true)}>
              Dane są poprawne
            </button>
          )}
        </div>
      );
    }
    case "zgoda":
      return (
        <div>
          <details className="wn-pouczenie">
            <summary>Pokaż pouczenie</summary>
            <p>{pole.tresc}</p>
          </details>
          <label className="wn-zgoda">
            <input {...wspolne} type="checkbox" checked={!!v} onChange={(e) => ustaw(pole.id, e.target.checked)} />
            <span>{pole.etykieta}</span>
          </label>
        </div>
      );
    default:
      return (
        <input
          {...wspolne}
          type="text"
          inputMode={pole.inputMode}
          placeholder={pole.placeholder}
          value={v}
          onChange={(e) => ustaw(pole.id, e.target.value)}
        />
      );
  }
}

function Pole({ pole, pola, w, ctx, ustaw, prowadz, aktywne, pominiete, pokazBlad, dymek }) {
  const widoczne = czyWidoczne(pole, w, ctx);

  // Pole, które nie dotyczy tej osoby — wyszarzone, nigdy wymagane
  if (!widoczne) {
    const znane = zaleznosciUzupelnione(pole, w, ctx, pola);
    return (
      <div className="wn-pole wn-nd" id={`pole-${pole.id}`} inert={prowadz || undefined}>
        <span className="wn-nr">{pole.nr}.</span>
        <div className="wn-tresc">
          <span className="wn-etyk">{pole.etykieta}</span>
          <p className="wn-nd-txt">
            <Ikona n={znane ? "ban" : "info"} rozmiar={16} />
            <span>{znane ? <><b>Nie dotyczy.</b> {tekstNieDotyczy(pole, w, ctx)}</> : "Uzupełnisz, jeśli będzie Cię dotyczyć — zależy od wcześniejszych odpowiedzi."}</span>
          </p>
        </div>
      </div>
    );
  }

  const err = blad(pole, w, ctx);
  const bledne = !!err && (pokazBlad || (pominiete && !aktywne));
  const wym = czyWymagane(pole, w, ctx);
  const klasy = ["wn-pole", aktywne && prowadz ? "wn-aktywne" : "", pominiete ? "wn-pomin" : "", bledne ? "wn-bledne" : ""].join(" ");

  return (
    <div className={klasy} id={`pole-${pole.id}`} inert={(prowadz && !aktywne) || undefined}>
      <span className="wn-nr">{pole.nr}.</span>
      <div className="wn-tresc">
        {pole.typ !== "zgoda" && pole.typ !== "info" && (
          <label className="wn-etyk" id={`et-${pole.id}`} htmlFor={pole.typ === "radio" ? undefined : `in-${pole.id}`}>
            {pole.etykieta}
            {wym ? <span className="wn-gw" title="Pole wymagane"> *</span> : <span className="wn-opc"> (nieobowiązkowe)</span>}
          </label>
        )}
        <Wejscie pole={pole} w={w} ctx={ctx} ustaw={ustaw} bledne={bledne} />
        {pominiete && err && !aktywne && (
          <p className="wn-flaga"><Ikona n="alert" rozmiar={16} /> Pominięte — wrócimy do tego pola przed wysłaniem.</p>
        )}
        {bledne && !(aktywne && prowadz) && (
          <p className="wn-blad" id={`blad-${pole.id}`}>{err}</p>
        )}
        {aktywne && prowadz && dymek}
      </div>
    </div>
  );
}

export default function Papier({ def = ZAM, w, ctx, ustaw, prowadz, aktywne, pominiete, pokazBledy, bladAktywnego, dymek }) {
  return (
    <div className="wn-papier">
      <header className="wn-papier-glowa" inert={prowadz || undefined}>
        <div className="wn-znak">
          <span>Wzór uproszczony</span>
          <small>prototyp — nie jest to formularz ZUS</small>
        </div>
        <div className="wn-symbol">{def.symbol}</div>
      </header>
      <div inert={prowadz || undefined}>
        <h2 className="wn-tytul">{def.tytul}</h2>
        <p className="wn-instr">
          Pola oznaczone <span className="wn-gw">*</span> są wymagane. Pola, które Cię nie dotyczą, wyłączyliśmy automatycznie.
        </p>
      </div>
      {def.czesci.map((c, i) => (
        <section key={c.id} className="wn-czesc" aria-labelledby={`cz-${c.id}`}>
          <h3 id={`cz-${c.id}`} inert={prowadz || undefined}>
            <span>Część {i + 1}.</span> {c.tytul}
          </h3>
          {def.pola.filter((p) => p.czesc === c.id).map((p) => (
            <Pole
              key={p.id}
              pole={p}
              pola={def.pola}
              w={w}
              ctx={ctx}
              ustaw={ustaw}
              prowadz={prowadz}
              aktywne={aktywne === p.id}
              pominiete={pominiete.includes(p.id)}
              pokazBlad={pokazBledy || (aktywne === p.id && bladAktywnego)}
              dymek={aktywne === p.id ? dymek : null}
            />
          ))}
        </section>
      ))}
    </div>
  );
}
