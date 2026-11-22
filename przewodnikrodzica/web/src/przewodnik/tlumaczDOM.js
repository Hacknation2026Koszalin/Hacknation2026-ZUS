// =====================================================================
// TŁUMACZ STRONY: po wybraniu EN/UK podmienia na ekranie polskie teksty
// ze słownika (tlumaczenia.js) — także te, które nie przechodzą przez t().
// Działa jak tłumacz przeglądarki, ale na naszym słowniku: zmienia tylko
// treść węzłów tekstowych i atrybuty placeholder / aria-label / title,
// więc nie psuje Reacta. Przy powrocie do PL przywraca oryginały.
// =====================================================================
import { SLOWNIK_DOM, WZORCE } from "./tlumaczenia.js";

const ATRYBUTY = ["placeholder", "aria-label", "title"];
const POMIN = "script, style, textarea, code, pre, .wn-mono, [data-bez-tlumaczenia], [contenteditable]";
const oryginal = new WeakMap(); // węzeł → tekst PL
const ostatni = new WeakMap(); // węzeł → to, co ostatnio wpisaliśmy
const oryginalAttr = new WeakMap(); // element → { atrybut: PL }
let jezyk = "pl";
let obserwator = null;

function przetlumacz(pl, j) {
  const goly = pl.trim();
  if (!goly || !/[a-ząćęłńóśźż]/i.test(goly)) return null;
  const wpis = SLOWNIK_DOM[goly];
  let cel = wpis?.[j];
  if (!cel) {
    for (const [re, f] of WZORCE) {
      const m = goly.match(re);
      if (m) { cel = f(m, j, (x) => SLOWNIK_DOM[x]?.[j]); break; }
    }
  }
  if (!cel) return null;
  // zachowaj spacje na brzegach (np. „Zwolnienie od ” + data)
  const lewo = pl.match(/^\s*/)[0];
  const prawo = pl.match(/\s*$/)[0];
  return lewo + cel + prawo;
}

function wezelTekstu(n) {
  const rodzic = n.parentElement;
  if (!rodzic || rodzic.closest(POMIN)) return;
  const akt = n.nodeValue;
  if (ostatni.get(n) !== akt) oryginal.set(n, akt); // React (albo ktoś) zmienił tekst — to nowy oryginał
  const pl = oryginal.get(n) ?? akt;
  const cel = jezyk === "pl" ? pl : przetlumacz(pl, jezyk) ?? pl;
  ostatni.set(n, cel);
  if (cel !== akt) n.nodeValue = cel;
}

function atrybuty(el) {
  if (el.closest(POMIN)) return;
  let zap = oryginalAttr.get(el);
  for (const a of ATRYBUTY) {
    const v = el.getAttribute(a);
    if (v == null) continue;
    if (!zap) { zap = {}; oryginalAttr.set(el, zap); }
    if (zap[`_${a}`] !== v) zap[a] = v; // nowa wartość z Reacta
    const pl = zap[a];
    const cel = jezyk === "pl" ? pl : przetlumacz(pl, jezyk) ?? pl;
    zap[`_${a}`] = cel;
    if (cel !== v) el.setAttribute(a, cel);
  }
}

function przejdz(korzen) {
  if (korzen.nodeType === 3) { wezelTekstu(korzen); return; }
  if (korzen.nodeType !== 1) return;
  atrybuty(korzen);
  const w = document.createTreeWalker(korzen, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let n;
  while ((n = w.nextNode())) n.nodeType === 3 ? wezelTekstu(n) : atrybuty(n);
}

export function ustawJezykStrony(j) {
  jezyk = j;
  if (typeof document === "undefined") return;
  const start = () => {
    przejdz(document.body);
    if (!obserwator) {
      obserwator = new MutationObserver((lista) => {
        for (const m of lista) {
          if (m.type === "characterData") wezelTekstu(m.target);
          else if (m.type === "attributes") atrybuty(m.target);
          else m.addedNodes.forEach(przejdz);
        }
      });
      obserwator.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATRYBUTY });
    }
  };
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start, { once: true });
}
