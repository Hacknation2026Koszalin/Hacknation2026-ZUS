// KONIEC UMOWY O PRACĘ — opcjonalna data ustania stosunku pracy i co z niej wynika.
// Dane trzymamy tylko w sesji (jak termin porodu).
import { Link } from "react-router-dom";
import { dodajDni, fmtDzien } from "../terminy.js";
import Ikona from "../wniosek/Ikona.jsx";
import { P } from "../parametry.js";

export const POWODY_USTANIA = [
  { v: "okreslony", t: "Kończy się umowa na czas określony lub okres próbny" },
  { v: "upadlosc", t: "Upadłość, likwidacja lub śmierć pracodawcy" },
  { v: "inne", t: "Wypowiedzenie lub porozumienie stron" },
];

/** Co oznacza koniec umowy w tej sytuacji — lista [klasa, tekst, link?]. */
export function skutkiUstania({ ustanie, etap, terminPorodu }) {
  if (!ustanie?.data || !ustanie?.powod) return [];
  const wynik = [];
  const ciaza = etap === "ciaza";
  // Koniec 3. miesiąca ciąży ≈ 12 tygodni od początku (280 dni przed terminem)
  const koniec3mies = terminPorodu ? dodajDni(terminPorodu, -280 + 84) : null;

  if (ustanie.powod === "okreslony" && ciaza) {
    if (!koniec3mies || ustanie.data > koniec3mies)
      wynik.push(["ok", `Umowa na czas określony (lub okres próbny dłuższy niż miesiąc), która skończyłaby się po 3. miesiącu ciąży, przedłuża się do dnia porodu (art. 177 § 3 Kodeksu pracy). Zostajesz ubezpieczona — zasiłek macierzyński przysługuje.`]);
    else
      wynik.push(["uwaga", `Umowa kończy się przed końcem 3. miesiąca ciąży (ok. ${fmtDzien(koniec3mies)}), więc nie przedłuży się do porodu. Po ${fmtDzien(ustanie.data)} stracisz ubezpieczenie chorobowe.`]);
  }
  if (ustanie.powod === "upadlosc" && ciaza)
    wynik.push(["ok", "Od dnia po rozwiązaniu umowy do porodu możesz dostać zasiłek w wysokości zasiłku macierzyńskiego (wypłaca ZUS).", ["Złóż ZAS-55", "/przewodnik/wnioski/zas-55"]]);
  if (ustanie.powod === "inne" || (ustanie.powod === "okreslony" && !ciaza) || (ustanie.powod === "okreslony" && koniec3mies && ustanie.data <= koniec3mies)) {
    wynik.push(["uwaga", `Po ${fmtDzien(ustanie.data)} kończy się ubezpieczenie chorobowe z tej umowy.`]);
    wynik.push(["info", "Jeśli w dniu końca umowy jesteś na zwolnieniu i trwa ono dalej bez przerwy, możesz dostać zasiłek chorobowy po ustaniu ubezpieczenia — w ciąży bez limitu 91 dni."]);
    wynik.push(["info", `Bez ubezpieczenia po porodzie przysługuje świadczenie rodzicielskie z gminy (${P.swiadczenieRodzicielskie} zł miesięcznie przez rok).`, ["Zobacz świadczenia", "/przewodnik/swiadczenia#swiadczenie-rodzicielskie"]]);
  }
  return wynik;
}

export function KartaUmowy({ ustanie, etap, terminPorodu, onZmien }) {
  const skutki = skutkiUstania({ ustanie, etap, terminPorodu });
  if (!skutki.length) return null;
  return (
    <section className="um" aria-labelledby="um-tytul">
      <div className="wrap">
        <div className="um-karta">
          <div className="um-glowa">
            <span className="zl-ikona"><Ikona n="teczka" rozmiar={24} /></span>
            <div>
              <h2 id="um-tytul">Twoja umowa kończy się {fmtDzien(ustanie.data)}</h2>
              <p>{POWODY_USTANIA.find((p) => p.v === ustanie.powod)?.t}</p>
            </div>
            <button type="button" className="wn-link" onClick={onZmien}>Zmień</button>
          </div>
          <ul className="um-lista">
            {skutki.map(([klasa, tekst, link], i) => (
              <li key={i} className={klasa}>
                <Ikona n={klasa === "ok" ? "check" : klasa === "uwaga" ? "alert" : "info"} rozmiar={18} />
                <span>{tekst} {link && <Link to={link[1]}>{link[0]} →</Link>}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
