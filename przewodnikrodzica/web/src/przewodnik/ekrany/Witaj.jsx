import { Navigate, useNavigate } from "react-router-dom";
import { useSesja } from "../SesjaContext.jsx";
import PrzewodnikPowitalny from "../komponenty/PrzewodnikPowitalny.jsx";

// Krok 5: przewodnik powitalny po pierwszym zalogowaniu, potem pulpit
export default function Witaj() {
  const nawiguj = useNavigate();
  const { zalogowany } = useSesja();
  if (!zalogowany) return <Navigate to="/przewodnik" replace />;
  return (
    <div className="wrap page">
      <PrzewodnikPowitalny onZamknij={() => nawiguj("/przewodnik/pulpit", { state: { zPrzewodnika: true } })} />
    </div>
  );
}
