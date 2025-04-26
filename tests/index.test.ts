// tests/index.test.ts

import filter from "../src/index";
import hindiBadWordsList from "../src/languages/hindi-words";
import bengaliBadWordsList from "../src/languages/bengali-words";
import tamilBadWordsList from "../src/languages/tamil-words";
import teluguBadWordsList from "../src/languages/telugu-words";
import frenchBadWordsList from "../src/languages/french-words";
import germanBadWordsList from "../src/languages/german-words";
import spanishBadWordsList from "../src/languages/spanish-words";

// Sample words from our actual list for testing
// Using real but less offensive words for the test descriptions
const HINDI_BAD_WORD_ROMAN = "chutiya";
const HINDI_BAD_WORD_DEVANAGARI = "भोसड़ी";
const HINGLISH_BAD_WORD = "behenchod";
const HINGLISH_VARIATION = "bc";

// Bengali test words
const BENGALI_BAD_WORD_SCRIPT = "বাল";
const BENGALI_BAD_WORD_ROMAN = "bal";

// Tamil test words
const TAMIL_BAD_WORD_SCRIPT = "கூதி";
const TAMIL_BAD_WORD_ROMAN = "koothi";

// Telugu test words
const TELUGU_BAD_WORD_SCRIPT = "పూకు";
const TELUGU_BAD_WORD_ROMAN = "pooku";

// European languages test words
const FRENCH_BAD_WORD = "merde";
const GERMAN_BAD_WORD = "scheisse"; // Using lowercase and alternative spelling without ß
const SPANISH_BAD_WORD = "mierda";

// Clean words for testing false positives
const HINDI_CLEAN_WORD = "अच्छा"; // Good
const ENGLISH_CLEAN_WORD = "excellent";
const BENGALI_CLEAN_WORD = "ভালো"; // Good
const TAMIL_CLEAN_WORD = "நன்று"; // Good
const TELUGU_CLEAN_WORD = "మంచి"; // Good
const FRENCH_CLEAN_WORD = "bonjour"; // Hello
const GERMAN_CLEAN_WORD = "Guten"; // Good
const SPANISH_CLEAN_WORD = "bueno"; // Good

