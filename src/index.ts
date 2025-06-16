// Language dictionaries imports
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
 * Logger interface for the library.
 */
export interface Logger {
  /**
   * Log informational messages.
   * @param message - The message to log.
   */
  info(message: string): void;
  /**
   * Log warning messages.
   * @param message - The message to log.
   */
  warn(message: string): void;
  /**
   * Log error messages.
   * @param message - The message to log.
   */
  error(message: string): void;
}

/**
 * Default console logger implementation.
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
 * Configuration options for AllProfanity.
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
 * Severity levels for profanity detection.
 */
export enum ProfanitySeverity {
  MILD = 1,
  MODERATE = 2,
  SEVERE = 3,
  EXTREME = 4,
}

/**
 * Detection result for profanity detection.
 */
export interface ProfanityDetectionResult {
  hasProfanity: boolean;
  detectedWords: string[];
  cleanedText: string;
  severity: ProfanitySeverity;
  positions: Array<{ word: string; start: number; end: number }>;
}

/**
 * Internal match result for efficient processing.
 */
interface MatchResult {
  word: string;
  start: number;
  end: number;
  originalWord: string;
}

/**
 * Validate a string parameter.
 * @param input - The input to validate.
 * @param paramName - The name of the parameter.
 * @returns The validated string.
 * @throws {TypeError} If input is not a string.
 */
function validateString(input: unknown, paramName: string): string {
  if (typeof input !== "string") {
    throw new TypeError(`${paramName} must be a string, got ${typeof input}`);
  }
  return input;
}

/**
 * Validate a string array parameter.
 * @param input - The input to validate.
 * @param paramName - The name of the parameter.
 * @returns The validated string array.
 * @throws {TypeError} If input is not an array.
 */
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
 * Trie node for efficient string matching.
 */
class TrieNode {
  private children: Map<string, TrieNode> = new Map();
  private isEndOfWord: boolean = false;
  private word: string = "";

  /**
   * Add a word to the trie.
   * @param word - The word to add.
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
   * Remove a word from the trie.
   * @param word - The word to remove.
   * @returns True if the word was removed, false otherwise.
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
   * Find all matches starting at a given position.
   * @param text - The text to search.
   * @param startPos - The start position.
   * @param allowPartial - Whether to allow partial word matches.
   * @returns Array of matches.
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
   * Clear all words from the trie.
   */
  clear(): void {
    this.children.clear();
    this.isEndOfWord = false;
    this.word = "";
  }
}

/**
 * Main class for profanity detection and filtering.
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

  private readonly dynamicWords: Set<string> = new Set();

  /**
   * Create an AllProfanity instance.
   * @param options - Profanity filter configuration options.
   */
  constructor(options?: AllProfanityOptions) {
    this.logger = options?.logger || new ConsoleLogger();

    if (options?.defaultPlaceholder !== undefined) {
      this.setPlaceholder(options.defaultPlaceholder);
    }

    this.enableLeetSpeak = options?.enableLeetSpeak ?? true;
    this.caseSensitive = options?.caseSensitive ?? false;
    this.strictMode = options?.strictMode ?? false;
    this.detectPartialWords = options?.detectPartialWords ?? false;

    if (options?.whitelistWords) {
      this.addToWhitelist(options.whitelistWords);
    }

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
  }

  /**
   * Normalize leet speak to regular characters.
   * @param text - The input text.
   * @returns Normalized text.
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
   * Escape regex special characters in a string.
   * @param str - The string to escape.
   * @returns The escaped string.
   */
  private escapeRegex(str: string): string {
    return str.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
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
   * Detect profanity in a given text.
   * @param text - The text to check.
   * @returns Profanity detection result.
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
   * @param searchText - The normalized text to search.
   * @param originalText - The original text.
   * @param matches - Array to collect matches.
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
   * Check if a string contains profanity.
   * @param text - The text to check.
   * @returns True if profanity is found, false otherwise.
   */
  check(text: string): boolean {
    return this.detect(text).hasProfanity;
  }

  /**
   * Clean text with a custom placeholder.
   * @param text - The text to clean.
   * @param placeholder - The placeholder to use.
   * @returns Cleaned text.
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
   * Clean text by replacing each profane word with a single placeholder (word-level).
   * @param text - The text to clean.
   * @param placeholder - The placeholder to use.
   * @returns Word-level cleaned text.
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
   * Add word(s) to the profanity filter.
   * @param word - Word or array of words to add.
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
   * Remove word(s) from the profanity filter.
   * @param word - Word or array of words to remove.
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
   * Add words to the whitelist.
   * @param words - Words to whitelist.
   */
  addToWhitelist(words: string[]): void {
    const validatedWords = validateStringArray(words, "whitelist words");
    for (const word of validatedWords) {
      const normalizedWord = this.caseSensitive ? word : word.toLowerCase();
      this.whitelistSet.add(normalizedWord);
    }
  }

  /**
   * Remove words from the whitelist.
   * @param words - Words to remove from whitelist.
   */
  removeFromWhitelist(words: string[]): void {
    const validatedWords = validateStringArray(words, "whitelist words");
    for (const word of validatedWords) {
      const normalizedWord = this.caseSensitive ? word : word.toLowerCase();
      this.whitelistSet.delete(normalizedWord);
    }
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
   * Load a built-in language dictionary.
   * @param language - The language key.
   * @returns True if loaded, false otherwise.
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
   * Load multiple language dictionaries.
   * @param languages - Array of languages to load.
   * @returns Number of successfully loaded languages.
   */
  loadLanguages(languages: string[]): number {
    const validatedLanguages = validateStringArray(languages, "languages");
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
   * Load a custom dictionary.
   * @param name - Name of the dictionary.
   * @param words - Words to add.
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

    this.profanityTrie.addWord(normalizedWord);
    return true;
  }

  /**
   * Calculate severity from matches.
   * @param matches - Array of matches.
   * @returns Severity level.
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
   * Clear all loaded dictionaries and dynamic words.
   */
  clearList(): void {
    this.profanityTrie.clear();
    this.loadedLanguages.clear();
    this.dynamicWords.clear();
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
   * Rebuild the profanity trie from loaded dictionaries and dynamic words.
   */
  private rebuildTrie(): void {
    this.profanityTrie.clear();
    for (const lang of this.loadedLanguages) {
      const words = this.availableLanguages[lang] || [];
      for (const word of words) {
        this.addWordToTrie(word);
      }
    }
    for (const word of this.dynamicWords) {
      this.addWordToTrie(word);
    }
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
      this.rebuildTrie();
    }
  }
}

/**
 * Singleton instance of AllProfanity with default configuration.
 */
const allProfanity = new AllProfanity();
export default allProfanity;
