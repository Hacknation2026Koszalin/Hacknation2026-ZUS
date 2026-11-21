// Proste ikony liniowe (bez dodatkowych bibliotek). Użycie: <Ikona n="check" />
const SCIEZKI = {
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  alert: (
    <>
      <path d="M12 3.5l9.5 16.5h-19z" />
      <path d="M12 10v4.5M12 17.5v.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.5v.01" />
    </>
  ),
  ban: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M6 18L18 6" />
    </>
  ),
  plik: (
    <>
      <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
      <path d="M14 3v5h5" />
    </>
  ),
  strzalka: <path d="M5 12h14M13 6l6 6-6 6" />,
  wstecz: <path d="M19 12H5M11 6l-6 6 6 6" />,
  olowek: <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
  zegar: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  urzad: <path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" />,
  pdf: (
    <>
      <path d="M12 4v11M7 10l5 5 5-5" />
      <path d="M5 20h14" />
    </>
  ),
  dokument: (
    <>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M10 12h6M10 16h6" />
    </>
  ),
  kalendarz: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  kalkulator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
    </>
  ),
  serce: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  poczta: (
    <>
      <path d="M4 13l2.5-7h11L20 13v6H4z" />
      <path d="M4 13h5l1 2h4l1-2h5" />
    </>
  ),
  dzwonek: (
    <>
      <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  oko: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  tarcza: <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" />,
  odswiez: <path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" />,
  wozek: (
    <>
      <path d="M12 3v8h9a9 9 0 0 0-9-8z" />
      <path d="M3 11h18a6 6 0 0 1-6 5H9a6 6 0 0 1-6-5z" />
      <circle cx="7" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
    </>
  ),
  drukarka: (
    <>
      <path d="M7 9V3h10v6M7 17H4v-7h16v7h-3" />
      <rect x="7" y="14" width="10" height="7" />
    </>
  ),
};

export default function Ikona({ n, rozmiar = 20, className = "" }) {
  return (
    <svg
      className={`ikona ${className}`}
      width={rozmiar}
      height={rozmiar}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {SCIEZKI[n]}
    </svg>
  );
}
