import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KrokiLogowania from "../komponenty/KrokiLogowania.jsx";
import { useSesja } from "../SesjaContext.jsx";
import { PROFIL_MOBYWATEL } from "../dane.js";

// Krok 3: zgoda na przekazanie danych z mObywatela i pobranie danych z ZUS
export default function Zgoda() {
  const nawiguj = useNavigate();
  const { ustaw } = useSesja();
  const [profil, setProfil] = useState(PROFIL_MOBYWATEL);

  // dane z backendu .NET (GET /api/symulacja/mobywatel); gdy nie działa — dane zapasowe
  useEffect(() => {
    fetch("/api/symulacja/mobywatel")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setProfil)
      .catch(() => {});
  }, []);

  const pola = [
    ["Imię i nazwisko", `${profil.imie} ${profil.nazwisko}`],
    ["PESEL", profil.pesel],
    ["Data urodzenia", new Date(profil.dataUrodzenia).toLocaleDateString("pl-PL")],
    ["Obywatelstwo", profil.obywatelstwo],
    ["Adres zamieszkania", profil.adres],
  ];

  const zgadzam = () => {
    ustaw({ profil });
    nawiguj("/przewodnik/pobieranie");
  };

  return (
    <div className="wrap page narrow">
      <KrokiLogowania aktywny={2} />
      <div className="sim-box">
        <p className="sim-tag">SYMULACJA</p>
        <h1>Przewodnik prosi o Twoje dane</h1>
        <p className="lead">Z aplikacji mObywatel przekażemy:</p>
        <dl className="dane-lista">
          {pola.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
        <div className="info-box">
          <b>Pobierzemy też z ZUS:</b> informację o ubezpieczeniu chorobowym, podstawę wymiaru zasiłku, zaświadczenia lekarskie e-ZLA i stan rozliczeń składek. Dzięki temu nie musisz nic wpisywać ręcznie.
        </div>
        <div className="row-btns">
          <button className="btn btn-primary btn-lg" onClick={zgadzam}>Zgadzam się</button>
          <button className="btn btn-secondary" onClick={() => nawiguj("/przewodnik")}>Anuluj</button>
        </div>
      </div>
    </div>
  );
}
