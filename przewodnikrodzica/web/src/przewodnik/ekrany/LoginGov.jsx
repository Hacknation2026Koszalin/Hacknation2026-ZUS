import { useNavigate } from "react-router-dom";
import KrokiLogowania from "../komponenty/KrokiLogowania.jsx";

// Krok 1: wybór sposobu logowania (symulacja węzła krajowego). Aktywny tylko mObywatel.
const SPOSOBY = [
  { id: "mobywatel", nazwa: "mObywatel", opis: "Zaloguj się aplikacją w telefonie", ikona: "📱", aktywny: true },
  { id: "pz", nazwa: "Profil zaufany", opis: "Niedostępne w prototypie", ikona: "🛡️" },
  { id: "bank", nazwa: "Bankowość elektroniczna", opis: "Niedostępne w prototypie", ikona: "🏦" },
  { id: "edowod", nazwa: "e-Dowód", opis: "Niedostępne w prototypie", ikona: "🪪" },
];

export default function LoginGov() {
  const nawiguj = useNavigate();
  return (
    <div className="wrap page narrow">
      <KrokiLogowania aktywny={0} />
      <div className="sim-box">
        <p className="sim-tag">SYMULACJA LOGOWANIA</p>
        <h1>Wybierz sposób logowania</h1>
        <p className="lead">Po zalogowaniu przekażemy do przewodnika Twoje dane z mObywatela.</p>
        <div className="sposoby">
          {SPOSOBY.map((s) => (
            <button key={s.id} className="sposob" disabled={!s.aktywny} onClick={() => nawiguj("/przewodnik/mobywatel")}>
              <span className="sposob-ikona" aria-hidden="true">{s.ikona}</span>
              <span className="sposob-txt"><b>{s.nazwa}</b><small>{s.opis}</small></span>
              {s.aktywny && <span aria-hidden="true">›</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
