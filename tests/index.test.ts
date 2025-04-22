// tests/index.test.ts

import filter from "../src/index";
import hindiBadWordsList from "../src/hindi-words";

// Sample words from our actual list for testing
// Using real but less offensive words for the test descriptions
const HINDI_BAD_WORD_ROMAN = "chutiya";
const HINDI_BAD_WORD_DEVANAGARI = "भोसड़ी";
const HINGLISH_BAD_WORD = "behenchod";
const HINGLISH_VARIATION = "bc";

// Clean words for testing false positives
const HINDI_CLEAN_WORD = "अच्छा"; // Good
const ENGLISH_CLEAN_WORD = "excellent";

describe("AllProfanity Filter", () => {
  describe("Initialization", () => {
    test("should load without errors", () => {
      expect(filter).toBeDefined();
      expect(typeof filter.check).toBe("function");
      expect(typeof filter.clean).toBe("function");
    });

    test("should have added Hindi words to the list", () => {
      const currentList = filter.list();
      expect(currentList.some((word) => hindiBadWordsList.includes(word))).toBe(
        true
      );

      // Check specific words
      expect(currentList).toContain(HINDI_BAD_WORD_ROMAN.toLowerCase());
      expect(currentList).toContain(HINDI_BAD_WORD_DEVANAGARI.toLowerCase());
    });

    test("should retain original leo-profanity words", () => {
      const currentList = filter.list();
      // Common English profanities that should be in default leo-profanity list
      expect(currentList).toContain("bullshit");
      expect(currentList).toContain("fuck");
    });
  });

  describe("Profanity Detection (check)", () => {
    // Test default English words
    test("should detect default English profanity", () => {
      expect(filter.check("This sentence contains bullshit.")).toBe(true);
      expect(filter.check("What the fuck is this?")).toBe(true);
      expect(filter.check("This is perfectly fine.")).toBe(false);
    });

    // Test added Hindi/Hinglish words
    test("should detect Hindi profanity (Roman script)", () => {
      expect(
        filter.check(`This has the word ${HINDI_BAD_WORD_ROMAN} in it.`)
      ).toBe(true);
      expect(filter.check(`Using ${HINDI_BAD_WORD_ROMAN} as an example.`)).toBe(
        true
      );
    });

    test("should detect Hindi profanity (Devanagari script)", () => {
      expect(
        filter.check(`इस वाक्य में ${HINDI_BAD_WORD_DEVANAGARI} शब्द है।`)
      ).toBe(true);
      expect(
        filter.check(`${HINDI_BAD_WORD_DEVANAGARI} एक बुरा शब्द है।`)
      ).toBe(true);
    });

    test("should detect Hinglish profanity and abbreviations", () => {
      expect(
        filter.check(`A Hinglish sentence with ${HINGLISH_BAD_WORD}.`)
      ).toBe(true);
      expect(
        filter.check(`People often abbreviate it as ${HINGLISH_VARIATION}.`)
      ).toBe(true);
    });

    // Test case-insensitivity
    test("should detect profanity regardless of case", () => {
      expect(filter.check("This is BULLSHIT.")).toBe(true);
      expect(
        filter.check(`Testing ${HINDI_BAD_WORD_ROMAN.toUpperCase()} here.`)
      ).toBe(true);
      expect(filter.check(`Using ${HINGLISH_BAD_WORD.toUpperCase()}.`)).toBe(
        true
      );
    });

    // Test clean strings
    test("should return false for clean strings", () => {
      expect(filter.check("This is a perfectly clean sentence.")).toBe(false);
      expect(
        filter.check(`यह एक साफ वाक्य है जिसमे ${HINDI_CLEAN_WORD} शब्द है।`)
      ).toBe(false);
      expect(filter.check(`Using ${ENGLISH_CLEAN_WORD} vocabulary.`)).toBe(
        false
      );
    });

    // Test word boundaries
    test("should handle word boundaries correctly", () => {
      // Words within words - these should NOT trigger if the filter is well-configured
      expect(filter.check("He is an associate professor.")).toBe(false); // 'ass' within 'associate'
      expect(filter.check("I'm an analyst at this company.")).toBe(false); // 'anal' within 'analyst'

      // But should trigger for actual profanity
      expect(filter.check("This is ass and that's bad.")).toBe(true);
    });

    // Test mixed language content
    test("should detect profanity in mixed language content", () => {
      expect(
        filter.check(
          `This English sentence has ${HINDI_BAD_WORD_ROMAN} which is bad.`
        )
      ).toBe(true);
      expect(
        filter.check(
          `I'm saying ${HINDI_BAD_WORD_DEVANAGARI} and bullshit in one sentence.`
        )
      ).toBe(true);
      expect(
        filter.check(
          `${HINDI_CLEAN_WORD} is good but ${HINGLISH_BAD_WORD} is bad.`
        )
      ).toBe(true);
    });
  });

  describe("Profanity Cleaning (clean)", () => {
    // leo-profanity replaces each character with the placeholder
    test("should clean English profanity (character-by-character)", () => {
      // Expecting each character to be replaced by *
      const bullshitCensored = "*".repeat("bullshit".length);
      expect(filter.clean("This sentence contains bullshit.")).toBe(
        `This sentence contains ${bullshitCensored}.`
      );

      const fuckCensored = "*".repeat("fuck".length);
      expect(filter.clean("This is a fucking test.")).toBe(
        `This is a ${fuckCensored}ing test.`
      );
    });

    test("should clean Hindi profanity (Roman script)", () => {
      const censoredWord = "*".repeat(HINDI_BAD_WORD_ROMAN.length);
      expect(
        filter.clean(`This has the word ${HINDI_BAD_WORD_ROMAN} in it.`)
      ).toBe(`This has the word ${censoredWord} in it.`);
    });

    test("should clean Hindi profanity (Devanagari script)", () => {
      const censoredWord = "*".repeat(HINDI_BAD_WORD_DEVANAGARI.length);
      expect(
        filter.clean(`इस वाक्य में ${HINDI_BAD_WORD_DEVANAGARI} शब्द है।`)
      ).toBe(`इस वाक्य में ${censoredWord} शब्द है।`);
    });

    test("should clean Hinglish profanity", () => {
      const censoredWord = "*".repeat(HINGLISH_BAD_WORD.length);
      expect(
        filter.clean(`A Hinglish sentence with ${HINGLISH_BAD_WORD}.`)
      ).toBe(`A Hinglish sentence with ${censoredWord}.`);
    });

    test("should clean multiple profanities", () => {
      const bullshitCensored = "*".repeat("bullshit".length);
      const hindiCensored = "*".repeat(HINDI_BAD_WORD_ROMAN.length);
      const fuckCensored = "*".repeat("fuck".length);

      expect(
        filter.clean(
          `This bullshit sentence has ${HINDI_BAD_WORD_ROMAN} and fuck.`
        )
      ).toBe(
        `This ${bullshitCensored} sentence has ${hindiCensored} and ${fuckCensored}.`
      );
    });

    test("should clean profanity regardless of case", () => {
      const bullshitCensored = "*".repeat("BULLSHIT".length);
      expect(filter.clean("This is BULLSHIT.")).toBe(
        `This is ${bullshitCensored}.`
      );

      const hindiCensored = "*".repeat(
        HINDI_BAD_WORD_ROMAN.toUpperCase().length
      );
      expect(
        filter.clean(`Testing ${HINDI_BAD_WORD_ROMAN.toUpperCase()} here.`)
      ).toBe(`Testing ${hindiCensored} here.`);
    });

    test("should leave clean strings unchanged", () => {
      const cleanSentence = "This is a perfectly clean sentence.";
      expect(filter.clean(cleanSentence)).toBe(cleanSentence);

      const cleanHindi = `यह एक साफ वाक्य है जिसमे ${HINDI_CLEAN_WORD} शब्द है।`;
      expect(filter.clean(cleanHindi)).toBe(cleanHindi);
    });

    test("should use custom placeholder character", () => {
      const customPlaceholder = "X";
      const bullshitCensored = customPlaceholder.repeat("bullshit".length);
      const hindiCensored = customPlaceholder.repeat(
        HINDI_BAD_WORD_ROMAN.length
      );

      expect(
        filter.clean(
          `This bullshit sentence has ${HINDI_BAD_WORD_ROMAN}.`,
          customPlaceholder
        )
      ).toBe(`This ${bullshitCensored} sentence has ${hindiCensored}.`);
    });
  });

  describe("Word-level Cleaning", () => {
    const placeholder = "***";

    test("should replace entire profane words with a single placeholder", () => {
      expect(filter.cleanWithWord("This sentence contains bullshit.")).toBe(
        `This sentence contains ${placeholder}.`
      );

      expect(
        filter.cleanWithWord(`This has the word ${HINDI_BAD_WORD_ROMAN} in it.`)
      ).toBe(`This has the word ${placeholder} in it.`);
    });

    test("should replace multiple profane words", () => {
      expect(
        filter.cleanWithWord(
          `This bullshit sentence has ${HINDI_BAD_WORD_ROMAN} and fuck.`
        )
      ).toBe(
        `This ${placeholder} sentence has ${placeholder} and ${placeholder}.`
      );
    });

    test("should use custom word placeholder", () => {
      const customPlaceholder = "[CENSORED]";
      expect(
        filter.cleanWithWord(
          `This bullshit sentence has ${HINDI_BAD_WORD_ROMAN}.`,
          customPlaceholder
        )
      ).toBe(`This ${customPlaceholder} sentence has ${customPlaceholder}.`);
    });
  });

  describe("Dynamic List Management", () => {
    // Create unique test words to avoid interference
    const uniqueEnglishWord = "xyztestword123";
    const uniqueHindiWord = "परीक्षाशब्द";

    // Clean up after each test
    afterEach(() => {
      filter.remove([uniqueEnglishWord, uniqueHindiWord]);
    });

    test("should allow adding new words dynamically", () => {
      // Verify words are not in filter initially
      expect(filter.check(uniqueEnglishWord)).toBe(false);
      expect(filter.check(uniqueHindiWord)).toBe(false);

      // Add single word
      filter.add(uniqueEnglishWord);
      expect(filter.check(`Testing the ${uniqueEnglishWord}`)).toBe(true);

      // Add second word
      filter.add(uniqueHindiWord);
      expect(filter.check(`यह ${uniqueHindiWord} है।`)).toBe(true);
    });

    test("should allow adding multiple words as array", () => {
      const testWords = ["tempword1abc", "tempword2def"];
      expect(filter.check(testWords[0])).toBe(false);
      expect(filter.check(testWords[1])).toBe(false);

      filter.add(testWords);
      expect(filter.check(testWords[0])).toBe(true);
      expect(filter.check(testWords[1])).toBe(true);

      // Cleanup specific to this test
      filter.remove(testWords);
    });

    test("should allow removing words dynamically", () => {
      // Add and confirm
      filter.add(uniqueEnglishWord);
      expect(filter.check(uniqueEnglishWord)).toBe(true);

      // Remove and verify
      filter.remove(uniqueEnglishWord);
      expect(filter.check(uniqueEnglishWord)).toBe(false);
    });

    test("should allow changing the placeholder character", () => {
      const customChar = "X";
      filter.setPlaceholder(customChar);

      const bullshitCensored = customChar.repeat("bullshit".length);
      expect(filter.clean("This is bullshit.")).toBe(
        `This is ${bullshitCensored}.`
      );

      // Reset to default for other tests
      filter.setPlaceholder("*");
    });
  });
});
