import allProfanity, {
  englishBadWords,
  hindiBadWords,
  frenchBadWords,
  germanBadWords,
  spanishBadWords,
  bengaliBadWords,
  tamilBadWords,
  teluguBadWords,
  AllProfanity,
  ProfanitySeverity,
  ProfanityDetectionResult,
} from "../src/index";

/**
 * AllProfanity Library - Example Usage (2025 Edition)
 *
 * This example demonstrates the core features of the refactored AllProfanity library,
 * including O(n) TRIE-based profanity detection, advanced leet-speak support,
 * multi-language management, accurate cleaning, dynamic word management,
 * and robust whitelist/placeholder configuration.
 */

// Display section headers
function displaySection(title: string): void {
  console.log("\n" + "=".repeat(50));
  console.log(`  ${title}`);
  console.log("=".repeat(50) + "\n");
}

// Display check results (simple boolean)
function displayCheck(text: string): void {
  const result = allProfanity.check(text);
  console.log(`"${text}" ${result ? "✘ CONTAINS PROFANITY" : "✓ CLEAN"}`);
}

// Display advanced detection results
function displayDetect(text: string): void {
  const result: ProfanityDetectionResult = allProfanity.detect(text);
  if (result.hasProfanity) {
    console.log(
      `"${text}" ✘ PROFANITY DETECTED | Words: [${result.detectedWords.join(
        ", "
      )}] | Severity: ${ProfanitySeverity[result.severity]}`
    );
    if (result.positions.length) {
      result.positions.forEach((p, idx) =>
        console.log(
          `  Match #${idx + 1}: "${p.word}" (pos ${p.start}-${p.end})`
        )
      );
    }
  } else {
    console.log(`"${text}" ✓ CLEAN`);
  }
}

// Display cleaning results
function displayClean(
  text: string,
  method: "character" | "word" = "character",
  placeholder?: string
): void {
  let cleaned: string;

  if (method === "character") {
    cleaned = allProfanity.clean(text, placeholder);
    console.log(
      `Character cleaning${placeholder ? ` (with '${placeholder}')` : ""}:`
    );
  } else {
    cleaned = allProfanity.cleanWithPlaceholder(text, placeholder);
    console.log(
      `Word cleaning${placeholder ? ` (with '${placeholder}')` : ""}:`
    );
  }

  console.log(`  Original: "${text}"`);
  console.log(`  Cleaned:  "${cleaned}"`);
}

// Start the demo
displaySection("WELCOME TO ALLPROFANITY DEMO");
console.log(
  "This example demonstrates the features of the AllProfanity library (2025 Edition)\n"
);

// 1. Basic profanity checking
displaySection("1. BASIC PROFANITY CHECKING");

// English examples
console.log("English content:");
displayCheck("This is a clean sentence.");
displayCheck("This is a bullshit sentence.");
displayCheck("What the fuck is this?");

// Hindi examples (Devanagari script)
console.log("\nHindi content (Devanagari script):");
displayCheck("यह एक अच्छा वाक्य है।"); // Clean
displayCheck("यह एक चूतिया वाक्य है।"); // Profanity

// Hindi examples (Roman script)
console.log("\nHindi content (Roman script):");
displayCheck("Yeh ek accha vakya hai."); // Clean
displayCheck("Yeh ek chutiya vakya hai."); // Profanity

// Hinglish examples
console.log("\nHinglish content:");
displayCheck("Kya scene hai bhai?"); // Clean
displayCheck("BC kya kar raha hai?"); // Profanity abbreviation

// Mixed language content
console.log("\nMixed language content:");
displayCheck("This sentence has the Hindi word अच्छा which means good.");
displayCheck("This sentence has the Hindi word चूतिया which is a profanity.");

// 2. Advanced detection (NEW)
displaySection("2. ADVANCED PROFANITY DETECTION");
displayDetect("This is a clean sentence.");
displayDetect("What the fuck is this?");
displayDetect("यह एक चूतिया परीक्षण है।");
displayDetect("This is a bullshit and chutiya example.");

// 3. Cleaning profanity
displaySection("3. CLEANING PROFANITY");

// Character-by-character cleaning
console.log("Default character-by-character cleaning:");
displayClean("This is a bullshit example.", "character");
displayClean("This contains the word fuck in it.", "character");
displayClean("यह एक चूतिया उदाहरण है।", "character");

