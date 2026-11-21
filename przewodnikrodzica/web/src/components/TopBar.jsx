import { Link } from "react-router-dom";

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="wrap topbar-in">
        <nav aria-label="Na skróty" className="topbar-left">
          <Link to="/o-zus/kontakt">Kontakt</Link>
          <span aria-hidden="true">·</span>
          <span className="lang">
            <b aria-current="true">PL</b> <span>EN</span> <span>UA</span>
          </span>
          <span aria-hidden="true">·</span>
          <a href="#tresc" title="Informacje dla osób z niepełnosprawnościami">Dostępność</a>
        </nav>
        <div className="topbar-right">
          <Link to="/logowanie" className="btn btn-ghost-light">Zarejestruj w eZUS</Link>
          <Link to="/logowanie" className="btn btn-light">Zaloguj do eZUS</Link>
        </div>
      </div>
    </div>
  );
}
