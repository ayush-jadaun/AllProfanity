# AllProfanity

A comprehensive multi-language profanity filter for JavaScript/TypeScript applications with built-in support for English, Hindi, and Hinglish content.

[![npm version](https://img.shields.io/npm/v/allprofanity.svg)](https://www.npmjs.com/package/allprofanity)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Multi-language Support**: Pre-loaded with English profanities (from leo-profanity) and an extensive Hindi/Hinglish dictionary
- **Multiple Scripts**: Detects profanity in both Latin/Roman and Devanagari scripts
- **Case Insensitive**: Works regardless of letter case
- **Flexible Cleaning Options**:
  - Character-level replacement (each character of a profane word becomes a placeholder)
  - Word-level replacement (entire profane word becomes a single placeholder)
- **Customizable**:
  - Dynamically add/remove words from the filter
  - Set custom placeholder characters or strings
- **Zero Dependencies**: Only depends on leo-profanity as the base filter
- **TypeScript Support**: Full TypeScript type definitions included

## Installation

```bash
npm install allprofanity
# or
yarn add allprofanity
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

## Word Boundary Detection

The library is designed to handle word boundaries correctly, reducing false positives:

```javascript
profanity.check('He is an associate professor.');  // false, even though 'ass' is a profane word
profanity.check('I'm an analyst at this company.'); // false, even though 'anal' is a profane word
profanity.check('This is ass and that's bad.');     // true
```

## Language Support

### Hindi/Hinglish Support

The library comes pre-loaded with an extensive list of Hindi profanities in both Devanagari and Roman scripts, as well as common Hinglish abbreviations and variations.

```javascript
// Hindi in Devanagari script
profanity.check('इस वाक्य में लंड शब्द है।');  // true

// Hindi in Roman script
profanity.check('Is vakya mein lund shabd hai.');  // true

// Hinglish abbreviations
profanity.check('Usne bc kaha.');  // true
```

## Mixed Language Content

AllProfanity effectively handles mixed-language content containing profanities from different languages:

```javascript
profanity.check('This English sentence has chutiya which is bad.');  // true
profanity.check('I'm saying मादरचोद and bullshit in one sentence.');  // true
```

## Customizing The Library

### Adding Custom Profanity Lists

You can add your own profanity lists to extend support for other languages:

```javascript
// Add Spanish profanity words
profanity.add([
  'mierda',
  'puta',
  'pendejo',
  'carajo',
  'coño'
]);

// Now it will detect Spanish profanity
profanity.check('Este es un ejemplo de mierda.');  // true
```

### Creating a Custom-Configured Instance

If you need multiple differently-configured instances of the filter, you can import the AllProfanity class directly:

```javascript
import { AllProfanity } from 'allprofanity';

// Create custom instances
const kidSafeFilter = new AllProfanity({ includeModerate: true });
const adultFilter = new AllProfanity({ includeModerate: false });
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

## Browser Support

AllProfanity works in all modern browsers and Node.js environments.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request