// Whole word cleaning
console.log("\nWhole word cleaning:");
displayClean("This is a bullshit example.", "word");
displayClean("This contains the word fuck in it.", "word");
displayClean("यह एक चूतिया उदाहरण है।", "word");

// Custom placeholder character
console.log("\nCustom character placeholder:");
displayClean("This is a bullshit example.", "character", "#");

// Custom placeholder word
console.log("\nCustom word placeholder:");
displayClean("This is a bullshit example.", "word", "[CENSORED]");

// 4. Handling punctuation and word boundaries
displaySection("4. PUNCTUATION & WORD BOUNDARIES");

console.log("Handling punctuation:");
displayClean("This is bullshit!", "word");
displayClean("Is this bullshit? Yes, it is.", "word");

console.log("\nWord boundaries (avoiding false positives):");
displayCheck("He is an associate professor."); // Should not detect 'ass'
displayCheck("I work as an analyst."); // Should not detect 'anal'
displayCheck("That was a great assignment!"); // Should not detect 'ass'

// Add custom words
console.log("\nAdding custom words to the list:");
const customWord = "badword123";
console.log(`Adding "${customWord}" to the list...`);
displayCheck(`This contains ${customWord}.`); // Should be clean
allProfanity.add(customWord);
displayCheck(`This contains ${customWord}.`); // Should detect profanity now

// Add multiple words at once
console.log("\nAdding multiple custom words at once:");
const customWords = ["customBadWord1", "customBadWord2"];
allProfanity.add(customWords);
displayCheck(`Testing ${customWords[0]} and ${customWords[1]}.`); // Should detect

// Remove words
console.log("\nRemoving words from the list:");
console.log(`Removing "${customWord}" from the list...`);
allProfanity.remove(customWord);
displayCheck(`This contains ${customWord}.`); // Should be clean again

// Clean up our custom words to leave the list as we found it
allProfanity.remove(customWords);

// 6. Placeholder settings
displaySection("6. PLACEHOLDER SETTINGS");

// Change default placeholder for character cleaning
console.log("Default placeholder result:");
displayClean("This is bullshit.", "character");

console.log('\nChanging placeholder to "#":');
allProfanity.setPlaceholder("#");
displayClean("This is bullshit.", "character");

// Reset placeholder to default
console.log('\nResetting placeholder to "*":');
allProfanity.setPlaceholder("*");
displayClean("This is bullshit.", "character");

// 7. Language loading and export
displaySection("7. LANGUAGE LOADING & EXPORT");

// Show available languages
console.log("Available languages:", allProfanity.getAvailableLanguages());

// Show loaded languages
console.log("Currently loaded languages:", allProfanity.getLoadedLanguages());

// Load a new language (e.g., French)
console.log("Loading French...");
allProfanity.loadLanguage("french");
console.log("Now loaded:", allProfanity.getLoadedLanguages());

// Use exported dictionaries directly
console.log("First 3 French bad words:", frenchBadWords.slice(0, 3));

// 8. Whitelist demo
displaySection("8. WHITELIST DEMO");
console.log('Whitelisting "anal" and "ass"...');
allProfanity.addToWhitelist(["anal", "ass"]);
displayCheck("He is an associate professor."); // Should never detect 'ass'
displayCheck("I work as an analyst."); // Should never detect 'anal'
allProfanity.removeFromWhitelist(["anal", "ass"]);

// 9. Leet-speak detection (NEW)
displaySection("9. LEET-SPEAK DETECTION");
console.log('Checking "f#ck" and "a55hole":');
displayDetect("You are a f#cking a55hole!"); // Should detect leet-speak variants

// 10. Multi-language and Indian language loading (NEW)
displaySection("10. MULTI-LANGUAGE SUPPORT");
console.log("Loading Indian languages in bulk...");
allProfanity.loadIndianLanguages();
console.log("Loaded languages:", allProfanity.getLoadedLanguages());
displayCheck("This is a Tamil profanity: புண்டை");
displayCheck("This is a Telugu profanity: బూతులు");

// Finish the demo
displaySection("END OF ALLPROFANITY DEMO");
console.log("Thank you for exploring the AllProfanity library!\n");
