# Configuration Presets

Plug-and-play configuration files for every type of AllProfanity user. Pick the preset that matches your use case, copy it into your project, and load it — no tuning required.

## Usage

```bash
# 1. Copy a preset into your project as allprofanity.config.json
cp node_modules/allprofanity/examples-config/chat-app.json ./allprofanity.config.json

# 2. (Optional) generate the JSON schema for IDE autocomplete
npx allprofanity
```

```typescript
import { AllProfanity } from 'allprofanity';
import config from './allprofanity.config.json';

const filter = AllProfanity.fromConfig(config);
filter.check('user message here');
```

Every preset works as-is and can be tweaked afterwards — the JSON schema (`config.schema.json`) gives you autocomplete and validation in your editor.

## Which preset is for me?

| Preset | Who it's for | Algorithm | Evasion protection | Context analysis |
|---|---|---|---|---|
| [`chat-app.json`](./chat-app.json) | Chat, gaming, comments | Trie + cache | Full | — |
| [`content-moderation.json`](./content-moderation.json) | UGC platforms, social media | Hybrid + cache | Full | Balanced (0.5) |
| [`high-throughput-api.json`](./high-throughput-api.json) | APIs, pipelines, documents | Aho-Corasick + cache | Full | — |
| [`medical-professional.json`](./medical-professional.json) | Medical, legal, academic | Hybrid + cache | Unicode only | Lenient (0.55) |
| [`family-friendly-max.json`](./family-friendly-max.json) | Kids' platforms, education | Trie + cache | Full + partial words | — |
| [`low-latency-minimal.json`](./low-latency-minimal.json) | Latency-critical, pre-screened input | Trie only | Off | — |
| [`multilingual-global.json`](./multilingual-global.json) | Global audiences | Aho-Corasick + cache | Full | — |

---

## Preset details

### `chat-app.json` — Real-time chat, gaming, comment sections

**Why:** Users in live communities actively try to sneak words past the filter, so every evasion pass is on: leet-speak (`sh1t`), masked characters (`f*ck`), stretched letters (`fuuuuck`), spaced-out spelling (`f u c k`) and Unicode tricks. The default Trie matcher plus the early-exit `check()` keeps short-message latency in the microsecond range, and the result cache absorbs repeated messages (emotes, spam, copypasta).

**Trade-off:** None worth noting — this is the recommended starting point for most apps.

---

### `content-moderation.json` — UGC platforms, social media, forums

**Why:** Moderation queues care about false positives as much as misses. This preset layers context analysis (threshold 0.5) on top of full evasion protection, so quoted speech, negations ("not bad") and medical phrasing score lower before flagging. The hybrid engine (Aho-Corasick + Bloom Filter) keeps long posts fast, and a large cache absorbs re-checks when content is edited and resubmitted.

**Trade-off:** Context analysis adds a small per-match cost; throughput is still far ahead of comparable libraries.

---

### `high-throughput-api.json` — Moderation APIs, ingestion pipelines, documents

**Why:** When you process large texts or high request volumes, the Aho-Corasick automaton (prebuilt at startup so the first request pays no compile cost) gives single-pass scanning regardless of dictionary size. A 10k-entry cache turns repeated payloads into O(1) lookups. Full evasion protection stays on — its passes only trigger when suspicious characters appear, so clean documents pay near-zero extra.

**Trade-off:** Slightly higher startup time (~6 ms) to prebuild the automaton.

---

### `medical-professional.json` — Medical, legal, academic content

**Why:** Professional text legitimately contains anatomical terms and quoted material. This preset raises the context-analysis threshold to 0.55 with a wide 100-character window, enables `strictMode` (matches must sit on clean word boundaries), and turns off the aggressive evasion passes (stretched/masked/separated letters) that professional authors don't use — keeping only Unicode folding for safety.

**Trade-off:** Deliberately lenient; an adversarial user could slip evasions past it. Use it for trusted-author content, not open UGC.

---

### `family-friendly-max.json` — Kids' platforms, education, zero-tolerance spaces

**Why:** Maximum recall. `detectPartialWords` flags profanity embedded inside other words ("absofuckinglutely"), and every evasion pass is on. Because partial matching reintroduces the classic false-positive traps ("class" contains "ass"), this preset ships with a whitelist of the common innocents pre-loaded — extend it with the vocabulary of your audience.

**Trade-off:** Highest false-positive risk of the pack. Review the whitelist before production and prefer `chat-app.json` if your audience writes long-form text.

---

### `low-latency-minimal.json` — Latency-critical paths, pre-screened input

**Why:** The bare matcher and nothing else: no leet-speak, no evasion passes, no cache. Use when input is already normalized upstream (e.g. a search index, telemetry, machine-generated text) or when every microsecond counts and you accept literal-match-only detection.

**Trade-off:** Catches only exact dictionary words. Trivially evadable — never use for live user content.

---

### `multilingual-global.json` — Global audiences, international platforms

**Why:** Loads all nine built-in language packs (English, Hindi, French, German, Spanish, Bengali, Tamil, Telugu, Brazilian Portuguese) covering Latin, Devanagari, Bengali, Tamil and Telugu scripts, plus Hinglish romanizations. The prebuilt Aho-Corasick automaton keeps scanning single-pass even with the combined dictionary, and full evasion protection covers Unicode tricks across scripts.

**Trade-off:** Larger dictionary means slightly more memory (~a few MB) and startup time; per-check speed is unaffected thanks to the automaton.

---

## Mixing and matching

Presets are just JSON — combine sections freely. Common tweaks:

```jsonc
// Add your own brand-specific blocklist
"customDictionaries": { "brand": ["competitorname", "internalcodename"] }

// Whitelist domain vocabulary
"whitelistWords": ["analysis", "assessment"]

// Change the censor character
"profanityDetection": { "defaultPlaceholder": "#" }
```

See the [main README](../README.md) for the full option reference and the
[configuration schema](../config.schema.json) for validation and autocomplete.
