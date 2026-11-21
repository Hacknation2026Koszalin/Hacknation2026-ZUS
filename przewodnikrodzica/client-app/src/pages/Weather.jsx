// src/pages/Weather.jsx
import { useEffect, useState } from 'react';

export default function Weather() {
  const [forecasts, setForecasts] = useState(null);

  useEffect(() => {
    fetch('https://localhost:7001/api/weather') // podmień port na ten z launchSettings.json
      .then((res) => res.json())
      .then((data) => setForecasts(data))
      .catch((err) => console.error('Błąd pobierania danych:', err));
  }, []);

  return (
    <>
      <h1>Weather</h1>
      <p>This component demonstrates showing data from the .NET API.</p>

      {!forecasts ? (
        <p><em>Loading...</em></p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Temp. (C)</th>
              <th>Temp. (F)</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((f) => (
              <tr key={f.date}>
                <td>{f.date}</td>
                <td>{f.temperatureC}</td>
                <td>{f.temperatureF}</td>
                <td>{f.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}