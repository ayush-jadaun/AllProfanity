import profanity, {
  ProfanitySeverity,
  englishBadWords,
  hindiBadWords,
  frenchBadWords,
  germanBadWords,
  spanishBadWords,
  bengaliBadWords,
  tamilBadWords,
  teluguBadWords,
} from "./dist/index.js";

console.log("=== AllProfanity Test Suite ===\n");

// 1. Basic English checks
console.log("English (clean):", profanity.check("This is a clean sentence.") === false);
console.log("English (profane):", profanity.check("What the fuck is this?") === true);

// 2. Hindi & Hinglish
console.log("Hindi (clean):", profanity.check("यह एक अच्छा वाक्य है।") === false);
console.log("Hindi (profane):", profanity.check("यह एक चूतिया वाक्य है।") === true);
console.log("Hinglish (profane):", profanity.check("Ye ek chutiya test hai.") === true);

// 3. Leet-speak detection
console.log("Leet-speak (a55hole):", profanity.check("You a f#cking a55hole!") === true);
console.log("Custom ayush check:", profanity.check("You a FuCkIng!") === true);


// 4. Cleaning
console.log("Clean (char):", profanity.clean("This is bullshit.") === "This is ********.");
console.log("Clean (char, custom):", profanity.clean("This is bullshit.", "#") === "This is ########.");
console.log("Clean (word):", profanity.cleanWithPlaceholder("This is bullshit.") === "This is ***.");
console.log("Clean (word, custom):", profanity.cleanWithPlaceholder("This is bullshit.", "[CENSORED]") === "This is [CENSORED].");

// 5. Severity scoring
const detectResult = profanity.detect("This is fucking bullshit and chutiya.");
console.log("Detect (hasProfanity):", detectResult.hasProfanity === true);
console.log("Detect (detectedWords):", JSON.stringify(detectResult.detectedWords) === JSON.stringify(["fucking", "bullshit", "chutiya"]));
console.log("Detect (severity):", detectResult.severity === ProfanitySeverity.SEVERE);

// 6. List management
profanity.add("badword123");
console.log("Add word:", profanity.check("This is badword123.") === true);
profanity.remove("badword123");
console.log("Remove word:", profanity.check("This is badword123.") === false);

// 7. Whitelist
profanity.addToWhitelist(["anal", "ass"]);
console.log("Whitelist 'anal':", profanity.check("I work as an analyst.") === false);
console.log("Whitelist 'ass':", profanity.check("He is an associate professor.") === false);
profanity.removeFromWhitelist(["anal", "ass"]);
console.log("Remove from whitelist:", profanity.check("That was a great assignment!") === false);

// 8. Language loading
profanity.loadLanguage("french");
console.log("French (profane):", profanity.check("Ce mot est merde.") === true);

// 9. Custom dictionary
profanity.loadCustomDictionary("pirate", ["barnacle-head"]);
profanity.loadLanguage("pirate");
console.log("Custom dictionary:", profanity.check("You barnacle-head!") === true);

// 10. Get loaded/available languages
console.log("Loaded languages:", profanity.getLoadedLanguages().length > 0);
console.log("Available languages:", profanity.getAvailableLanguages().includes("english"));

// 11. Placeholder config
profanity.setPlaceholder("#");
console.log("Set placeholder:", profanity.clean("This is bullshit.") === "This is ########.");
profanity.setPlaceholder("*");

// 12. Clear list
profanity.clearList();
console.log("Clear list:", profanity.check("fuck") === false);
profanity.loadLanguage("english");

// 13. Exported wordlists
console.log("English words sample:", Array.isArray(englishBadWords) && englishBadWords.length > 0);
console.log("Hindi words sample:", Array.isArray(hindiBadWords) && hindiBadWords.length > 0);


console.log("\n=== All tests executed ===");