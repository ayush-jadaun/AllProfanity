# AllProfanity

A blazing-fast, multi-language, enterprise-grade profanity filter for JavaScript/TypeScript with advanced leet-speak normalization, Unicode support, and a robust, modern API.

[![npm version](https://img.shields.io/npm/v/allprofanity.svg)](https://www.npmjs.com/package/allprofanity)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Features

- **Ultra-Fast O(n) Detection:** TRIE-based, single-pass algorithm for massive performance gains over regex/set-based filters.
- **Multi-Language Support:** Built-in dictionaries for English, Hindi, French, German, Spanish, Bengali, Tamil, Telugu. Load multiple at once.
- **Multiple Scripts:** Detects profanity in Latin/Roman (Hinglish) and native scripts (e.g., Devanagari, Tamil, Telugu).
- **Advanced Leet-Speak Normalization:** Detects obfuscated profanities (`f#ck`, `a55hole`, etc.) with context-aware mapping.
- **Unicode & Punctuation Robustness:** Handles word boundaries and mixed language content with near-zero false positives.
- **Flexible Cleaning:** Replace matches character-by-character or as whole words, with configurable placeholders.
- **Custom Dictionaries:** Add/remove words or entire lists at runtime, including your own language packs.
- **Whitelisting:** Exclude safe words or false positives from detection.
- **Severity Levels:** Assess how offensive a string is (`MILD`, `MODERATE`, `SEVERE`, `EXTREME`).
- **No Dictionary Exposure:** For security, the full list of loaded profanities is never exposed.
- **TypeScript Support:** Typed, documented API and result objects.
- **Zero 3rd-Party Dependencies:** Only internal code and data.

---

## Installation

```bash
npm install allprofanity
# or
yarn add allprofanity
```

---

## Quick Start

```typescript
import profanity from 'allprofanity';

// Simple check
profanity.check('This is a clean sentence.');        // false
profanity.check('What the f#ck is this?');           // true (leet-speak detected)
profanity.check('यह एक चूतिया परीक्षण है।');           // true (Hindi)
profanity.check('Ye ek chutiya test hai.');          // true (Hinglish Roman script)
```

---

## API Reference & Examples

### `check(text: string): boolean`

Returns `true` if the text contains any profanity.

```typescript
profanity.check('This is a clean sentence.');  // false
profanity.check('This is a bullshit sentence.'); // true
profanity.check('What the f#ck is this?'); // true (leet-speak)
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
profanity.addToWhitelist(['anal', 'ass']);
profanity.check('He is an associate professor.'); // false
profanity.check('I work as an analyst.'); // false
// Remove from whitelist to restore detection
profanity.removeFromWhitelist(['anal', 'ass']);
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
// ['english', 'hindi', 'french', 'german', 'spanish', 'bengali', 'tamil', 'telugu']
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

## Severity Levels

Severity reflects the number and variety of detected profanities:

| Level     | Enum Value | Description                             |
|-----------|------------|-----------------------------------------|
| MILD      | 1          | 1 unique/total word                     |
| MODERATE  | 2          | 2 unique or total words                 |
| SEVERE    | 3          | 3 unique/total words                    |
| EXTREME   | 4          | 4+ unique or 5+ total profane words     |

---

## Language Support

- **Built-in:** English, Hindi, French, German, Spanish, Bengali, Tamil, Telugu
- **Scripts:** Latin/Roman, Devanagari, Tamil, Telugu, Bengali, etc.
- **Mixed Content:** Handles mixed-language and code-switched sentences.

```typescript
profanity.check('This is bullshit and चूतिया.'); // true (mixed English/Hindi)
profanity.check('Ce mot est merde and पागल.');   // true (French/Hindi)
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
- **Handles leet-speak:** Catches obfuscated variants like `f#ck`, `a55hole`.

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

## Middleware Examples

**Looking for Express.js/Node.js middleware to use AllProfanity in your API or chat app?**  
**Check the [`examples/`](./examples/) folder for ready-to-copy middleware and integration samples.**

---

## Roadmap

- More language packs (Arabic, Russian, etc.)
- Contextual detection & severity scoring
- Phonetic/typo/obfuscation resilience
- Plugin system for custom detection

---

## License

MIT — See [LICENSE](https://github.com/ayush-jadaun/allprofanity/blob/main/LICENSE)

---

## Contributing

We welcome new language packs, detection improvements, and docs!  
To add a new language, create a file in `src/languages/` and export a string array.  
Open a PR or issue for bugs, features, or suggestions.