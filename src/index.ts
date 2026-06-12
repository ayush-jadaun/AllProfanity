// Language dictionaries imports
import englishBadWords from "./languages/english-words.js";
import hindiBadWords from "./languages/hindi-words.js";
import frenchBadWords from "./languages/french-words.js";
import germanBadWords from "./languages/german-words.js";
import spanishBadWords from "./languages/spanish-words.js";
import bengaliBadWords from "./languages/bengali-words.js";
import tamilBadWords from "./languages/tamil-words.js";
import teluguBadWords from "./languages/telugu-words.js";
import brazilianBadWords from "./languages/brazilian-words.js";

// Advanced algorithm imports
import { AhoCorasick, Match as AhoMatch } from "./algos/aho-corasick.js";
import { BloomFilter } from "./algos/bloom-filter.js";
import { ContextAnalyzer, ContextPatternMatcher } from "./algos/context-patterns.js";

// Export language dictionaries for direct access
export { default as englishBadWords } from "./languages/english-words.js";
export { default as hindiBadWords } from "./languages/hindi-words.js";
export { default as frenchBadWords } from "./languages/french-words.js";
export { default as germanBadWords } from "./languages/german-words.js";
export { default as spanishBadWords } from "./languages/spanish-words.js";
export { default as bengaliBadWords } from "./languages/bengali-words.js";
export { default as tamilBadWords } from "./languages/tamil-words.js";
export { default as teluguBadWords } from "./languages/telugu-words.js";
export { default as brazilianBadWords } from "./languages/brazilian-words.js";

/**
 * Logger interface for AllProfanity library logging operations.
 *
 * @interface Logger
 * @description Provides a contract for logging implementations used by the AllProfanity library.
 * Implement this interface to provide custom logging behavior (e.g., logging to files, external services).
 *
 * @example
 * ```typescript
 * class CustomLogger implements Logger {
 *   info(message: string): void {
 *     // Custom info logging logic
 *   }
 *   warn(message: string): void {
 *     // Custom warning logging logic
 *   }
 *   error(message: string): void {
 *     // Custom error logging logic
 *   }
 * }
 * const filter = new AllProfanity({ logger: new CustomLogger() });
 * ```
 */
export interface Logger {
  /**
   * Log informational messages about normal operations.
   *
   * @param message - The informational message to log
   * @returns void
   */
  info(message: string): void;

  /**
   * Log warning messages about potential issues or deprecated usage.
   *
   * @param message - The warning message to log
   * @returns void
   */
  warn(message: string): void;

  /**
   * Log error messages about failures or critical issues.
   *
   * @param message - The error message to log
   * @returns void
   */
  error(message: string): void;
}

/**
 * Default console logger implementation for AllProfanity.
 *
 * @class ConsoleLogger
 * @implements {Logger}
 * @description Logs messages to the browser or Node.js console with an "[AllProfanity]" prefix.
 * This is the default logger used when no custom logger is provided.
 *
 * @internal
 */
class ConsoleLogger implements Logger {
  /**
   * Log informational messages to console.log with [AllProfanity] prefix.
   *
   * @param message - The message to log
   * @returns void
   */
  info(message: string): void {
    console.log(`[AllProfanity] ${message}`);
  }

  /**
   * Log warning messages to console.warn with [AllProfanity] prefix.
   *
   * @param message - The warning message to log
   * @returns void
   */
  warn(message: string): void {
    console.warn(`[AllProfanity] ${message}`);
  }

  /**
   * Log error messages to console.error with [AllProfanity] prefix.
   *
   * @param message - The error message to log
   * @returns void
   */
  error(message: string): void {
    console.error(`[AllProfanity] ${message}`);
  }
}

/**
 * Silent logger implementation that suppresses all log output.
 *
 * @class SilentLogger
 * @implements {Logger}
 * @description A no-op logger that discards all log messages. Used when `silent: true` is set
 * in AllProfanityOptions, or when you want to completely disable logging.
 *
 * @internal
 */
class SilentLogger implements Logger {
  /**
   * No-op implementation - messages are discarded.
   *
   * @param _message - The message (unused)
   * @returns void
   */
  info(_message: string): void {
    // Silent mode - no logging
  }

  /**
   * No-op implementation - warnings are discarded.
   *
   * @param _message - The warning message (unused)
   * @returns void
   */
  warn(_message: string): void {
    // Silent mode - no logging
  }

  /**
   * No-op implementation - errors are discarded.
   *
   * @param _message - The error message (unused)
   * @returns void
   */
  error(_message: string): void {
    // Silent mode - no logging
  }
}

/**
 * Configuration options for initializing an AllProfanity instance.
 *
 * @interface AllProfanityOptions
 * @description Comprehensive configuration object for customizing profanity detection behavior,
 * algorithm selection, performance optimizations, and logging.
 *
 * @example
 * ```typescript
 * const filter = new AllProfanity({
 *   languages: ['english', 'french'],
 *   enableLeetSpeak: true,
 *   strictMode: true,
 *   algorithm: {
 *     matching: 'hybrid',
 *     useBloomFilter: true
 *   },
 *   performance: {
 *     enableCaching: true,
 *     cacheSize: 500
 *   }
 * });
 * ```
 */
export interface AllProfanityOptions {
  /**
   * Array of language keys to load (e.g., 'english', 'hindi', 'french').
   * Available languages: english, hindi, french, german, spanish, bengali, tamil, telugu, brazilian.
   *
   * @default ['english', 'hindi'] (loaded by default in constructor)
   */
  languages?: string[];

  /**
   * Custom dictionaries to load in addition to built-in languages.
   * Key is the dictionary name, value is an array of words.
   *
   * @example
   * ```typescript
   * customDictionaries: {
   *   'gaming': ['noob', 'trash'],
   *   'custom': ['word1', 'word2']
   * }
   * ```
   */
  customDictionaries?: Record<string, string[]>;

  /**
   * Single character to use as replacement placeholder for profane characters.
   *
   * @default "*"
   */
  defaultPlaceholder?: string;

  /**
   * Enable detection and normalization of leet speak variations (e.g., "h3ll0" -> "hello").
   *
   * @default true
   */
  enableLeetSpeak?: boolean;

  /**
   * Enable case-sensitive matching. When false, all matching is done in lowercase.
   *
   * @default false
   */
  caseSensitive?: boolean;

  /**
   * Array of words to whitelist (never flag as profanity even if in dictionaries).
   *
   * @example ['hello', 'class', 'assignment']
   */
  whitelistWords?: string[];

  /**
   * Strict mode requires profanity to be surrounded by word boundaries (spaces, punctuation).
   * When false, profanity embedded in other words may be detected.
   *
   * @default false
   */
  strictMode?: boolean;

  /**
   * Allow detection of profanity as partial matches within larger words.
   * When true, "badword" will be detected in "mybadwordhere".
   *
   * @default false
   */
  detectPartialWords?: boolean;

  /**
   * Custom logger implementation for handling log messages.
   * If not provided, defaults to ConsoleLogger unless silent mode is enabled.
   */
  logger?: Logger;

  /**
   * Silent mode suppresses all logging output.
   * When true, uses SilentLogger to discard all log messages.
   *
   * @default false
   */
  silent?: boolean;

  /**
   * Advanced algorithm configuration for pattern matching strategies.
   */
  algorithm?: {
    /**
     * Primary matching algorithm to use.
     * - 'trie': Fast prefix tree matching (default, best for most use cases)
     * - 'aho-corasick': Multi-pattern matching (best for large dictionaries)
     * - 'hybrid': Combines Aho-Corasick with Bloom Filter (best for extreme performance)
     *
     * @default "trie"
     */
    matching?: "trie" | "aho-corasick" | "hybrid";

    /**
     * Enable Aho-Corasick automaton for multi-pattern matching.
     * Automatically enabled when matching is set to 'aho-corasick' or 'hybrid'.
     *
     * @default false
     */
    useAhoCorasick?: boolean;

    /**
     * Enable Bloom Filter for probabilistic quick rejection of non-profane text.
     * Automatically enabled when matching is set to 'hybrid'.
     *
     * @default false
     */
    useBloomFilter?: boolean;

    /**
     * Enable context analysis to reduce false positives based on surrounding words.
     *
     * @default false
     */
    useContextAnalysis?: boolean;
  };

  /**
   * Bloom Filter configuration for probabilistic matching optimization.
   */
  bloomFilter?: {
    /**
     * Enable Bloom Filter.
     *
     * @default false
     */
    enabled?: boolean;

    /**
     * Expected number of items to be stored in the Bloom Filter.
     * Higher values increase memory usage but reduce false positive rate.
     *
     * @default 10000
     */
    expectedItems?: number;

    /**
     * Target false positive rate (probability of incorrectly identifying non-profanity as profanity).
     * Lower values increase memory usage but improve accuracy.
     *
     * @default 0.01 (1%)
     */
    falsePositiveRate?: number;
  };

  /**
   * Aho-Corasick automaton configuration for multi-pattern matching.
   */
  ahoCorasick?: {
    /**
     * Enable Aho-Corasick automaton.
     *
     * @default false
     */
    enabled?: boolean;

    /**
     * Pre-build the automaton during initialization.
     * When false, automaton is built lazily on first use.
     *
     * @default false
     */
    prebuild?: boolean;
  };

  /**
   * Context analysis configuration for reducing false positives.
   */
  contextAnalysis?: {
    /**
     * Enable context-aware profanity detection.
     *
     * @default false
     */
    enabled?: boolean;

    /**
     * Number of words before and after the detected word to analyze for context.
     *
     * @default 5
     */
    contextWindow?: number;

    /**
     * Languages to use for context analysis (e.g., ['en', 'es']).
     *
     * @default ['en']
     */
    languages?: string[];

    /**
     * Minimum confidence score (0-1) required to flag as profanity.
     * Higher values reduce false positives but may miss some profanity.
     *
     * @default 0.5
     */
    scoreThreshold?: number;
  };

  /**
   * Evasion-protection configuration. All passes are enabled by default and
   * only run when their trigger characters are present in the text, so they
   * add near-zero cost on ordinary input.
   */
  evasionProtection?: {
    /**
     * Fold unicode evasion: fullwidth forms (ｆｕｃｋ), Cyrillic/Greek
     * homoglyphs (fυck), diacritics (fück) and invisible characters
     * (zero-width spaces, soft hyphens) injected inside words.
     *
     * @default true
     */
    unicode?: boolean;

    /**
     * Collapse stretched characters ("fuuuuck" -> "fuck"). Only triggers when
     * a run of 3+ identical characters exists.
     *
     * @default true
     */
    repeatedCharacters?: boolean;

    /**
     * Resolve masked characters as single-character wildcards ("f*ck",
     * "f#ck", "f@ck"). A masked token only matches when the visible letters
     * align exactly with a dictionary word.
     *
     * @default true
     */
    maskedCharacters?: boolean;

    /**
     * Detect words spelled out with uniform single separators
     * ("f u c k", "f.u.c.k"). The joined letters must equal a dictionary
     * word exactly, which keeps initialisms like "U S A" clean.
     *
     * @default true
     */
    separatedLetters?: boolean;

    /**
     * Detect unambiguous profanity stems embedded inside larger tokens
     * ("sisfuck", "totalshitshow"). Applies only to a curated list of
     * strong words that never occur in legitimate vocabulary, with built-in
     * exceptions (Scunthorpe, mishit, snigger, ...), so "classic", "bass"
     * and "Hitchcock" stay clean.
     *
     * @default true
     */
    embeddedWords?: boolean;
  };

