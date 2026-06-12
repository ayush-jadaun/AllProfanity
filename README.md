# AllProfanity

The most evasion-resistant multi-language profanity filter for JavaScript/TypeScript. Catches leet-speak (`sh1t`), masked words (`f*ck`, `f#ck`), stretched letters (`fuuuuck`), spaced-out spelling (`f u c k`), Unicode tricks (fullwidth `ｆｕｃｋ`, homoglyph `fυck`, zero-width injection) and nine languages — with zero false positives on the classic traps ("Scunthorpe", "classic", "bass") and sub-millisecond checks.

[![npm version](https://img.shields.io/npm/v/allprofanity.svg)](https://www.npmjs.com/package/allprofanity)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What's New in v2.3.0

- **Evasion protection suite:** masked characters (`f*ck`, `f#ck`, `f@ck`), stretched letters (`fuuuuck`), separated letters (`f u c k`, `f.u.c.k`), and a Unicode folding pass (fullwidth forms, Cyrillic/Greek homoglyphs, diacritics, zero-width/invisible characters) — all on by default, all individually configurable
- **Early-exit `check()`:** boolean checks stop at the first confirmed match — a 20k-word profane document that took v2.2.1 ~24 ms now checks in ~0.01 ms
- **8× faster leet-speak engine vs v2.2.1:** the normalizer was rewritten with first-character bucketing and an ASCII fast path — a 100 KB clean document dropped from ~24 ms to ~3 ms per scan
- **Position-accurate everywhere:** matches found through any normalization (leet, Unicode, collapse) now report exact positions in the *original* string, so cleaning masks exactly the evasive text
- **Hardened core:** `remove()`/`clearList()` now reach the Aho-Corasick automaton, the result cache is truly LRU and invalidates on every mutation, `contextAnalysis.scoreThreshold` and `ahoCorasick.prebuild` are honored, and importing the library no longer writes to the console
- **`ProfanitySeverity.NONE` (0):** clean text now reports `NONE` instead of `MILD`

[Read the full Performance Analysis →](./docs/SPEED_VS_ACCURACY.md)

---

## How It Compares

Benchmarked against the most popular npm profanity filters on a 20-case evasion battery, 15 false-positive traps, and throughput tests. Reproduce with [`benchmark/compare-libraries.mjs`](./benchmark/compare-libraries.mjs).

### Detection accuracy

| Library | Evasion cases caught | False positives | Multi-language |
|---|---|---|---|
| **allprofanity** | **19/20** | **0/15** | **9 languages** |
| obscenity | 16/20 | 1/15 (flags "shiitake") | English only |
| bad-words | 9/20 | 0/15 | English only |
| @2toad/profanity | 9/20 | 0/15 | English only |
| leo-profanity | 6/20 | 0/15 | English only |

The battery covers plain profanity, leet-speak (`sh1t`, `a55hole`, `b@stard`), masked words (`f*ck`, `f#ck`), stretched letters, spaced/dotted spelling, case tricks, fullwidth Unicode, homoglyphs, and Hindi in both Roman and Devanagari script.

### Performance (ms per `check()` call)

| Input | allprofanity | leo-profanity | bad-words | obscenity | @2toad |
|---|---|---|---|---|---|
| Short message (10 words) | 0.001 | 0.001 | 0.356 | 0.017 | 0.001 |
| Large text, profane (20k words) | **0.013** | 0.449 | 15.1 | 11.3 | 0.041 |
| Large text, clean (20k words) | 3.20 | 0.75 | 13.2 | 14.6 | 0.29 |

Against **obscenity** — the only library close on detection — allprofanity is ~4.5× faster on clean text and ~870× faster on profane text, with better detection and zero false positives. The thin word-list filters (leo-profanity, @2toad) are faster on clean throughput but miss half to two-thirds of the evasion battery.

---

## Features

### Performance & Speed

- **Multiple Algorithm Options:** Choose between Trie (default), Aho-Corasick, or Hybrid modes
- **300K+ ops/sec on short texts:** default Trie mode (chat-message-sized inputs, measured on the comparison benchmark hardware); profane text exits early at 1M+ ops/sec
- **O(1) Cached Repeats:** LRU result cache turns repeated checks into map lookups — 25× (short texts) to 6,500× (large texts) faster than the same uncached call
- **Aho-Corasick Option:** single-pass multi-pattern matching whose cost stays flat as your dictionary grows (vs the Trie's per-position scanning)
- **Single-Pass Scanning:** O(n) complexity regardless of dictionary size
- **Batch Processing Ready:** Optimized for high-throughput API endpoints

### Accuracy & Detection

- **Word Boundary Matching:** Smart whole-word detection prevents false positives like "assassin" or "assistance"
- **Pattern-Based Context Detection:** Recognizes medical terms ("anal region") and negation patterns ("not bad")
- **Advanced Leet-Speak:** Detects obfuscated profanities (`a55hole`, `sh1t`, `b!tch`, etc.)
- **Masked-Character Wildcards:** Resolves `f*ck`, `f#ck`, `f@ck` — without flagging `c#`, `5% off`, or email addresses
- **Stretched & Separated Letters:** Catches `fuuuuck`, `f u c k`, `f.u.c.k` while leaving "U S A" and "hmmmm" alone
- **Embedded Strong Words:** Catches profanity glued into non-words (`sisfuck`, `totalshitshow`) for a curated list of unambiguous stems — with built-in exceptions so "Scunthorpe", "mishit" and "snigger" never flag
- **Unicode Evasion Folding:** Fullwidth forms (`ｆｕｃｋ`), Cyrillic/Greek homoglyphs (`fυck`, `bаstard`), diacritics (`fück`), and zero-width/invisible character injection
- **Position-Accurate Cleaning:** Every match maps back to the exact span in the original text, however it was obfuscated
- **Configurable Strictness:** Each evasion pass can be toggled independently via `evasionProtection`

### Multi-Language & Flexibility

- **Multi-Language Support:** Built-in dictionaries for English, Hindi, French, German, Spanish, Bengali, Tamil, Telugu, Brazilian Portuguese
- **Multiple Scripts:** Latin/Roman (Hinglish) and native scripts (Devanagari, Tamil, Telugu, etc.)
- **Custom Dictionaries:** Add/remove words or entire language packs at runtime
- **Whitelisting:** Exclude safe words from detection
- **Severity Scoring:** Assess content offensiveness (`MILD`, `MODERATE`, `SEVERE`, `EXTREME`)

### Developer Experience

- **TypeScript Support:** Fully typed API with comprehensive documentation
- **Zero 3rd-Party Dependencies:** Only internal code and data
- **Configurable:** Tune performance vs accuracy for your use case
- **No Dictionary Exposure:** Secure by design - word lists never exposed
- **Universal:** Works in Node.js and browsers

---

## Installation

```bash
npm install allprofanity
# or
yarn add allprofanity
```

**Generate configuration file (optional):**

```bash
npx allprofanity
# Creates allprofanity.config.json and config.schema.json in your project
```

---

## Quick Start

```typescript
import profanity from 'allprofanity';

// Simple check
profanity.check('This is a clean sentence.');        // false
profanity.check('What the f#ck is this?');           // true (masked character)
profanity.check('This is sh1t');                     // true (leet-speak)
profanity.check('fuuuuck this');                     // true (stretched letters)
profanity.check('f u c k you');                      // true (separated letters)
profanity.check('ｆｕｃｋ and fυck');                  // true (unicode evasion)
profanity.check('यह एक चूतिया परीक्षण है।');           // true (Hindi)
profanity.check('Ye ek chutiya test hai.');          // true (Hinglish Roman script)

// But the classics stay clean:
profanity.check('I live in Scunthorpe');             // false
profanity.check('a classic bass guitar class');      // false
profanity.check('I write c# code, get 5% off');      // false
```

---

## Algorithm Configuration

AllProfanity v2.2+ offers multiple algorithms optimized for different use cases. You can configure via **constructor options** or **config file**.

### Plug-and-Play Presets

Skip the tuning: [`examples-config/`](./examples-config/) ships ready-made configurations for every type of user — chat apps, content moderation, high-throughput APIs, medical/professional content, kids' platforms, latency-critical paths, and global multilingual audiences. Each preset is documented with who it's for, why it's tuned that way, and its trade-offs in the [preset guide](./examples-config/README.md).

```bash
# Copy the preset that fits your use case
cp node_modules/allprofanity/examples-config/chat-app.json ./allprofanity.config.json
```

```typescript
import { AllProfanity } from 'allprofanity';
import config from './allprofanity.config.json';

const filter = AllProfanity.fromConfig(config);
```

### Configuration Methods

#### Method 1: Constructor Options (Inline)

```typescript
import { AllProfanity } from 'allprofanity';

const filter = new AllProfanity({
  algorithm: { matching: "hybrid" },
  performance: { enableCaching: true }
});
```

#### Method 2: Config File (Recommended)

```bash
# Generate config files in your project
npx allprofanity

# This creates:
# - allprofanity.config.json (main config)
# - config.schema.json (for IDE autocomplete)
```

```typescript
import { AllProfanity } from 'allprofanity';
import config from './allprofanity.config.json';

// Load from generated config file
const filter = AllProfanity.fromConfig(config);

// Or directly from object (no file needed)
const filter2 = AllProfanity.fromConfig({
  algorithm: { matching: "hybrid", useContextAnalysis: true },
  performance: { enableCaching: true, cacheSize: 1000 }
});
```

**Example Config File** (`allprofanity.config.json`):

```json
{
  "algorithm": {
    "matching": "hybrid",
    "useAhoCorasick": true,
    "useBloomFilter": true,
    "useContextAnalysis": true
  },
  "contextAnalysis": {
    "enabled": true,
    "contextWindow": 50,
    "languages": ["en"],
    "scoreThreshold": 0.5
  },
  "profanityDetection": {
    "enableLeetSpeak": true,
    "caseSensitive": false,
    "strictMode": false
  },
  "performance": {
    "enableCaching": true,
    "cacheSize": 1000
  }
}
```

**Config File:** Run `npx allprofanity` to generate config files in your project. The JSON schema provides IDE autocomplete and validation.

---

### Quick Configuration Examples

#### 1. Default (Best for General Use)

```typescript
import { AllProfanity } from 'allprofanity';
const filter = new AllProfanity();
// Uses optimized Trie - fast and reliable (300K+ ops/sec on short texts)
```

#### 2. Large Text Processing (Documents, Articles)

```typescript
const filter = new AllProfanity({
  algorithm: { matching: "aho-corasick" }
});
// Single-pass scanning that stays flat as the dictionary grows;
// prebuild pays the compile cost at startup instead of the first request
```

#### 3. Reduced False Positives (Social Media, Content Moderation)

```typescript
const filter = new AllProfanity({
  algorithm: {
    matching: "hybrid",
    useBloomFilter: true,
    useAhoCorasick: true,
    useContextAnalysis: true
  },
  contextAnalysis: {
    enabled: true,
    contextWindow: 50,
    languages: ["en"],
    scoreThreshold: 0.5
  }
});
// Pattern-based context detection reduces medical/negation false positives
```

#### 4. Repeated Checks (Chat, Forms, APIs)

```typescript
const filter = new AllProfanity({
  performance: {
    enableCaching: true,
    cacheSize: 1000
  }
});
// O(1) on cache hits - 25x to 6,500x faster than the same uncached
// detect() call, depending on text size (short message vs 20k words)
```

#### 5. Tuning Evasion Protection

```typescript
const filter = new AllProfanity({
  evasionProtection: {
    unicode: true,            // fold fullwidth/homoglyph/diacritic/invisible-char tricks
    repeatedCharacters: true, // collapse "fuuuuck" -> "fuck"
    maskedCharacters: true,   // resolve "f*ck", "f#ck", "f@ck"
    separatedLetters: true    // catch "f u c k", "f.u.c.k"
  }
});
// All four passes are ON by default and only run when their trigger
// characters appear in the text, so ordinary input pays near-zero cost.
// Disable any of them for maximum-throughput or specialised pipelines.
```

#### 6. Medical/Professional Content

```typescript
const filter = new AllProfanity({
  algorithm: {
    matching: "hybrid",
    useContextAnalysis: true
  },
  contextAnalysis: {
    enabled: true,
    contextWindow: 100,
    scoreThreshold: 0.7  // Higher threshold = less sensitive
  }
});
// Reduces false positives from medical terms using keyword patterns
```

### Performance Characteristics

| Use Case | Algorithm | Speed | Detection | Best For |
|----------|-----------|-------|----------|----------|
| Short texts (<500 chars) | Trie (default) | 300K+ ops/sec | Excellent | Chat, comments |
| Large texts (20KB+) | Trie or Aho-Corasick | ~3 ms/check (clean), ~0.01 ms (profane, early exit) | Excellent | Documents, articles |
| Repeated patterns | Any + Caching | O(1) — 25× to 6,500× faster than uncached | Excellent | Forms, validation |

All numbers measured with [`benchmark/compare-libraries.mjs`](./benchmark/compare-libraries.mjs) and `npm run benchmark` (Node 22, Windows x64); baselines are v2.2.1 for version-to-version claims and the named library for cross-library claims. Re-run them yourself — results vary with hardware.
| Content moderation | Hybrid + Context | Moderate | Good (fewer false positives) | Social media, UGC |
| Professional content | Hybrid + Context (strict) | Moderate | Reduced false flags | Medical, academic |

[See detailed benchmarks and comparisons →](./docs/SPEED_VS_ACCURACY.md)

---

## API Reference & Examples

### `check(text: string): boolean`

Returns `true` if the text contains any profanity. Uses an early-exit fast
path that stops scanning at the first confirmed match — for boolean
moderation gates it is dramatically faster than `detect()` on profane input.

```typescript
profanity.check('This is a clean sentence.');  // false
profanity.check('This is a bullshit sentence.'); // true
profanity.check('What the f#ck is this?'); // true (masked character)
profanity.check('यह एक चूतिया परीक्षण है।'); // true (Hindi)
```

---

### `detect(text: string): ProfanityDetectionResult`

Returns a detailed result:

- `hasProfanity: boolean`
- `detectedWords: string[]` (actual matched words)
- `cleanedText: string` (character-masked)
- `severity: ProfanitySeverity` (`MILD`, `MODERATE`, `SEVERE`, `EXTREME`)
- `positions: Array<{ word: string, start: number, end: number }>`

```typescript
const result = profanity.detect('This is fucking bullshit and chutiya.');
console.log(result.hasProfanity); // true
console.log(result.detectedWords); // ['fucking', 'bullshit', 'chutiya']
console.log(result.severity); // 3 (SEVERE)
console.log(result.cleanedText); // "This is ******* ******** and ******."
console.log(result.positions); // e.g. [{word: 'fucking', start: 8, end: 15}, ...]
```

---

### `clean(text: string, placeholder?: string): string`

Replace each character of profane words with a placeholder (default: `*`).

```typescript
profanity.clean('This contains bullshit.'); // "This contains ********."
profanity.clean('This contains bullshit.', '#'); // "This contains ########."
profanity.clean('यह एक चूतिया परीक्षण है।'); // e.g. "यह एक ***** परीक्षण है।"
```

---

### `cleanWithPlaceholder(text: string, placeholder?: string): string`

Replace each profane word with a single placeholder (default: `***`).  
(If the placeholder is omitted, uses `***`.)

```typescript
profanity.cleanWithPlaceholder('This contains bullshit.'); // "This contains ***."
profanity.cleanWithPlaceholder('This contains bullshit.', '[CENSORED]'); // "This contains [CENSORED]."
profanity.cleanWithPlaceholder('यह एक चूतिया परीक्षण है।', '####'); // e.g. "यह एक #### परीक्षण है।"
```

---

### `add(word: string | string[]): void`

Add a word or an array of words to the profanity filter.

```typescript
profanity.add('badword123');
profanity.check('This is badword123.'); // true

profanity.add(['mierda', 'puta']);
profanity.check('Esto es mierda.'); // true (Spanish)
profanity.check('Qué puta situación.'); // true
```

---

### `remove(word: string | string[]): void`

Remove a word or an array of words from the profanity filter.

```typescript
profanity.remove('bullshit');
profanity.check('This is bullshit.'); // false

profanity.remove(['mierda', 'puta']);
profanity.check('Esto es mierda.'); // false
```

---

### `addToWhitelist(words: string[]): void`

Whitelist words so they are never flagged as profane.

```typescript
profanity.addToWhitelist(['fuck', 'idiot','shit']);
profanity.check('He is an fucking idiot.'); // false
profanity.check('Fuck this shit.'); // false
// Remove from whitelist to restore detection
profanity.removeFromWhitelist(['fuck', 'idiot','shit']);
```

---

### `removeFromWhitelist(words: string[]): void`

Remove words from the whitelist so they can be detected again.

```typescript
profanity.removeFromWhitelist(['anal']);
```

---

### `setPlaceholder(placeholder: string): void`

Set the default placeholder character for `clean()`.

```typescript
profanity.setPlaceholder('#');
profanity.clean('This is bullshit.'); // "This is ########."
profanity.setPlaceholder('*'); // Reset to default
```

---

### `updateConfig(options: Partial<AllProfanityOptions>): void`

Change configuration at runtime.  
Options include: `enableLeetSpeak`, `caseSensitive`, `strictMode`, `detectPartialWords`, `defaultPlaceholder`, `languages`, `whitelistWords`.

```typescript
profanity.updateConfig({ caseSensitive: true, enableLeetSpeak: false });
profanity.check('FUCK'); // false (if caseSensitive)
profanity.updateConfig({ caseSensitive: false, enableLeetSpeak: true });
profanity.check('f#ck'); // true
```

---

### `loadLanguage(language: string): boolean`

Load a built-in language.

```typescript
profanity.loadLanguage('french');
profanity.check('Ce mot est merde.'); // true
```

---

### `loadLanguages(languages: string[]): number`

Load multiple built-in languages at once.

```typescript
profanity.loadLanguages(['english', 'french', 'german']);
profanity.check('Das ist scheiße.'); // true (German)
```

---

### `loadIndianLanguages(): number`

Convenience: Load all major Indian language packs.

```typescript
profanity.loadIndianLanguages();
profanity.check('यह एक बेंगाली गाली है।'); // true (Bengali)
profanity.check('This is a Tamil profanity: புண்டை'); // true
```

---

### `loadCustomDictionary(name: string, words: string[]): void`

Add your own dictionary as an additional language.

```typescript
profanity.loadCustomDictionary('swedish', ['fan', 'jävla', 'skit']);
profanity.loadLanguage('swedish');
profanity.check('Det här är skit.'); // true
```

---

### `getLoadedLanguages(): string[]`

Returns the names of all currently loaded language packs.

```typescript
console.log(profanity.getLoadedLanguages()); // ['english', 'hindi', ...]
```

---

### `getAvailableLanguages(): string[]`

Returns the names of all available built-in language packs.

```typescript
console.log(profanity.getAvailableLanguages());
// ['english', 'hindi', 'french', 'german', 'spanish', 'bengali', 'tamil', 'telugu', 'brazilian']
```

---

### `clearList(): void`

Remove all loaded languages and dynamic words (start with a clean filter).

```typescript
profanity.clearList();
profanity.check('fuck'); // false
profanity.loadLanguage('english');
profanity.check('fuck'); // true
```

---

### `getConfig(): Partial<AllProfanityOptions>`

Get the current configuration.

```typescript
console.log(profanity.getConfig());
/*
{
  defaultPlaceholder: '*',
  enableLeetSpeak: true,
  caseSensitive: false,
  strictMode: false,
  detectPartialWords: false,
  languages: [...],
  whitelistWords: [...]
}
*/
```

---

## Configuration File Structure

AllProfanity supports JSON-based configuration for easy setup and deployment. The config file structure supports all algorithm and detection options.

### Full Configuration Schema

```typescript
{
  "algorithm": {
    "matching": "trie" | "aho-corasick" | "hybrid",  // Algorithm selection
    "useAhoCorasick": boolean,                        // Enable Aho-Corasick
    "useBloomFilter": boolean,                        // Enable Bloom Filter
    "useContextAnalysis": boolean                     // Enable context analysis
  },
  "bloomFilter": {
    "enabled": boolean,                               // Enable/disable
    "expectedItems": number,                          // Expected dictionary size (default: 10000)
    "falsePositiveRate": number                       // Acceptable false positive rate (default: 0.01)
  },
  "ahoCorasick": {
    "enabled": boolean,                               // Enable/disable
    "prebuild": boolean                               // Prebuild automaton (default: true)
  },
  "contextAnalysis": {
    "enabled": boolean,                               // Enable/disable pattern-based context detection
    "contextWindow": number,                          // Characters around match to check (default: 50)
    "languages": string[],                            // Languages for keyword patterns (default: ["en"])
    "scoreThreshold": number                          // Detection threshold 0-1 (default: 0.5)
  },
  "profanityDetection": {
    "enableLeetSpeak": boolean,                       // Detect l33t speak (default: true)
    "caseSensitive": boolean,                         // Case sensitive matching (default: false)
    "strictMode": boolean,                            // Require word boundaries (default: false)
    "detectPartialWords": boolean,                    // Detect within words (default: false)
    "defaultPlaceholder": string                      // Default censoring character (default: "*")
  },
  "evasionProtection": {
    "unicode": boolean,                               // Fold fullwidth/homoglyphs/diacritics/invisibles (default: true)
    "repeatedCharacters": boolean,                    // Collapse "fuuuuck" (default: true)
    "maskedCharacters": boolean,                      // Resolve "f*ck", "f#ck" (default: true)
    "separatedLetters": boolean                       // Catch "f u c k" (default: true)
  },
  "performance": {
    "enableCaching": boolean,                         // Enable result cache (default: false)
    "cacheSize": number                               // Cache size limit (default: 1000)
  }
}
```

### Pre-configured Templates

#### High Performance (Large Texts)

```json
{
  "algorithm": { "matching": "aho-corasick" },
  "ahoCorasick": { "enabled": true, "prebuild": true },
  "profanityDetection": { "enableLeetSpeak": true }
}
```

#### Reduced False Positives (Content Moderation)

```json
{
  "algorithm": {
    "matching": "hybrid",
    "useContextAnalysis": true,
    "useBloomFilter": true
  },
  "contextAnalysis": {
    "enabled": true,
    "contextWindow": 50,
    "scoreThreshold": 0.5
  },
  "performance": { "enableCaching": true }
}
```

#### Balanced (Production)

```json
{
  "algorithm": {
    "matching": "hybrid",
    "useAhoCorasick": true,
    "useBloomFilter": true
  },
  "profanityDetection": { "enableLeetSpeak": true },
  "performance": { "enableCaching": true, "cacheSize": 1000 }
}
```

### Using Config Files

**Step 1: Generate Config Files**

```bash
# Run this in your project directory
npx allprofanity

# Output:
# ✅ AllProfanity configuration files created!
#
# Created files:
#   📄 allprofanity.config.json - Main configuration
#   📄 config.schema.json - JSON schema for IDE autocomplete
```

**Step 2: Load Config in Your Code**

```typescript
// ES Modules / TypeScript
import { AllProfanity } from 'allprofanity';
import config from './allprofanity.config.json';

const filter = AllProfanity.fromConfig(config);
```

```javascript
// CommonJS (Node.js)
const { AllProfanity } = require('allprofanity');
const config = require('./allprofanity.config.json');

const filter = AllProfanity.fromConfig(config);
```

**Step 3: Customize Config**

Edit `allprofanity.config.json` to enable/disable features. Your IDE will provide autocomplete thanks to the JSON schema!

---

## Severity Levels

Severity reflects the number and variety of detected profanities:

| Level     | Enum Value | Description                             |
|-----------|------------|-----------------------------------------|
| NONE      | 0          | No profanity detected                   |
| MILD      | 1          | 1 unique/total word                     |
| MODERATE  | 2          | 2 unique or total words                 |
| SEVERE    | 3          | 3 unique/total words                    |
| EXTREME   | 4          | 4+ unique or 5+ total profane words     |

---

## Language Support

- **Built-in:** English, Hindi, French, German, Spanish, Bengali, Tamil, Telugu, Brazilian Portuguese
- **Scripts:** Latin/Roman, Devanagari, Tamil, Telugu, Bengali, etc.
- **Mixed Content:** Handles mixed-language and code-switched sentences.

```typescript
profanity.check('This is bullshit and चूतिया.'); // true (mixed English/Hindi)
profanity.check('Ce mot est merde and पागल.');   // true (French/Hindi)
profanity.check('Isso é uma merda.');             // true (Brazilian Portuguese)
```

---

## Use Exported Wordlists

For sample words in a language (for UIs, admin, etc):

```typescript
import { englishBadWords, hindiBadWords } from 'allprofanity';
console.log(englishBadWords.slice(0, 5)); // ["fuck", "shit", ...]
```

---

## Security

- **No wordlist exposure:** There is no `.list()` function for security and encapsulation. Use exported word arrays for samples.
- **TRIE-based:** Scales easily to 50,000+ words.
- **Evasion-resistant:** Catches leet-speak (`a55hole`), masked characters (`f*ck`, `f#ck`), stretched letters (`fuuuuck`), separated letters (`f u c k`), and Unicode tricks (fullwidth, homoglyphs, zero-width injection).
- **Silent by default:** Importing the library never writes to the console; instantiate with a custom `logger` for diagnostics.

---

## Full Example

```typescript
import profanity, { ProfanitySeverity } from 'allprofanity';

// Multi-language detection
profanity.loadLanguages(['english', 'french', 'tamil']);
console.log(profanity.check('Ce mot est merde.')); // true

// Leet-speak detection
console.log(profanity.check('You a f#cking a55hole!')); // true

// Whitelisting
profanity.addToWhitelist(['anal', 'ass']);
console.log(profanity.check('He is an associate professor.')); // false

// Severity
const result = profanity.detect('This is fucking bullshit and chutiya.');
console.log(ProfanitySeverity[result.severity]); // "SEVERE"

// Custom dictionary
profanity.loadCustomDictionary('pirate', ['barnacle-head', 'landlubber']);
profanity.loadLanguage('pirate');
console.log(profanity.check('You barnacle-head!')); // true

// Placeholder configuration
profanity.setPlaceholder('#');
console.log(profanity.clean('This is bullshit.')); // "This is ########."
profanity.setPlaceholder('*'); // Reset
```

---

## FAQ

**Q: How do I see all loaded profanities?**  
A: For security, the internal word list is not exposed. Use `englishBadWords` etc. for samples.

**Q: How do I reset the filter?**  
A: Use `clearList()` and reload languages/dictionaries.

**Q: Is this safe for browser and Node.js?**  
A: Yes! AllProfanity is universal.

---

## Use with AI Agents (MCP Server)

AllProfanity ships a built-in [Model Context Protocol](https://modelcontextprotocol.io) server, so any MCP-capable agent (Claude Code, Claude Desktop, Cursor, custom agents) can check, analyze and clean text with zero integration code — and zero extra dependencies.

**Claude Code:**

```bash
claude mcp add allprofanity -- npx -y -p allprofanity allprofanity-mcp
```

**Claude Desktop / generic MCP config:**

```json
{
  "mcpServers": {
    "allprofanity": {
      "command": "npx",
      "args": ["-y", "-p", "allprofanity", "allprofanity-mcp"],
      "env": {
        "ALLPROFANITY_LANGUAGES": "french,german,spanish"
      }
    }
  }
}
```

**Exposed tools:** `check_profanity`, `detect_profanity` (positions + severity + cleaned text), `clean_profanity` (character or word mode), `add_words`, `add_to_whitelist`, `load_language`, `list_languages`, and `get_documentation` — agents can read this README and the preset guide directly through the server (also exposed as MCP resources), so they can learn how to integrate and configure the library on their own.

**Configuration:** set `ALLPROFANITY_LANGUAGES` (comma-separated) to preload languages, or `ALLPROFANITY_CONFIG` to the path of an `allprofanity.config.json` (any [preset](./examples-config/) works).

---

## Middleware Examples

**Looking for Express.js/Node.js middleware to use AllProfanity in your API or chat app?**  
**Check the [`examples/`](./examples/) folder for ready-to-copy middleware and integration samples.**

---

## Roadmap

- 🚧 Multi-language context analysis (Hindi, Spanish, etc.)
- 🚧 Phonetic matching (sounds-like detection)
- 🚧 More language packs (Arabic, Russian, Japanese, etc.)
- 🚧 Machine learning integration for adaptive scoring
- 🚧 Plugin system for custom detection algorithms

---

## License

MIT — See [LICENSE](https://github.com/ayush-jadaun/allprofanity/blob/main/LICENSE)

---

## Contributing

  We welcome contributions! Please see our [CONTRIBUTORS.md](./CONTRIBUTORS.md) for:

- How to add your name to our contributors list
- Guidelines for adding new languages
- Test requirements (must include passing test screenshots in PRs)
- Code of conduct and PR guidelines
