import filter from "../src/index";
import hindiBadWordsList from "../src/languages/hindi-words";
import bengaliBadWordsList from "../src/languages/bengali-words";
import tamilBadWordsList from "../src/languages/tamil-words";
import teluguBadWordsList from "../src/languages/telugu-words";
import frenchBadWordsList from "../src/languages/french-words";
import germanBadWordsList from "../src/languages/german-words";
import spanishBadWordsList from "../src/languages/spanish-words";

// Sample words for testing
const HINDI_BAD_WORD_ROMAN = "chutiya";
const HINDI_BAD_WORD_DEVANAGARI = "भोसड़ी";
const HINGLISH_BAD_WORD = "behenchod";
const HINGLISH_VARIATION = "bc";
const BENGALI_BAD_WORD_SCRIPT = "বাল";
const BENGALI_BAD_WORD_ROMAN = "bal";
const TAMIL_BAD_WORD_SCRIPT = "கூதி";
const TAMIL_BAD_WORD_ROMAN = "koothi";
const TELUGU_BAD_WORD_SCRIPT = "పూకు";
const TELUGU_BAD_WORD_ROMAN = "pooku";
const FRENCH_BAD_WORD = "merde";
const GERMAN_BAD_WORD = "scheisse";
const SPANISH_BAD_WORD = "mierda";
const HINDI_CLEAN_WORD = "अच्छा";
const ENGLISH_CLEAN_WORD = "excellent";
const BENGALI_CLEAN_WORD = "ভালো";
const TAMIL_CLEAN_WORD = "நன்று";
const TELUGU_CLEAN_WORD = "మంచి";
const FRENCH_CLEAN_WORD = "bonjour";
const GERMAN_CLEAN_WORD = "Guten";
const SPANISH_CLEAN_WORD = "bueno";

