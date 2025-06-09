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
 * Advanced AllProfanity - Custom profanity filter with multi-language support and leet speak detection
 * No external dependencies - built from scratch for maximum performance and control
 */
export class AllProfanity {
  private profanitySet: Set<string> = new Set();
  private normalizedProfanityMap: Map<string, string> = new Map();
  private defaultPlaceholder: string = "*";
  private loadedLanguages: Set<string> = new Set();
  private whitelistSet: Set<string> = new Set();
  private enableLeetSpeak: boolean = true;
  private caseSensitive: boolean = false;
  private strictMode: boolean = false;
  private detectPartialWords: boolean = true;

  // Comprehensive leet speak mapping
  private readonly leetMap: Record<string, string[]> = {
    a: ["4", "@", "^", "aye", "λ", "ª"],
    b: ["8", "6", "|3", "ß", "β", "13"],
    c: ["(", "<", "©", "¢", "see", "sea"],
    d: ["|)", "|]", "0", "ð"],
    e: ["3", "€", "£", "ë", "é", "è"],
    f: ["|=", "ph", "|#", "ƒ"],
    g: ["9", "6", "&", "gee"],
    h: ["#", "|-|", "[-]", "}{", "ħ"],
    i: ["1", "!", "|", "eye", "ï", "í", "ì"],
    j: ["_|", "_/", "¿", "ĵ"],
    k: ["|<", "1<", "l<", "|{", "ķ"],
    l: ["1", "|", "7", "£", "ł", "ĺ"],
    m: ["|/|", "//\\", "em", "ɱ"],
    n: ["||", "//", "and", "ñ", "ń"],
    o: ["0", "()", "oh", "ø", "ó", "ò", "ô"],
    p: ["|*", "|o", "|^", "|>", "9", "þ"],
    q: ["(_,)", "()_", "kw", "ĸ"],
    r: ["|2", "12", ".-", "are", "ř", "ŕ"],
    s: ["5", "$", "z", "ş", "ś", "š"],
    t: ["7", "+", "-|-", "†", "ť", "ţ"],
    u: ["(_)", "|_|", "v", "you", "ü", "ú", "ù"],
    v: ["\\/", "|/", "|", "vee"],
    w: ["\\/\\/", "vv", "dubya", "ŵ"],
    x: ["><", "}{", "ecks", "χ"],
    y: ["`/", "j", "why", "ÿ", "ý"],
    z: ["2", "7_", "-/_", "zee", "ž", "ź", "ż"],
  };

