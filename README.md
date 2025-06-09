# AllProfanity

A comprehensive, zero-dependency, multi-language profanity filter for JavaScript/TypeScript applications with built-in support for English, Hindi, Hinglish, Bengali, Tamil, Telugu, French, German, and Spanish content.

[![npm version](https://img.shields.io/npm/v/allprofanity.svg)](https://www.npmjs.com/package/allprofanity)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Multi-language Support**: Built-in dictionaries for English, Hindi/Hinglish, Bengali, Tamil, Telugu, French, German, and Spanish.
- **Multiple Scripts**: Detects profanity in both Latin/Roman and native scripts (Devanagari, Bengali, Tamil, Telugu).
- **Case Insensitive (configurable)**: By default, not case sensitive, but can be configured to be case sensitive.
- **Leet Speak Detection**: Optionally detects leet speak and obfuscated profanities.
- **Flexible Cleaning Options**:
  - Character-level replacement (each character of a profane word becomes a placeholder).
  - Word-level replacement (entire profane word becomes a single placeholder).
- **Customizable & Extensible**:
  - Dynamically add/remove words or whole dictionaries.
  - Set custom placeholder characters or strings.
  - Supports custom language packs.
  - Whitelist words to avoid false positives.
  - Strict mode and partial word detection options.
- **Severity Levels**: Detects severity of profanities (MILD, MODERATE, SEVERE, EXTREME).
- **Zero External Dependencies**: Fully built from scratch for maximum performance and control.
- **TypeScript Support**: Full TypeScript type definitions included.
- **Exportable Dictionaries**: Language word lists are exportable for direct use or extension.

## Installation

```bash
npm install allprofanity
# or
yarn add allprofanity
# or
pnpm add allprofanity
```

## Basic Usage

```javascript
import profanity from 'allprofanity';

// Check if a string contains profanity
profanity.check('This is a clean sentence.');  // false
profanity.check('This is a fucking test.');    // true
profanity.check('यह एक चूतिया परीक्षण है।');    // true (Hindi example)
profanity.check('Ye ek chutiya test hai.');    // true (Hinglish example)

// Clean profanity (character by character replacement)
profanity.clean('This is a fucking test.');
// => "This is a ****ing test."

// Clean profanity (whole word replacement)
profanity.cleanWithWord('This is a fucking test.');
// => "This is a *** test."
```

## API Reference

### `check(string: string): boolean`

Checks if a string contains any profanity from the loaded dictionaries.

```javascript
profanity.check('This contains bullshit.');  // true
profanity.check('This is clean.');           // false
```

### `detect(string: string): ProfanityDetectionResult`

Advanced detection with details about profanities found, severity, cleaned text, and word positions.

```javascript
const result = profanity.detect('This contains bullshit.');
// result: {
//   hasProfanity: true,
//   detectedWords: [...],
//   cleanedText: ...,
//   severity: ...,
//   positions: [...]
// }
```

### `clean(string: string, placeholder?: string): string`

Cleans a string by replacing each character of profane words with a placeholder character.

```javascript
// Default placeholder is "*"
profanity.clean('This contains bullshit.');
// => "This contains ********."

// Custom placeholder character
profanity.clean('This contains bullshit.', '#');
// => "This contains ########."
```

### `cleanWithWord(string: string, placeholder?: string): string`

Cleans a string by replacing entire profane words with a single placeholder string.

```javascript
// Default placeholder is "***"
profanity.cleanWithWord('This contains bullshit.');
// => "This contains ***."

// Custom placeholder string
profanity.cleanWithWord('This contains bullshit.', '[CENSORED]');
// => "This contains [CENSORED]."
```

### `list(): string[]`

Returns an array of all the profanity words currently in the filter.

```javascript
const words = profanity.list();
console.log(words);  // ["fuck", "bullshit", "chutiya", ...]
```

### `add(word: string | string[]): void`

Adds one or more words to the profanity filter.

```javascript
// Add a single word
profanity.add('badword');

// Add multiple words
profanity.add(['badword1', 'badword2', 'बुराशब्द']);
```

### `remove(word: string | string[]): void`

Removes one or more words from the profanity filter.

```javascript
// Remove a single word
profanity.remove('bullshit');

// Remove multiple words
profanity.remove(['fuck', 'chutiya']);
```

### `clearList(): void`

Removes all words from the profanity filter, resetting it to an empty list.

```javascript
profanity.clearList();
```

### `setPlaceholder(placeholder: string): void`

Sets the default placeholder character for the `clean` method.

```javascript
// Set "#" as the default placeholder character
profanity.setPlaceholder('#');
```

### `getLoadedLanguages(): string[]`

Returns the list of currently loaded languages.

```javascript
const loaded = profanity.getLoadedLanguages();
// => ['english', 'hindi', ...]
```

### `getAvailableLanguages(): string[]`

Returns the list of all available built-in languages.

```javascript
const available = profanity.getAvailableLanguages();
// => ['english', 'hindi', 'bengali', 'tamil', 'telugu', 'french', 'german', 'spanish']
```

### `loadLanguage(language: string): boolean`

Loads a built-in language dictionary by name.

```javascript
profanity.loadLanguage('bengali');
profanity.loadLanguage('french');
```

### `loadLanguages(languages: string[]): number`

Loads multiple languages at once.

```javascript
profanity.loadLanguages(['tamil', 'german', 'spanish']);
```

### `loadIndianLanguages(): number`

Loads Hindi, Bengali, Tamil, and Telugu dictionaries.

```javascript
profanity.loadIndianLanguages();
```

### `loadCustomDictionary(name: string, words: string[]): void`

Loads a custom dictionary under the given name.

```javascript
profanity.loadCustomDictionary('myLanguage', ['word1', 'word2']);
profanity.loadLanguage('myLanguage');
```

### `addToWhitelist(words: string[]): void` / `removeFromWhitelist(words: string[]): void`

Add or remove words from the whitelist (words never flagged as profanity).

```javascript
profanity.addToWhitelist(['anal', 'ass']);
profanity.removeFromWhitelist(['anal']);
```

### `getConfig(): AllProfanityOptions`

Get current configuration.

### `updateConfig(options: Partial<AllProfanityOptions>): void`

Update configuration (enable/disable leet speak, case sensitivity, etc.).

## Word Boundary Detection

The library handles word boundaries and reduces false positives:

```javascript
profanity.check('He is an associate professor.');  // false, even though 'ass' is a profane word
profanity.check('I\'m an analyst at this company.'); // false, even though 'anal' is a profane word
profanity.check('This is ass and that\'s bad.');     // true
```

## Language Support

### Current Languages

- **English** (imported from `./languages/english-words.js`)
- **Hindi/Hinglish** (`./languages/hindi-words.js`)
- **Bengali** (`./languages/bengali-words.js`)
- **Tamil** (`./languages/tamil-words.js`)
- **Telugu** (`./languages/telugu-words.js`)
- **French** (`./languages/french-words.js`)
- **German** (`./languages/german-words.js`)
- **Spanish** (`./languages/spanish-words.js`)

> **Note:** All dictionaries are exported for direct access/import.

#### Usage Examples

```javascript
profanity.check('इस वाक्य में लंड शब्द है।');  // true (Hindi)
profanity.check('Is vakya mein lund shabd hai.');  // true (Hinglish)
profanity.check('এই বাক্যে বাল শব্দ আছে।');  // true (Bengali)
profanity.check('இந்த வாக்கியத்தில் கூதி உள்ளது.');  // true (Tamil)
profanity.check('Cette phrase contient le mot merde.');  // true (French)
```

### Mixed Language Content

AllProfanity can detect profanities from multiple languages in a single string:

```javascript
profanity.check('This English sentence has chutiya which is bad.');  // true
profanity.check('I\'m saying मादरचोद and bullshit in one sentence.');  // true
```

### Loading Additional or Custom Languages

By default, only English and Hindi are loaded. You can load additional languages as needed:

```javascript
profanity.loadLanguage('bengali');
profanity.loadLanguages(['tamil', 'french']);
```

You can also load custom dictionaries:

```javascript
profanity.loadCustomDictionary('swedish', ['fulord1', 'fulord2']);
profanity.loadLanguage('swedish');
```

## Customizing The Library

### Adding Custom Profanity Lists

You can add your own profanity words to extend support for other languages or add additional words to existing languages:

```javascript
// Add custom profanity words
profanity.add([
  'customword1',
  'customword2',
  'customword3'
]);
```

## Creating a Custom-Configured Instance

If you need multiple differently-configured filters, import the `AllProfanity` class directly:

```javascript
import { AllProfanity } from 'allprofanity';

const kidSafeFilter = new AllProfanity({ enableLeetSpeak: true, strictMode: true });
const adultFilter = new AllProfanity({ enableLeetSpeak: false, detectPartialWords: false });
```

## Advanced Use Cases

### Performance Optimization

For high-throughput applications:

```javascript
const badWordsList = profanity.list();
const preCompiledRegex = new RegExp('\\b(' + badWordsList.join('|') + ')\\b', 'i');

function quickCheck(text) {
  return preCompiledRegex.test(text);
}
```

### Content Moderation Systems

```javascript
function moderateContent(content) {
  if (profanity.check(content)) {
    return {
      isApproved: false,
      cleanedContent: profanity.cleanWithWord(content, '[INAPPROPRIATE]'),
      reason: 'Contains profanity'
    };
  }
  return { isApproved: true, cleanedContent: content };
}
```

## Use Cases

- Content moderation systems
- Chat applications
- User-generated content platforms
- Educational software
- Forums and community platforms
- Social media content filtering
- Comment sections
- Gaming chat filters
- Email filtering
- Document processing systems

## Browser Support

AllProfanity works in all modern browsers and Node.js environments.

## Roadmap

- Add support for more languages (Arabic, Chinese, Russian, etc.)
- Contextual profanity detection
- Severity levels for different categories of profanity
- Phonetic matching for evasion attempts
- Plugin system for custom detection strategies

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/ayush-jadaun/allprofanity/blob/main/LICENSE) file for details.

## Contributing

Contributions are welcome! Whether it's adding new language support, improving detection algorithms, or enhancing documentation.

Please feel free to submit a Pull Request or open an Issue on GitHub.

### Adding a New Language

To add support for a new language:

1. Create a new file in the `src/languages` directory (e.g., `french-words.ts`)
2. Follow the format of the existing word lists
3. Submit a pull request with your changes

## Acknowledgements

- Inspired by [leo-profanity](https://github.com/jojoee/leo-profanity), but fully rebuilt for extensibility and multi-language support.

```diff
- Note: As of v2+, AllProfanity is zero-dependency and does not use leo-profanity internally.
```