describe("AllProfanity Filter", () => {
  beforeAll(() => {
    filter.loadLanguages([
      "bengali",
      "tamil",
      "telugu",
      "french",
      "german",
      "spanish",
    ]);
    filter.add([
      BENGALI_BAD_WORD_SCRIPT,
      BENGALI_BAD_WORD_ROMAN,
      TAMIL_BAD_WORD_SCRIPT,
      TAMIL_BAD_WORD_ROMAN,
      TELUGU_BAD_WORD_SCRIPT,
      TELUGU_BAD_WORD_ROMAN,
      FRENCH_BAD_WORD,
      GERMAN_BAD_WORD,
      SPANISH_BAD_WORD,
    ]);
  });

  afterAll(() => {
    filter.remove([
      BENGALI_BAD_WORD_SCRIPT,
      BENGALI_BAD_WORD_ROMAN,
      TAMIL_BAD_WORD_SCRIPT,
      TAMIL_BAD_WORD_ROMAN,
      TELUGU_BAD_WORD_SCRIPT,
      TELUGU_BAD_WORD_ROMAN,
      FRENCH_BAD_WORD,
      GERMAN_BAD_WORD,
      SPANISH_BAD_WORD,
    ]);
  });

  describe("Language Management", () => {
    test("should report loaded languages", () => {
      const loaded = filter.getLoadedLanguages();
      expect(loaded).toEqual(
        expect.arrayContaining([
          "english",
          "hindi",
          "bengali",
          "tamil",
          "telugu",
          "french",
          "german",
          "spanish",
        ])
      );
    });
    test("should report available languages", () => {
      const available = filter.getAvailableLanguages();
      expect(available).toEqual(
        expect.arrayContaining([
          "hindi",
          "bengali",
          "tamil",
          "telugu",
          "french",
          "german",
          "spanish",
        ])
      );
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
      expect(
        currentList.some((w: string) => hindiBadWordsList.includes(w))
      ).toBe(true);
      expect(currentList).toContain(HINDI_BAD_WORD_ROMAN.toLowerCase());
      expect(currentList).toContain(HINDI_BAD_WORD_DEVANAGARI.toLowerCase());
    });
    test("should retain original leo-profanity words", () => {
      const currentList = filter.list();
      expect(currentList).toContain("bullshit");
      expect(currentList).toContain("fuck");
    });
    test("should be able to load additional languages", () => {
      const currentList = filter.list();
      expect(
        currentList.some((w: string) => bengaliBadWordsList.includes(w))
      ).toBe(true);
      expect(
        currentList.some((w: string) => tamilBadWordsList.includes(w))
      ).toBe(true);
      expect(
        currentList.some((w: string) => teluguBadWordsList.includes(w))
      ).toBe(true);
      expect(
        currentList.some((w: string) => frenchBadWordsList.includes(w))
      ).toBe(true);
      expect(
        currentList.some((w: string) => germanBadWordsList.includes(w))
      ).toBe(true);
      expect(
        currentList.some((w: string) => spanishBadWordsList.includes(w))
      ).toBe(true);
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
      const { AllProfanity } = require("../src/index");
      const newFilter = new AllProfanity();
      const loadedCount = newFilter.loadIndianLanguages();
      expect(loadedCount).toBe(4);
      const currentList = newFilter.list();
      expect(
        currentList.some((w: string) => hindiBadWordsList.includes(w))
      ).toBe(true);
      expect(
        currentList.some((w: string) => bengaliBadWordsList.includes(w))
      ).toBe(true);
      expect(
        currentList.some((w: string) => tamilBadWordsList.includes(w))
      ).toBe(true);
      expect(
        currentList.some((w: string) => teluguBadWordsList.includes(w))
      ).toBe(true);
    });
  });

 

  describe("Profanity Detection (check)", () => {
    test("should detect default English profanity", () => {
      expect(filter.check("This sentence contains bullshit.")).toBe(true);
      expect(filter.check("What the fuck is this?")).toBe(true);
      expect(filter.check("This is perfectly fine.")).toBe(false);
    });
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
    
    test("should detect Bengali profanity (Roman script)", () => {
      expect(
        filter.check(`This has the word ${BENGALI_BAD_WORD_ROMAN} in it.`)
      ).toBe(true);
      expect(
        filter.check(`Using ${BENGALI_BAD_WORD_ROMAN} as an example.`)
      ).toBe(true);
    });
    test("should detect Tamil profanity (Tamil script)", () => {
      expect(
        filter.check(`இந்த வாக்கியத்தில் ${TAMIL_BAD_WORD_SCRIPT} உள்ளது.`)
      ).toBe(true);
      expect(filter.check(`${TAMIL_BAD_WORD_SCRIPT} ஒரு கெட்ட வார்த்தை.`)).toBe(
        true
      );
    });
    test("should detect Tamil profanity (Roman script)", () => {
      expect(
        filter.check(`This has the word ${TAMIL_BAD_WORD_ROMAN} in it.`)
      ).toBe(true);
      expect(filter.check(`Using ${TAMIL_BAD_WORD_ROMAN} as an example.`)).toBe(
        true
      );
    });
    test("should detect Telugu profanity (Telugu script)", () => {
      expect(
        filter.check(`ఈ వాక్యంలో ${TELUGU_BAD_WORD_SCRIPT} పదం ఉంది.`)
      ).toBe(true);
      expect(filter.check(`${TELUGU_BAD_WORD_SCRIPT} ఒక చెడు పదం.`)).toBe(true);
    });
    test("should detect Telugu profanity (Roman script)", () => {
      expect(
        filter.check(`This has the word ${TELUGU_BAD_WORD_ROMAN} in it.`)
      ).toBe(true);
      expect(
        filter.check(`Using ${TELUGU_BAD_WORD_ROMAN} as an example.`)
      ).toBe(true);
    });
    test("should detect French profanity", () => {
      expect(
        filter.check(`Cette phrase contient le mot ${FRENCH_BAD_WORD}.`)
      ).toBe(true);
      expect(filter.check(`Using ${FRENCH_BAD_WORD} as an example.`)).toBe(
        true
      );
    });
    test("should detect German profanity", () => {
      expect(
        filter.check(`Dieser Satz enthält das Wort ${GERMAN_BAD_WORD}.`)
      ).toBe(true);
      expect(filter.check(`Using ${GERMAN_BAD_WORD} as an example.`)).toBe(
        true
      );
    });
    test("should detect Spanish profanity", () => {
      expect(
        filter.check(`Esta frase contiene la palabra ${SPANISH_BAD_WORD}.`)
      ).toBe(true);
      expect(filter.check(`Using ${SPANISH_BAD_WORD} as an example.`)).toBe(
        true
      );
    });
    test("should detect profanity regardless of case", () => {
      expect(filter.check("This is BULLSHIT.")).toBe(true);
      expect(
        filter.check(`Testing ${HINDI_BAD_WORD_ROMAN.toUpperCase()} here.`)
      ).toBe(true);
      expect(filter.check(`Using ${HINGLISH_BAD_WORD.toUpperCase()}.`)).toBe(
        true
      );
      expect(
        filter.check(`Testing ${BENGALI_BAD_WORD_ROMAN.toUpperCase()}.`)
      ).toBe(true);
      expect(
        filter.check(`Testing ${TAMIL_BAD_WORD_ROMAN.toUpperCase()}.`)
      ).toBe(true);
      expect(
        filter.check(`Testing ${TELUGU_BAD_WORD_ROMAN.toUpperCase()}.`)
      ).toBe(true);
      expect(filter.check(`Testing ${FRENCH_BAD_WORD.toUpperCase()}.`)).toBe(
        true
      );
      expect(filter.check(`Testing ${GERMAN_BAD_WORD.toUpperCase()}.`)).toBe(
        true
      );
      expect(filter.check(`Testing ${SPANISH_BAD_WORD.toUpperCase()}.`)).toBe(
        true
      );
    });
    test("should return false for clean strings", () => {
      expect(filter.check("This is a perfectly clean sentence.")).toBe(false);
      expect(
        filter.check(`यह एक साफ वाक्य है जिसमे ${HINDI_CLEAN_WORD} शब्द है।`)
      ).toBe(false);
      expect(filter.check(`Using ${ENGLISH_CLEAN_WORD} vocabulary.`)).toBe(
        false
      );
    });
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
   
    test("should clean Bengali profanity (Roman script)", () => {
      const censoredWord = "*".repeat(BENGALI_BAD_WORD_ROMAN.length);
      expect(
        filter.clean(`This has the word ${BENGALI_BAD_WORD_ROMAN} in it.`)
      ).toBe(`This has the word ${censoredWord} in it.`);
    });
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
      const hindiCensored = "*".repeat(HINDI_BAD_WORD_ROMAN.length);
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
    const uniqueEnglishWord = "xyztestword123";
    const uniqueHindiWord = "परीक्षाशब्द";
    afterEach(() => {
      filter.remove([uniqueEnglishWord, uniqueHindiWord]);
    });
    test("should allow adding new words dynamically", () => {
      expect(filter.check(uniqueEnglishWord)).toBe(false);
      expect(filter.check(uniqueHindiWord)).toBe(false);
      filter.add(uniqueEnglishWord);
      expect(filter.check(`Testing the ${uniqueEnglishWord}`)).toBe(true);
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
      expect(filter.check(`This contains ${customBengaliWord}.`)).toBe(false);
      expect(filter.check(`This contains ${customTamilWord}.`)).toBe(false);
      expect(filter.check(`This contains ${customTeluguWord}.`)).toBe(false);
      expect(filter.check(`This contains ${customFrenchWord}.`)).toBe(false);
      expect(filter.check(`This contains ${customGermanWord}.`)).toBe(false);
      expect(filter.check(`This contains ${customSpanishWord}.`)).toBe(false);
      filter.add([
        customBengaliWord,
        customTamilWord,
        customTeluguWord,
        customFrenchWord,
        customGermanWord,
        customSpanishWord,
      ]);
      expect(filter.check(`This contains ${customBengaliWord}.`)).toBe(true);
      expect(filter.check(`This contains ${customTamilWord}.`)).toBe(true);
      expect(filter.check(`This contains ${customTeluguWord}.`)).toBe(true);
      expect(filter.check(`This contains ${customFrenchWord}.`)).toBe(true);
      expect(filter.check(`This contains ${customGermanWord}.`)).toBe(true);
      expect(filter.check(`This contains ${customSpanishWord}.`)).toBe(true);
      filter.remove([
        customBengaliWord,
        customTamilWord,
        customTeluguWord,
        customFrenchWord,
        customGermanWord,
        customSpanishWord,
      ]);
    });
    test("should allow adding multiple words as array", () => {
      const testWords = ["tempword1abc", "tempword2def"];
      expect(filter.check(testWords[0])).toBe(false);
      expect(filter.check(testWords[1])).toBe(false);
      filter.add(testWords);
      expect(filter.check(testWords[0])).toBe(true);
      expect(filter.check(testWords[1])).toBe(true);
      filter.remove(testWords);
    });
    test("should allow removing words dynamically", () => {
      filter.add(uniqueEnglishWord);
      expect(filter.check(uniqueEnglishWord)).toBe(true);
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
      filter.setPlaceholder("*");
    });
  });

  describe("Whitelist", () => {
    const safeWord = "safeass";
    beforeAll(() => {
      filter.add(safeWord);
      filter.addToWhitelist([safeWord]);
    });
    afterAll(() => {
      filter.removeFromWhitelist([safeWord]);
      filter.remove(safeWord);
    });
    test("should not flag whitelisted words", () => {
      expect(filter.check("He is a safeass driver.")).toBe(false);
      expect(filter.clean("He is a safeass driver.")).toContain("safeass");
    });
  });

  describe("Config/Options API", () => {
    test("should allow updating config and placeholder", () => {
      filter.setPlaceholder("#");
      expect(filter.clean("bullshit")).toBe("########");
      filter.setPlaceholder("*");
    });
    test("should allow toggling leet speak detection", () => {
      filter.updateConfig({ enableLeetSpeak: false });
      filter.add("leet");
      expect(filter.check("l33t")).toBe(false);
      filter.updateConfig({ enableLeetSpeak: true });
      expect(filter.check("l33t")).toBe(true);
      filter.remove("leet");
    });
    test("should allow toggling case sensitivity", () => {
      filter.updateConfig({ caseSensitive: true });
      filter.add("CaseTestWord");
      expect(filter.check("casetestword")).toBe(false);
      expect(filter.check("CaseTestWord")).toBe(true);
      filter.remove("CaseTestWord");
      filter.updateConfig({ caseSensitive: false });
    });
  });
});