  /**
   * Performance optimization configuration.
   */
  performance?: {
    /**
     * Maximum number of results to cache in LRU cache.
     *
     * @default 1000
     */
    cacheSize?: number;

    /**
     * Enable result caching to speed up repeated queries.
     * Stores detection results for previously seen text.
     *
     * @default false
     */
    enableCaching?: boolean;
  };
}

/**
 * Severity levels for profanity detection results.
 *
 * @enum {number}
 * @description Categorizes the severity of detected profanity based on the number
 * of unique words and total matches found in the text.
 *
 * @readonly
 * @example
 * ```typescript
 * const result = filter.detect("some text");
 * if (result.severity === ProfanitySeverity.EXTREME) {
 *   // Handle extreme profanity
 * }
 * ```
 */
export enum ProfanitySeverity {
  /** No profanity detected */
  NONE = 0,

  /** Mild profanity: 1 unique word or 1 total match */
  MILD = 1,

  /** Moderate profanity: 2 unique words or 2 total matches */
  MODERATE = 2,

  /** Severe profanity: 3 unique words or 3 total matches */
  SEVERE = 3,

  /** Extreme profanity: 4+ unique words or 5+ total matches */
  EXTREME = 4,
}

/**
 * Result object returned from profanity detection operations.
 *
 * @interface ProfanityDetectionResult
 * @description Contains comprehensive information about detected profanity including
 * what was found, where it was found, how severe it is, and a cleaned version of the text.
 *
 * @example
 * ```typescript
 * const result = filter.detect("This is a bad word");
 * console.log(result.hasProfanity); // true
 * console.log(result.detectedWords); // ['bad word']
 * console.log(result.cleanedText); // 'This is a *** ****'
 * console.log(result.severity); // ProfanitySeverity.MILD
 * console.log(result.positions); // [{ word: 'bad word', start: 10, end: 18 }]
 * ```
 */
export interface ProfanityDetectionResult {
  /**
   * Whether any profanity was detected in the text.
   *
   * @type {boolean}
   */
  hasProfanity: boolean;

  /**
   * Array of detected profane words/phrases as they appeared in the original text.
   * Includes case and formatting from the original text.
   *
   * @type {string[]}
   */
  detectedWords: string[];

  /**
   * The text with all profanity replaced by placeholder characters.
   * Each profane character is replaced with the configured placeholder (default: '*').
   *
   * @type {string}
   */
  cleanedText: string;

  /**
   * Severity level of detected profanity.
   *
   * @type {ProfanitySeverity}
   */
  severity: ProfanitySeverity;

  /**
   * Precise positions of each detected profane word in the original text.
   * Useful for highlighting or further processing.
   *
   * @type {Array<{ word: string; start: number; end: number }>}
   */
  positions: Array<{ word: string; start: number; end: number }>;
}

/**
 * Internal match result structure for efficient profanity matching and processing.
 *
 * @interface MatchResult
 * @description Used internally during the matching phase to track both the dictionary
 * word that was matched and the actual text that was found.
 *
 * @internal
 */
interface MatchResult {
  /** The dictionary word that was matched (normalized) */
  word: string;

  /** Start index of the match in the original text (0-based, inclusive) */
  start: number;

  /** End index of the match in the original text (0-based, exclusive) */
  end: number;

  /** The actual matched text from the original input (preserves case and formatting) */
  originalWord: string;
}

/**
 * Result of leet-speak normalization with a position map back to the input.
 *
 * @internal
 */
interface LeetNormalization {
  /** The normalized text */
  normalized: string;

  /** For each normalized character, the start index of its source range in the input */
  starts: number[];

  /** For each normalized character, the end index (exclusive) of its source range in the input */
  ends: number[];
}

/**
 * Compose two position maps: `inner` maps its normalized text back to the
 * text that `outer` normalized, and the result maps `inner.normalized`
 * directly back to the original input.
 *
 * @internal
 */
function composeMaps(
  outer: LeetNormalization,
  inner: LeetNormalization
): LeetNormalization {
  const starts = new Array<number>(inner.starts.length);
  const ends = new Array<number>(inner.ends.length);
  for (let i = 0; i < inner.starts.length; i++) {
    starts[i] = outer.starts[inner.starts[i]];
    ends[i] = outer.ends[inner.ends[i] - 1];
  }
  return { normalized: inner.normalized, starts, ends };
}

/**
 * Common homoglyphs (visually identical/near-identical non-Latin characters)
 * folded to their ASCII look-alikes for evasion-resistant matching.
 *
 * @internal
 */
const CONFUSABLES: ReadonlyMap<string, string> = new Map([
  // Cyrillic
  ["а", "a"], ["в", "b"], ["е", "e"], ["к", "k"], ["м", "m"], ["н", "h"],
  ["о", "o"], ["р", "p"], ["с", "c"], ["т", "t"], ["у", "y"], ["х", "x"],
  ["і", "i"], ["ј", "j"], ["ѕ", "s"], ["ԁ", "d"], ["ԛ", "q"], ["ԝ", "w"],
  // Greek
  ["α", "a"], ["β", "b"], ["γ", "y"], ["ε", "e"], ["η", "n"], ["ι", "i"],
  ["κ", "k"], ["μ", "m"], ["ν", "v"], ["ο", "o"], ["ρ", "p"], ["σ", "s"],
  ["τ", "t"], ["υ", "u"], ["χ", "x"], ["ω", "w"],
]);

/**
 * Invisible characters commonly injected to break up profane words.
 *
 * @internal
 */
const INVISIBLE_CHARS: ReadonlySet<string> = new Set([
  "\u200B", // zero-width space
  "\u200C", // zero-width non-joiner
  "\u200D", // zero-width joiner
  "\uFEFF", // zero-width no-break space
  "\u00AD", // soft hyphen
  "\u2060", // word joiner
  "\u180E", // Mongolian vowel separator
]);

/** Symbols treated as single-character wildcards in masked words like "f*ck". @internal */
const MASK_CHARS: ReadonlySet<string> = new Set(["*", "#", "@", "$", "%"]);

/**
 * Unambiguous profanity stems that are flagged even when embedded inside a
 * larger token ("sisfuck", "totalshitshow"). Only words that essentially
 * never occur inside legitimate vocabulary belong here — ambiguous stems
 * like "ass" or "cock" (class, bass, Hitchcock, peacock) must stay
 * whole-word matched.
 *
 * @internal
 */
const EMBEDDED_STRONG_STEMS: readonly string[] = [
  "fuck",
  "shit",
  "bitch",
  "cunt",
  "whore",
  "nigger",
  "nigga",
  "faggot",
  "wanker",
  "chutiya",
  "bhenchod",
  "behenchod",
  "madarchod",
  "bhosdi",
];

/**
 * Legitimate words that contain a strong stem and must never be flagged by
 * the embedded pass (the user whitelist extends this set).
 *
 * @internal
 */
const EMBEDDED_SAFE_WORDS: ReadonlySet<string> = new Set([
  "scunthorpe", // cunt
  "mishit", // shit
  "mishits",
  "mishitting",
  "shitake", // alt spelling of shiitake
  "shitakes",
  "matsushita", // Japanese surname/company
  "takeshita", // Japanese surname
  "snigger", // nigger
  "sniggers",
  "sniggered",
  "sniggering",
]);

/**
 * Validates that an input is a non-empty string.
 *
 * @function validateString
 * @param {unknown} input - The value to validate
 * @param {string} paramName - Name of the parameter being validated (used in error messages)
 * @returns {string} The validated string
 * @throws {TypeError} If input is not a string
 *
 * @internal
 *
 * @example
 * ```typescript
 * const text = validateString(userInput, 'text');
 * // Returns userInput if it's a string, throws TypeError otherwise
 * ```
 */
function validateString(input: unknown, paramName: string): string {
  if (typeof input !== "string") {
    throw new TypeError(`${paramName} must be a string, got ${typeof input}`);
  }
  return input;
}

/**
 * Validates and filters a string array, removing non-string and empty items.
 *
 * @function validateStringArray
 * @param {unknown} input - The value to validate (expected to be an array)
 * @param {string} paramName - Name of the parameter being validated (used in error/warning messages)
 * @returns {string[]} Array of valid, non-empty strings
 * @throws {TypeError} If input is not an array
 *
 * @internal
 *
 * @example
 * ```typescript
 * const words = validateStringArray(['word1', '', 123, 'word2'], 'words');
 * // Returns: ['word1', 'word2']
 * // Logs warning: "Skipping non-string item in words: 123"
 * ```
 */
function validateStringArray(
  input: unknown,
  paramName: string,
  logger?: Logger
): string[] {
  if (!Array.isArray(input)) {
    throw new TypeError(`${paramName} must be an array`);
  }
  return input.filter((item): item is string => {
    if (typeof item !== "string") {
      const message = `Skipping non-string item in ${paramName}: ${item}`;
      if (logger) {
        logger.warn(message);
      } else {
        console.warn(message);
      }
      return false;
    }
    return item.trim().length > 0;
  });
}

/**
 * Trie (prefix tree) node for efficient pattern matching and word storage.
 *
 * @class TrieNode
 * @description Implements a trie data structure for O(m) time complexity word matching,
 * where m is the length of the word being searched. Each node represents a character
 * in the word, and paths from root to nodes with isEndOfWord=true represent complete words.
 *
 * @internal
 *
 * @example
 * ```typescript
 * const trie = new TrieNode();
 * trie.addWord('bad');
 * trie.addWord('badword');
 * const matches = trie.findMatches('badwords here', 0, false);
 * // Returns matches for 'bad' and 'badword'
 * ```
 */
class TrieNode {
  /** Map of characters to child nodes for fast lookups */
  private children: Map<string, TrieNode> = new Map();

  /** Flag indicating if this node represents the end of a complete word */
  private isEndOfWord: boolean = false;

  /** The complete word ending at this node (only set when isEndOfWord is true) */
  private word: string = "";

