// =====================================================================
// Pomocnicze funkcje dat (terminy rodzica liczy plan.js).
// waga: "krytyczny" = nieprzekraczalny termin (po nim coś tracisz)
//       "szansa"    = od tego dnia możesz coś zrobić
//       "info"      = warto wiedzieć
// =====================================================================
const DZIEN = 86400000;
export const dzisISO = () => new Date().toISOString().slice(0, 10);
export const dodajDni = (iso, n) => new Date(new Date(iso).getTime() + n * DZIEN).toISOString().slice(0, 10);
export const dodajMiesiace = (iso, n) => {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.toISOString().slice(0, 10);
};
export const ileDni = (od, doDnia) => Math.round((new Date(doDnia) - new Date(od)) / DZIEN);
export const fmtDzien = (iso, opcje = { day: "numeric", month: "long", year: "numeric" }) =>
  new Date(iso).toLocaleDateString("pl-PL", opcje);

/** Tydzień ciąży liczony z planowanego terminu porodu (termin = 40. tydzień). */
export function tydzienCiazy(terminPorodu, dzis = dzisISO()) {
  const dni = 280 - ileDni(dzis, terminPorodu);
  return { tydzien: Math.floor(dni / 7), dzien: ((dni % 7) + 7) % 7, procent: Math.min(100, Math.max(0, (dni / 280) * 100)) };
}

export const opisZa = (za) =>
  za === 0 ? "dziś" : za === 1 ? "jutro" : za < 0 ? `${-za} dni temu` : za < 100 ? `za ${za} dni` : `za ${Math.round(za / 30.4)} mies.`;
