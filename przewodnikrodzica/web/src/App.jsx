import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Podstrona from "./pages/Podstrona.jsx";
import Logowanie from "./pages/Logowanie.jsx";
import Szukaj from "./pages/Szukaj.jsx";
import NotFound from "./pages/NotFound.jsx";
import PrzewodnikApp from "./przewodnik/PrzewodnikApp.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        {/* Nasz moduł: logowanie mObywatel -> przewodnik powitalny -> pulpit */}
        <Route path="/przewodnik/*" element={<PrzewodnikApp />} />
        <Route path="/logowanie" element={<Logowanie />} />
        <Route path="/szukaj" element={<Szukaj />} />
        <Route path="/:sekcja/:pozycja" element={<Podstrona />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
