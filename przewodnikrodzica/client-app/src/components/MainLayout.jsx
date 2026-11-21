import { Outlet } from 'react-router-dom';
import NavMenu from './NavMenu';
import './MainLayout.css';

export default function MainLayout() {
  return (
    <div className="page">
      <div className="sidebar">
        <NavMenu />
      </div>

      <main>
        <div className="top-row px-4">
          <a href="https://learn.microsoft.com/aspnet/core/" target="_blank" rel="noreferrer">
            About
          </a>
        </div>

        <article className="content px-4">
          <Outlet />
        </article>
      </main>
    </div>
  );
}