  /**
   * Adds a word to the trie structure.
   *
   * @param {string} word - The word to add to the trie
   * @returns {void}
   *
   * @remarks
   * - Time Complexity: O(m) where m is the length of the word
   * - Space Complexity: O(m) in worst case when all characters are new
   * - Supports any Unicode characters
   *
   * @example
   * ```typescript
   * const trie = new TrieNode();
   * trie.addWord('hello');
   * trie.addWord('world');
   * ```
   */
  addWord(word: string): void {
    let current: TrieNode = this;
    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      const nextNode = current.children.get(char);
      if (nextNode) {
        current = nextNode;
      }
    }
    current.isEndOfWord = true;
    current.word = word;
  }

  /**
   * Removes a word from the trie structure.
   *
   * @param {string} word - The word to remove from the trie
   * @returns {boolean} True if the word existed and was removed, false if word was not found
   *
   * @remarks
   * - Time Complexity: O(m) where m is the length of the word
   * - Also removes unnecessary nodes to keep the trie optimized
   * - Only removes the word marking; shared prefixes with other words are preserved
   *
   * @example
   * ```typescript
   * const trie = new TrieNode();
   * trie.addWord('hello');
   * trie.removeWord('hello'); // Returns: true
   * trie.removeWord('world'); // Returns: false (word not in trie)
   * ```
   */
  removeWord(word: string): boolean {
    return this.removeHelper(word, 0);
  }

  /**
   * Recursive helper method for removing a word from the trie.
   *
   * @param {string} word - The word being removed
   * @param {number} index - Current character index in the word
   * @returns {boolean} True if this node should be deleted (has no children and is not end of another word)
   *
   * @internal
   */
  private removeHelper(word: string, index: number): boolean {
    if (index === word.length) {
      if (!this.isEndOfWord) return false;
      this.isEndOfWord = false;
      return this.children.size === 0;
    }

    const char = word[index];
    const node = this.children.get(char);

    if (!node) return false;

    const shouldDeleteChild = node.removeHelper(word, index + 1);

    if (shouldDeleteChild) {
      this.children.delete(char);
      return this.children.size === 0 && !this.isEndOfWord;
    }

    return false;
  }

  /**
   * Finds all word matches in text starting at a specific position.
   *
   * @param {string} text - The text to search for profanity
   * @param {number} startPos - The starting position (0-based index) in the text
   * @param {boolean} allowPartial - If true, finds partial matches within larger words
   * @returns {Array<{ word: string; start: number; end: number }>} Array of match objects with word and position info
   *
   * @remarks
   * - Time Complexity: O(k) where k is the length of the longest match from startPos
   * - Returns all valid words that can be formed starting from startPos
   * - When allowPartial is false, respects word boundaries
   *
   * @example
   * ```typescript
   * const trie = new TrieNode();
   * trie.addWord('bad');
   * const matches = trie.findMatches('badword', 0, false);
   * // Returns: [{ word: 'bad', start: 0, end: 3 }]
   * ```
   */
  findMatches(
    text: string,
    startPos: number,
    allowPartial: boolean
  ): Array<{ word: string; start: number; end: number }> {
    const matches: Array<{ word: string; start: number; end: number }> = [];
    let current: TrieNode = this;
    let pos = startPos;

    while (pos < text.length) {
      const nextNode = current.children.get(text[pos]);
      if (!nextNode) break;
      current = nextNode;
      pos++;

      if (current.isEndOfWord) {
        matches.push({
          word: current.word,
          start: 0,
          end: pos - startPos,
        });
      }
    }

    return matches;
  }

  /**
   * Find a stored word matching the token, where mask characters match any
   * single character. The token must align with a complete word exactly.
   *
   * @param token - The token to resolve (e.g. "f*ck")
   * @param maskChars - Characters that act as single-character wildcards
   * @returns The first matching dictionary word, or null
   */
  findWildcardMatch(
    token: string,
    maskChars: ReadonlySet<string>
  ): string | null {
    return this.wildcardHelper(token, 0, maskChars);
  }

  private wildcardHelper(
    token: string,
    index: number,
    maskChars: ReadonlySet<string>
  ): string | null {
    if (index === token.length) {
      return this.isEndOfWord ? this.word : null;
    }
    const char = token[index];
    if (maskChars.has(char)) {
      for (const child of this.children.values()) {
        const result = child.wildcardHelper(token, index + 1, maskChars);
        if (result) return result;
      }
      return null;
    }
    const child = this.children.get(char);
    return child ? child.wildcardHelper(token, index + 1, maskChars) : null;
  }

  /**
   * Clears all words from the trie, resetting it to empty state.
   *
   * @returns {void}
   *
   * @remarks
   * - Time Complexity: O(1) - clears the root node only (JavaScript GC handles children)
   * - Removes all stored words and resets the trie to initial state
   *
   * @example
   * ```typescript
   * const trie = new TrieNode();
   * trie.addWord('hello');
   * trie.addWord('world');
   * trie.clear();
   * // Trie is now empty
   * ```
   */
  clear(): void {
    this.children.clear();
    this.isEndOfWord = false;
    this.word = "";
  }
}

/**
 * AllProfanity - Professional-grade multilingual profanity detection and filtering library.
 *
 * @class AllProfanity
 * @description A comprehensive, high-performance profanity filtering system supporting 9+ languages
 * with advanced features including leet speak detection, context analysis, multiple matching algorithms,
 * and customizable filtering options.
 *
 * @remarks
 * ### Features:
 * - **Multi-language Support**: English, Hindi, French, German, Spanish, Bengali, Tamil, Telugu, Brazilian Portuguese
 * - **Advanced Algorithms**: Trie, Aho-Corasick, Bloom Filter, and hybrid approaches
 * - **Leet Speak Detection**: Automatically normalizes and detects variations like "h3ll0"
 * - **Context Analysis**: Reduces false positives using surrounding word context
 * - **Performance**: Built-in caching and optimized data structures
 * - **Flexible**: Custom dictionaries, whitelisting, severity levels
 *
 * ### Default Behavior:
 * - Loads English and Hindi dictionaries by default
 * - Case-insensitive matching
 * - Leet speak detection enabled
 * - Uses Trie algorithm (fastest for most cases)
 *
 * @example
 * ```typescript
 * // Basic usage with default instance
 * import allProfanity from 'allprofanity';
 *
 * const result = allProfanity.detect("This is some bad text");
 * console.log(result.hasProfanity); // true
 * console.log(result.cleanedText); // "This is some *** text"
 * console.log(result.severity); // ProfanitySeverity.MILD
 * ```
 *
 * @example
 * ```typescript
 * // Advanced usage with custom configuration
 * import { AllProfanity, ProfanitySeverity } from 'allprofanity';
 *
 * const filter = new AllProfanity({
 *   languages: ['english', 'french', 'spanish'],
 *   enableLeetSpeak: true,
 *   strictMode: true,
 *   algorithm: {
 *     matching: 'hybrid',
 *     useBloomFilter: true
 *   },
 *   performance: {
 *     enableCaching: true,
 *     cacheSize: 500
 *   },
 *   whitelistWords: ['class', 'assignment']
 * });
 *
 * const text = "This text has some b@d w0rds";
 * const result = filter.detect(text);
 *
 * if (result.hasProfanity) {
 *   console.log(`Found ${result.detectedWords.length} profane words`);
 *   console.log(`Severity: ${ProfanitySeverity[result.severity]}`);
 *   console.log(`Cleaned: ${result.cleanedText}`);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Using individual methods
 * const filter = new AllProfanity();
 *
 * // Simple check
 * if (filter.check("some text")) {
 *   console.log("Contains profanity!");
 * }
 *
 * // Clean with custom placeholder
 * const cleaned = filter.clean("bad words here", "#");
 *
 * // Load additional languages
 * filter.loadLanguage('german');
 * filter.loadIndianLanguages(); // Loads hindi, bengali, tamil, telugu
 *
 * // Add custom words
 * filter.add(['customword1', 'customword2']);
 *
 * // Remove words
 * filter.remove(['someword']);
 *
 * // Whitelist words
 * filter.addToWhitelist(['class', 'assignment']);
 * ```
 *
 * @see {@link AllProfanityOptions} for all configuration options
 * @see {@link ProfanityDetectionResult} for detection result format
 * @see {@link ProfanitySeverity} for severity levels
 */
export class AllProfanity {
  private readonly profanityTrie: TrieNode = new TrieNode();
  private readonly whitelistSet: Set<string> = new Set();
  private readonly loadedLanguages: Set<string> = new Set();
  private readonly logger: Logger;

  private defaultPlaceholder: string = "*";
  private enableLeetSpeak: boolean = true;
  private caseSensitive: boolean = false;
  private strictMode: boolean = false;
  private detectPartialWords: boolean = false;
  private evasionUnicode: boolean = true;
  private evasionRepeatedChars: boolean = true;
  private evasionMaskedChars: boolean = true;
  private evasionSeparatedLetters: boolean = true;
  private evasionEmbeddedWords: boolean = true;

  private readonly availableLanguages: Record<string, string[]> = {
    english: englishBadWords || [],
    hindi: hindiBadWords || [],
    french: frenchBadWords || [],
    german: germanBadWords || [],
    spanish: spanishBadWords || [],
    bengali: bengaliBadWords || [],
    tamil: tamilBadWords || [],
    telugu: teluguBadWords || [],
    brazilian: brazilianBadWords || [],
  };

  private readonly leetMappings: Map<string, string> = new Map([
    ["@", "a"],
    ["^", "a"],
    ["4", "a"],
    ["8", "b"],
    ["6", "b"],
    ["|3", "b"],
    ["(", "c"],
    ["<", "c"],
    ["©", "c"],
    ["|)", "d"],
    ["0", "o"],
    ["3", "e"],
    ["€", "e"],
    ["|=", "f"],
    ["ph", "f"],
    ["9", "g"],
    ["#", "h"],
    ["|-|", "h"],
    ["1", "i"],
    ["!", "i"],
    ["|", "i"],
    ["_|", "j"],
    ["¿", "j"],
    ["|<", "k"],
    ["1<", "k"],
    ["|\\/|", "m"],
    ["/\\/\\", "m"],
    ["|\\|", "n"],
    ["//", "n"],
    ["()", "o"],
    ["|*", "p"],
    ["|o", "p"],
    ["(_,)", "q"],
    ["()_", "q"],
    ["|2", "r"],
    ["12", "r"],
    ["5", "s"],
    ["$", "s"],
    ["7", "t"],
    ["+", "t"],
    ["†", "t"],
    ["|_|", "u"],
    ["(_)", "u"],
    ["\\/", "v"],
    ["|/", "v"],
    ["\\/\\/", "w"],
    ["vv", "w"],
    ["><", "x"],
    ["}{", "x"],
    ["`/", "y"],
    ["2", "z"],
    ["7_", "z"],
  ]);

  private readonly dynamicWords: Set<string> = new Set();

  // Advanced algorithms
  private ahoCorasickAutomaton: AhoCorasick | null = null;
  private bloomFilter: BloomFilter | null = null;
  private contextAnalyzer: ContextAnalyzer | null = null;
  private contextScoreThreshold: number = 0.5;
  private matchingAlgorithm: "trie" | "aho-corasick" | "hybrid" = "trie";
  private resultCache: Map<string, ProfanityDetectionResult> | null = null;
  private cacheMaxSize: number = 1000;
  private leetTokensByFirstChar: Map<string, Array<[string, string]>> | null =
    null;

