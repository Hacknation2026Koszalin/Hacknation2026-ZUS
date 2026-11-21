import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  AKTUALNOSCI_ZAPAS,
  NAJCZESCIEJ,
  ZALATW,
} from "../data/nawigacja.js";

const IKONY_SPRAW = ["/padlock.svg", "/phone-call.svg", "/placeholder.svg", "/webcam.svg"];

// Zdjęcia do /public/zdjecia/. Gdy brak pliku, pokazuje się spokojne tło.
function Zdjecie({ src, alt = "", className = "", priorytet = false }) {
  const [blad, setBlad] = useState(false);
  if (blad) return <div className={`hp-photo hp-photo--brak ${className}`} />;
  return (
    <img
      className={`hp-photo ${className}`}
      src={src}
      alt={alt}
      loading={priorytet ? "eager" : "lazy"}
      fetchPriority={priorytet ? "high" : "auto"}
      onError={() => setBlad(true)}
    />
  );
}

// Ścieżki poza /przewodnik są przykładowe, podmień na własne.
const SYTUACJE = [
  { tytul: "Zostaję rodzicem", opis: "Urlopy i zasiłki", do: "/przewodnik" },
  { tytul: "Prowadzę firmę", opis: "Składki i rozliczenia", do: "/przedsiebiorca" },
  { tytul: "Choruję lub opiekuję się bliskim", opis: "Zwolnienia i zasiłki", do: "/choroba" },
  { tytul: "Myślę o emeryturze", opis: "Wiek, wysokość, wniosek", do: "/emerytura" },
];

// Żywy baner: każdy slajd to jedna konkretna sprawa z własnym zdjęciem.
const SLAJDY = [
  {
    krotko: "Rodzice",
    tag: "Nowy przewodnik",
    tytul: "Dziecko w drodze? Sprawdź, co Ci przysługuje.",
    opis: "Odpowiedz na kilka pytań, a ułożymy plan urlopów, zasiłków i dokumentów dla Ciebie i drugiego rodzica.",
    cta: "Zaplanuj formalności",
    do: "/przewodnik",
    foto: "/public/hero.jpg",
    alt: "Rodzice z noworodkiem",
  },
  {
    krotko: "Przedsiębiorcy",
    tag: "Dla firm",
    tytul: "Składki i deklaracje bez błędów, w jednym miejscu.",
    opis: "Sprawdź terminy, wysokość składek i przygotuj dokumenty w eZUS.",
    cta: "Zobacz, co załatwisz",
    do: "/przedsiebiorca",
    foto: "/public/hero.jpg",
    alt: "Właścicielka małej pracowni przy laptopie",
  },
  {
    krotko: "Emerytura",
    tag: "Emerytura",
    tytul: "Ile dostaniesz na emeryturze? Policz to sam.",
    opis: "Kalkulator pokaże orientacyjną wysokość świadczenia i najwcześniejszy termin przejścia.",
    cta: "Przejdź do kalkulatora",
    do: "/emerytura",
    foto: "/public/hero.jpg",
    alt: "Starsza para przy tablecie",
  },
];

const formatDaty = (iso) => {
  if (!iso) return "";
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
};