  // Word boundary patterns
  private readonly wordBoundaryChars = /[\s\.,;:!?\-_+=\[\]{}()"'\/\\]/;

  // Common word variations and suffixes
  private readonly commonSuffixes = [
    "ing",
    "ed",
    "s",
    "er",
    "ers",
    "est",
    "ly",
    "tion",
    "ness",
  ];
  private readonly commonPrefixes = [
    "un",
    "re",
    "pre",
    "dis",
    "over",
    "under",
    "out",
  ];

  private availableLanguages: Record<string, string[]> = {
    english: englishBadWords || [],
    hindi: hindiBadWords || [],
    french: frenchBadWords || [],
    german: germanBadWords || [],
    spanish: spanishBadWords || [],
    bengali: bengaliBadWords || [],
    tamil: tamilBadWords || [],
    telugu: teluguBadWords || [],
  };

  /**
   * Create a new AllProfanity instance
   * @param options - Configuration options
   */
  constructor(options?: AllProfanityOptions) {
    // Set configuration options
    if (options?.defaultPlaceholder) {
      this.setPlaceholder(options.defaultPlaceholder);
    }

    this.enableLeetSpeak = options?.enableLeetSpeak ?? true;
    this.caseSensitive = options?.caseSensitive ?? false;
    this.strictMode = options?.strictMode ?? false;
    this.detectPartialWords = options?.detectPartialWords ?? true;

    // Load whitelist if provided
    if (options?.whitelistWords) {
      this.addToWhitelist(options.whitelistWords);
    }

    // Load the default English dictionary
    this.loadLanguage("english");

    // Load Hindi by default for backward compatibility
    this.loadLanguage("hindi");

    // Load any additional languages specified in options
    if (options?.languages) {
      options.languages.forEach((lang) => this.loadLanguage(lang));
    }

    // Load any custom dictionaries
    if (options?.customDictionaries) {
      Object.entries(options.customDictionaries).forEach(
        ([langName, words]) => {
          this.loadCustomDictionary(langName, words);
        }
      );
    }
  }

  /**
   * Normalize text by converting leet speak to regular characters
   * @param text - Text to normalize
   * @returns Normalized text
   */
  private normalizeLeetSpeak(text: string): string {
    if (!this.enableLeetSpeak) return text;

    let normalized = text.toLowerCase();

    // Define comprehensive leet mappings
    const leetMappings = [
      // Multi-character first
      { pattern: /\|-\|/g, replacement: "h" },
      { pattern: /\[-\]/g, replacement: "h" },
      { pattern: /\}{\s*/g, replacement: "h" },
      { pattern: /\|\/\|/g, replacement: "m" },
      { pattern: /\/\/\\/g, replacement: "m" },
      { pattern: /\|\|/g, replacement: "n" },
      { pattern: /\/\//g, replacement: "n" },
      { pattern: /\|2/g, replacement: "r" },
      { pattern: /12/g, replacement: "r" },
      { pattern: /\\\/\\\//g, replacement: "w" },
      { pattern: /vv/g, replacement: "w" },
      { pattern: /><\s*/g, replacement: "x" },
      { pattern: /\(_\)/g, replacement: "u" },
      { pattern: /\|_\|/g, replacement: "u" },
      { pattern: /\\\//g, replacement: "v" },
      { pattern: /\|\//g, replacement: "v" },

      // Single character mappings
      { pattern: /@/g, replacement: "a" },
      { pattern: /4/g, replacement: "u" },
      { pattern: /\^/g, replacement: "a" },
      { pattern: /8/g, replacement: "b" },
      { pattern: /6/g, replacement: "b" },
      { pattern: /\(/g, replacement: "c" },
      { pattern: /</g, replacement: "c" },
      { pattern: /©/g, replacement: "c" },
      { pattern: /¢/g, replacement: "c" },
      { pattern: /0/g, replacement: "o" },
      { pattern: /3/g, replacement: "e" },
      { pattern: /€/g, replacement: "e" },
      { pattern: /£/g, replacement: "e" },
      { pattern: /9/g, replacement: "g" },
      { pattern: /&/g, replacement: "g" },
      { pattern: /#/g, replacement: "h" },
      { pattern: /1/g, replacement: "i" },
      { pattern: /!/g, replacement: "i" },
      { pattern: /\|/g, replacement: "i" },
      { pattern: /7/g, replacement: "t" },
      { pattern: /5/g, replacement: "s" },
      { pattern: /\$/g, replacement: "s" },
      { pattern: /\+/g, replacement: "t" },
      { pattern: /2/g, replacement: "z" },
    ];

    // Apply all mappings
    for (const mapping of leetMappings) {
      normalized = normalized.replace(mapping.pattern, mapping.replacement);
    }

    return normalized;
  }

  private escapeRegex(str: string): string {
    if (!str || typeof str !== "string") {
      return "";
    }

    return str.replace(/[\\^$.*+?()[\]{}|\-]/g, function (match) {
      return "\\" + match;
    });
  }

  /**
   * Generate word variations with common prefixes and suffixes
   */
  private generateWordVariations(word: string): string[] {
    const variations = new Set([word]);

    // Add suffix variations
    for (const suffix of this.commonSuffixes) {
      variations.add(word + suffix);
      // Handle words ending in 'e'
      if (word.endsWith("e") && !suffix.startsWith("e")) {
        variations.add(word.slice(0, -1) + suffix);
      }
      // Handle consonant doubling
      if (word.length > 2 && /[bcdfghjklmnpqrstvwxyz]/.test(word.slice(-1))) {
        variations.add(word + word.slice(-1) + suffix);
      }
    }

    // Add prefix variations
    for (const prefix of this.commonPrefixes) {
      variations.add(prefix + word);
    }

    return Array.from(variations);
  }

  /**
   * Check if text contains word boundaries around a match
   */
  private hasWordBoundaries(text: string, start: number, end: number): boolean {
    if (!this.strictMode) return true;

    const beforeChar = start > 0 ? text[start - 1] : " ";
    const afterChar = end < text.length ? text[end] : " ";

    return (
      this.wordBoundaryChars.test(beforeChar) &&
      this.wordBoundaryChars.test(afterChar)
    );
  }

  /**
   * Calculate severity based on detected words
   */
  private calculateSeverity(detectedWords: string[]): ProfanitySeverity {
    if (detectedWords.length === 0) return ProfanitySeverity.MILD;

    // This is a simplified severity calculation
    // You can enhance this based on your specific word categorization
    const totalWords = detectedWords.length;
    const uniqueWords = new Set(detectedWords).size;

    if (totalWords >= 5 || uniqueWords >= 3) return ProfanitySeverity.EXTREME;
    if (totalWords >= 3 || uniqueWords >= 2) return ProfanitySeverity.SEVERE;
    if (totalWords >= 2) return ProfanitySeverity.MODERATE;
    return ProfanitySeverity.MILD;
  }

  /**
   * Load a built-in language dictionary
   * @param language - The language to load
   * @returns boolean - True if loaded successfully, false otherwise
   */
  loadLanguage(language: string): boolean {
    if (this.loadedLanguages.has(language.toLowerCase())) {
      return true;
    }

    const langKey = language.toLowerCase();
    if (
      this.availableLanguages[langKey] &&
      this.availableLanguages[langKey].length > 0
    ) {
      const words = this.availableLanguages[langKey];

      // Add words and their variations to the profanity set
      for (const word of words) {
        if (!word || typeof word !== "string") continue;

        const normalizedWord = this.caseSensitive ? word : word.toLowerCase();
        this.profanitySet.add(normalizedWord);

        // Store normalized leet version mapping
        const leetNormalized = this.normalizeLeetSpeak(normalizedWord);
        if (leetNormalized !== normalizedWord) {
          this.normalizedProfanityMap.set(leetNormalized, normalizedWord);
        }

        // Generate and add variations
        const variations = this.generateWordVariations(normalizedWord);
        for (const variation of variations) {
          this.profanitySet.add(variation);
          const leetVariation = this.normalizeLeetSpeak(variation);
          if (leetVariation !== variation) {
            this.normalizedProfanityMap.set(leetVariation, variation);
          }
        }
      }

      this.loadedLanguages.add(langKey);
      console.log(
        `AllProfanity: Added ${words.length} ${language} words to the profanity list.`
      );
      return true;
    } else {
      console.warn(
        `AllProfanity: Language '${language}' not found or empty in available dictionaries.`
      );
      return false;
    }
  }

  /**
   * Load multiple languages at once
   * @param languages - Array of language names to load
   * @returns number - Number of successfully loaded languages
   */
  loadLanguages(languages: string[]): number {
    let successCount = 0;
    languages.forEach((lang) => {
      if (this.loadLanguage(lang)) {
        successCount++;
      }
    });
    return successCount;
  }

  /**
   * Load all Indian languages at once
   * @returns number - Number of Indian languages loaded
   */
  loadIndianLanguages(): number {
    const indianLanguages = ["hindi", "bengali", "tamil", "telugu"];
    return this.loadLanguages(indianLanguages);
  }

  /**
   * Load a custom dictionary with a given name
   * @param name - Name to identify this dictionary
   * @param words - Array of profanity words
   */
  loadCustomDictionary(name: string, words: string[]): void {
    if (!words || words.length === 0) {
      console.warn(`AllProfanity: Custom dictionary '${name}' has no words.`);
      return;
    }

    // Add to available languages for future reference
    this.availableLanguages[name.toLowerCase()] = words;

    // Process and add words
    for (const word of words) {
      if (!word || typeof word !== "string") continue;

      const normalizedWord = this.caseSensitive ? word : word.toLowerCase();
      this.profanitySet.add(normalizedWord);

      // Store normalized leet version mapping
      const leetNormalized = this.normalizeLeetSpeak(normalizedWord);
      if (leetNormalized !== normalizedWord) {
        this.normalizedProfanityMap.set(leetNormalized, normalizedWord);
      }

      // Generate and add variations
      const variations = this.generateWordVariations(normalizedWord);
      for (const variation of variations) {
        this.profanitySet.add(variation);
        const leetVariation = this.normalizeLeetSpeak(variation);
        if (leetVariation !== variation) {
          this.normalizedProfanityMap.set(leetVariation, variation);
        }
      }
    }

    this.loadedLanguages.add(name.toLowerCase());
    console.log(
      `AllProfanity: Added ${words.length} words from custom '${name}' dictionary.`
    );
  }

  /**
   * Add words to whitelist (words that should never be flagged as profanity)
   * @param words - Array of words to whitelist
   */
  addToWhitelist(words: string[]): void {
    for (const word of words) {
      if (word && typeof word === "string") {
        this.whitelistSet.add(this.caseSensitive ? word : word.toLowerCase());
      }
    }
  }

  /**
   * Remove words from whitelist
   * @param words - Array of words to remove from whitelist
   */
  removeFromWhitelist(words: string[]): void {
    for (const word of words) {
      if (word && typeof word === "string") {
        this.whitelistSet.delete(
          this.caseSensitive ? word : word.toLowerCase()
        );
      }
    }
  }

  /**
   * Advanced profanity detection with detailed results
   * @param text - The text to analyze
   * @returns ProfanityDetectionResult - Detailed detection results
   */
  detect(text: string): ProfanityDetectionResult {
    if (!text || typeof text !== "string") {
      return {
        hasProfanity: false,
        detectedWords: [],
        cleanedText: text || "",
        severity: ProfanitySeverity.MILD,
        positions: [],
      };
    }

    const normalizedText = this.caseSensitive ? text : text.toLowerCase();
    const leetNormalizedText = this.normalizeLeetSpeak(normalizedText);

    const detectedWords: string[] = [];
    const positions: Array<{ word: string; start: number; end: number }> = [];

    // Check for whole word matches first
    for (const profanity of this.profanitySet) {
      if (this.whitelistSet.has(profanity)) continue;

      try {
        // Create regex for word boundary detection
        const escapedWord = this.escapeRegex(profanity);
        const wordRegex = new RegExp(
          `\\b${escapedWord}\\b`,
          this.caseSensitive ? "g" : "gi"
        );

        let match;
        while ((match = wordRegex.exec(normalizedText)) !== null) {
          if (
            this.hasWordBoundaries(
              normalizedText,
              match.index,
              match.index + match[0].length
            )
          ) {
            detectedWords.push(match[0]);
            positions.push({
              word: match[0],
              start: match.index,
              end: match.index + match[0].length,
            });
          }
        }
      } catch (error) {
        // Fallback to simple string search if regex fails
        const index = normalizedText.indexOf(profanity);
        if (index !== -1) {
          detectedWords.push(profanity);
          positions.push({
            word: profanity,
            start: index,
            end: index + profanity.length,
          });
        }
      }
    }

    // Check leet speak normalized text
    if (this.enableLeetSpeak && leetNormalizedText !== normalizedText) {
      for (const profanity of this.profanitySet) {
        if (this.whitelistSet.has(profanity)) continue;

        try {
          const escapedWord = this.escapeRegex(profanity);
          const wordRegex = new RegExp(
            `\\b${escapedWord}\\b`,
            this.caseSensitive ? "g" : "gi"
          );

          let match;
          while ((match = wordRegex.exec(leetNormalizedText)) !== null) {
            if (
              this.hasWordBoundaries(
                leetNormalizedText,
                match.index,
                match.index + match[0].length
              )
            ) {
              // Find the original text that corresponds to this match
              const originalMatch = normalizedText.substring(
                match.index,
                match.index + match[0].length
              );
              if (!detectedWords.includes(originalMatch)) {
                detectedWords.push(originalMatch);
                positions.push({
                  word: originalMatch,
                  start: match.index,
                  end: match.index + match[0].length,
                });
              }
            }
          }
        } catch (error) {
          // Fallback to simple string search
          if (leetNormalizedText.includes(profanity)) {
            const index = leetNormalizedText.indexOf(profanity);
            const originalMatch = normalizedText.substring(
              index,
              index + profanity.length
            );
            if (!detectedWords.includes(originalMatch)) {
              detectedWords.push(originalMatch);
              positions.push({
                word: originalMatch,
                start: index,
                end: index + profanity.length,
              });
            }
          }
        }
      }
    }

    // Partial word detection (if enabled)
    if (this.detectPartialWords) {
      for (const profanity of this.profanitySet) {
        if (this.whitelistSet.has(profanity) || profanity.length < 4) continue;

        if (
          normalizedText.includes(profanity) ||
          leetNormalizedText.includes(profanity)
        ) {
          const index = normalizedText.indexOf(profanity);
          if (
            index !== -1 &&
            !detectedWords.some((w) => normalizedText.indexOf(w) === index)
          ) {
            detectedWords.push(profanity);
            positions.push({
              word: profanity,
              start: index,
              end: index + profanity.length,
            });
          }
        }
      }
    }

    // REMOVED: cleanedText = this.clean(text) - this was causing circular dependency
    // We'll generate the cleaned text directly here instead
    let cleanedText = text;
    if (detectedWords.length > 0) {
      // Sort positions by start index in descending order to avoid index shifting
      const sortedPositions = positions.sort((a, b) => b.start - a.start);

      for (const pos of sortedPositions) {
        const originalWord = text.substring(pos.start, pos.end);
        const replacement = this.defaultPlaceholder.repeat(originalWord.length);
        cleanedText =
          cleanedText.substring(0, pos.start) +
          replacement +
          cleanedText.substring(pos.end);
      }
    }

    const severity = this.calculateSeverity(detectedWords);

    return {
      hasProfanity: detectedWords.length > 0,
      detectedWords: [...new Set(detectedWords)], // Remove duplicates
      cleanedText,
      severity,
      positions,
    };
  }

  /**
   * Check if a string contains profanity (simple boolean check)
   * @param string - The string to check
   * @returns boolean - True if profanity found, false otherwise
   */
  check(string: string): boolean {
    return this.detect(string).hasProfanity;
  }

  /**
   * Clean a string by replacing profanities with placeholders
   * @param string - The string to clean
   * @param placeholder - Optional custom placeholder
   * @returns string - The cleaned string
   */
  clean(string: string, placeholder?: string): string {
    if (!string || typeof string !== "string") return string || "";

    const placeholderChar = placeholder || this.defaultPlaceholder;
    const detection = this.detect(string);

    // If detect() already provided cleanedText and no custom placeholder, use it
    if (!placeholder && detection.cleanedText !== string) {
      return detection.cleanedText;
    }

    // Otherwise, build cleaned text with custom placeholder
    let result = string;
    const sortedPositions = detection.positions.sort(
      (a, b) => b.start - a.start
    );

    for (const pos of sortedPositions) {
      const originalWord = string.substring(pos.start, pos.end);
      const replacement = placeholderChar.repeat(originalWord.length);
      result =
        result.substring(0, pos.start) +
        replacement +
        result.substring(pos.end);
    }

    return result;
  }

  /**
   * Clean a string by replacing each profane word with a single placeholder
   * @param string - The string to clean
   * @param placeholder - The placeholder to use (defaults to '***')
   * @returns string - The cleaned string
   */
  cleanWithWord(string: string, placeholder: string = "***"): string {
    if (!string || typeof string !== "string") return string || "";

    // Build a regex that matches any profane word with word boundaries, unicode-aware
    const words = Array.from(this.profanitySet)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) // escape regex
      .sort((a, b) => b.length - a.length); // longer words first to avoid partial matches

    if (words.length === 0) return string;

    // Unicode safe word boundary: (?<=^|[^\p{L}\p{N}_])WORD(?=[^\p{L}\p{N}_]|$)
    // This ensures we only match whole words, not inside other words.
    const regex = new RegExp(
      `(?<=^|[\\s\\.,;:!\\?\\-_+=\\[\\]{}()"'\\/\\\\])(` +
        words.join("|") +
        `)(?=[\\s\\.,;:!\\?\\-_+=\\[\\]{}()"'\\/\\\\]|$)`,
      this.caseSensitive ? "gu" : "giu"
    );

    // Replace all matches with the placeholder.
    return string.replace(regex, placeholder);
  }

  /**
   * Get the current list of profanity words
   * @returns string[] - Array of all profanity words
   */
  list(): string[] {
    return Array.from(this.profanitySet);
  }

  /**
   * Add word(s) to the profanity list
   * @param word - String or array of strings to add
   */
  add(word: string | string[]): void {
    const words = Array.isArray(word) ? word : [word];

    for (const w of words) {
      if (!w || typeof w !== "string") continue;

      const normalizedWord = this.caseSensitive ? w : w.toLowerCase();
      this.profanitySet.add(normalizedWord);

      // Add leet speak mapping
      const leetNormalized = this.normalizeLeetSpeak(normalizedWord);
      if (leetNormalized !== normalizedWord) {
        this.normalizedProfanityMap.set(leetNormalized, normalizedWord);
      }

      // Add variations
      const variations = this.generateWordVariations(normalizedWord);
      for (const variation of variations) {
        this.profanitySet.add(variation);
      }
    }
  }

  /**
   * Remove word(s) from the profanity list
   * @param word - String or array of strings to remove
   */
  remove(word: string | string[]): void {
    const words = Array.isArray(word) ? word : [word];

    for (const w of words) {
      if (!w || typeof w !== "string") continue;

      const normalizedWord = this.caseSensitive ? w : w.toLowerCase();
      this.profanitySet.delete(normalizedWord);

      // Remove variations
      const variations = this.generateWordVariations(normalizedWord);
      for (const variation of variations) {
        this.profanitySet.delete(variation);
      }
    }
  }

  /**
   * Clear the filter list and reset to default
   */
  clearList(): void {
    this.profanitySet.clear();
    this.normalizedProfanityMap.clear();
    this.loadedLanguages.clear();
  }

  /**
   * Change the character used as placeholder
   * @param placeholder - Single character to use as placeholder
   */
  setPlaceholder(placeholder: string): void {
    if (placeholder.length !== 1) {
      console.warn(
        "AllProfanity: Placeholder should be a single character. Using first character."
      );
      this.defaultPlaceholder = placeholder.charAt(0);
    } else {
      this.defaultPlaceholder = placeholder;
    }
  }

  /**
   * Get the list of currently loaded languages
   * @returns string[] - Array of loaded language names
   */
  getLoadedLanguages(): string[] {
    return Array.from(this.loadedLanguages);
  }

  /**
   * Get the list of available language dictionaries
   * @returns string[] - Array of available language names
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
   * Update configuration
   */
  updateConfig(options: Partial<AllProfanityOptions>): void {
    if (options.defaultPlaceholder !== undefined) {
      this.setPlaceholder(options.defaultPlaceholder);
    }
    if (options.enableLeetSpeak !== undefined) {
      this.enableLeetSpeak = options.enableLeetSpeak;
    }
    if (options.caseSensitive !== undefined) {
      this.caseSensitive = options.caseSensitive;
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
  }
}

// Create and export a singleton instance with default settings
const allProfanity = new AllProfanity();
export default allProfanity;
