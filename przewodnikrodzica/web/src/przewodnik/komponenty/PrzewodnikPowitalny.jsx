import { useEffect, useRef, useState } from "react";
import { ETAPY, SLAJDY } from "../dane.js";
import { useSesja } from "../SesjaContext.jsx";

function pobierzIkoneEtapu(etap, index = 0) {
  const tekst = `${etap?.id || ""} ${etap?.nazwa || ""}`.toLowerCase();

  if (tekst.includes("ciąż") || tekst.includes("ciaz")) return "/pregnant.svg";
  if (tekst.includes("rodz")) return "/heart.svg";
  if (tekst.includes("dom")) return "/house.svg";
  if (tekst.includes("plan")) return "/plant.svg";
  if (tekst.includes("mama") || tekst.includes("kob")) return "/girl.svg";

  const fallback = ["/plant.svg", "/girl.svg", "/house.svg", "/pregnant.svg", "/heart.svg"];
  return fallback[index % fallback.length];
}

export default function PrzewodnikPowitalny({ onZamknij, tylkoSlajdy = false }) {
  const { profil, etap, ustaw } = useSesja();

  const [krok, setKrok] = useState(tylkoSlajdy ? 1 : 0);
  const [wylot, setWylot] = useState(false);

  const dialogRef = useRef(null);
  const timerRef = useRef(null);

  const ostatni = SLAJDY.length + 1;
  const slajd = krok > 0 && krok < ostatni ? SLAJDY[krok - 1] : null;
  const wybranyEtap = ETAPY.find((e) => e.id === etap);

  const zamknij = () => {
    if (!etap) {
      ustaw({ etap: "ciaza", onboardingZakonczony: true });
    } else {
      ustaw({ onboardingZakonczony: true });
    }

    setWylot(true);
    timerRef.current = setTimeout(() => {
      onZamknij?.();
    }, 550);
  };

  useEffect(() => {
    const poprzedniOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const klawisz = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        zamknij();
      }

      if (e.key === "ArrowRight" && krok > 0 && krok < ostatni) {
        setKrok((prev) => Math.min(prev + 1, ostatni));
      }

      if (e.key === "ArrowLeft" && krok > (tylkoSlajdy ? 1 : 0)) {
        setKrok((prev) => Math.max(prev - 1, tylkoSlajdy ? 1 : 0));
      }
    };

    window.addEventListener("keydown", klawisz);

    return () => {
      window.removeEventListener("keydown", klawisz);
      document.body.style.overflow = poprzedniOverflow;
      clearTimeout(timerRef.current);
    };
  }, [krok, ostatni, tylkoSlajdy]);

  const wybierzEtap = (id) => {
    ustaw({ etap: id });
    setKrok(1);
  };

  const nastepny = () => {
    setKrok((prev) => Math.min(prev + 1, ostatni));
  };

  const poprzedni = () => {
    setKrok((prev) => Math.max(prev - 1, tylkoSlajdy ? 1 : 0));
  };

  const procent =
    krok > 0 && krok < ostatni
      ? Math.round((krok / SLAJDY.length) * 100)
      : 0;

  return (
    <div className={`pw-overlay ${wylot ? "is-closing" : ""}`}>
      <div
        className="pw-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pw-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        {/* LEWA STRONA — ZDJĘCIE */}
        <aside className="pw-visual" aria-hidden="true">
          <img
            src="/powitanie.jpg"
            alt=""
            className="pw-visual__photo"
          />

          <div className="pw-visual__overlay">
            <span className="pw-visual__badge">Przewodnik rodzica</span>
            <p>
              Spokojnie przeprowadzimy Cię przez formalności krok po kroku.
            </p>
          </div>
        </aside>

        {/* PRAWA STRONA — TREŚĆ */}
        <section className="pw-panel">
          <div className="pw-topbar">
            <div className="pw-brand">
              <img src="/heart.svg" alt="" aria-hidden="true" />
              <span>Przewodnik młodego rodzica</span>
            </div>

            {krok < ostatni && (
              <button type="button" className="pw-skip" onClick={zamknij}>
                Pomiń
              </button>
            )}
          </div>

          {krok > 0 && krok < ostatni && (
            <div className="pw-progress">
              <div className="pw-progress__head">
                <span>Przewodnik</span>
                <span>
                  {krok} / {SLAJDY.length}
                </span>
              </div>

              <div
                className="pw-progress__bar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={procent}
                aria-label="Postęp przewodnika"
              >
                <div style={{ width: `${procent}%` }} />
              </div>
            </div>
          )}

          {/* KROK 0 — WYBÓR ETAPU */}
          {krok === 0 && (
            <div className="pw-content pw-content--start">
              <p className="pw-eyebrow">
                Cześć{profil?.imie ? `, ${profil.imie}` : ""}!
              </p>

              <h2 id="pw-title">Na jakim jesteś etapie?</h2>

              <p className="pw-lead">
                Dopasujemy przewodnik do Twojej sytuacji. Ten wybór możesz później zmienić.
              </p>

              <div className="pw-stage-list">
                {ETAPY.map((e, index) => (
                  <button
                    key={e.id}
                    type="button"
                    className={`pw-stage ${etap === e.id ? "is-selected" : ""}`}
                    onClick={() => wybierzEtap(e.id)}
                  >
                    <span className="pw-stage__icon">
                      <img
                        src={pobierzIkoneEtapu(e, index)}
                        alt=""
                        aria-hidden="true"
                      />
                    </span>

                    <span className="pw-stage__text">
                      <span className="pw-stage__name">{e.nazwa}</span>
                      {e.podtytul && (
                        <span className="pw-stage__desc">{e.podtytul}</span>
                      )}
                    </span>

                    <span className="pw-stage__arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SLAJDY */}
          {slajd && (
            <div className="pw-content pw-content--slide">
              {krok === 1 && wybranyEtap && (
                <p className="pw-stage-message">
                  {wybranyEtap.powitanie}
                  {wybranyEtap.podtytul ? (
                    <span> {wybranyEtap.podtytul}</span>
                  ) : null}
                </p>
              )}

              <div className="pw-mini-icon" aria-hidden="true">
                <img
                  src={[
                    "/plant.svg",
                    "/girl.svg",
                    "/house.svg",
                    "/pregnant.svg",
                    "/heart.svg",
                  ][(krok - 1) % 5]}
                  alt=""
                />
              </div>

              <h2 id="pw-title">{slajd.tytul}</h2>
              <p className="pw-lead pw-lead--slide">{slajd.tekst}</p>
            </div>
          )}

          {/* KONIEC */}
          {krok === ostatni && (
            <div className="pw-content pw-content--finish">
              <div className="pw-finish-icon" aria-hidden="true">
                <img src="/heart.svg" alt="" />
              </div>

              <h2 id="pw-title">Wszystko gotowe!</h2>

              <p className="pw-lead pw-lead--slide">
                Twój przewodnik jest gotowy. W każdej chwili możesz wrócić do tej prezentacji z poziomu pulpitu.
              </p>

              <div className="pw-finish-actions">
                <button
                  type="button"
                  className="pw-btn pw-btn--secondary"
                  onClick={() => setKrok(1)}
                >
                  Obejrzyj jeszcze raz
                </button>

                <button
                  type="button"
                  className="pw-btn pw-btn--primary"
                  onClick={zamknij}
                >
                  Przejdź do pulpitu
                </button>
              </div>
            </div>
          )}

          {/* NAWIGACJA */}
          {krok > 0 && krok < ostatni && (
            <div className="pw-nav">
              <button
                type="button"
                className="pw-btn pw-btn--secondary"
                onClick={poprzedni}
                disabled={krok === 1 && tylkoSlajdy}
              >
                Wstecz
              </button>

              <div className="pw-dots" aria-label={`Slajd ${krok} z ${SLAJDY.length}`}>
                {SLAJDY.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    className={i + 1 === krok ? "is-active" : ""}
                    aria-label={`Slajd ${i + 1}`}
                    onClick={() => setKrok(i + 1)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="pw-btn pw-btn--primary"
                onClick={nastepny}
              >
                {krok === SLAJDY.length ? "Zakończ" : "Dalej"}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}