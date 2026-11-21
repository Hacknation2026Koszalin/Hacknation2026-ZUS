var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));
app.MapGet("/api/hello", () => new { message = "Hello from .NET" });

// Aktualności na stronę główną wydmuszki (frontend: GET /api/aktualnosci)
app.MapGet("/api/aktualnosci", () => new[]
{
    new Aktualnosc(1, "2026-11-21", "Nowy Przewodnik młodego rodzica",
        "Sprawdź, jakie świadczenia Ci przysługują w ciąży i po porodzie."),
    new Aktualnosc(2, "2026-10-24", "Zmiany we wnioskach o zasiłek macierzyński",
        "Wnioski ZUR i ZAO połączono z wnioskiem ZAM."),
    new Aktualnosc(3, "2026-10-01", "Zarezerwuj wizytę w placówce",
        "Przyjdź na wybraną godzinę bez czekania w kolejce."),
});

// ===== SYMULACJE (dane zmyślone; PESEL ma celowo błędną cyfrę kontrolną) =====

// Dane, które "przekazuje mObywatel" po zalogowaniu
app.MapGet("/api/symulacja/mobywatel", () => new ProfilMObywatel(
    "Anna", "Testowa", "92071512345", "1992-07-15", "polskie",
    "ul. Przykładowa 12/3, 85-001 Bydgoszcz"));

// Dane, które "zwraca ZUS" dla danego PESEL
app.MapGet("/api/symulacja/zus/{pesel}", (string pesel) => new DaneZus(
    new Ubezpieczenie("umowa o pracę", "2021-03-01", "obowiązkowe", true,
        "Przykładowa Firma sp. z o.o.", true),
    6904.70m,
    new[] { new EZla("2026-08-04", "2026-08-31", "B"), new EZla("2026-09-01", "2026-09-28", "B") },
    0m));

// Karta ciąży "pobrana od ginekologa" (symulacja). Zwracamy dowolny JSON w tym samym kształcie co KARTA_CIAZY we frontendzie.
app.MapGet("/api/symulacja/karta-ciazy/{pesel}", (string pesel) => new
{
    zrodlo = new { placowka = "Przychodnia Przykładowa, Bydgoszcz", lekarz = "lek. Maria Przykładowa", pobrano = "2026-11-18" },
    ostatniaMiesiaczka = "2026-04-13",
    terminPorodu = "2027-01-18",
    liczbaDzieci = 1,
    plec = "dziewczynka",
    grupaKrwi = "A Rh+",
    ktoraCiaza = 1,
    ktoryPorod = 1,
    pomiary = new { data = "2026-11-18", tydzien = "31+2", masaCiala = "68,4 kg", cisnienie = "115/75 mmHg", masaPlodu = "ok. 1 750 g", tetnoPlodu = "142 / min" },
    wizyty = new[]
    {
        new { data = "2026-06-08", tydzien = "8+0", opis = "Potwierdzenie ciąży, pierwsze USG" },
        new { data = "2026-06-29", tydzien = "11+0", opis = "USG I trymestru — wynik prawidłowy" },
        new { data = "2026-08-24", tydzien = "19+0", opis = "USG połówkowe — rozwój prawidłowy" },
        new { data = "2026-10-05", tydzien = "25+0", opis = "Test obciążenia glukozą — w normie" },
        new { data = "2026-11-18", tydzien = "31+2", opis = "USG III trymestru — dziecko rośnie prawidłowo" },
    },
    badania = new[]
    {
        new { nazwa = "Morfologia krwi", wynik = "w normie", stan = "ok" },
        new { nazwa = "Test obciążenia glukozą (OGTT)", wynik = "w normie", stan = "ok" },
        new { nazwa = "Wymaz GBS", wynik = "zaplanuj między 35. a 37. tygodniem", stan = "plan" },
    },
    nastepnaWizyta = "2026-12-02",
});

// ===== WNIOSKI (trzymane w pamięci — znikają po restarcie backendu) =====
var wnioski = new System.Collections.Concurrent.ConcurrentDictionary<string, Wniosek>();
string Teraz() => DateTime.UtcNow.ToString("o");

// Lista wszystkich wniosków (widok urzędnika i "Moje sprawy")
app.MapGet("/api/wnioski", () => wnioski.Values.OrderByDescending(w => w.Zlozono));

app.MapGet("/api/wnioski/{numer}", (string numer) =>
    wnioski.TryGetValue(numer, out var w) ? Results.Ok(w) : Results.NotFound());

// Wysłanie wniosku. Bez numeru = nowy; z numerem = poprawiony po prośbie urzędnika.
app.MapPost("/api/wnioski", (Wniosek w) =>
{
    var poprawa = !string.IsNullOrEmpty(w.Numer) && wnioski.ContainsKey(w.Numer!);
    var numer = poprawa ? w.Numer! : $"ZAM-{DateTime.Now.Year}-{Random.Shared.Next(100000, 999999)}";
    var historia = poprawa ? new List<Zdarzenie>(wnioski[numer].Historia ?? new()) : new List<Zdarzenie>();
    historia.Add(new Zdarzenie(Teraz(), "u_urzednika", poprawa ? "Wniosek poprawiony i wysłany ponownie" : "Wniosek wysłany"));
    var zapis = w with
    {
        Numer = numer,
        Status = "u_urzednika",
        Komentarz = null,
        DoPoprawy = new List<string>(),
        Zlozono = poprawa ? wnioski[numer].Zlozono : Teraz(),
        Historia = historia,
    };
    wnioski[numer] = zapis;
    return Results.Ok(zapis);
});

// Urzędnik zmienia status: "przyjety" albo "do_uzupelnienia"
app.MapPatch("/api/wnioski/{numer}/status", (string numer, ZmianaStatusu z) =>
{
    if (!wnioski.TryGetValue(numer, out var w)) return Results.NotFound();
    var opis = z.Status == "przyjety" ? "Wniosek przyjęty do realizacji" : "Urzędnik prosi o uzupełnienie";
    var historia = new List<Zdarzenie>(w.Historia ?? new()) { new Zdarzenie(Teraz(), z.Status, opis) };
    var zapis = w with { Status = z.Status, Komentarz = z.Komentarz, DoPoprawy = z.DoPoprawy ?? new(), Historia = historia };
    wnioski[numer] = zapis;
    return Results.Ok(zapis);
});

app.Run();

record Aktualnosc(int Id, string Data, string Tytul, string Lead);
record ProfilMObywatel(string Imie, string Nazwisko, string Pesel, string DataUrodzenia, string Obywatelstwo, string Adres);
record Ubezpieczenie(string Tytul, string Od, string Chorobowe, bool OkresWyczekiwaniaSpelniony, string Platnik, bool PlatnikPowyzej20);
record EZla(string Od, string Do, string Kod);
record DaneZus(Ubezpieczenie Ubezpieczenie, decimal PodstawaWymiaru,
    [property: System.Text.Json.Serialization.JsonPropertyName("eZLA")] EZla[] EZLA, decimal Zadluzenie);

record Osoba(string Imie, string Nazwisko, string Pesel);
record Zdarzenie(string Data, string Status, string Opis);
// "Dane" i "Kontekst" zostawiamy jako dowolny JSON — formularz definiuje frontend.
record Wniosek(string? Numer, string Typ, string Nazwa, Osoba Osoba,
    System.Text.Json.JsonElement Dane, System.Text.Json.JsonElement? Kontekst,
    string? Status, string? Komentarz, List<string>? DoPoprawy, string? Zlozono, List<Zdarzenie>? Historia);
record ZmianaStatusu(string Status, string? Komentarz, List<string>? DoPoprawy);
