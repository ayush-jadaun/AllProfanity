/**
 * Head-to-head comparison: allprofanity vs popular npm profanity filters.
 *
 * Measures detection accuracy on a 20-case evasion battery, false positives
 * on 15 clean-text traps, and per-call performance on short and large inputs.
 *
 * Usage:
 *   npm install --no-save leo-profanity bad-words obscenity @2toad/profanity
 *   npm run build
 *   node benchmark/compare-libraries.mjs
 */
import { AllProfanity } from "../dist/index.js";
import leo from "leo-profanity";
import { Filter as BadWordsFilter } from "bad-words";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";
import { profanity as twoToad } from "@2toad/profanity";

// --- adapters: name -> check(text): boolean ---
const badWords = new BadWordsFilter();
const obscenityMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

const ap = new AllProfanity({ silent: true });
const apHybrid = new AllProfanity({
  algorithm: { matching: "hybrid" },
  ahoCorasick: { prebuild: true },
  silent: true,
});

const libs = {
  "allprofanity(trie)": (t) => ap.check(t),
  "allprofanity(hyb)": (t) => apHybrid.check(t),
  "leo-profanity": (t) => leo.check(t),
  "bad-words": (t) => {
    try {
      return badWords.isProfane(t);
    } catch {
      return "ERR";
    }
  },
  obscenity: (t) => obscenityMatcher.hasMatch(t),
  "@2toad": (t) => twoToad.exists(t),
};

// --- detection battery ---
const profaneCases = [
  ["plain", "fuck"],
  ["plain sentence", "this is fucking ridiculous"],
  ["plain bitch", "you are a bitch"],
  ["plain shit", "what a shit day"],
  ["plain asshole", "total asshole move"],
  ["leet #", "what the f#ck"],
  ["leet 1", "this is sh1t"],
  ["leet 55", "you a55hole"],
  ["leet !", "b!tch please"],
  ["leet @", "b@stard alert"],
  ["leet mixed", "fvck u"],
  ["repeat letters", "fuuuuck this"],
  ["spaced out", "f u c k you"],
  ["dotted", "f.u.c.k"],
  ["star mask", "f*ck off"],
  ["case", "FuCk YoU"],
  ["hindi roman", "tum chutiya ho"],
  ["hindi devanagari", "यह भोसड़ी वाला"],
  ["fullwidth", "ｆｕｃｋ"],
  ["homoglyph", "fυck this"],
];

const cleanCases = [
  ["scunthorpe", "I live in Scunthorpe"],
  ["classic", "a classic movie"],
  ["assassin", "the assassin waited"],
  ["bass", "bass guitar lessons"],
  ["grass", "touch grass sometimes"],
  ["class", "my class starts at 5"],
  ["analysis", "data analysis report"],
  ["cocktail", "a cocktail bar downtown"],
  ["therapist", "my therapist said hi"],
  ["dickens", "Charles Dickens novels"],
  ["cumulative", "cumulative totals rise"],
  ["numbers", "I have 100 dollars and 50 cents"],
  ["shiitake", "shiitake mushrooms taste good"],
  ["hello", "hello there friend"],
  ["saturday", "see you Saturday at six"],
];

const pad = (s, n) => String(s).padEnd(n);
const names = Object.keys(libs);

console.log("=== DETECTION (want true) ===");
console.log(pad("case", 20) + names.map((n) => pad(n, 19)).join(""));
const score = Object.fromEntries(names.map((n) => [n, { tp: 0, fp: 0 }]));
for (const [label, text] of profaneCases) {
  const row = names.map((n) => {
    const r = libs[n](text);
    if (r === true) score[n].tp++;
    return pad(r === true ? "HIT" : r === "ERR" ? "ERR" : ".", 19);
  });
  console.log(pad(label, 20) + row.join(""));
}

console.log("\n=== FALSE POSITIVES (want false) ===");
console.log(pad("case", 20) + names.map((n) => pad(n, 19)).join(""));
for (const [label, text] of cleanCases) {
  const row = names.map((n) => {
    const r = libs[n](text);
    if (r === true) score[n].fp++;
    return pad(r === true ? "FP!" : r === "ERR" ? "ERR" : "ok", 19);
  });
  console.log(pad(label, 20) + row.join(""));
}

console.log("\n=== SCORE ===");
for (const n of names) {
  console.log(
    `${pad(n, 20)} caught ${score[n].tp}/${profaneCases.length} profane, ${score[n].fp}/${cleanCases.length} false positives`
  );
}

// --- performance ---
const mkText = (words, profaneEvery) => {
  const clean =
    "the quick brown fox jumps over a lazy dog near riverbank today".split(" ");
  const out = [];
  for (let i = 0; i < words; i++) {
    out.push(
      profaneEvery && i % profaneEvery === 0 ? "fuck" : clean[i % clean.length]
    );
  }
  return out.join(" ");
};

const perfTexts = {
  "short (10w)": { text: mkText(10, 5), iters: 3000 },
  "medium clean (1k w)": { text: mkText(1000), iters: 100 },
  "medium profane (1k w)": { text: mkText(1000, 100), iters: 100 },
  "large clean (20k w)": { text: mkText(20000), iters: 10 },
  "large profane (20k w)": { text: mkText(20000, 500), iters: 10 },
};

console.log("\n=== PERFORMANCE: ms per check() ===");
console.log(pad("text", 24) + names.map((n) => pad(n, 19)).join(""));
for (const [tname, { text, iters }] of Object.entries(perfTexts)) {
  const row = names.map((n) => {
    const fn = libs[n];
    try {
      fn(text); // warmup
      const t0 = performance.now();
      for (let i = 0; i < iters; i++) fn(text);
      return pad(((performance.now() - t0) / iters).toFixed(3), 19);
    } catch {
      return pad("ERR", 19);
    }
  });
  console.log(pad(tname, 24) + row.join(""));
}
