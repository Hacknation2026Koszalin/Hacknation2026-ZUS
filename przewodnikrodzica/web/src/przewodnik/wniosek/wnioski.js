// =====================================================================
// Zapisywanie i pobieranie wniosków
// Najpierw próbujemy backendu .NET (/api/wnioski). Jeśli nie działa,
// zapisujemy w przeglądarce (localStorage), żeby demo zawsze działało.
// Dzięki localStorage widok urzędnika w drugiej karcie widzi ten sam wniosek.
// =====================================================================
const KLUCZ = "przewodnik-wnioski";

const wczytaj = () => {
  try {
    return JSON.parse(localStorage.getItem(KLUCZ)) || [];
  } catch {
    return [];
  }
};
const zapisz = (lista) => {
  try {
    localStorage.setItem(KLUCZ, JSON.stringify(lista));
  } catch {
    /* brak dostępu do pamięci przeglądarki — trudno */
  }
};
const wstaw = (wniosek) => {
  const lista = wczytaj().filter((w) => w.numer !== wniosek.numer);
  zapisz([wniosek, ...lista]);
  return wniosek;
};

const teraz = () => new Date().toISOString();
const nowyNumer = () => `ZAM-${new Date().getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000))}`;

async function api(sciezka, opcje) {
  const r = await fetch(sciezka, {
    headers: { "Content-Type": "application/json" },
    ...opcje,
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

/** Wysyła nowy wniosek albo poprawiony (gdy ma już numer). */
export async function wyslijWniosek(wniosek) {
  try {
    return wstaw(await api("/api/wnioski", { method: "POST", body: JSON.stringify(wniosek) }));
  } catch {
    const poprzedni = wczytaj().find((w) => w.numer === wniosek.numer);
    return wstaw({
      ...wniosek,
      numer: wniosek.numer || nowyNumer(),
      status: "u_urzednika",
      komentarz: null,
      doPoprawy: [],
      zlozono: poprzedni?.zlozono || teraz(),
      historia: [
        ...(poprzedni?.historia || []),
        { data: teraz(), status: "u_urzednika", opis: poprzedni ? "Wniosek poprawiony i wysłany ponownie" : "Wniosek wysłany" },
      ],
    });
  }
}

export async function pobierzWnioski() {
  try {
    const lista = await api("/api/wnioski");
    lista.forEach(wstaw);
    return lista;
  } catch {
    return wczytaj();
  }
}

/** Urzędnik zmienia status: "przyjety" albo "do_uzupelnienia" (z komentarzem i listą pól). */
export async function zmienStatus(numer, status, { komentarz = null, doPoprawy = [] } = {}) {
  try {
    return wstaw(
      await api(`/api/wnioski/${encodeURIComponent(numer)}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, komentarz, doPoprawy }),
      }),
    );
  } catch {
    const w = wczytaj().find((x) => x.numer === numer);
    if (!w) return null;
    const opis = status === "przyjety" ? "Wniosek przyjęty do realizacji" : "Urzędnik prosi o uzupełnienie";
    return wstaw({ ...w, status, komentarz, doPoprawy, historia: [...(w.historia || []), { data: teraz(), status, opis }] });
  }
}

export const STATUSY = {
  u_urzednika: { tekst: "U urzędnika", klasa: "info" },
  przyjety: { tekst: "Przyjęty do realizacji", klasa: "ok" },
  do_uzupelnienia: { tekst: "Do uzupełnienia", klasa: "uwaga" },
};
