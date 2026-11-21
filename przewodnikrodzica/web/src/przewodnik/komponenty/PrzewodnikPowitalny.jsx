import { useEffect, useState } from "react";
import { ETAPY, SLAJDY } from "../dane.js";
import { useSesja } from "../SesjaContext.jsx";

// Pełnoekranowy przewodnik w stylu "Hello" z pierwszej konfiguracji telefonu.
// Slajd 0 = wybór etapu, potem SLAJDY, na końcu ekran zakończenia.
// Po zakończeniu okno animacją "wlatuje" do ikony ? w nagłówku (onZamknij).
export default function PrzewodnikPowitalny({ onZamknij, tylkoSlajdy = false }) {
  const { profil, etap, ustaw } = useSesja();
  const [krok, setKrok] = useState(tylkoSlajdy ? 1 : 0); // 0 etap, 1..N slajdy, N+1 koniec
  const [wylot, setWylot] = useState(false);
  const ostatni = SLAJDY.length + 1;
  const wybranyEtap = ETAPY.find((e) => e.id === etap);

  const zamknij = () => {
    if (!etap) ustaw({ etap: "ciaza" }); // gdy ktoś pominął wybór etapu
    ustaw({ onboardingZakonczony: true });
    setWylot(true);
    setTimeout(onZamknij, 650); // czas animacji "wlotu" do ?
  };

  // klawiatura: strzałki i Escape
  useEffect(() => {
    const klawisz = (e) => {
      if (e.key === "Escape") zamknij();
      if (e.key === "ArrowRight" && krok > 0 && krok < ostatni) setKrok(krok + 1);
      if (e.key === "ArrowLeft" && krok > (tylkoSlajdy ? 1 : 0)) setKrok(krok - 1);
    };
    window.addEventListener("keydown", klawisz);
    return () => window.removeEventListener("keydown", klawisz);
  });

  const slajd = SLAJDY[krok - 1];

  return (
    <div className={`onb-tlo ${wylot ? "wylot" : ""}`} role="dialog" aria-modal="true" aria-label="Przewodnik powitalny">
      <div className="onb-okno">
        {krok < ostatni && <button className="onb-pomin" onClick={zamknij}>Pomiń →</button>}

        {krok === 0 && (
          <div className="onb-tresc" key="etap">
            <p className="onb-hello">Cześć{profil?.imie ? `, ${profil.imie}` : ""}!</p>
            <h2>Na jakim jesteś etapie?</h2>
            <p className="muted">Dopasujemy przewodnik do Twojej sytuacji. Zmienisz to w każdej chwili.</p>
            <div className="etapy">
              {ETAPY.map((e) => (
                <button key={e.id} className={`etap ${etap === e.id ? "wybrany" : ""}`} onClick={() => { ustaw({ etap: e.id }); setKrok(1); }}>
                  <span className="etap-ikona" aria-hidden="true">{e.ikona}</span>
                  {e.nazwa}
                </button>
              ))}
            </div>
          </div>
        )}

        {slajd && (
          <div className="onb-tresc" key={slajd.id}>
            {krok === 1 && wybranyEtap && (
              <p className="onb-powitanie">{wybranyEtap.powitanie} <span className="muted">{wybranyEtap.podtytul}</span></p>
            )}
            <div className="onb-ilustracja" aria-hidden="true">
              <span className="onb-ikona">{slajd.ikona}</span>
              <span className="onb-mini">{slajd.mini}</span>
            </div>
            <h2>{slajd.tytul}</h2>
            <p className="onb-tekst">{slajd.tekst}</p>
          </div>
        )}

        {krok === ostatni && (
          <div className="onb-tresc" key="koniec">
            <div className="onb-ilustracja" aria-hidden="true"><span className="onb-ikona">🎉</span></div>
            <h2>Gotowe!</h2>
            <p className="onb-tekst">Ten przewodnik zawsze znajdziesz pod ikoną <b>?</b> w prawym górnym rogu.</p>
            <div className="row-btns center">
              <button className="btn btn-secondary" onClick={() => setKrok(1)}>Obejrzyj jeszcze raz</button>
              <button className="btn btn-primary btn-lg" onClick={zamknij}>Przejdź do mojego pulpitu</button>
            </div>
          </div>
        )}

        {krok > 0 && krok < ostatni && (
          <div className="onb-nawigacja">
            <button className="btn btn-secondary" onClick={() => setKrok(krok - 1)} disabled={krok === 1 && tylkoSlajdy}>← Wstecz</button>
            <div className="kropki" aria-label={`Slajd ${krok} z ${SLAJDY.length}`}>
              {SLAJDY.map((s, i) => (
                <button key={s.id} className={i + 1 === krok ? "on" : ""} aria-label={`Slajd ${i + 1}`} onClick={() => setKrok(i + 1)} />
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => setKrok(krok + 1)}>Dalej →</button>
          </div>
        )}
      </div>
    </div>
  );
}
