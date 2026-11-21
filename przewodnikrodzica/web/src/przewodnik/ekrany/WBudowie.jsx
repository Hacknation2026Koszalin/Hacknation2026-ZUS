// Tymczasowa strona dla zakładek, które dopiero zbudujecie
export default function WBudowie({ tytul }) {
  return (
    <div className="wrap page">
      <h1>{tytul}</h1>
      <div className="placeholder"><p>Ta zakładka jest w budowie — zawartość opisuje plan podstron.</p></div>
    </div>
  );
}
