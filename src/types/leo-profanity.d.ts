// src/types/leo-profanity.d.ts

// Declare the module 'leo-profanity'
declare module "leo-profanity" {
  // Define the shape of the default export (the profanity instance)
  interface ProfanityFilter {
    /**
     * Checks if a text contains profanity.
     * @param text The text to check.
     * @returns True if profanity is found, false otherwise.
     */
    check(text: string): boolean;

    /**
     * Replaces profanity in a text with a placeholder.
     * @param text The text to clean.
     * @param placeholder The character or string to replace profanity with (default: '*').
     * @returns The cleaned text.
     */
    clean(text: string, placeholder?: string): string;

    /**
     * Adds words to the profanity list.
     * @param words An array of words or a single word string to add.
     */
    add(words: string | string[]): void;

    /**
     * Removes words from the profanity list.
     * @param words An array of words or a single word string to remove.
     */
    remove(words: string | string[]): void;

    /**
     * Returns the current list of profanity words.
     * @returns An array of profanity words.
     */
    list(): string[];

    /**
     * Replaces the current profanity list with a new list.
     * @param words An array of words to set as the new list.
     */
    load(words: string[]): void;

    // Add other methods if you use them (e.g., specific dictionary methods)
  }

  // Declare the default export of the module
  const filter: ProfanityFilter;
  export = filter; // Use 'export =' for compatibility with CommonJS module.exports = instance
}
