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

app.Run();

record Aktualnosc(int Id, string Data, string Tytul, string Lead);
record ProfilMObywatel(string Imie, string Nazwisko, string Pesel, string DataUrodzenia, string Obywatelstwo, string Adres);
record Ubezpieczenie(string Tytul, string Od, string Chorobowe, bool OkresWyczekiwaniaSpelniony, string Platnik, bool PlatnikPowyzej20);
record EZla(string Od, string Do, string Kod);
record DaneZus(Ubezpieczenie Ubezpieczenie, decimal PodstawaWymiaru,
    [property: System.Text.Json.Serialization.JsonPropertyName("eZLA")] EZla[] EZLA, decimal Zadluzenie);
