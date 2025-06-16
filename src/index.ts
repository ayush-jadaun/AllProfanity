// Import language dictionaries (assuming these exist)
import englishBadWords from "./languages/english-words.js";
import hindiBadWords from "./languages/hindi-words.js";
import frenchBadWords from "./languages/french-words.js";
import germanBadWords from "./languages/german-words.js";
import spanishBadWords from "./languages/spanish-words.js";
import bengaliBadWords from "./languages/bengali-words.js";
import tamilBadWords from "./languages/tamil-words.js";
import teluguBadWords from "./languages/telugu-words.js";

// Export language dictionaries for direct access
export { default as englishBadWords } from "./languages/english-words.js";
export { default as hindiBadWords } from "./languages/hindi-words.js";
export { default as frenchBadWords } from "./languages/french-words.js";
export { default as germanBadWords } from "./languages/german-words.js";
export { default as spanishBadWords } from "./languages/spanish-words.js";
export { default as bengaliBadWords } from "./languages/bengali-words.js";
export { default as tamilBadWords } from "./languages/tamil-words.js";
export { default as teluguBadWords } from "./languages/telugu-words.js";

/**
 * Logging interface for the library
 */
export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

/**
 * Default console logger implementation
 */
class ConsoleLogger implements Logger {
  info(message: string): void {
    console.log(`[AllProfanity] ${message}`);
  }

  warn(message: string): void {
    console.warn(`[AllProfanity] ${message}`);
  }

  error(message: string): void {
    console.error(`[AllProfanity] ${message}`);
  }
}

/**
 * Configuration options for AllProfanity
 */
export interface AllProfanityOptions {
  languages?: string[];
  customDictionaries?: Record<string, string[]>;
  defaultPlaceholder?: string;
  enableLeetSpeak?: boolean;
  caseSensitive?: boolean;
  whitelistWords?: string[];
  strictMode?: boolean;
  detectPartialWords?: boolean;
  logger?: Logger;
}

/**
 * Severity levels for profanity detection
 */
export enum ProfanitySeverity {
  MILD = 1,
  MODERATE = 2,
  SEVERE = 3,
  EXTREME = 4,
}

/**
 * Detection result interface
 */
export interface ProfanityDetectionResult {
  hasProfanity: boolean;
  detectedWords: string[];
  cleanedText: string;
  severity: ProfanitySeverity;
  positions: Array<{ word: string; start: number; end: number }>;
}

/**
 * Internal match result for efficient processing
 */
interface MatchResult {
  word: string;
  start: number;
  end: number;
  originalWord: string;
}

/**
 * Validates input parameters
 */
function validateString(input: unknown, paramName: string): string {
  if (typeof input !== "string") {
    throw new TypeError(`${paramName} must be a string, got ${typeof input}`);
  }
  return input;
}

function validateStringArray(input: unknown, paramName: string): string[] {
  if (!Array.isArray(input)) {
    throw new TypeError(`${paramName} must be an array`);
  }
  return input.filter((item): item is string => {
    if (typeof item !== "string") {
      console.warn(`Skipping non-string item in ${paramName}: ${item}`);
      return false;
    }
    return item.trim().length > 0;
  });
}

/**
 * Efficient Trie data structure for fast string matching
 */
class TrieNode {
  private children: Map<string, TrieNode> = new Map();
  private isEndOfWord: boolean = false;
  private word: string = "";

  /**
   * Add a word to the trie
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
   * Remove a word from the trie
   */
  removeWord(word: string): boolean {
    return this.removeHelper(word, 0);
  }

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
   * Find all matches starting at a given position
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
        if (!allowPartial) {
          const wordStart = startPos;
          const wordEnd = pos;

          matches.push({
            word: current.word,
            start: wordStart - startPos,
            end: wordEnd - startPos,
          });
        } else {
          matches.push({
            word: current.word,
            start: 0,
            end: pos - startPos,
          });
        }
      }
    }

    return matches;
  }

  /**
   * Clear all words from the trie
   */
  clear(): void {
    this.children.clear();
    this.isEndOfWord = false;
    this.word = "";
  }
}

/**
 * Advanced AllProfanity - Fixed profanity filter with multi-language support
 * Addresses all critical issues from the original implementation
 */