describe("AllProfanity Filter", () => {
  // Load all languages and ensure test words are in the dictionary before running tests
  beforeAll(() => {
    filter.loadLanguage("bengali");
    filter.loadLanguage("tamil");
    filter.loadLanguage("telugu");
    filter.loadLanguage("french");
    filter.loadLanguage("german");
    filter.loadLanguage("spanish");
    
    // Ensure our test words are in the dictionary
    filter.add([
      BENGALI_BAD_WORD_SCRIPT,
      BENGALI_BAD_WORD_ROMAN,
      TAMIL_BAD_WORD_SCRIPT,
      TAMIL_BAD_WORD_ROMAN,
      TELUGU_BAD_WORD_SCRIPT,
      TELUGU_BAD_WORD_ROMAN,
      FRENCH_BAD_WORD,
      GERMAN_BAD_WORD,
      SPANISH_BAD_WORD
    ]);
  });
  
  // Clean up after all tests
  afterAll(() => {
    // Remove our test words to leave the dictionary as we found it
    filter.remove([
      BENGALI_BAD_WORD_SCRIPT,
      BENGALI_BAD_WORD_ROMAN,
      TAMIL_BAD_WORD_SCRIPT,
      TAMIL_BAD_WORD_ROMAN,
      TELUGU_BAD_WORD_SCRIPT,
      TELUGU_BAD_WORD_ROMAN,
      FRENCH_BAD_WORD,
      GERMAN_BAD_WORD,
      SPANISH_BAD_WORD
    ]);
  });
  
  describe("Language Management", () => {
    test("should report loaded languages", () => {
      const loadedLanguages = filter.getLoadedLanguages();
      expect(loadedLanguages).toContain("english"); // Default from leo-profanity
      expect(loadedLanguages).toContain("hindi"); // Our addition
      expect(loadedLanguages).toContain("bengali");
      expect(loadedLanguages).toContain("tamil");
      expect(loadedLanguages).toContain("telugu");
      expect(loadedLanguages).toContain("french");
      expect(loadedLanguages).toContain("german");
      expect(loadedLanguages).toContain("spanish");
    });
    
    test("should report available languages", () => {
      const availableLanguages = filter.getAvailableLanguages();
      expect(availableLanguages).toContain("hindi");
      expect(availableLanguages).toContain("bengali");
      expect(availableLanguages).toContain("tamil");
      expect(availableLanguages).toContain("telugu");
      expect(availableLanguages).toContain("french");
      expect(availableLanguages).toContain("german");
      expect(availableLanguages).toContain("spanish");
    });
  });
  
  describe("Initialization", () => {
    test("should load without errors", () => {
      expect(filter).toBeDefined();
      expect(typeof filter.check).toBe("function");
      expect(typeof filter.clean).toBe("function");
    });

    test("should have added Hindi words to the list", () => {
      const currentList = filter.list();
      expect(currentList.some((word: string) => hindiBadWordsList.includes(word))).toBe(
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
    
    test("should be able to load additional languages", () => {
      // Load additional languages
      filter.loadLanguage("bengali");
      filter.loadLanguage("tamil");
      filter.loadLanguage("telugu");
      filter.loadLanguage("french");
      filter.loadLanguage("german");
      filter.loadLanguage("spanish");
      
      const currentList = filter.list();
      
      // Check if words from each language are in the list
      expect(currentList.some((word: string) => bengaliBadWordsList.includes(word))).toBe(true);
      expect(currentList.some((word: string) => tamilBadWordsList.includes(word))).toBe(true);
      expect(currentList.some((word: string) => teluguBadWordsList.includes(word))).toBe(true);
      expect(currentList.some((word: string) => frenchBadWordsList.includes(word))).toBe(true);
      expect(currentList.some((word: string) => germanBadWordsList.includes(word))).toBe(true);
      expect(currentList.some((word: string) => spanishBadWordsList.includes(word))).toBe(true);
      
      // Check specific words from each language
      expect(currentList).toContain(BENGALI_BAD_WORD_SCRIPT.toLowerCase());
      expect(currentList).toContain(BENGALI_BAD_WORD_ROMAN.toLowerCase());
      expect(currentList).toContain(TAMIL_BAD_WORD_SCRIPT.toLowerCase());
      expect(currentList).toContain(TAMIL_BAD_WORD_ROMAN.toLowerCase());
      expect(currentList).toContain(TELUGU_BAD_WORD_SCRIPT.toLowerCase());
      expect(currentList).toContain(TELUGU_BAD_WORD_ROMAN.toLowerCase());
      expect(currentList).toContain(FRENCH_BAD_WORD.toLowerCase());
      expect(currentList).toContain(GERMAN_BAD_WORD.toLowerCase());
      expect(currentList).toContain(SPANISH_BAD_WORD.toLowerCase());
    });
    
    test("should be able to load Indian languages at once", () => {
      // Import the AllProfanity class directly to create a new instance
      const { AllProfanity } = require("../src/index");
      const newFilter = new AllProfanity();
      const loadedCount = newFilter.loadIndianLanguages();
      
      // Should load Hindi, Bengali, Tamil, and Telugu
      expect(loadedCount).toBe(4);
      
      const currentList = newFilter.list();
      expect(currentList.some((word: string) => hindiBadWordsList.includes(word))).toBe(true);
      expect(currentList.some((word: string) => bengaliBadWordsList.includes(word))).toBe(true);
      expect(currentList.some((word: string) => tamilBadWordsList.includes(word))).toBe(true);
      expect(currentList.some((word: string) => teluguBadWordsList.includes(word))).toBe(true);
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
    
    // Test Bengali words
    test("should detect Bengali profanity (Bengali script)", () => {
      expect(
        filter.check(`এই বাক্যে ${BENGALI_BAD_WORD_SCRIPT} শব্দ আছে।`)
      ).toBe(true);
      expect(
        filter.check(`${BENGALI_BAD_WORD_SCRIPT} একটি খারাপ শব্দ।`)
      ).toBe(true);
    });
    
    test("should detect Bengali profanity (Roman script)", () => {
      expect(
        filter.check(`This has the word ${BENGALI_BAD_WORD_ROMAN} in it.`)
      ).toBe(true);
      expect(
        filter.check(`Using ${BENGALI_BAD_WORD_ROMAN} as an example.`)
      ).toBe(true);
    });
    
    // Test Tamil words
    test("should detect Tamil profanity (Tamil script)", () => {
      expect(
        filter.check(`இந்த வாக்கியத்தில் ${TAMIL_BAD_WORD_SCRIPT} உள்ளது.`)
      ).toBe(true);
      expect(
        filter.check(`${TAMIL_BAD_WORD_SCRIPT} ஒரு கெட்ட வார்த்தை.`)
      ).toBe(true);
    });
    
    test("should detect Tamil profanity (Roman script)", () => {
      expect(
        filter.check(`This has the word ${TAMIL_BAD_WORD_ROMAN} in it.`)
      ).toBe(true);
      expect(
        filter.check(`Using ${TAMIL_BAD_WORD_ROMAN} as an example.`)
      ).toBe(true);
    });
    
    // Test Telugu words
    test("should detect Telugu profanity (Telugu script)", () => {
      expect(
        filter.check(`ఈ వాక్యంలో ${TELUGU_BAD_WORD_SCRIPT} పదం ఉంది.`)
      ).toBe(true);
      expect(
        filter.check(`${TELUGU_BAD_WORD_SCRIPT} ఒక చెడు పదం.`)
      ).toBe(true);
    });
    
    test("should detect Telugu profanity (Roman script)", () => {
      expect(
        filter.check(`This has the word ${TELUGU_BAD_WORD_ROMAN} in it.`)
      ).toBe(true);
      expect(
        filter.check(`Using ${TELUGU_BAD_WORD_ROMAN} as an example.`)
      ).toBe(true);
    });
    
    // Test European languages
    test("should detect French profanity", () => {
      expect(
        filter.check(`Cette phrase contient le mot ${FRENCH_BAD_WORD}.`)
      ).toBe(true);
      expect(
        filter.check(`Using ${FRENCH_BAD_WORD} as an example.`)
      ).toBe(true);
    });
    
    test("should detect German profanity", () => {
      expect(
        filter.check(`Dieser Satz enthält das Wort ${GERMAN_BAD_WORD}.`)
      ).toBe(true);
      expect(
        filter.check(`Using ${GERMAN_BAD_WORD} as an example.`)
      ).toBe(true);
    });
    
    test("should detect Spanish profanity", () => {
      expect(
        filter.check(`Esta frase contiene la palabra ${SPANISH_BAD_WORD}.`)
      ).toBe(true);
      expect(
        filter.check(`Using ${SPANISH_BAD_WORD} as an example.`)
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
      
      // Test case insensitivity for other languages
      expect(filter.check(`Testing ${BENGALI_BAD_WORD_ROMAN.toUpperCase()}.`)).toBe(true);
      expect(filter.check(`Testing ${TAMIL_BAD_WORD_ROMAN.toUpperCase()}.`)).toBe(true);
      expect(filter.check(`Testing ${TELUGU_BAD_WORD_ROMAN.toUpperCase()}.`)).toBe(true);
      expect(filter.check(`Testing ${FRENCH_BAD_WORD.toUpperCase()}.`)).toBe(true);
      expect(filter.check(`Testing ${GERMAN_BAD_WORD.toUpperCase()}.`)).toBe(true);
      expect(filter.check(`Testing ${SPANISH_BAD_WORD.toUpperCase()}.`)).toBe(true);
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
    
    // Test cleaning Bengali words
    test("should clean Bengali profanity (Bengali script)", () => {
      const censoredWord = "*".repeat(BENGALI_BAD_WORD_SCRIPT.length);
      expect(
        filter.clean(`এই বাক্যে ${BENGALI_BAD_WORD_SCRIPT} শব্দ আছে।`)
      ).toBe(`এই বাক্যে ${censoredWord} শব্দ আছে।`);
    });
    
    test("should clean Bengali profanity (Roman script)", () => {
      const censoredWord = "*".repeat(BENGALI_BAD_WORD_ROMAN.length);
      expect(
        filter.clean(`This has the word ${BENGALI_BAD_WORD_ROMAN} in it.`)
      ).toBe(`This has the word ${censoredWord} in it.`);
    });
    
    // Test cleaning Tamil words
    test("should clean Tamil profanity (Tamil script)", () => {
      const censoredWord = "*".repeat(TAMIL_BAD_WORD_SCRIPT.length);
      expect(
        filter.clean(`இந்த வாக்கியத்தில் ${TAMIL_BAD_WORD_SCRIPT} உள்ளது.`)
      ).toBe(`இந்த வாக்கியத்தில் ${censoredWord} உள்ளது.`);
    });
    
    test("should clean Tamil profanity (Roman script)", () => {
      const censoredWord = "*".repeat(TAMIL_BAD_WORD_ROMAN.length);
      expect(
        filter.clean(`This has the word ${TAMIL_BAD_WORD_ROMAN} in it.`)
      ).toBe(`This has the word ${censoredWord} in it.`);
    });
    
    // Test cleaning Telugu words
    test("should clean Telugu profanity (Telugu script)", () => {
      const censoredWord = "*".repeat(TELUGU_BAD_WORD_SCRIPT.length);
      expect(
        filter.clean(`ఈ వాక్యంలో ${TELUGU_BAD_WORD_SCRIPT} పదం ఉంది.`)
      ).toBe(`ఈ వాక్యంలో ${censoredWord} పదం ఉంది.`);
    });
    
    test("should clean Telugu profanity (Roman script)", () => {
      const censoredWord = "*".repeat(TELUGU_BAD_WORD_ROMAN.length);
      expect(
        filter.clean(`This has the word ${TELUGU_BAD_WORD_ROMAN} in it.`)
      ).toBe(`This has the word ${censoredWord} in it.`);
    });
    
    // Test cleaning European languages
    test("should clean French profanity", () => {
      const censoredWord = "*".repeat(FRENCH_BAD_WORD.length);
      expect(
        filter.clean(`Cette phrase contient le mot ${FRENCH_BAD_WORD}.`)
      ).toBe(`Cette phrase contient le mot ${censoredWord}.`);
    });
    
    test("should clean German profanity", () => {
      const censoredWord = "*".repeat(GERMAN_BAD_WORD.length);
      expect(
        filter.clean(`Dieser Satz enthält das Wort ${GERMAN_BAD_WORD}.`)
      ).toBe(`Dieser Satz enthält das Wort ${censoredWord}.`);
    });
    
    test("should clean Spanish profanity", () => {
      const censoredWord = "*".repeat(SPANISH_BAD_WORD.length);
      expect(
        filter.clean(`Esta frase contiene la palabra ${SPANISH_BAD_WORD}.`)
      ).toBe(`Esta frase contiene la palabra ${censoredWord}.`);
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
    
    test("should allow adding custom words in different languages", () => {
      const customBengaliWord = "কাস্টমবাংলা";
      const customTamilWord = "கஸ்டம்தமிழ்";
      const customTeluguWord = "కస్టమ్తెలుగు";
      const customFrenchWord = "customfrançais";
      const customGermanWord = "customdeutsch";
      const customSpanishWord = "customespañol";
      
      // Verify none are detected initially
      expect(filter.check(`This contains ${customBengaliWord}.`)).toBe(false);
      expect(filter.check(`This contains ${customTamilWord}.`)).toBe(false);
      expect(filter.check(`This contains ${customTeluguWord}.`)).toBe(false);
      expect(filter.check(`This contains ${customFrenchWord}.`)).toBe(false);
      expect(filter.check(`This contains ${customGermanWord}.`)).toBe(false);
      expect(filter.check(`This contains ${customSpanishWord}.`)).toBe(false);
      
      // Add all words at once
      filter.add([
        customBengaliWord,
        customTamilWord,
        customTeluguWord,
        customFrenchWord,
        customGermanWord,
        customSpanishWord
      ]);
      
      // Now they should all be detected
      expect(filter.check(`This contains ${customBengaliWord}.`)).toBe(true);
      expect(filter.check(`This contains ${customTamilWord}.`)).toBe(true);
      expect(filter.check(`This contains ${customTeluguWord}.`)).toBe(true);
      expect(filter.check(`This contains ${customFrenchWord}.`)).toBe(true);
      expect(filter.check(`This contains ${customGermanWord}.`)).toBe(true);
      expect(filter.check(`This contains ${customSpanishWord}.`)).toBe(true);
      
      // Clean up
      filter.remove([
        customBengaliWord,
        customTamilWord,
        customTeluguWord,
        customFrenchWord,
        customGermanWord,
        customSpanishWord
      ]);
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
