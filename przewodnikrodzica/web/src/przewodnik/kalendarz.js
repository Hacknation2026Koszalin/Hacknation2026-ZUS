// Dodawanie terminów do kalendarza: plik .ics (Google, Apple, Outlook) albo link do Kalendarza Google.
// Wydarzenia są całodniowe, z przypomnieniem na 3 dni przed terminem.

const bezMyslnikow = (iso) => iso.replaceAll("-", "");
const nastepnyDzien = (iso) => {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};
const ucieknij = (t = "") => t.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");

// zadania: [{ id, t, termin, nazwaWniosku? }]
export function plikIcs(zadania) {
  const teraz = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const zdarzenia = zadania.filter((z) => z.termin).map((z) => [
    "BEGIN:VEVENT",
    `UID:${z.id}-${z.termin}@przewodnik-rodzica`,
    `DTSTAMP:${teraz}`,
    `DTSTART;VALUE=DATE:${bezMyslnikow(z.termin)}`,
    `DTEND;VALUE=DATE:${bezMyslnikow(nastepnyDzien(z.termin))}`,
    `SUMMARY:${ucieknij(`Ostatni dzień: ${z.t}`)}`,
    `DESCRIPTION:${ucieknij("Przypomnienie z Przewodnika młodego rodzica (prototyp). Szczegóły: Moja ścieżka.")}`,
    "BEGIN:VALARM",
    "TRIGGER:-P3D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${ucieknij(`Za 3 dni mija termin: ${z.t}`)}`,
    "END:VALARM",
    "END:VEVENT",
  ].join("\r\n"));
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Przewodnik mlodego rodzica//PL", "CALSCALE:GREGORIAN", ...zdarzenia, "END:VCALENDAR"].join("\r\n");
}

export function pobierzIcs(zadania, nazwa = "terminy-rodzica.ics") {
  const blob = new Blob([plikIcs(zadania)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nazwa;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function linkGoogle(z) {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: `Ostatni dzień: ${z.t}`,
    dates: `${bezMyslnikow(z.termin)}/${bezMyslnikow(nastepnyDzien(z.termin))}`,
    details: "Przypomnienie z Przewodnika młodego rodzica (prototyp).",
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}
