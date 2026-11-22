// =====================================================================
// PRZEWODNIK POWITALNY
// 1) Kilka pytań: kim jesteś dla dziecka → etap (zależny od roli) → praca
//    (→ dobrowolne chorobowe, jeśli trzeba) → podsumowanie.
//    W pytaniach NIE ma „Pomiń” — bez odpowiedzi nie wiemy, co przysługuje.
// 2) Samouczek (slajdy) — tu można pominąć.
// =====================================================================
import { useEffect, useRef, useState } from "react";
import { DANE_ZUS_ZAPAS, ETAPY, SLAJDY } from "../dane.js";
import { useSesja } from "../SesjaContext.jsx";
import { PYTANIA, etapyDlaRoli, listaPytan, ocenSytuacje, pracaZZus } from "../sytuacja.js";

const IKONY_SLAJDOW = ["/plant.svg", "/girl.svg", "/house.svg", "/pregnant.svg", "/heart.svg"];

export default function PrzewodnikPowitalny({ onZamknij, tylkoSlajdy = false }) {
  const { profil, etap, ustaw, zus = DANE_ZUS_ZAPAS, ankieta } = useSesja();

  // krok 0 = pytania; 1..SLAJDY.length = slajdy; ostatni = ekran końcowy
  const [krok, setKrok] = useState(tylkoSlajdy ? 1 : 0);
  const [pyt, setPyt] = useState(0); // numer pytania albo "wynik"
  const [odp, setOdp] = useState(() => ({
    ...(pracaZZus(zus) ? { praca: pracaZZus(zus) } : {}),
    ...(ankieta || {}),
    ...(etap ? { etap: ankieta?.typOpieki || etap } : {}),
  }));
  const [wylot, setWylot] = useState(false);

  const dialogRef = useRef(null);
  const timerRef = useRef(null);

  const pracaWgZus = pracaZZus(zus);
  const pytania = listaPytan(odp);
  const ostatni = SLAJDY.length + 1;
  const slajd = krok > 0 && krok < ostatni ? SLAJDY[krok - 1] : null;
  const wybranyEtap = ETAPY.find((e) => e.id === etap);

  const zamknij = () => {
    const zmiany = { onboardingZakonczony: true };
    if (!etap) zmiany.etap = "ciaza";
    ustaw(zmiany);
    setWylot(true);
    timerRef.current = setTimeout(() => onZamknij?.(), 550);
  };

  useEffect(() => {
    const poprzedniOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const klawisz = (e) => {
      if (krok === 0) return; // w pytaniach bez skrótów klawiszowych
      if (e.key === "Escape") { e.preventDefault(); zamknij(); }
      if (e.key === "ArrowRight" && krok < ostatni) setKrok((p) => Math.min(p + 1, ostatni));
      if (e.key === "ArrowLeft" && krok > 1) setKrok((p) => Math.max(p - 1, 1));
    };
    window.addEventListener("keydown", klawisz);
    return () => {
      window.removeEventListener("keydown", klawisz);
      document.body.style.overflow = poprzedniOverflow;
      clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [krok, ostatni]);

  // ---------- pytania ----------
  const opcjePytania = (klucz) =>
    klucz === "etap" ? etapyDlaRoli(odp.rola).map((o) => ({ v: o.v, t: o.nazwa, opis: o.podtytul, ikona: o.ikona })) : PYTANIA[klucz].opcje;

  const odpowiedz = (klucz, v) => {
    const nowe = { ...odp, [klucz]: v };
    if (klucz === "rola") {
      // zmiana roli może unieważnić wybrany etap (np. tata nie wybiera „Jestem w ciąży”)
      const dozwolone = etapyDlaRoli(v).map((o) => o.v);
      if (!dozwolone.includes(nowe.etap)) delete nowe.etap;
    }
    if (klucz === "praca" && v !== "dzialalnosc" && v !== "zlecenie") delete nowe.chorobowe;
    setOdp(nowe);
    const lista = listaPytan(nowe);
    setPyt(pyt + 1 < lista.length ? pyt + 1 : "wynik");
  };

  const wstecz = () => {
    if (pyt === "wynik") setPyt(pytania.length - 1);
    else if (pyt > 0) setPyt(pyt - 1);
  };

  // zapis odpowiedzi w sesji (etap „zastępcza” to w aplikacji etap adopcji)
  const zapiszOdpowiedzi = () => {
    const o = etapyDlaRoli(odp.rola).find((x) => x.v === odp.etap);
    const doZapisu = { ...odp };
    if (o && o.v !== o.etap) doZapisu.typOpieki = o.v;
    else delete doZapisu.typOpieki;
    ustaw({ ankieta: doZapisu, etap: o?.etap || "ciaza" });
    return o?.etap || "ciaza";
  };

  const poAnkiecie = () => {
    zapiszOdpowiedzi();
    setKrok(1);
  };

  const etapDoOceny = etapyDlaRoli(odp.rola).find((x) => x.v === odp.etap)?.etap;
  const sytuacja = pyt === "wynik" ? ocenSytuacje(odp, zus, etapDoOceny) : null;
  const wszystkichKrokow = pytania.length + 1;
  const procent = krok > 0 && krok < ostatni ? Math.round((krok / SLAJDY.length) * 100) : 0;

  return (
    <div className={`pw-overlay ${wylot ? "is-closing" : ""}`}>
      <div className="pw-dialog" role="dialog" aria-modal="true" aria-labelledby="pw-title" ref={dialogRef} tabIndex={-1}>
        <aside className="pw-visual" aria-hidden="true">
          <img src="/powitanie.jpg" alt="" className="pw-visual__photo" />
        </aside>

        <section className="pw-panel">
          <div className="pw-topbar">
            {krok > 0 && krok < ostatni && (
              <button type="button" className="pw-skip" onClick={zamknij}>Pomiń samouczek</button>
            )}
          </div>

          {krok > 0 && krok < ostatni && (
            <div className="pw-progress">
              <div className="pw-progress__head">
                <span>Jak działa przewodnik</span>
                <span>{krok} / {SLAJDY.length}</span>
              </div>
              <div className="pw-progress__bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={procent} aria-label="Postęp samouczka">
                <div style={{ width: `${procent}%` }} />
              </div>
            </div>
          )}

          {/* ===== PYTANIA ===== */}
          {krok === 0 && typeof pyt === "number" && (() => {
            const klucz = pytania[pyt];
            const P = PYTANIA[klucz];
            return (
              <div className="pw-content pw-content--start" key={klucz}>
                <p className="pw-eyebrow">
                  Krok {pyt + 1} z {wszystkichKrokow}
                  {pyt === 0 && ` · Cześć${profil?.imie ? `, ${profil.imie}` : ""}`}
                </p>
                <h2 id="pw-title">{P.pytanie}</h2>
                <p className="pw-lead">{P.opis}</p>
                <div className="pw-stage-list" role="radiogroup" aria-labelledby="pw-title">
                  {opcjePytania(klucz).map((o) => (
                    <button
                      key={o.v}
                      type="button"
                      role="radio"
                      aria-checked={odp[klucz] === o.v}
                      className={`pw-stage ${o.ikona ? "" : "pw-stage--opcja"} ${odp[klucz] === o.v ? "is-selected" : ""}`}
                      onClick={() => odpowiedz(klucz, o.v)}
                    >
                      {o.ikona ? (
                        <span className="pw-stage__icon"><img src={o.ikona} alt="" aria-hidden="true" /></span>
                      ) : (
                        <span className="pw-radio" aria-hidden="true" />
                      )}
                      <span className="pw-stage__text">
                        <span className="pw-stage__name">
                          {o.t}
                          {klucz === "praca" && pracaWgZus === o.v && <span className="pw-wgzus">według danych ZUS</span>}
                        </span>
                        {o.opis && <span className="pw-stage__desc">{o.opis}</span>}
                      </span>
                      <span className="pw-stage__arrow" aria-hidden="true">→</span>
                    </button>
                  ))}
                </div>
                <div className="pw-ankieta-dol">
                  {pyt > 0 ? <button type="button" className="pw-btn pw-btn--secondary" onClick={wstecz}>Wstecz</button> : <span />}
                  <span className="pw-prywatnosc">Pytamy tylko o to, czego nie ma w danych ZUS.</span>
                </div>
              </div>
            );
          })()}

          {/* ===== PODSUMOWANIE ===== */}
          {krok === 0 && pyt === "wynik" && sytuacja && (
            <div className="pw-content pw-content--start">
              <p className="pw-eyebrow">Krok {wszystkichKrokow} z {wszystkichKrokow} · Podsumowanie</p>
              <h2 id="pw-title">{sytuacja.tytul}</h2>
              <ul className="pw-wynik">
                {sytuacja.punkty.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
              <div className="pw-ankieta-dol">
                <button type="button" className="pw-btn pw-btn--secondary" onClick={wstecz}>Wstecz</button>
                <button type="button" className="pw-btn pw-btn--primary" onClick={poAnkiecie}>Dalej — pokaż, jak to działa</button>
              </div>
            </div>
          )}

          {/* ===== SAMOUCZEK ===== */}
          {slajd && (
            <div className="pw-content pw-content--slide">
              {krok === 1 && wybranyEtap && !tylkoSlajdy && (
                <p className="pw-stage-message">
                  {wybranyEtap.powitanie} <span>Teraz pokażemy Ci w kilku krokach, jak działa przewodnik.</span>
                </p>
              )}
              <div className="pw-mini-icon" aria-hidden="true">
                <img src={IKONY_SLAJDOW[(krok - 1) % IKONY_SLAJDOW.length]} alt="" />
              </div>
              <h2 id="pw-title">{slajd.tytul}</h2>
              <p className="pw-lead pw-lead--slide">{slajd.tekst}</p>
            </div>
          )}

          {krok === ostatni && (
            <div className="pw-content pw-content--finish">
              <div className="pw-finish-icon" aria-hidden="true"><img src="/heart.svg" alt="" /></div>
              <h2 id="pw-title">Wszystko gotowe!</h2>
              <p className="pw-lead pw-lead--slide">
                Twój przewodnik jest gotowy. Do samouczka wrócisz pod przyciskiem „?”, a odpowiedzi zmienisz w ustawieniach (ikona zębatki).
              </p>
              <div className="pw-finish-actions">
                <button type="button" className="pw-btn pw-btn--secondary" onClick={() => setKrok(1)}>Obejrzyj jeszcze raz</button>
                <button type="button" className="pw-btn pw-btn--primary" onClick={zamknij}>Przejdź do konta</button>
              </div>
            </div>
          )}

          {krok > 0 && krok < ostatni && (
            <div className="pw-nav">
              <button type="button" className="pw-btn pw-btn--secondary" onClick={() => setKrok((p) => Math.max(p - 1, 1))} disabled={krok === 1}>
                Wstecz
              </button>
              <div className="pw-dots" aria-label={`Slajd ${krok} z ${SLAJDY.length}`}>
                {SLAJDY.map((s, i) => (
                  <button key={s.id} type="button" className={i + 1 === krok ? "is-active" : ""} aria-label={`Slajd ${i + 1}`} onClick={() => setKrok(i + 1)} />
                ))}
              </div>
              <button type="button" className="pw-btn pw-btn--primary" onClick={() => setKrok((p) => Math.min(p + 1, ostatni))}>
                {krok === SLAJDY.length ? "Zakończ" : "Dalej"}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