  /**
   * Creates a new AllProfanity instance with the specified configuration.
   *
   * @constructor
   * @param {AllProfanityOptions} [options] - Configuration options for profanity detection behavior
   *
   * @remarks
   * ### Default Initialization:
   * - Loads English and Hindi dictionaries automatically
   * - Enables leet speak detection
   * - Case-insensitive matching
   * - Uses Trie algorithm for pattern matching
   *
   * ### Performance Considerations:
   * - Initial load time depends on number of languages loaded
   * - Aho-Corasick automaton (if enabled) is built during construction
   * - Bloom Filter (if enabled) is populated during construction
   *
   * @throws {TypeError} If invalid options are provided
   *
   * @example
   * ```typescript
   * // Default instance
   * const filter = new AllProfanity();
   *
   * // Custom configuration
   * const filter = new AllProfanity({
   *   languages: ['english', 'french'],
   *   strictMode: true,
   *   defaultPlaceholder: '#',
   *   algorithm: { matching: 'hybrid' }
   * });
   *
   * // Silent mode (no logging)
   * const filter = new AllProfanity({ silent: true });
   * ```
   *
   * @see {@link AllProfanityOptions} for all available configuration options
   */
  constructor(options?: AllProfanityOptions) {
    // Use silent logger if silent mode is enabled, otherwise use provided logger or console logger
    this.logger = options?.logger || (options?.silent ? new SilentLogger() : new ConsoleLogger());

    if (options?.defaultPlaceholder !== undefined) {
      this.setPlaceholder(options.defaultPlaceholder);
    }

    this.enableLeetSpeak = options?.enableLeetSpeak ?? true;
    this.caseSensitive = options?.caseSensitive ?? false;
    this.strictMode = options?.strictMode ?? false;
    this.detectPartialWords = options?.detectPartialWords ?? false;
    this.evasionUnicode = options?.evasionProtection?.unicode ?? true;
    this.evasionRepeatedChars =
      options?.evasionProtection?.repeatedCharacters ?? true;
    this.evasionMaskedChars =
      options?.evasionProtection?.maskedCharacters ?? true;
    this.evasionSeparatedLetters =
      options?.evasionProtection?.separatedLetters ?? true;
    this.evasionEmbeddedWords =
      options?.evasionProtection?.embeddedWords ?? true;

    if (options?.whitelistWords) {
      this.addToWhitelist(options.whitelistWords);
    }

    // Initialize advanced algorithms BEFORE loading dictionaries
    // so that words can be added to all data structures
    this.initializeAdvancedAlgorithms(options);

    this.loadLanguage("english");
    this.loadLanguage("hindi");

    if (options?.languages?.length) {
      options.languages.forEach((lang) => this.loadLanguage(lang));
    }

    if (options?.customDictionaries) {
      Object.entries(options.customDictionaries).forEach(([name, words]) => {
        this.loadCustomDictionary(name, words);
      });
    }

    if (options?.ahoCorasick?.prebuild && this.ahoCorasickAutomaton) {
      this.ahoCorasickAutomaton.build();
    }
  }

  /**
   * Initialize advanced algorithms based on configuration
   */
  private initializeAdvancedAlgorithms(options?: AllProfanityOptions): void {
    // Set matching algorithm
    if (options?.algorithm?.matching) {
      this.matchingAlgorithm = options.algorithm.matching;
    }

    // Initialize Bloom Filter if enabled
    const bloomEnabled =
      options?.algorithm?.useBloomFilter ||
      options?.bloomFilter?.enabled ||
      this.matchingAlgorithm === "hybrid";

    if (bloomEnabled) {
      const expectedItems = options?.bloomFilter?.expectedItems || 10000;
      const falsePositiveRate = options?.bloomFilter?.falsePositiveRate || 0.01;
      this.bloomFilter = new BloomFilter(expectedItems, falsePositiveRate);
      this.logger.info(
        `Bloom Filter initialized with ${expectedItems} expected items and ${(
          falsePositiveRate * 100
        ).toFixed(2)}% false positive rate`
      );
    }

    // Initialize Aho-Corasick if enabled
    const ahoEnabled =
      options?.algorithm?.useAhoCorasick ||
      options?.ahoCorasick?.enabled ||
      this.matchingAlgorithm === "aho-corasick" ||
      this.matchingAlgorithm === "hybrid";

    if (ahoEnabled) {
      this.ahoCorasickAutomaton = new AhoCorasick([]);
      this.logger.info("Aho-Corasick automaton initialized");
    }

    // Initialize Context Analyzer if enabled
    const contextEnabled =
      options?.algorithm?.useContextAnalysis ||
      options?.contextAnalysis?.enabled;

    if (contextEnabled) {
      const contextLanguages =
        options?.contextAnalysis?.languages || ["en"];
      this.contextAnalyzer = new ContextAnalyzer(contextLanguages);

      if (options?.contextAnalysis?.contextWindow) {
        this.contextAnalyzer.setContextWindow(
          options.contextAnalysis.contextWindow
        );
      }

      if (options?.contextAnalysis?.scoreThreshold !== undefined) {
        this.contextScoreThreshold = options.contextAnalysis.scoreThreshold;
      }

      this.logger.info(
        `Context Analyzer initialized for languages: ${contextLanguages.join(", ")}`
      );
    }

    // Initialize result cache if enabled
    if (options?.performance?.enableCaching) {
      this.cacheMaxSize = options.performance.cacheSize || 1000;
      this.resultCache = new Map();
      this.logger.info(
        `Result caching enabled with size limit: ${this.cacheMaxSize}`
      );
    }
  }

  /**
   * Normalize leet speak to regular characters, keeping a map from each
   * normalized character back to its source range in the input text.
   *
   * For normalized index i, starts[i]/ends[i] give the [start, end) range in
   * the input that produced that character. A match [s, e) in the normalized
   * string therefore spans [starts[s], ends[e - 1]) in the input. This is what
   * keeps positions correct when length-changing mappings like "ph" -> "f"
   * apply.
   */
  private normalizeLeetSpeakWithMap(text: string): LeetNormalization {
    // Bucket tokens by first character so each position costs one Map lookup
    // instead of a scan over every mapping (longest token first per bucket).
    if (!this.leetTokensByFirstChar) {
      this.leetTokensByFirstChar = new Map();
      for (const entry of this.leetMappings.entries()) {
        const bucket = this.leetTokensByFirstChar.get(entry[0][0]);
        if (bucket) {
          bucket.push(entry);
        } else {
          this.leetTokensByFirstChar.set(entry[0][0], [entry]);
        }
      }
      for (const bucket of this.leetTokensByFirstChar.values()) {
        bucket.sort(([leetA], [leetB]) => leetB.length - leetA.length);
      }
    }

    // Fast path: most text contains no leet characters at all. Scan for the
    // first applicable mapping before allocating the position-map arrays.
    let hasLeet = false;
    for (let j = 0; j < text.length && !hasLeet; j++) {
      const bucket = this.leetTokensByFirstChar.get(text[j]);
      if (bucket) {
        for (const [leet] of bucket) {
          if (leet.length === 1 || text.startsWith(leet, j)) {
            hasLeet = true;
            break;
          }
        }
      }
    }
    if (!hasLeet) {
      return { normalized: text, starts: [], ends: [] };
    }

    const parts: string[] = [];
    const starts: number[] = [];
    const ends: number[] = [];
    let i = 0;

    while (i < text.length) {
      let consumed = 0;
      let replacement = "";
      const bucket = this.leetTokensByFirstChar.get(text[i]);
      if (bucket) {
        for (const [leet, normal] of bucket) {
          if (leet.length === 1 || text.startsWith(leet, i)) {
            consumed = leet.length;
            replacement = normal;
            break;
          }
        }
      }
      if (consumed === 0) {
        consumed = 1;
        replacement = text[i];
      }
      for (const char of replacement) {
        parts.push(char);
        starts.push(i);
        ends.push(i + consumed);
      }
      i += consumed;
    }

    return { normalized: parts.join(""), starts, ends };
  }

  /**
   * Fold unicode evasion tactics into ASCII with a position map: fullwidth
   * forms, Cyrillic/Greek homoglyphs, Latin diacritics, and invisible
   * characters injected inside words. Non-Latin scripts (Devanagari, Tamil,
   * etc.) pass through untouched. Returns null when nothing changed.
   */
  private unicodeNormalizeWithMap(text: string): LeetNormalization | null {
    // Fast path: pure ASCII text needs no folding
    let needsScan = false;
    for (let j = 0; j < text.length; j++) {
      if (text.charCodeAt(j) > 127) {
        needsScan = true;
        break;
      }
    }
    if (!needsScan) return null;

    const parts: string[] = [];
    const starts: number[] = [];
    const ends: number[] = [];
    let changed = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = text.charCodeAt(i);

      if (code < 128) {
        parts.push(char);
        starts.push(i);
        ends.push(i + 1);
        continue;
      }

      if (INVISIBLE_CHARS.has(char)) {
        changed = true;
        continue;
      }

      // Fullwidth ASCII block (！ U+FF01 .. ～ U+FF5E)
      if (code >= 0xff01 && code <= 0xff5e) {
        parts.push(String.fromCharCode(code - 0xfee0));
        starts.push(i);
        ends.push(i + 1);
        changed = true;
        continue;
      }

      const confusable = CONFUSABLES.get(char);
      if (confusable) {
        parts.push(confusable);
        starts.push(i);
        ends.push(i + 1);
        changed = true;
        continue;
      }

      // Bare combining marks (covers decomposed input like "u" + U+0308)
      if (code >= 0x0300 && code <= 0x036f) {
        changed = true;
        continue;
      }

      // Latin letters with diacritics: decompose and strip the marks.
      // Limited to the Latin blocks so other scripts keep their composed forms.
      if (code >= 0x00c0 && code < 0x0250) {
        for (const piece of char.normalize("NFD")) {
          const pieceCode = piece.charCodeAt(0);
          if (pieceCode >= 0x0300 && pieceCode <= 0x036f) {
            changed = true;
            continue;
          }
          const folded = this.caseSensitive ? piece : piece.toLowerCase();
          parts.push(folded);
          starts.push(i);
          ends.push(i + 1);
          if (folded !== char) changed = true;
        }
        continue;
      }

      parts.push(char);
      starts.push(i);
      ends.push(i + 1);
    }

