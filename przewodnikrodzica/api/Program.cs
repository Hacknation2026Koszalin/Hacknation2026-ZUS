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

app.Run();

record Aktualnosc(int Id, string Data, string Tytul, string Lead);
