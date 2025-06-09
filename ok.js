import allProfanity, { AllProfanity, ProfanitySeverity } from "./dist/index.js";

console.log("🚀 Starting AllProfanity Test Suite\n");


// Test 1: Basic Profanity Detection
console.log("📋 Test 1: Basic Profanity Detection");
console.log(
  "Clean sentence:",
  allProfanity.check("This is ass and that's bad.")
); // false
console.log(
  "English profanity:",
  allProfanity.check("This is a fucking test.")
); // true
console.log("Hindi profanity:", allProfanity.check("यह एक चूतिया परीक्षण है।")); // true
console.log(
  "Hinglish profanity:",
  allProfanity.check("Ye ek chutiya test hai.")
); // true
console.log("");

// Test 2: Text Cleaning
console.log("📋 Test 2: Text Cleaning");
console.log(
  "Character replacement:",
  allProfanity.clean("This is a fucking test.")
);
console.log(
  "Word replacement:",
  allProfanity.cleanWithWord("This is a fucking test.")
);
console.log(
  "Multiple profanities:",
  allProfanity.clean("This damn fucking shit is terrible.")
);
console.log("");

// Test 3: Leet Speak Detection
console.log("📋 Test 3: Leet Speak Detection");
console.log("Leet speak f4ck:", allProfanity.check("This is f4cking awesome"));
console.log("Leet speak $h1t:", allProfanity.check("This $h1t is crazy"));
console.log("Leet speak d4mn:", allProfanity.check("d4mn this is good"));
console.log("");

// Test 4: Advanced Detection with Results
console.log("📋 Test 4: Advanced Detection");
const detectionResult = allProfanity.detect(
  "This fucking damn shit is terrible."
);
console.log("Has profanity:", detectionResult.hasProfanity);
console.log("Detected words:", detectionResult.detectedWords);
console.log("Cleaned text:", detectionResult.cleanedText);
console.log("Severity:", detectionResult.severity);
console.log("Positions:", detectionResult.positions);
console.log("");

// Test 5: Custom Instance with Configuration
console.log("📋 Test 5: Custom Instance Configuration");
const customFilter = new AllProfanity({
  defaultPlaceholder: "#",
  enableLeetSpeak: true,
  caseSensitive: false,
  strictMode: true,
  detectPartialWords: false,
  whitelistWords: ["damn"],
  languages: ["english", "hindi"],
});

console.log(
  "Custom placeholder:",
  customFilter.clean("This is fucking crazy.")
);
console.log(
  "Whitelisted word (damn):",
  customFilter.check("This is damn good.")
);
console.log(
  "Non-whitelisted profanity:",
  customFilter.check("This is fucking good.")
);
console.log("");

// Test 6: Language Management
console.log("📋 Test 6: Language Management");
console.log("Available languages:", allProfanity.getAvailableLanguages());
console.log("Currently loaded languages:", allProfanity.getLoadedLanguages());

// Load additional languages
const loadedCount = allProfanity.loadLanguages(["french", "german", "spanish"]);
console.log("Loaded languages count:", loadedCount);
console.log("Updated loaded languages:", allProfanity.getLoadedLanguages());
console.log("");

// Test 7: Indian Languages
console.log("📋 Test 7: Indian Languages");
const indianCount = allProfanity.loadIndianLanguages();
console.log("Indian languages loaded:", indianCount);
console.log("All loaded languages:", allProfanity.getLoadedLanguages());
console.log("");

// Test 8: Custom Dictionary
console.log("📋 Test 8: Custom Dictionary");
allProfanity.loadCustomDictionary("gaming", ["noob", "scrub", "camper"]);
console.log(
  "Gaming profanity (noob):",
  allProfanity.check("You are such a noob")
);
console.log(
  "Gaming profanity (scrub):",
  allProfanity.check("What a scrub move")
);
console.log("");

// Test 9: Whitelist Functionality
console.log("📋 Test 9: Whitelist Functionality");
allProfanity.addToWhitelist(["hell", "damn"]);
console.log(
  "Whitelisted 'hell':",
  allProfanity.check("What the hell is this?")
);
console.log(
  "Non-whitelisted profanity:",
  allProfanity.check("This is fucking crazy")
);

// Remove from whitelist
allProfanity.removeFromWhitelist(["hell"]);
console.log(
  "After removing 'hell' from whitelist:",
  allProfanity.check("What the hell is this?")
);
console.log("");

