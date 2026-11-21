import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Counter from './pages/Counter';
import Weather from './pages/Weather';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="counter" element={<Counter />} />
          <Route path="weather" element={<Weather />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}