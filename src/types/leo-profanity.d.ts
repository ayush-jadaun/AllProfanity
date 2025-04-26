// Declare the module 'leo-profanity' as an ES module
declare module "leo-profanity" {
  export interface ProfanityFilter {
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
  }

  // Export the default filter as an ES module default export
  const filter: ProfanityFilter;
  export default filter;
}