// Test 10: Add/Remove Words
console.log("📋 Test 10: Add/Remove Words");
allProfanity.add(["badword", "anotherbad"]);
console.log("Added custom bad word:", allProfanity.check("This is a badword"));

allProfanity.remove(["badword"]);
console.log(
  "After removing custom word:",
  allProfanity.check("This is a badword")
);
console.log("");

// Test 11: Placeholder Management
console.log("📋 Test 11: Placeholder Management");
allProfanity.setPlaceholder("@");
console.log(
  "Custom placeholder (@):",
  allProfanity.clean("This is fucking crazy")
);

allProfanity.setPlaceholder("*"); // Reset to default
console.log("");

// Test 12: Configuration Management
console.log("📋 Test 12: Configuration Management");
console.log("Current config:", allProfanity.getConfig());

allProfanity.updateConfig({
  enableLeetSpeak: false,
  strictMode: true,
});
console.log(
  "Leet speak disabled:",
  allProfanity.check("This is f4cking awesome")
);
console.log("");

// Test 13: Severity Testing
console.log("📋 Test 13: Severity Testing");
const mildResult = allProfanity.detect("This is damn good");
const moderateResult = allProfanity.detect("This damn shit is bad");
const severeResult = allProfanity.detect(
  "This fucking damn shit is terrible ass"
);

console.log(
  "Mild severity:",
  mildResult.severity,
  "- Words:",
  mildResult.detectedWords
);
console.log(
  "Moderate severity:",
  moderateResult.severity,
  "- Words:",
  moderateResult.detectedWords
);
console.log(
  "Severe severity:",
  severeResult.severity,
  "- Words:",
  severeResult.detectedWords
);
console.log("");

// Test 14: Edge Cases
console.log("📋 Test 14: Edge Cases");
console.log("Empty string:", allProfanity.check(""));
console.log("Null/undefined:", allProfanity.check(null));
console.log("Numbers only:", allProfanity.check("12345"));
console.log("Special characters:", allProfanity.check("!@#$%^&*()"));
console.log(
  "Very long text:",
  allProfanity.check(
    "This is a very long sentence with no profanity that should be processed correctly"
  )
);
console.log("");

// Test 15: Word Variations
console.log("📋 Test 15: Word Variations (if implemented)");
console.log("Plural form:", allProfanity.check("These are fucking tests"));
console.log("Past tense:", allProfanity.check("He fucked up"));
console.log("Present continuous:", allProfanity.check("He is fucking around"));
console.log("");

// Test 16: Case Sensitivity
console.log("📋 Test 16: Case Sensitivity");
console.log("Uppercase:", allProfanity.check("THIS IS FUCKING CRAZY"));
console.log("Mixed case:", allProfanity.check("This Is FuCkInG Crazy"));
console.log("Lowercase:", allProfanity.check("this is fucking crazy"));
console.log("");

// Test 17: Performance Test
console.log("📋 Test 17: Performance Test");
const startTime = Date.now();
const longText =
  "This is a test sentence that contains some profanity fucking words and should be processed quickly. ".repeat(
    100
  );
const result = allProfanity.detect(longText);
const endTime = Date.now();
console.log("Processing time for long text:", endTime - startTime, "ms");
console.log("Detected words count:", result.detectedWords.length);
console.log("");

// Test 18: Multiple Language Detection
console.log("📋 Test 18: Multiple Language Detection");
console.log(
  "Mixed English-Hindi:",
  allProfanity.check("This fucking chutiya is bad")
);
console.log("Only Hindi:", allProfanity.check("यह बहुत बुरा है")); // "This is very bad" - may or may not contain profanity depending on dictionary
console.log("");

// Test 19: List Operations
console.log("📋 Test 19: List Operations");
const wordList = allProfanity.list();
console.log("Total profanity words in dictionary:", wordList.length);
console.log("First 10 words:", wordList.slice(0, 10));
console.log("");

// Test 20: Clean Up
console.log("📋 Test 20: Clean Up");
console.log(
  "Before clear - loaded languages:",
  allProfanity.getLoadedLanguages().length
);
allProfanity.clearList();
console.log("After clear - word count:", allProfanity.list().length);
console.log(
  "After clear - still detects profanity:",
  allProfanity.check("This is fucking crazy")
);
console.log("");

console.log("✅ All tests completed!");
console.log(
  "💡 Note: Some tests may show different results based on the actual dictionary content"
);
console.log("🔧 Modify the dictionary files to see different behaviors");
