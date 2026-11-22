// Opcjonalna data (termin porodu / data urodzenia / data przyjęcia).
// Podaje ją sama osoba — nic nie pobieramy od lekarza. Trzymamy ją tylko w sesji przeglądarki.
import { useEffect, useRef, useState } from "react";
import { useSesja } from "../SesjaContext.jsx";
import { kluczowaData } from "../sytuacja.js";
import { dzisISO, fmtDzien } from "../terminy.js";
import Ikona from "../wniosek/Ikona.jsx";

export function useDataKluczowa() {
  const sesja = useSesja();
  const def = kluczowaData(sesja.etap || "ciaza");
  const data = def ? sesja[def.klucz] || null : null;
  return {
    def,
    data,
    ustawDate: (v) => def && sesja.ustaw({ [def.klucz]: v }),
    usunDate: () => def && sesja.ustaw({ [def.klucz]: null }),
  };
}

export function DataModal({ otwarty, onZamknij }) {
  const { def, data, ustawDate, usunDate } = useDataKluczowa();
  const [v, setV] = useState(data || "");
  const [blad, setBlad] = useState("");
  const pole = useRef(null);

  useEffect(() => {
    if (otwarty) {
      setV(data || "");
      setBlad("");
      setTimeout(() => pole.current?.focus(), 30);
    }
  }, [otwarty, data]);

  useEffect(() => {
    if (!otwarty) return;
    const esc = (e) => e.key === "Escape" && onZamknij();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [otwarty, onZamknij]);

  if (!otwarty || !def) return null;

  const zapisz = (e) => {
    e.preventDefault();
    if (!v) return setBlad("Wybierz datę.");
    const dzis = dzisISO();
    if (def.przyszla === true && v < dzis) return setBlad("Planowany termin porodu nie może być w przeszłości.");
    if (def.przyszla === false && v > dzis) return setBlad("Ta data nie może być z przyszłości.");
    ustawDate(v);
    onZamknij();
  };

  return (
    <div className="dk-tlo" onClick={onZamknij}>
      <form className="dk-okno" role="dialog" aria-modal="true" aria-labelledby="dk-tytul" onClick={(e) => e.stopPropagation()} onSubmit={zapisz}>
        <span className="dk-ikona"><Ikona n="kalendarz" rozmiar={26} /></span>
        <h2 id="dk-tytul">{def.etykieta}</h2>
        <p className="dk-opis">
          Dzięki tej dacie zamienimy terminy ustawowe na konkretne dni i policzymy, ile zostało do każdego wniosku.
        </p>
        <label htmlFor="dk-data" className="dk-etyk">{def.etykieta}</label>
        <input id="dk-data" ref={pole} type="date" value={v} onChange={(e) => { setV(e.target.value); setBlad(""); }}
          aria-invalid={!!blad || undefined} aria-describedby="dk-pomoc dk-blad" />
        <p id="dk-pomoc" className="dk-pomoc">{def.pomoc}</p>
        <p id="dk-blad" className="dk-blad" aria-live="polite">{blad}</p>
        <p className="dk-prywatnosc"><Ikona n="tarcza" rozmiar={16} /> To pole jest dobrowolne. Datę zapamiętujemy tylko do zamknięcia karty przeglądarki.</p>
        <div className="dk-przyciski">
          {data && (
            <button type="button" className="dk-btn dk-btn-tekst" onClick={() => { usunDate(); onZamknij(); }}>Usuń datę</button>
          )}
          <button type="button" className="dk-btn dk-btn-drugi" onClick={onZamknij}>Anuluj</button>
          <button type="submit" className="dk-btn dk-btn-glowny">Zapisz</button>
        </div>
      </form>
    </div>
  );
}

/** Pasek nad osią czasu: „liczymy od…” albo zachęta do dodania daty. */
export function PasekDaty({ onDodaj }) {
  const { def, data } = useDataKluczowa();
  if (!def) return null;
  return data ? (
    <div className="dk-pasek ok">
      <Ikona n="kalendarz" />
      <span>Liczymy od daty: <b>{fmtDzien(data)}</b> ({def.etykieta.toLowerCase()})</span>
      <button type="button" className="dk-link" onClick={onDodaj}>Zmień</button>
    </div>
  ) : (
    <div className="dk-pasek">
      <Ikona n="info" />
      <span>
        Nie znamy jeszcze daty, więc pokazujemy <b>terminy ustawowe</b>, np. „do 21 dni po porodzie”.
        Możesz dodać datę, żeby zobaczyć konkretne dni — to dobrowolne.
      </span>
      <button type="button" className="dk-btn dk-btn-glowny" onClick={onDodaj}>{def.dodaj}</button>
    </div>
  );
}