export class AllProfanity {
  private readonly profanityTrie: TrieNode = new TrieNode();
  private readonly whitelistSet: Set<string> = new Set();
  private readonly loadedLanguages: Set<string> = new Set();
  private readonly logger: Logger;

  // Configuration
  private defaultPlaceholder: string = "*";
  private enableLeetSpeak: boolean = true;
  private caseSensitive: boolean = false;
  private strictMode: boolean = false;
  private detectPartialWords: boolean = false;

  // Available language dictionaries
  private readonly availableLanguages: Record<string, string[]> = {
    english: englishBadWords || [],
    hindi: hindiBadWords || [],
    french: frenchBadWords || [],
    german: germanBadWords || [],
    spanish: spanishBadWords || [],
    bengali: bengaliBadWords || [],
    tamil: tamilBadWords || [],
    telugu: teluguBadWords || [],
  };

  // Fixed leet speak mappings
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
    ["7", "l"],
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
    ["z", "s"],
    ["7", "t"],
    ["+", "t"],
    ["†", "t"],
    ["|_|", "u"],
    ["(_)", "u"],
    ["v", "u"],
    ["\\/", "v"],
    ["|/", "v"],
    ["\\/\\/", "w"],
    ["vv", "w"],
    ["><", "x"],
    ["}{", "x"],
    ["`/", "y"],
    ["j", "y"],
    ["2", "z"],
    ["7_", "z"],
  ]);

  // Dynamic words added at runtime
  private readonly dynamicWords: Set<string> = new Set();

  constructor(options?: AllProfanityOptions) {
    this.logger = options?.logger || new ConsoleLogger();

    // Validate and set configuration
    if (options?.defaultPlaceholder !== undefined) {
      this.setPlaceholder(options.defaultPlaceholder);
    }

    this.enableLeetSpeak = options?.enableLeetSpeak ?? true;
    this.caseSensitive = options?.caseSensitive ?? false;
    this.strictMode = options?.strictMode ?? false;
    this.detectPartialWords = options?.detectPartialWords ?? false;

    // Load whitelist
    if (options?.whitelistWords) {
      this.addToWhitelist(options.whitelistWords);
    }

    // Load default languages
    this.loadLanguage("english");
    this.loadLanguage("hindi");

    // Load additional languages
    if (options?.languages?.length) {
      options.languages.forEach((lang) => this.loadLanguage(lang));
    }

    // Load custom dictionaries
    if (options?.customDictionaries) {
      Object.entries(options.customDictionaries).forEach(([name, words]) => {
        this.loadCustomDictionary(name, words);
      });
    }
  }

  /**
   * Normalize text by converting leet speak to regular characters.
   */
  private normalizeLeetSpeak(text: string): string {
    if (!this.enableLeetSpeak) return text;

    let normalized = text.toLowerCase();
    const sortedMappings = Array.from(this.leetMappings.entries()).sort(
      ([leetA], [leetB]) => leetB.length - leetA.length
    );
    for (const [leet, normal] of sortedMappings) {
      const regex = new RegExp(this.escapeRegex(leet), "g");
      normalized = normalized.replace(regex, normal);
    }
    return normalized;
  }

  /**
   * Properly escape regex special characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
  }

  /**
   * Check if a position has word boundaries (for strict mode)
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
   * Helper method to verify whole-word matching.
   */
  private isWholeWord(text: string, start: number, end: number): boolean {
    // Check left boundary
    if (start === 0) {
      // ok
    } else if (/\w/.test(text[start - 1])) {
      return false;
    }
    // Check right boundary
    if (end === text.length) {
      // ok
    } else if (/\w/.test(text[end])) {
      return false;
    }
    return true;
  }

  /**
   * Check if a match is whitelisted (by actual matched substring and dictionary word)
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
   * Remove overlapping matches, keep only the longest at each start position
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
   * Advanced profanity detection using efficient trie-based algorithm
   */
  detect(text: string): ProfanityDetectionResult {
    const validatedText = validateString(text, "text");
    if (validatedText.length === 0) {
      return {
        hasProfanity: false,
        detectedWords: [],
        cleanedText: validatedText,
        severity: ProfanitySeverity.MILD,
        positions: [],
      };
    }
    const matches: MatchResult[] = [];
    const normalizedText = this.caseSensitive
      ? validatedText
      : validatedText.toLowerCase();
    this.findMatches(normalizedText, validatedText, matches);

    // Leet speak detection (normalize and search, map back to original)
    if (this.enableLeetSpeak) {
      const leetNormalized = this.normalizeLeetSpeak(normalizedText);
      if (leetNormalized !== normalizedText) {
        this.findMatches(leetNormalized, validatedText, matches);
      }
    }

    const uniqueMatches = this.deduplicateMatches(matches);
    const detectedWords = uniqueMatches.map((m) => m.originalWord);
    const severity = this.calculateSeverity(uniqueMatches);
    const cleanedText = this.generateCleanedText(validatedText, uniqueMatches);
    return {
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
  }

  /**
   * Main matching function, with whole-word logic.
   */
  private findMatches(
    searchText: string,
    originalText: string,
    matches: MatchResult[]
  ): void {
    for (let i = 0; i < searchText.length; i++) {
      const matchResults = this.profanityTrie.findMatches(
        searchText,
        i,
        this.detectPartialWords
      );
      for (const match of matchResults) {
        const start = i + match.start;
        const end = i + match.end;
        // Only match whole words if !detectPartialWords
        if (
          !this.detectPartialWords &&
          !this.isWholeWord(originalText, start, end)
        ) {
          continue;
        }
        // Use actual matched text for whitelist check
        const matchedText = originalText.substring(start, end);
        if (this.isWhitelistedMatch(match.word, matchedText)) {
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
   * Generate cleaned text by replacing profane words (non-overlapping only)
   */
  private generateCleanedText(
    originalText: string,
    matches: MatchResult[]
  ): string {
    if (matches.length === 0) return originalText;

    let result = originalText;

    // Process matches in reverse order to maintain indices and avoid overlap
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
   * Simple boolean check for profanity
   */
  check(text: string): boolean {
    return this.detect(text).hasProfanity;
  }

  /**
   * Clean text with custom placeholder
   */
  clean(text: string, placeholder?: string): string {
    const detection = this.detect(text);

    if (!placeholder || placeholder === this.defaultPlaceholder) {
      return detection.cleanedText;
    }

    // Use custom placeholder
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
      const originalWord = text.substring(pos.start, pos.end);
      const replacement = placeholder.repeat(originalWord.length);
      result =
        result.substring(0, pos.start) +
        replacement +
        result.substring(pos.end);
    }

    return result;
  }

  /**
   * Clean text by replacing each profane word with a single placeholder (word-level)
   */
  cleanWithPlaceholder(text: string, placeholder: string = "***"): string {
    const detection = this.detect(text);
    if (detection.positions.length === 0) return text;

    let result = text;
    // Sort matches so later matches don't affect earlier ones
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
      // Only replace whole words!
      if (!this.isWholeWord(result, pos.start, pos.end)) continue;
      result =
        result.substring(0, pos.start) +
        placeholder +
        result.substring(pos.end);
    }

    return result;
  }

  /**
   * Add word(s) to the profanity list
   */
  add(word: string | string[]): void {
    const words = Array.isArray(word) ? word : [word];
    const validatedWords = validateStringArray(words, "words to add");
    for (const w of validatedWords) {
      this.dynamicWords.add(w);
      this.addWordToTrie(w);
    }
  }

  /**
   * Remove word(s) from the profanity list
   */
  remove(word: string | string[]): void {
    const words = Array.isArray(word) ? word : [word];
    const validatedWords = validateStringArray(words, "words to remove");
    for (const w of validatedWords) {
      const normalizedWord = this.caseSensitive ? w : w.toLowerCase();
      this.profanityTrie.removeWord(normalizedWord);
      this.dynamicWords.delete(w);
    }
  }

  /**
   * Add words to whitelist
   */
  addToWhitelist(words: string[]): void {
    const validatedWords = validateStringArray(words, "whitelist words");
    for (const word of validatedWords) {
      const normalizedWord = this.caseSensitive ? word : word.toLowerCase();
      this.whitelistSet.add(normalizedWord);
    }
  }

  /**
   * Remove words from whitelist
   */
  removeFromWhitelist(words: string[]): void {
    const validatedWords = validateStringArray(words, "whitelist words");
    for (const word of validatedWords) {
      const normalizedWord = this.caseSensitive ? word : word.toLowerCase();
      this.whitelistSet.delete(normalizedWord);
    }
  }

  /**
   * Helper for whitelist checking with correct normalization
   */
  private isWhitelisted(word: string): boolean {
    const normalizedWord = this.caseSensitive ? word : word.toLowerCase();
    return this.whitelistSet.has(normalizedWord);
  }

  /**
   * Load a built-in language dictionary
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
   * Load multiple languages at once
   */
  loadLanguages(languages: string[]): number {
    const validatedLanguages = validateStringArray(languages, "languages");
    return validatedLanguages.reduce((count, lang) => {
      return this.loadLanguage(lang) ? count + 1 : count;
    }, 0);
  }

  /**
   * Load all Indian languages
   */
  loadIndianLanguages(): number {
    const indianLanguages = ["hindi", "bengali", "tamil", "telugu"];
    return this.loadLanguages(indianLanguages);
  }

  /**
   * Load a custom dictionary
   */
  loadCustomDictionary(name: string, words: string[]): void {
    validateString(name, "dictionary name");
    const validatedWords = validateStringArray(
      words,
      "custom dictionary words"
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

      // Store for future reference
      this.availableLanguages[name.toLowerCase()] = validatedWords;
      this.loadedLanguages.add(name.toLowerCase());

      this.logger.info(
        `Loaded ${addedCount} words from custom dictionary '${name}'`
      );
    } catch (error) {
      this.logger.error(`Failed to load custom dictionary ${name}: ${error}`);
    }
  }

  /**
   * Add a single word to the trie structure
   */
  private addWordToTrie(word: string): boolean {
    if (!word || typeof word !== "string" || word.trim().length === 0) {
      return false;
    }

    const normalizedWord = this.caseSensitive
      ? word.trim()
      : word.trim().toLowerCase();

    // Skip if whitelisted
    if (this.isWhitelisted(normalizedWord)) {
      return false;
    }

    // Add to trie
    this.profanityTrie.addWord(normalizedWord);
    return true;
  }

  /**
   * Remove overlapping matches, keep only the longest at each start position
   */
  private calculateSeverity(matches: MatchResult[]): ProfanitySeverity {
    if (matches.length === 0) return ProfanitySeverity.MILD;

    const uniqueWords = new Set(matches.map((m) => m.word)).size;
    const totalMatches = matches.length;

    if (totalMatches >= 5 || uniqueWords >= 4) return ProfanitySeverity.EXTREME;
    if (totalMatches >= 3 || uniqueWords >= 3) return ProfanitySeverity.SEVERE;
    if (totalMatches >= 2 || uniqueWords >= 2)
      return ProfanitySeverity.MODERATE;
    return ProfanitySeverity.MILD;
  }

  /**
   * Clear all loaded dictionaries
   */
  clearList(): void {
    this.profanityTrie.clear();
    this.loadedLanguages.clear();
    this.dynamicWords.clear();
  }

  /**
   * Set placeholder character
   */
  setPlaceholder(placeholder: string): void {
    validateString(placeholder, "placeholder");

    if (placeholder.length === 0) {
      throw new Error("Placeholder cannot be empty");
    }

    this.defaultPlaceholder = placeholder.charAt(0);
  }

  /**
   * Get loaded languages
   */
  getLoadedLanguages(): string[] {
    return Array.from(this.loadedLanguages);
  }

  /**
   * Get available languages
   */
  getAvailableLanguages(): string[] {
    return Object.keys(this.availableLanguages);
  }

  /**
   * Get current configuration
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
   * Rebuilds the profanity trie from loaded language dictionaries and dynamic words.
   */
  private rebuildTrie(): void {
    this.profanityTrie.clear();
    // Re-add all loaded language words
    for (const lang of this.loadedLanguages) {
      const words = this.availableLanguages[lang] || [];
      for (const word of words) {
        this.addWordToTrie(word);
      }
    }
    // Re-add dynamic words
    for (const word of this.dynamicWords) {
      this.addWordToTrie(word);
    }
  }

  /**
   * Update configuration. Rebuild trie if needed.
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
      this.rebuildTrie();
    }
  }
}

// Create and export a singleton instance
const allProfanity = new AllProfanity();
export default allProfanity;
