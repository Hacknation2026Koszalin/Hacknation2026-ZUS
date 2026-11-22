// Pasek postępu logowania: 4 kroki
const KROKI = ["Wybór logowania", "mObywatel", "Zgoda", "Dane z ZUS"];

export default function KrokiLogowania({ aktywny }) {
  return (
    <ol className="kroki" aria-label="Postęp logowania">
      {KROKI.map((k, i) => (
        <li key={k} className={i < aktywny ? "done" : i === aktywny ? "now" : ""} aria-current={i === aktywny ? "step" : undefined}>
          <span className="kroki-nr">{i < aktywny ? "✓" : i + 1}</span>
          <span className="kroki-txt">{k}</span>
        </li>
      ))}
    </ol>
  );
}
