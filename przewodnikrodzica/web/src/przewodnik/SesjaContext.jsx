import { createContext, useContext, useEffect, useState } from "react";

// Stan zalogowania w przewodniku. Trzymamy go w sessionStorage (znika po zamknięciu karty).
const KLUCZ = "przewodnik-sesja";
const Sesja = createContext(null);

const wczytaj = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KLUCZ)) || {};
  } catch {
    return {};
  }
};

export function SesjaProvider({ children }) {
  const [stan, setStan] = useState(wczytaj);
  const [przewodnikOtwarty, setPrzewodnikOtwarty] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(KLUCZ, JSON.stringify(stan));
    } catch {
      /* tryb prywatny itp. — działamy bez zapisu */
    }
  }, [stan]);

  const ustaw = (zmiany) => setStan((s) => ({ ...s, ...zmiany }));
  const wyloguj = () => setStan({});

  return (
    <Sesja.Provider value={{ ...stan, ustaw, wyloguj, przewodnikOtwarty, setPrzewodnikOtwarty }}>
      {children}
    </Sesja.Provider>
  );
}

export const useSesja = () => useContext(Sesja);