function Baner() {
  const [i, setI] = useState(0);
  const [pauza, setPauza] = useState(false);
  const [najazd, setNajazd] = useState(false);
  const stop = pauza || najazd;
  const nastepny = () => setI((x) => (x + 1) % SLAJDY.length);

  return (
    <section
      className={`hp-banner ${stop ? "is-paused" : ""}`}
      aria-roledescription="karuzela"
      aria-label="Wyróżnione sprawy"
      onMouseEnter={() => setNajazd(true)}
      onMouseLeave={() => setNajazd(false)}
      onFocus={() => setNajazd(true)}
      onBlur={() => setNajazd(false)}
    >
      <div className="hp-banner__stage" aria-live={stop ? "polite" : "off"}>
        {SLAJDY.map((s, idx) => (
          <div
            key={s.do}
            className={`hp-slide ${idx === i ? "is-active" : ""}`}
            aria-hidden={idx !== i}
            inert={idx !== i ? "" : undefined}
          >
            <Zdjecie className="hp-slide__photo" src={s.foto} alt={s.alt} />
            <div className="wrap hp-slide__layout">
              <div className="hp-slide__box">
                <p className="hp-slide__tag">{s.tag}</p>
                <h2>{s.tytul}</h2>
                <p className="hp-slide__text">{s.opis}</p>
                <Link to={s.do} className="hp-btn hp-btn--light">{s.cta}</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="wrap hp-banner__controls">
        <div className="hp-tabs" role="tablist">
          {SLAJDY.map((s, idx) => (
            <button
              key={s.do}
              role="tab"
              aria-selected={idx === i}
              className={`hp-tab ${idx === i ? "is-active" : ""}`}
              onClick={() => setI(idx)}
            >
              <span className="hp-tab__bar">
                {idx === i && <i key={i} onAnimationEnd={nastepny} />}
              </span>
              <span className="hp-tab__label">{s.krotko}</span>
            </button>
          ))}
        </div>
        <button
          className="hp-pause"
          aria-pressed={pauza}
          onClick={() => setPauza((p) => !p)}
        >
          {pauza ? "Wznów pokaz" : "Zatrzymaj pokaz"}
        </button>
      </div>
    </section>
  );
}

export default function Home() {
  const [aktualnosci, setAktualnosci] = useState(AKTUALNOSCI_ZAPAS);
  const [zrodlo, setZrodlo] = useState("zapas");

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const response = await fetch("/api/aktualnosci", { signal: controller.signal });
        if (!response.ok) throw new Error("Błąd pobierania aktualności");
        const dane = await response.json();
        if (!Array.isArray(dane)) throw new Error("Nieprawidłowe dane API");
        setAktualnosci(dane);
        setZrodlo("api");
      } catch (error) {
        if (error.name === "AbortError") return;
        setAktualnosci(AKTUALNOSCI_ZAPAS);
        setZrodlo("zapas");
      }
    })();
    return () => controller.abort();
  }, []);

  return (
    <main className="hp">
      
<section className="hp-hero" aria-labelledby="hp-hero-title">
  <div className="wrap hp-hero__layout">

    {/* LEWA STRONA */}
    <div className="hp-hero__panel">

      <div className="hp-hero__eyebrow">
        <span className="hp-hero__dot" aria-hidden="true" />
        ZUS bliżej Ciebie
      </div>

      <h1 id="hp-hero-title">
        Co się zmienia
        <br />
        w Twoim <span>życiu?</span>
      </h1>

      <p className="hp-hero__lead">
        Każdy etap życia przynosi nowe możliwości i pytania.
        Wybierz swoją sytuację, a pomożemy Ci znaleźć
        właściwe świadczenia i formalności.
      </p>

      <div className="hp-hero__situations-heading">
        Wybierz, co Cię dotyczy
      </div>

      <ul className="hp-situations">
        {SYTUACJE.map((s) => (
          <li key={s.do}>
            <Link to={s.do} className="hp-situation">

              <span className="hp-situation__content">
                <span className="hp-situation__title">
                  {s.tytul}
                </span>

                <span className="hp-situation__desc">
                  {s.opis}
                </span>
              </span>

              <span
                className="hp-situation__arrow"
                aria-hidden="true"
              >
                ↗
              </span>

            </Link>
          </li>
        ))}
      </ul>

      <div className="hp-hero__actions">
        <Link
          to="/logowanie"
          className="hp-btn hp-btn--primary"
        >
          Zaloguj się do eZUS
          <span aria-hidden="true">→</span>
        </Link>

        <Link
          to="/wzory-formularzy/najpopularniejsze"
          className="hp-btn hp-btn--link"
        >
          Wzory formularzy
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

    </div>

    {/* PRAWA STRONA — ZDJĘCIE */}
    <div className="hp-hero__visual">

      <div className="hp-hero__image-shape">
        <Zdjecie
          className="hp-hero__photo"
          src="/public/hero.jpg"
          alt="Rodzina spędzająca wspólnie czas w domu"
          priorytet
        />
      </div>

      <div
        className="hp-hero__organic-line"
        aria-hidden="true"
      />

    </div>

  </div>
</section>


      <Baner />

      <section className="hp-services" aria-labelledby="hp-services-title">
        <div className="wrap">
          <div className="hp-head">
            <h2 id="hp-services-title" className="hp-h2">Załatw sprawę online</h2>
            <p>Najczęstsze formalności, które zrobisz bez wychodzenia z domu.</p>
          </div>
          <ul className="hp-services__list">
            {ZALATW.map((usluga, index) => (
              <li key={`${usluga.do}-${index}`}>
                <Link to={usluga.do} className="hp-service">
                  <span className="hp-service__icon">
                    {IKONY_SPRAW[index] && <img src={IKONY_SPRAW[index]} alt="" />}
                  </span>
                  <h3>{usluga.tytul}</h3>
                  <p>{usluga.opis}</p>
                  <span className="hp-chevron" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hp-popular" aria-labelledby="hp-popular-title">
        <div className="wrap hp-popular__layout">
          <div>
            <h2 id="hp-popular-title" className="hp-h2">Najczęściej szukane</h2>
            <p className="hp-popular__lead">Tematy, do których wraca najwięcej osób.</p>
          </div>
          <ul className="hp-popular__items">
            {NAJCZESCIEJ.map((pozycja, index) => (
              <li key={`${pozycja.do}-${index}`}>
                <Link to={pozycja.do} className="hp-popular__item">
                  <span>
                    <h3>{pozycja.tytul}</h3>
                    <p>{pozycja.opis}</p>
                  </span>
                  <span className="hp-chevron" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hp-news" aria-labelledby="hp-news-title">
        <div className="wrap">
          <div className="hp-news__heading">
            <h2 id="hp-news-title" className="hp-h2">Aktualności</h2>
            {zrodlo !== "api" && <span className="hp-news__source">Przykładowe aktualności</span>}
          </div>
          {aktualnosci.length > 0 ? (
            <div className="hp-news__grid">
              {aktualnosci.map((news, index) => (
                <article
                  key={news.id ?? index}
                  className={`hp-news__item ${index === 0 ? "hp-news__item--first" : ""}`}
                >
                  <time dateTime={news.data}>{formatDaty(news.data)}</time>
                  <h3>{news.tytul}</h3>
                  <p>{news.lead}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="hp-news__empty">Brak aktualności do wyświetlenia.</p>
          )}
        </div>
      </section>
    </main>
  );
}