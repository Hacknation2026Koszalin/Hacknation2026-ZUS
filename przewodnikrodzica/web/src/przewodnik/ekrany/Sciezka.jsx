// MOJA ŚCIEŻKA — cała oś czasu z listą rzeczy do zrobienia.
// Bez daty pokazujemy terminy ustawowe; datę można (dobrowolnie) dodać.
import { useState } from "react";
import { useSesja } from "../SesjaContext.jsx";
import { DANE_ZUS_ZAPAS, PROFIL_MOBYWATEL } from "../dane.js";
import { zbudujPlan } from "../plan.js";
import { maChorobowe } from "../sytuacja.js";
import { dzisISO, fmtDzien, tydzienCiazy } from "../terminy.js";
import OsCzasu, { useChecklista } from "../komponenty/OsCzasu.jsx";
import { DataModal, PasekDaty, useDataKluczowa } from "../komponenty/DataKluczowa.jsx";
import { KartaPrzypomnien } from "../komponenty/Powiadomienia.jsx";

export default function Sciezka() {
  const { profil = PROFIL_MOBYWATEL, zus = DANE_ZUS_ZAPAS, etap = "ciaza", ankieta = {} } = useSesja();
  const { def, data } = useDataKluczowa();
  const [modal, setModal] = useState(false);
  const chor = maChorobowe(ankieta, zus);
  const plan = zbudujPlan({ etap, data, odp: ankieta, chor });
  const lista = useChecklista(profil.pesel);
  const wszystkie = plan.flatMap((k) => k.zadania);
  const gotowe = wszystkie.filter(lista.czyZrobione).length;
  const strata = etap === "trudna";
  const dzis = dzisISO();

  const dzisTekst = data
    ? `Dziś, ${fmtDzien(dzis, { day: "numeric", month: "long" })}${etap === "ciaza" ? ` · ${tydzienCiazy(data, dzis).tydzien}. tydzień ciąży` : ""}`
    : null;

  return (
    <section className="plan-sekcja sc" aria-labelledby="sc-tytul">
      <div className="wrap">
        <header className="plan-glowa">
          <span className="plan-kicker">Moja ścieżka</span>
          <h1 id="sc-tytul">{strata ? "Co możesz załatwić — bez pośpiechu" : "Co i kiedy musisz zrobić"}</h1>
          <p>
            {strata
              ? "Zebraliśmy najważniejsze sprawy w jednym miejscu. Wracaj do nich wtedy, kiedy będziesz gotowa."
              : "Każdy krok ma listę rzeczy do odhaczenia. Najważniejsze terminy oznaczyliśmy na czerwono."}
          </p>
          {wszystkie.length > 0 && (
            <div className="plan-postep">
              <div className="plan-postep-tor" role="progressbar" aria-valuemin={0} aria-valuemax={wszystkie.length} aria-valuenow={gotowe} aria-label="Postęp listy zadań">
                <div style={{ width: `${(gotowe / wszystkie.length) * 100}%` }} />
              </div>
              <span><b>{gotowe}</b> z {wszystkie.length} zrobione</span>
            </div>
          )}
        </header>

        {def && <div className="sc-pasek"><PasekDaty onDodaj={() => setModal(true)} /></div>}
        {!strata && <KartaPrzypomnien />}

        <OsCzasu plan={plan} lista={lista} dzisTekst={dzisTekst} strata={strata} />
      </div>
      <DataModal otwarty={modal} onZamknij={() => setModal(false)} />
    </section>
  );
}
