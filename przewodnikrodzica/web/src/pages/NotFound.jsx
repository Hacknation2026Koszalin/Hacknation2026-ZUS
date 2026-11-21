import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="wrap page narrow">
      <h1>Nie znaleźliśmy tej strony</h1>
      <p className="lead">Sprawdź adres albo wróć na stronę główną.</p>
      <Link to="/" className="btn btn-primary">Strona główna</Link>
    </div>
  );
}
