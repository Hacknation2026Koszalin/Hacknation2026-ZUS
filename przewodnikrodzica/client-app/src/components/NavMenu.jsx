import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './NavMenu.css';

export default function NavMenu() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      <div className="top-row ps-3 navbar navbar-dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            przewodnikrodzica
          </NavLink>
          <button
            title="Navigation menu"
            className="navbar-toggler"
            onClick={() => setCollapsed(!collapsed)}
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>
      </div>

      <div
        className={`${collapsed ? 'collapse' : ''} nav-scrollable`}
        onClick={() => setCollapsed(true)}
      >
        <nav className="flex-column">
          <div className="nav-item px-3">
            <NavLink className="nav-link" to="/" end>
              Home
            </NavLink>
          </div>
          <div className="nav-item px-3">
            <NavLink className="nav-link" to="/counter">
              Counter
            </NavLink>
          </div>
          <div className="nav-item px-3">
            <NavLink className="nav-link" to="/weather">
              Weather
            </NavLink>
          </div>
        </nav>
      </div>
    </>
  );
}