    if (!changed) return null;
    return { normalized: parts.join(""), starts, ends };
  }

  /**
   * Collapse runs of repeated characters ("fuuuuck" -> "fuck") with a
   * position map. Only triggers when a run of 3+ identical characters
   * exists, so ordinary doubled letters never pay for this pass.
   * Returns null when not triggered.
   */
  private collapseRepeatsWithMap(text: string): LeetNormalization | null {
    let triggered = false;
    for (let j = 2; j < text.length; j++) {
      if (text[j] === text[j - 1] && text[j] === text[j - 2]) {
        triggered = true;
        break;
      }
    }
    if (!triggered) return null;

    const parts: string[] = [];
    const starts: number[] = [];
    const ends: number[] = [];
    let i = 0;
    while (i < text.length) {
      let runEnd = i + 1;
      while (runEnd < text.length && text[runEnd] === text[i]) {
        runEnd++;
      }
      parts.push(text[i]);
      starts.push(i);
      ends.push(runEnd);
      i = runEnd;
    }
    return { normalized: parts.join(""), starts, ends };
  }

  /**
   * Build the list of (text, position-map) variants to scan: the base text
   * plus unicode-folded, leet-normalized and repeat-collapsed variants, each
   * included only when its normalization actually changed something.
   */
  private buildScanPasses(
    normalizedText: string
  ): Array<{ text: string; posMap?: LeetNormalization }> {
    const passes: Array<{ text: string; posMap?: LeetNormalization }> = [
      { text: normalizedText },
    ];
    let workText = normalizedText;
    let workMap: LeetNormalization | undefined;

    if (this.evasionUnicode) {
      const uni = this.unicodeNormalizeWithMap(normalizedText);
      if (uni) {
        passes.push({ text: uni.normalized, posMap: uni });
        workText = uni.normalized;
        workMap = uni;
      }
    }

    if (this.enableLeetSpeak) {
      const leet = this.normalizeLeetSpeakWithMap(workText);
      if (leet.normalized !== workText) {
        passes.push({
          text: leet.normalized,
          posMap: workMap ? composeMaps(workMap, leet) : leet,
        });
      }
    }

    if (this.evasionRepeatedChars) {
      const collapsed = this.collapseRepeatsWithMap(workText);
      if (collapsed) {
        passes.push({
          text: collapsed.normalized,
          posMap: workMap ? composeMaps(workMap, collapsed) : collapsed,
        });
      }
    }

    return passes;
  }

  /**
   * Find dictionary words hidden behind masked characters ("f*ck", "f#ck").
   * Each mask matches exactly one character and the token's visible letters
   * must align with a dictionary word, so "c#" or "5% off" never flag.
   */
  private findMaskedMatches(
    searchText: string,
    originalText: string
  ): MatchResult[] {
    const results: MatchResult[] = [];
    if (!/[*#@$%]/.test(searchText)) return results;

    const tokenRegex = /[\p{L}*#@$%]+/gu;
    let tokenMatch: RegExpExecArray | null;
    while ((tokenMatch = tokenRegex.exec(searchText)) !== null) {
      const token = tokenMatch[0];
      let maskCount = 0;
      for (const char of token) {
        if (MASK_CHARS.has(char)) maskCount++;
      }
      if (maskCount === 0 || maskCount > 2) continue;
      if (
        MASK_CHARS.has(token[0]) ||
        MASK_CHARS.has(token[token.length - 1])
      ) {
        continue;
      }

      const word = this.profanityTrie.findWildcardMatch(token, MASK_CHARS);
      if (!word) continue;

      const start = tokenMatch.index;
      const end = start + token.length;
      if (
        !this.detectPartialWords &&
        !this.isWholeWord(originalText, start, end)
      ) {
        continue;
      }
      const matchedText = originalText.substring(start, end);
      if (this.isWhitelistedMatch(word, matchedText)) continue;
      if (!this.hasWordBoundaries(originalText, start, end)) continue;

      results.push({ word, start, end, originalWord: matchedText });
    }
    return results;
  }

  /**
   * Find words spelled out with a uniform single separator ("f u c k",
   * "f.u.c.k"). The joined letters must equal a dictionary word exactly:
   * runs like "U S A" or letters inside spelled-out sentences never flag.
   */
  private findSeparatedMatches(
    searchText: string,
    originalText: string
  ): MatchResult[] {
    const results: MatchResult[] = [];
    // Single letters joined by one consistent separator, at least 3 letters,
    // not touching letters/digits on either side.
    const runRegex =
      /(?<![\p{L}\p{N}])\p{L}(?:([ ._\-/])\p{L})(?:\1\p{L})+(?![\p{L}\p{N}])/gu;
    let runMatch: RegExpExecArray | null;
    while ((runMatch = runRegex.exec(searchText)) !== null) {
      const run = runMatch[0];
      const separator = runMatch[1];
      const joined = run.split(separator).join("");

      const trieMatches = this.profanityTrie.findMatches(joined, 0, false);
      const exact = trieMatches.find((m) => m.end === joined.length);
      if (!exact) continue;

      const start = runMatch.index;
      const end = start + run.length;
      const matchedText = originalText.substring(start, end);
      if (
        this.isWhitelistedMatch(exact.word, joined) ||
        this.isWhitelistedMatch(exact.word, matchedText)
      ) {
        continue;
      }

      results.push({ word: exact.word, start, end, originalWord: matchedText });
    }
    return results;
  }

  /**
   * Find unambiguous profanity stems embedded inside larger tokens
   * ("sisfuck", "totalshitshow"). Only stems from EMBEDDED_STRONG_STEMS that
   * are currently in the dictionary are considered, and tokens listed in
   * EMBEDDED_SAFE_WORDS or the whitelist never flag. The whole containing
   * token is reported so cleaning masks all of it.
   */
  private findEmbeddedMatches(
    searchText: string,
    originalText: string
  ): MatchResult[] {
    const results: MatchResult[] = [];

    for (const stem of EMBEDDED_STRONG_STEMS) {
      // Respect remove()/clearList(): only flag stems still in the dictionary
      const exact = this.profanityTrie
        .findMatches(stem, 0, false)
        .some((m) => m.end === stem.length);
      if (!exact) continue;

      let index = searchText.indexOf(stem);
      while (index !== -1) {
        // Expand to the containing token
        let tokenStart = index;
        let tokenEnd = index + stem.length;
        while (tokenStart > 0 && /\w/.test(searchText[tokenStart - 1])) {
          tokenStart--;
        }
        while (
          tokenEnd < searchText.length &&
          /\w/.test(searchText[tokenEnd])
        ) {
          tokenEnd++;
        }

        const token = searchText.substring(tokenStart, tokenEnd);
        const isEmbedded = token !== stem; // exact tokens are the base pass's job
        if (
          isEmbedded &&
          !EMBEDDED_SAFE_WORDS.has(token.toLowerCase()) &&
          !this.isWhitelisted(token) &&
          !this.isWhitelistedMatch(stem, token)
        ) {
          results.push({
            word: stem,
            start: tokenStart,
            end: tokenEnd,
            originalWord: originalText.substring(tokenStart, tokenEnd),
          });
        }

        index = searchText.indexOf(stem, tokenEnd);
      }
    }

    return results;
  }

  /**
   * Check if a match is bounded by word boundaries (strict mode).
   * @param text - The text.
   * @param start - Start index.
   * @param end - End index.
   * @returns True if match is at word boundaries, false otherwise.
   */
  private hasWordBoundaries(text: string, start: number, end: number): boolean {
    if (!this.strictMode) return true;
    const beforeChar = start > 0 ? text[start - 1] : " ";
    const afterChar = end < text.length ? text[end] : " ";
    const wordBoundaryRegex = /[\s\p{P}\p{S}]/u;
    return (
      wordBoundaryRegex.test(beforeChar) && wordBoundaryRegex.test(afterChar)
    );
  }

  /**
   * Determine if a match is a whole word.
   * @param text - The text.
   * @param start - Start index.
   * @param end - End index.
   * @returns True if whole word, false otherwise.
   */
  private isWholeWord(text: string, start: number, end: number): boolean {
    if (start !== 0 && /\w/.test(text[start - 1])) return false;
    if (end !== text.length && /\w/.test(text[end])) return false;
    return true;
  }

  /**
   * Check if a match is whitelisted.
   * @param word - Word from dictionary.
   * @param matchedText - Actual matched text.
   * @returns True if whitelisted, false otherwise.
   */
  private isWhitelistedMatch(word: string, matchedText: string): boolean {
    if (this.caseSensitive) {
      return this.whitelistSet.has(word) || this.whitelistSet.has(matchedText);
    } else {
      return (
        this.whitelistSet.has(word.toLowerCase()) ||
        this.whitelistSet.has(matchedText.toLowerCase())
      );
    }
  }

  /**
   * In partial-word mode, check whether the word CONTAINING the match is
   * whitelisted: with "classic" whitelisted, the embedded "ass" must not flag.
   */
  private isWhitelistedContainingWord(
    originalText: string,
    start: number,
    end: number
  ): boolean {
    if (!this.detectPartialWords || this.whitelistSet.size === 0) {
      return false;
    }
    let tokenStart = start;
    let tokenEnd = end;
    while (tokenStart > 0 && /\w/.test(originalText[tokenStart - 1])) {
      tokenStart--;
    }
    while (tokenEnd < originalText.length && /\w/.test(originalText[tokenEnd])) {
      tokenEnd++;
    }
    if (tokenStart === start && tokenEnd === end) {
      return false; // match is the whole token; already covered by isWhitelistedMatch
    }
    return this.isWhitelisted(originalText.substring(tokenStart, tokenEnd));
  }

  /**
   * Remove overlapping matches, keeping only the longest at each start position.
   * @param matches - Array of match results.
   * @returns Deduplicated matches.
   */
  private deduplicateMatches(matches: MatchResult[]): MatchResult[] {
    const sorted = [...matches].sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      return b.end - a.end;
    });
    const result: MatchResult[] = [];
    let lastEnd = -1;
    for (const match of sorted) {
      if (match.start >= lastEnd) {
        result.push(match);
        lastEnd = match.end;
      }
    }
    return result;
  }

  /**
   * Use Aho-Corasick algorithm for pattern matching
   */
  private findMatchesWithAhoCorasick(
    searchText: string,
    originalText: string,
    posMap?: LeetNormalization
  ): MatchResult[] {
    if (!this.ahoCorasickAutomaton) {
      return [];
    }

    const ahoMatches = this.ahoCorasickAutomaton.findAll(searchText);
    const results: MatchResult[] = [];

    for (const match of ahoMatches) {
      const start = posMap ? posMap.starts[match.start] : match.start;
      const end = posMap ? posMap.ends[match.end - 1] : match.end;

      if (
        !this.detectPartialWords &&
        !this.isWholeWord(originalText, start, end)
      ) {
        continue;
      }

      const matchedText = originalText.substring(start, end);
      if (this.isWhitelistedMatch(match.pattern, matchedText)) {
        continue;
      }
      if (this.isWhitelistedContainingWord(originalText, start, end)) {
        continue;
      }

      if (this.hasWordBoundaries(originalText, start, end)) {
        results.push({
          word: match.pattern,
          start,
          end,
          originalWord: matchedText,
        });
      }
    }

    return results;
  }

  /**
   * Check whether the Bloom Filter can quickly rule out any profanity in the
   * text. Only safe for ASCII whole-word matching: partial matches and
   * non-ASCII scripts can match inside tokens, so they bypass the prefilter.
   */
  private bloomQuickReject(searchText: string): boolean {
    if (!this.bloomFilter || this.detectPartialWords) return false;
    // eslint-disable-next-line no-control-regex
    if (!/^[\x00-\x7F]*$/.test(searchText)) return false;

    const tokens = searchText.split(/[^\p{L}\p{N}]+/u);
    for (const token of tokens) {
      if (token.length > 0 && this.bloomFilter.mightContain(token)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Hybrid approach: Bloom Filter for quick rejection, Aho-Corasick for matching
   */
  private findMatchesHybrid(
    searchText: string,
    originalText: string,
    posMap?: LeetNormalization
  ): MatchResult[] {
    if (this.bloomQuickReject(searchText)) {
      return [];
    }

    // Use Aho-Corasick for primary matching if available
    if (this.ahoCorasickAutomaton) {
      return this.findMatchesWithAhoCorasick(searchText, originalText, posMap);
    }

    // Fallback to Trie if Aho-Corasick not available
    const matches: MatchResult[] = [];
    this.findMatches(searchText, originalText, matches, posMap);
    return matches;
  }

  /**
   * Apply context analysis to filter false positives
   */
  private applyContextAnalysis(
    text: string,
    matches: MatchResult[],
    scoreThreshold: number = 0.5
  ): MatchResult[] {
    if (!this.contextAnalyzer) {
      return matches;
    }

    return matches.filter((match) => {
      const analysis = this.contextAnalyzer!.analyzeContext(
        text,
        match.start,
        match.end,
        match.word
      );

      // If score is above threshold, it's likely profanity
      return analysis.score >= scoreThreshold;
    });
  }

  /**
   * Drop all cached detection results. Must be called whenever the word lists
   * or any option that affects detection output changes.
   */
  private invalidateCache(): void {
    this.resultCache?.clear();
  }

  /**
   * Detects profanity in the provided text and returns comprehensive analysis.
   *
   * @param {string} text - The text to analyze for profanity
   * @returns {ProfanityDetectionResult} Detailed detection result including matches, positions, severity, and cleaned text
   *
   * @throws {TypeError} If text is not a string
   *
   * @remarks
   * ### Performance:
   * - Time Complexity: O(n*m) where n is text length, m is average word length in dictionary
   * - With Bloom Filter: O(n) average case (faster early rejection)
   * - With Caching: O(1) for repeated identical text
   *
   * ### Features:
   * - Detects leet speak variations (if enabled): "h3ll0" → "hello"
   * - Respects word boundaries (strict mode) or detects partial matches
   * - Returns exact positions for highlighting/masking
   * - Calculates severity based on match count and uniqueness
   *
   * ### Caching:
   * - Results are cached if `performance.enableCaching` is true
   * - Cache uses LRU eviction when size limit is reached
   *
   * @example
   * ```typescript
   * const filter = new AllProfanity();
   * const result = filter.detect("This has bad words");
   *
   * console.log(result.hasProfanity); // true
   * console.log(result.detectedWords); // ['bad']
   * console.log(result.cleanedText); // 'This has *** words'
   * console.log(result.severity); // ProfanitySeverity.MILD
   * console.log(result.positions); // [{ word: 'bad', start: 9, end: 12 }]
   * ```
   *
   * @example
   * ```typescript
   * // With leet speak detection
   * const filter = new AllProfanity({ enableLeetSpeak: true });
   * const result = filter.detect("st0p b3ing b@d");
   *
   * if (result.hasProfanity) {
   *   result.positions.forEach(pos => {
   *     console.log(`Found "${pos.word}" at position ${pos.start}-${pos.end}`);
   *   });
   * }
   * ```
   *
   * @see {@link ProfanityDetectionResult} for result structure
   * @see {@link ProfanitySeverity} for severity levels
   */
  detect(text: string): ProfanityDetectionResult {
    const validatedText = validateString(text, "text");
    if (validatedText.length === 0) {
      return {
        hasProfanity: false,
        detectedWords: [],
        cleanedText: validatedText,
        severity: ProfanitySeverity.NONE,
        positions: [],
      };
    }

    // Check cache first if enabled (refresh recency for LRU eviction)
    if (this.resultCache) {
      const cached = this.resultCache.get(validatedText);
      if (cached) {
        this.resultCache.delete(validatedText);
        this.resultCache.set(validatedText, cached);
        return cached;
      }
    }

    let matches: MatchResult[] = [];
    const normalizedText = this.caseSensitive
      ? validatedText
      : validatedText.toLowerCase();

    // Scan the base text plus every triggered normalization variant
    // (unicode folding, leet speak, repeated-character collapse)
    for (const pass of this.buildScanPasses(normalizedText)) {
      switch (this.matchingAlgorithm) {
        case "aho-corasick":
          matches.push(
            ...this.findMatchesWithAhoCorasick(
              pass.text,
              validatedText,
              pass.posMap
            )
          );
          break;

        case "hybrid":
          matches.push(
            ...this.findMatchesHybrid(pass.text, validatedText, pass.posMap)
          );
          break;

        case "trie":
        default:
          this.findMatches(pass.text, validatedText, matches, pass.posMap);
          break;
      }
    }

    if (this.evasionMaskedChars) {
      matches.push(...this.findMaskedMatches(normalizedText, validatedText));
    }
    if (this.evasionSeparatedLetters) {
      matches.push(
        ...this.findSeparatedMatches(normalizedText, validatedText)
      );
    }
    if (this.evasionEmbeddedWords) {
      matches.push(...this.findEmbeddedMatches(normalizedText, validatedText));
    }

    // Apply context analysis if enabled
    if (this.contextAnalyzer) {
      matches = this.applyContextAnalysis(
        validatedText,
        matches,
        this.contextScoreThreshold
      );
    }

    const uniqueMatches = this.deduplicateMatches(matches);
    const detectedWords = uniqueMatches.map((m) => m.originalWord);
    const severity = this.calculateSeverity(uniqueMatches);
    const cleanedText = this.generateCleanedText(validatedText, uniqueMatches);

    const result: ProfanityDetectionResult = {
      hasProfanity: uniqueMatches.length > 0,
      detectedWords,
      cleanedText,
      severity,
      positions: uniqueMatches.map((m) => ({
        word: m.originalWord,
        start: m.start,
        end: m.end,
      })),
    };

    // Cache result if caching is enabled (evict least recently used entry)
    if (this.resultCache) {
      if (this.resultCache.size >= this.cacheMaxSize) {
        const oldestKey = this.resultCache.keys().next().value;
        if (oldestKey !== undefined) {
          this.resultCache.delete(oldestKey);
        }
      }
      this.resultCache.set(validatedText, result);
    }

    return result;
  }

  /**
   * Main matching function, with whole-word logic.
   * @param searchText - The normalized text to search.
   * @param originalText - The original text.
   * @param matches - Array to collect matches.
   */
  private findMatches(
    searchText: string,
    originalText: string,
    matches: MatchResult[],
    posMap?: LeetNormalization
  ): void {
    for (let i = 0; i < searchText.length; i++) {
      const matchResults = this.profanityTrie.findMatches(
        searchText,
        i,
        this.detectPartialWords
      );
      for (const match of matchResults) {
        const searchStart = i + match.start;
        const searchEnd = i + match.end;
        const start = posMap ? posMap.starts[searchStart] : searchStart;
        const end = posMap ? posMap.ends[searchEnd - 1] : searchEnd;
        if (
          !this.detectPartialWords &&
          !this.isWholeWord(originalText, start, end)
        ) {
          continue;
        }
        const matchedText = originalText.substring(start, end);
        if (this.isWhitelistedMatch(match.word, matchedText)) {
          continue;
        }
        if (this.isWhitelistedContainingWord(originalText, start, end)) {
          continue;
        }
        if (this.hasWordBoundaries(originalText, start, end)) {
          matches.push({
            word: match.word,
            start,
            end,
            originalWord: matchedText,
          });
        }
      }
    }
  }

  /**
   * Generate cleaned text by replacing profane words.
   * @param originalText - The original text.
   * @param matches - Array of matches.
   * @returns Cleaned text.
   */
  private generateCleanedText(
    originalText: string,
    matches: MatchResult[]
  ): string {
    if (matches.length === 0) return originalText;

    let result = originalText;
    const sortedMatches = [...this.deduplicateMatches(matches)].sort(
      (a, b) => b.start - a.start
    );

    for (const match of sortedMatches) {
      const replacement = this.defaultPlaceholder.repeat(
        match.originalWord.length
      );
      result =
        result.substring(0, match.start) +
        replacement +
        result.substring(match.end);
    }

    return result;
  }

  /**
   * Quick boolean check for profanity presence in text.
   *
   * @param {string} text - The text to check for profanity
   * @returns {boolean} True if profanity is detected, false otherwise
   *
   * @throws {TypeError} If text is not a string
   *
   * @remarks
   * - Convenience method that internally calls `detect()` and returns only the boolean result
   * - For detailed information about matches, use `detect()` instead
   * - Results are cached if caching is enabled (same cache as `detect()`)
   *
   * @example
   * ```typescript
   * const filter = new AllProfanity();
   *
   * if (filter.check("This has bad words")) {
   *   console.log("Profanity detected!");
   * }
   *
   * // Quick validation
   * const isClean = !filter.check(userInput);
   * ```
   *
   * @see {@link detect} for detailed profanity analysis
   */
  check(text: string): boolean {
    const validatedText = validateString(text, "text");
    if (validatedText.length === 0) return false;

    // Reuse a cached full result when available
    if (this.resultCache) {
      const cached = this.resultCache.get(validatedText);
      if (cached) return cached.hasProfanity;
    }

    // Context analysis scores matches against their surroundings; reuse the
    // full pipeline so check() and detect() can never disagree.
    if (this.contextAnalyzer) {
      return this.detect(validatedText).hasProfanity;
    }

    const normalizedText = this.caseSensitive
      ? validatedText
      : validatedText.toLowerCase();

    // Early exit on the first accepted match — unlike detect(), no positions,
    // severity or cleaned text are computed. The base text is scanned before
    // any normalization variants are built, so plainly profane text returns
    // without paying for normalization at all.
    if (this.hasMatchInPass(normalizedText, validatedText)) {
      return true;
    }
    const passes = this.buildScanPasses(normalizedText);
    for (let p = 1; p < passes.length; p++) {
      if (this.hasMatchInPass(passes[p].text, validatedText, passes[p].posMap)) {
        return true;
      }
    }
    if (
      this.evasionMaskedChars &&
      this.findMaskedMatches(normalizedText, validatedText).length > 0
    ) {
      return true;
    }
    if (
      this.evasionSeparatedLetters &&
      this.findSeparatedMatches(normalizedText, validatedText).length > 0
    ) {
      return true;
    }
    if (
      this.evasionEmbeddedWords &&
      this.findEmbeddedMatches(normalizedText, validatedText).length > 0
    ) {
      return true;
    }
    return false;
  }

  /**
   * Trie scan that stops at the first match surviving the whole-word,
   * whitelist and boundary checks. Powers the fast path in check().
   */
  private hasMatchInPass(
    searchText: string,
    originalText: string,
    posMap?: LeetNormalization
  ): boolean {
    for (let i = 0; i < searchText.length; i++) {
      const matchResults = this.profanityTrie.findMatches(
        searchText,
        i,
        this.detectPartialWords
      );
      for (const match of matchResults) {
        const searchEnd = i + match.end;
        const start = posMap ? posMap.starts[i] : i;
        const end = posMap ? posMap.ends[searchEnd - 1] : searchEnd;
        if (
          !this.detectPartialWords &&
          !this.isWholeWord(originalText, start, end)
        ) {
          continue;
        }
        const matchedText = originalText.substring(start, end);
        if (this.isWhitelistedMatch(match.word, matchedText)) {
          continue;
        }
        if (this.isWhitelistedContainingWord(originalText, start, end)) {
          continue;
        }
        if (this.hasWordBoundaries(originalText, start, end)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Cleans text by replacing profanity with a placeholder character.
   *
   * @param {string} text - The text to clean
   * @param {string} [placeholder] - Optional custom placeholder character (uses default if not provided)
   * @returns {string} The cleaned text with profanity replaced
   *
   * @throws {TypeError} If text is not a string
   *
   * @remarks
   * ### Character-level Replacement:
   * - Each profane character is replaced individually
   * - "bad" with placeholder "*" becomes "***"
   * - Preserves text length and structure
   *
   * ### Placeholder Behavior:
   * - If no placeholder provided, uses the instance's default placeholder
   * - If placeholder provided, uses only the first character
   * - Empty placeholder throws error
   *
   * @example
   * ```typescript
   * const filter = new AllProfanity();
   *
   * // Using default placeholder (*)
   * const cleaned = filter.clean("This has bad words");
   * console.log(cleaned); // "This has *** *****"
   *
   * // Using custom placeholder
   * const cleaned = filter.clean("This has bad words", "#");
   * console.log(cleaned); // "This has ### #####"
   * ```
   *
   * @example
   * ```typescript
   * // Clean user-generated content for display
   * const userComment = "Some inappropriate words here";
   * const safeComment = filter.clean(userComment);
   * displayComment(safeComment);
   * ```
   *
   * @see {@link cleanWithPlaceholder} for word-level replacement
   * @see {@link setPlaceholder} to change default placeholder
   */
  clean(text: string, placeholder?: string): string {
    const detection = this.detect(text);

    if (!placeholder || placeholder === this.defaultPlaceholder) {
      return detection.cleanedText;
    }

    let result = text;
    const sortedPositions = [
      ...this.deduplicateMatches(
        detection.positions.map((p) => ({
          word: p.word,
          start: p.start,
          end: p.end,
          originalWord: text.substring(p.start, p.end),
        }))
      ),
    ].sort((a, b) => b.start - a.start);

    const placeholderChar = placeholder.charAt(0);
    for (const pos of sortedPositions) {
      const originalWord = text.substring(pos.start, pos.end);
      const replacement = placeholderChar.repeat(originalWord.length);
      result =
        result.substring(0, pos.start) +
        replacement +
        result.substring(pos.end);
    }

    return result;
  }

  /**
   * Cleans text by replacing each profane word with a single placeholder string (word-level replacement).
   *
   * @param {string} text - The text to clean
   * @param {string} [placeholder="***"] - The placeholder string to use for each profane word
   * @returns {string} The cleaned text with each profane word replaced by the placeholder
   *
   * @throws {TypeError} If text is not a string
   *
   * @remarks
   * ### Word-level Replacement:
   * - Each profane word is replaced with the entire placeholder string (not character-by-character)
   * - "bad words" with placeholder "***" becomes "*** ***"
   * - Does NOT preserve original text length
   *
   * ### Difference from `clean()`:
   * - `clean()`: Character-level replacement - "bad" becomes "***" (preserves length)
   * - `cleanWithPlaceholder()`: Word-level replacement - "bad" becomes "***" (fixed placeholder)
   *
   * @example
   * ```typescript
   * const filter = new AllProfanity();
   *
   * // Default placeholder (***) const text = "This has bad words";
   * const cleaned = filter.cleanWithPlaceholder(text);
   * console.log(cleaned); // "This has *** ***"
   *
   * // Custom placeholder
   * const cleaned2 = filter.cleanWithPlaceholder(text, "[CENSORED]");
   * console.log(cleaned2); // "This has [CENSORED] [CENSORED]"
   * ```
   *
   * @example
   * ```typescript
   * // Censoring chat messages
   * const message = "You are a badword and stupid";
   * const censored = filter.cleanWithPlaceholder(message, "[***]");
   * // Result: "You are a [***] and [***]"
   * ```
   *
   * @see {@link clean} for character-level replacement
   */
  cleanWithPlaceholder(text: string, placeholder: string = "***"): string {
    const detection = this.detect(text);
    if (detection.positions.length === 0) return text;

    let result = text;
    const sortedPositions = [
      ...this.deduplicateMatches(
        detection.positions.map((p) => ({
          word: p.word,
          start: p.start,
          end: p.end,
          originalWord: text.substring(p.start, p.end),
        }))
      ),
    ].sort((a, b) => b.start - a.start);

    for (const pos of sortedPositions) {
      if (!this.isWholeWord(result, pos.start, pos.end)) continue;
      result =
        result.substring(0, pos.start) +
        placeholder +
        result.substring(pos.end);
    }

    return result;
  }

  /**
   * Dynamically adds one or more words to the profanity filter at runtime.
   *
   * @param {string | string[]} word - A single word or array of words to add to the filter
   * @returns {void}
   *
   * @remarks
   * ### Behavior:
   * - Words are added to all active data structures (Trie, Aho-Corasick, Bloom Filter)
   * - Automatically normalizes words based on caseSensitive setting
   * - Skips whitelisted words
   * - Validates and filters out non-string or empty values
   * - Changes take effect immediately for subsequent detect/check/clean calls
   *
   * ### Use Cases:
   * - Adding context-specific profanity
   * - Building dynamic word lists from user reports
   * - Customizing filters for specific communities/applications
   *
   * @example
   * ```typescript
   * const filter = new AllProfanity();
   *
   * // Add single word
   * filter.add('newbadword');
   *
   * // Add multiple words
   * filter.add(['word1', 'word2', 'word3']);
   *
   * // Now these words will be detected
   * filter.check('newbadword'); // true
   * ```
   *
   * @example
   * ```typescript
   * // Add game-specific slang dynamically
   * const filter = new AllProfanity();
   * const gamingSlang = ['noob', 'trash', 'tryhard'];
   * filter.add(gamingSlang);
   *
   * const message = "You're such a noob";
   * console.log(filter.check(message)); // true
   * ```
   *
   * @see {@link remove} to remove words
   * @see {@link loadCustomDictionary} for loading named dictionaries
   */
  add(word: string | string[]): void {
    const words = Array.isArray(word) ? word : [word];
    const validatedWords = validateStringArray(
      words,
      "words to add",
      this.logger
    );
    for (const w of validatedWords) {
      this.dynamicWords.add(w);
      this.addWordToTrie(w);
    }
    this.invalidateCache();
  }

  /**
   * Dynamically removes one or more words from the profanity filter at runtime.
   *
   * @param {string | string[]} word - A single word or array of words to remove from the filter
   * @returns {void}
   *
   * @remarks
   * ### Behavior:
   * - Removes words from all active data structures (Trie, dynamic words set)
   * - Normalizes words based on caseSensitive setting before removal
   * - Only removes dynamically added words, not words from loaded language dictionaries
   * - Changes take effect immediately for subsequent detect/check/clean calls
   *
   * ### Important Notes:
   * - Cannot remove words from built-in language dictionaries
   * - To exclude dictionary words, use `addToWhitelist()` instead
   * - Validates and filters out non-string or empty values
   *
   * @example
   * ```typescript
   * const filter = new AllProfanity();
   *
   * // Add then remove a word
   * filter.add('tempword');
   * filter.check('tempword'); // true
   *
   * filter.remove('tempword');
   * filter.check('tempword'); // false
   *
   * // Remove multiple words
   * filter.remove(['word1', 'word2']);
   * ```
   *
   * @example
   * ```typescript
   * // Managing custom word list
   * const filter = new AllProfanity();
   * filter.add(['custom1', 'custom2', 'custom3']);
   *
   * // Later, remove one that's no longer needed
   * filter.remove('custom2');
   * ```
   *
   * @see {@link add} to add words
   * @see {@link addToWhitelist} to exclude dictionary words without removing them
   */
  remove(word: string | string[]): void {
    const words = Array.isArray(word) ? word : [word];
    const validatedWords = validateStringArray(
      words,
      "words to remove",
      this.logger
    );
    for (const w of validatedWords) {
      const normalizedWord = this.caseSensitive ? w : w.toLowerCase();
      this.profanityTrie.removeWord(normalizedWord);
      this.dynamicWords.delete(w);
      // Bloom filter entries cannot be deleted, but stale entries only cost a
      // skipped quick-rejection — they can never produce a match by themselves.
      this.ahoCorasickAutomaton?.removePattern(normalizedWord);
    }
    this.invalidateCache();
  }

  /**
   * Add words to the whitelist.
   * @param words - Words to whitelist.
   */
  addToWhitelist(words: string[]): void {
    const validatedWords = validateStringArray(
      words,
      "whitelist words",
      this.logger
    );
    for (const word of validatedWords) {
      const normalizedWord = this.caseSensitive ? word : word.toLowerCase();
      this.whitelistSet.add(normalizedWord);
    }
    this.invalidateCache();
  }

  /**
   * Remove words from the whitelist.
   * @param words - Words to remove from whitelist.
   */
  removeFromWhitelist(words: string[]): void {
    const validatedWords = validateStringArray(
      words,
      "whitelist words",
      this.logger
    );
    for (const word of validatedWords) {
      const normalizedWord = this.caseSensitive ? word : word.toLowerCase();
      this.whitelistSet.delete(normalizedWord);
    }
    this.invalidateCache();
  }

  /**
   * Check if a word is whitelisted.
   * @param word - The word to check.
   * @returns True if whitelisted, false otherwise.
   */
  private isWhitelisted(word: string): boolean {
    const normalizedWord = this.caseSensitive ? word : word.toLowerCase();
    return this.whitelistSet.has(normalizedWord);
  }

  /**
   * Loads a built-in language dictionary into the profanity filter.
   *
   * @param {string} language - The language key to load (case-insensitive)
   * @returns {boolean} True if language was loaded successfully, false if not found or already loaded
   *
   * @remarks
   * ### Available Languages:
   * - `'english'` - English profanity words
   * - `'hindi'` - Hindi profanity words
   * - `'french'` - French profanity words
   * - `'german'` - German profanity words
   * - `'spanish'` - Spanish profanity words
   * - `'bengali'` - Bengali profanity words
   * - `'tamil'` - Tamil profanity words
   * - `'telugu'` - Telugu profanity words
   * - `'brazilian'` - Brazilian Portuguese profanity words
   *
   * ### Behavior:
   * - Language keys are case-insensitive
   * - Loading is idempotent - calling multiple times for same language is safe
   * - Returns true if language loaded successfully or was already loaded
   * - Returns false if language not found
   * - Logs success/failure messages (unless silent mode enabled)
   * - Words are added to all active data structures
   *
   * ### Default Languages:
   * English and Hindi are loaded automatically in the constructor
   *
   * @example
   * ```typescript
   * const filter = new AllProfanity();
   *
   * // Load additional languages
   * filter.loadLanguage('french');
   * filter.loadLanguage('spanish');
   *
   * // Case-insensitive
   * filter.loadLanguage('GERMAN'); // Works
   *
   * // Check if loaded
   * console.log(filter.getLoadedLanguages()); // ['english', 'hindi', 'french', 'spanish', 'german']
   * ```
   *
   * @example
   * ```typescript
   * // Load all Indian languages at once
   * const filter = new AllProfanity();
   * filter.loadIndianLanguages();
   * ```
   *
   * @see {@link loadLanguages} to load multiple languages at once
   * @see {@link loadIndianLanguages} for convenience method
   * @see {@link getAvailableLanguages} to see all available languages
   * @see {@link getLoadedLanguages} to see currently loaded languages
   */
  loadLanguage(language: string): boolean {
    if (!language || typeof language !== "string") {
      this.logger.warn(`Invalid language parameter: ${language}`);
      return false;
    }

    const langKey = language.toLowerCase().trim();

    if (this.loadedLanguages.has(langKey)) {
      return true;
    }

    const words = this.availableLanguages[langKey];
    if (!words || words.length === 0) {
      this.logger.warn(`Language '${language}' not found or empty`);
      return false;
    }

    try {
      let addedCount = 0;
      for (const word of words) {
        if (this.addWordToTrie(word)) {
          addedCount++;
        }
      }

      this.loadedLanguages.add(langKey);
      this.invalidateCache();
      this.logger.info(
        `Loaded ${addedCount} words from ${language} dictionary`
      );
      return true;
    } catch (error) {
      this.logger.error(`Failed to load language ${language}: ${error}`);
      return false;
    }
  }

  /**
   * Load multiple language dictionaries.
   * @param languages - Array of languages to load.
   * @returns Number of successfully loaded languages.
   */
  loadLanguages(languages: string[]): number {
    const validatedLanguages = validateStringArray(
      languages,
      "languages",
      this.logger
    );
    return validatedLanguages.reduce((count, lang) => {
      return this.loadLanguage(lang) ? count + 1 : count;
    }, 0);
  }

  /**
   * Load all supported Indian languages.
   * @returns Number of loaded Indian languages.
   */
  loadIndianLanguages(): number {
    const indianLanguages = ["hindi", "bengali", "tamil", "telugu"];
    return this.loadLanguages(indianLanguages);
  }

  /**
   * Loads a custom dictionary of profane words with a specific name.
   *
   * @param {string} name - Unique name/identifier for this custom dictionary
   * @param {string[]} words - Array of profane words to add to the dictionary
   * @returns {void}
   *
   * @throws {TypeError} If name is not a string or words is not an array
   *
   * @remarks
   * ### Behavior:
   * - Creates a new named dictionary or overwrites existing one with same name
   * - Validates and filters out non-string and empty values from words array
   * - Words are added to all active data structures (Trie, Aho-Corasick, Bloom Filter)
   * - Dictionary name is converted to lowercase for storage
   * - Logs count of loaded words (unless silent mode enabled)
   *
   * ### Use Cases:
   * - Domain-specific profanity (gaming, medical, legal, etc.)
   * - Organization-specific word lists
   * - Temporary or context-dependent filters
   * - Testing and development
   *
   * @example
   * ```typescript
   * const filter = new AllProfanity();
   *
   * // Load gaming-specific slang
   * filter.loadCustomDictionary('gaming', [
   *   'noob',
   *   'scrub',
   *   'tryhard',
   *   'trash'
   * ]);
   *
   * // Load company-specific terms
   * filter.loadCustomDictionary('company', [
   *   'competitor1',
   *   'bannedTerm1',
   *   'inappropriateJargon'
   * ]);
   *
   * console.log(filter.check('You are such a noob')); // true
   * ```
   *
   * @example
   * ```typescript
   * // Load from external source
   * const filter = new AllProfanity();
   *
   * async function loadExternalDictionary() {
   *   const response = await fetch('https://example.com/custom-words.json');
   *   const customWords = await response.json();
   *   filter.loadCustomDictionary('external', customWords);
   * }
   * ```
   *
   * @see {@link add} for adding individual words dynamically
   * @see {@link loadLanguage} for loading built-in language dictionaries
   */
  loadCustomDictionary(name: string, words: string[]): void {
    validateString(name, "dictionary name");
    const validatedWords = validateStringArray(
      words,
      "custom dictionary words",
      this.logger
    );

    if (validatedWords.length === 0) {
      this.logger.warn(`Custom dictionary '${name}' contains no valid words`);
      return;
    }

    try {
      let addedCount = 0;
      for (const word of validatedWords) {
        if (this.addWordToTrie(word)) {
          addedCount++;
        }
      }

      this.availableLanguages[name.toLowerCase()] = validatedWords;
      this.loadedLanguages.add(name.toLowerCase());
      this.invalidateCache();

      this.logger.info(
        `Loaded ${addedCount} words from custom dictionary '${name}'`
      );
    } catch (error) {
      this.logger.error(`Failed to load custom dictionary ${name}: ${error}`);
    }
  }

  /**
   * Add a single word to the trie.
   * @param word - The word to add.
   * @returns True if added, false otherwise.
   */
  private addWordToTrie(word: string): boolean {
    if (!word || typeof word !== "string" || word.trim().length === 0) {
      return false;
    }

    const normalizedWord = this.caseSensitive
      ? word.trim()
      : word.trim().toLowerCase();

    if (this.isWhitelisted(normalizedWord)) {
      return false;
    }

    // Add to Trie (always used as fallback)
    this.profanityTrie.addWord(normalizedWord);

    // Add to Bloom Filter if enabled. Constituent tokens of multi-word or
    // symbol-containing entries are added too, so the token-level quick
    // rejection in bloomQuickReject() can never miss a phrase.
    if (this.bloomFilter) {
      this.bloomFilter.add(normalizedWord);
      const tokens = normalizedWord.split(/[^\p{L}\p{N}]+/u);
      for (const token of tokens) {
        if (token.length > 0 && token !== normalizedWord) {
          this.bloomFilter.add(token);
        }
      }
    }

    // Add to Aho-Corasick automaton if enabled
    if (this.ahoCorasickAutomaton) {
      this.ahoCorasickAutomaton.addPattern(normalizedWord);
    }

    return true;
  }

  /**
   * Calculate severity from matches.
   * @param matches - Array of matches.
   * @returns Severity level.
   */
  private calculateSeverity(matches: MatchResult[]): ProfanitySeverity {
    if (matches.length === 0) return ProfanitySeverity.NONE;

    const uniqueWords = new Set(matches.map((m) => m.word)).size;
    const totalMatches = matches.length;

    if (totalMatches >= 5 || uniqueWords >= 4) return ProfanitySeverity.EXTREME;
    if (totalMatches >= 3 || uniqueWords >= 3) return ProfanitySeverity.SEVERE;
    if (totalMatches >= 2 || uniqueWords >= 2)
      return ProfanitySeverity.MODERATE;
    return ProfanitySeverity.MILD;
  }

  /**
   * Clear all loaded dictionaries and dynamic words.
   */
  clearList(): void {
    this.profanityTrie.clear();
    this.loadedLanguages.clear();
    this.dynamicWords.clear();
    this.ahoCorasickAutomaton?.clear();
    this.bloomFilter?.clear();
    this.invalidateCache();
  }

  /**
   * Set the placeholder character for filtered words.
   * @param placeholder - The placeholder character.
   */
  setPlaceholder(placeholder: string): void {
    validateString(placeholder, "placeholder");

    if (placeholder.length === 0) {
      throw new Error("Placeholder cannot be empty");
    }

    this.defaultPlaceholder = placeholder.charAt(0);
    this.invalidateCache();
  }

  /**
   * Get the list of loaded languages.
   * @returns Array of loaded language keys.
   */
  getLoadedLanguages(): string[] {
    return Array.from(this.loadedLanguages);
  }

  /**
   * Get the list of available built-in languages.
   * @returns Array of available language keys.
   */
  getAvailableLanguages(): string[] {
    return Object.keys(this.availableLanguages);
  }

  /**
   * Get the current configuration of the profanity filter.
   * @returns Partial configuration object.
   */
  getConfig(): Partial<AllProfanityOptions> {
    return {
      defaultPlaceholder: this.defaultPlaceholder,
      enableLeetSpeak: this.enableLeetSpeak,
      caseSensitive: this.caseSensitive,
      strictMode: this.strictMode,
      detectPartialWords: this.detectPartialWords,
      languages: this.getLoadedLanguages(),
      whitelistWords: Array.from(this.whitelistSet),
    };
  }

  /**
   * Rebuild all matching structures (trie, Aho-Corasick automaton, Bloom
   * Filter) from loaded dictionaries and dynamic words.
   */
  private rebuildIndexes(): void {
    this.profanityTrie.clear();
    this.ahoCorasickAutomaton?.clear();
    this.bloomFilter?.clear();
    for (const lang of this.loadedLanguages) {
      const words = this.availableLanguages[lang] || [];
      for (const word of words) {
        this.addWordToTrie(word);
      }
    }
    for (const word of this.dynamicWords) {
      this.addWordToTrie(word);
    }
    this.invalidateCache();
  }

  /**
   * Update configuration options for the profanity filter.
   * @param options - Partial configuration object.
   */
  updateConfig(options: Partial<AllProfanityOptions>): void {
    let rebuildNeeded = false;
    if (options.defaultPlaceholder !== undefined) {
      this.setPlaceholder(options.defaultPlaceholder);
    }
    if (options.enableLeetSpeak !== undefined) {
      this.enableLeetSpeak = options.enableLeetSpeak;
    }
    if (
      options.caseSensitive !== undefined &&
      options.caseSensitive !== this.caseSensitive
    ) {
      this.caseSensitive = options.caseSensitive;
      rebuildNeeded = true;
    }
    if (options.strictMode !== undefined) {
      this.strictMode = options.strictMode;
    }
    if (options.detectPartialWords !== undefined) {
      this.detectPartialWords = options.detectPartialWords;
    }
    if (options.whitelistWords) {
      this.addToWhitelist(options.whitelistWords);
    }
    if (rebuildNeeded) {
      this.rebuildIndexes();
    }
    this.invalidateCache();
  }

  /**
   * Create an AllProfanity instance from a configuration object.
   * @param config - Configuration object
   * @returns A new AllProfanity instance
   */
  static fromConfig(config: AllProfanityOptions | any): AllProfanity {
    const options: AllProfanityOptions = {};

    if (config.algorithm) options.algorithm = config.algorithm;
    if (config.bloomFilter) options.bloomFilter = config.bloomFilter;
    if (config.ahoCorasick) options.ahoCorasick = config.ahoCorasick;
    if (config.contextAnalysis) options.contextAnalysis = config.contextAnalysis;
    if (config.evasionProtection) options.evasionProtection = config.evasionProtection;
    if (config.performance) options.performance = config.performance;
    if (config.silent !== undefined) options.silent = config.silent;

    if (config.profanityDetection) {
      options.enableLeetSpeak = config.profanityDetection.enableLeetSpeak;
      options.caseSensitive = config.profanityDetection.caseSensitive;
      options.strictMode = config.profanityDetection.strictMode;
      options.detectPartialWords = config.profanityDetection.detectPartialWords;
      options.defaultPlaceholder = config.profanityDetection.defaultPlaceholder;
    }

    if (config.enableLeetSpeak !== undefined) options.enableLeetSpeak = config.enableLeetSpeak;
    if (config.caseSensitive !== undefined) options.caseSensitive = config.caseSensitive;
    if (config.strictMode !== undefined) options.strictMode = config.strictMode;
    if (config.detectPartialWords !== undefined) options.detectPartialWords = config.detectPartialWords;
    if (config.defaultPlaceholder !== undefined) options.defaultPlaceholder = config.defaultPlaceholder;
    if (config.languages) options.languages = config.languages;
    if (config.whitelistWords) options.whitelistWords = config.whitelistWords;
    if (config.customDictionaries) options.customDictionaries = config.customDictionaries;
    if (config.logger) options.logger = config.logger;

    return new AllProfanity(options);
  }
}

/**
 * Singleton instance of AllProfanity with default configuration.
 * Silent so that importing the library never writes to the console.
 */
const allProfanity = new AllProfanity({ silent: true });
export default allProfanity;
