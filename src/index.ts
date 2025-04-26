// src/index.ts
import leoProfanity from "leo-profanity";
import hindiBadWords from "./languages/hindi-words";
import frenchBadWords from "./languages/french-words";
import germanBadWords from "./languages/german-words";
import spanishBadWords from "./languages/spanish-words";
import bengaliBadWords from "./languages/bengali-words";
import tamilBadWords from "./languages/tamil-words";
import teluguBadWords from "./languages/telugu-words";

// Export language dictionaries for direct access
export { default as hindiBadWords } from "./languages/hindi-words";
export { default as frenchBadWords } from "./languages/french-words";
export { default as germanBadWords } from "./languages/german-words";
export { default as spanishBadWords } from "./languages/spanish-words";
export { default as bengaliBadWords } from "./languages/bengali-words";
export { default as tamilBadWords } from "./languages/tamil-words";
export { default as teluguBadWords } from "./languages/telugu-words";

/**
 * Configuration options for AllProfanity
 */
export interface AllProfanityOptions {
  languages?: string[];
  customDictionaries?: Record<string, string[]>;
  defaultPlaceholder?: string;
}

/**
 * AllProfanity - Extended profanity filter with multi-language support
 * Based on leo-profanity with additional language capabilities
 */
export class AllProfanity {
  private filter: typeof leoProfanity;
  private defaultPlaceholder: string = "*";
  private loadedLanguages: Set<string> = new Set<string>();
  private availableLanguages: Record<string, string[]> = {
    hindi: hindiBadWords,
    french: frenchBadWords,
    german: germanBadWords,
    spanish: spanishBadWords,
    bengali: bengaliBadWords,
    tamil: tamilBadWords,
    telugu: teluguBadWords,
    // Add more built-in languages here in the future
  };

  /**
   * Create a new AllProfanity instance
   * @param options - Configuration options
   */
  constructor(options?: AllProfanityOptions) {
    this.filter = leoProfanity;

    // Set custom placeholder if provided
    if (options?.defaultPlaceholder) {
      this.setPlaceholder(options.defaultPlaceholder);
    }

    // Load the default English dictionary from leo-profanity
    this.loadedLanguages.add("english");

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
   * Load a built-in language dictionary
   * @param language - The language to load
   * @returns boolean - True if loaded successfully, false otherwise
   */
  loadLanguage(language: string): boolean {
    // Skip if already loaded
    if (this.loadedLanguages.has(language.toLowerCase())) {
      return true;
    }

    const langKey = language.toLowerCase();
    if (this.availableLanguages[langKey]) {
      this.filter.add(this.availableLanguages[langKey]);
      this.loadedLanguages.add(langKey);
      console.log(
        `AllProfanity: Added ${this.availableLanguages[langKey].length} ${language} words to the profanity list.`
      );
      return true;
    } else {
      console.warn(
        `AllProfanity: Language '${language}' not found in available dictionaries.`
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

    // Add to filter
    this.filter.add(words);
    this.loadedLanguages.add(name.toLowerCase());

    console.log(
      `AllProfanity: Added ${words.length} words from custom '${name}' dictionary.`
    );
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
   * Check if a string contains profanity
   * @param string - The string to check
   * @returns boolean - True if profanity found, false otherwise
   */
  check(string: string): boolean {
    return this.filter.check(string);
  }

  /**
   * Clean a string by replacing profanities with placeholders
   * @param string - The string to clean
   * @param placeholder - Optional custom placeholder (defaults to '*')
   * @returns string - The cleaned string
   */
  clean(string: string, placeholder?: string): string {
    // More general solution for handling variations like "fucking"
    const badWords = this.list();
    let result = string;

    for (const word of badWords) {
      // Check for variations with "ing", "ed", etc.
      const variations = [
        `${word}ing`,
        `${word}ed`,
        `${word}s`,
        `${word}er`,
        `${word}ers`,
      ];

      for (const variation of variations) {
        if (result.toLowerCase().includes(variation.toLowerCase())) {
          const prefix = word;
          const suffix = variation.slice(word.length);
          const replacement =
            (placeholder || this.defaultPlaceholder).repeat(prefix.length) +
            suffix;

          // Use regex to replace while preserving case (though this simplifies it)
          const regex = new RegExp(variation, "gi");
          result = result.replace(regex, replacement);
        }
      }
    }

    // Fall back to default leo-profanity implementation
    return this.filter.clean(result, placeholder || this.defaultPlaceholder);
  }

  /**
   * Clean a string by replacing each profane word with a single placeholder
   * @param string - The string to clean
   * @param placeholder - The placeholder to use (defaults to '***')
   * @returns string - The cleaned string
   */
  cleanWithWord(string: string, placeholder: string = "***"): string {
    // Split by spaces but preserve punctuation
    const regex = /([^\w\s])/g;
    let tempString = string.replace(regex, " $1 ");
    const words = tempString.split(" ").filter((w) => w !== "");

    const result = words.map((word) => {
      // Check if this word contains profanity, ignoring punctuation for the check
      const wordWithoutPunctuation = word.replace(/[^\w\s]/g, "");
      if (wordWithoutPunctuation && this.check(wordWithoutPunctuation)) {
        return placeholder;
      }
      return word;
    });

    // Join and fix spaces before punctuation
    let cleaned = result.join(" ");
    cleaned = cleaned.replace(/ ([^\w\s]) /g, "$1 "); // Fix space before punctuation
    cleaned = cleaned.replace(/ ([^\w\s])$/g, "$1"); // Fix trailing punctuation

    return cleaned;
  }

  /**
   * Get the current list of profanity words
   * @returns string[] - Array of all profanity words
   */
  list(): string[] {
    return this.filter.list();
  }

  /**
   * Add word(s) to the profanity list
   * @param word - String or array of strings to add
   */
  add(word: string | string[]): void {
    this.filter.add(word);
  }

  /**
   * Remove word(s) from the profanity list
   * @param word - String or array of strings to remove
   */
  remove(word: string | string[]): void {
    this.filter.remove(word);
  }

  /**
   * Clear the filter list and reset to default
   */
  clearList(): void {
    // Get all current words
    const currentWords = this.filter.list();
    // Remove all words
    if (currentWords.length > 0) {
      this.filter.remove(currentWords);
    }
    // Reset loaded languages tracking
    this.loadedLanguages.clear();
    this.loadedLanguages.add("english"); // Default language remains
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
}

// Create and export a singleton instance with default settings
const allProfanity = new AllProfanity();
export default allProfanity;
