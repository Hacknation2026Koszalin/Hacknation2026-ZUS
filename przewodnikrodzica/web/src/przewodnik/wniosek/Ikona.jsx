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
