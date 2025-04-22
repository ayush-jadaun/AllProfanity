// examples/basic-usage.ts
import allProfanity from "../src/index";

/**
 * AllProfanity Library - Example Usage
 *
 * This example demonstrates all the main features of the AllProfanity library
 * including profanity detection, cleaning, and list management across multiple languages.
 */

// Function to display section headers nicely
function displaySection(title: string): void {
  console.log("\n" + "=".repeat(50));
  console.log(`  ${title}`);
  console.log("=".repeat(50) + "\n");
}

// Function to display check results
function displayCheck(text: string): void {
  const result = allProfanity.check(text);
  console.log(`"${text}" ${result ? "✘ CONTAINS PROFANITY" : "✓ CLEAN"}`);
}

// Function to display cleaning results
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
    cleaned = allProfanity.cleanWithWord(text, placeholder);
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
  "This example demonstrates the features of the AllProfanity library\n"
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
displayCheck("यह एक अच्छा वाक्य है।"); // This is a good sentence.
displayCheck("यह एक चूतिया वाक्य है।"); // This contains profanity

// Hindi examples (Roman script)
console.log("\nHindi content (Roman script):");
displayCheck("Yeh ek accha vakya hai."); // This is a good sentence.
displayCheck("Yeh ek chutiya vakya hai."); // This contains profanity

// Hinglish examples
console.log("\nHinglish content:");
displayCheck("Kya scene hai bhai?"); // What's up brother? (clean)
displayCheck("BC kya kar raha hai?"); // Using a common Hindi profanity abbreviation

// Mixed language content
console.log("\nMixed language content:");
displayCheck("This sentence has the Hindi word अच्छा which means good.");
displayCheck("This sentence has the Hindi word चूतिया which is a profanity.");

// 2. Cleaning profanity
displaySection("2. CLEANING PROFANITY");

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

// 3. Handling punctuation and word boundaries
displaySection("3. PUNCTUATION & WORD BOUNDARIES");

console.log("Handling punctuation:");
displayClean("This is bullshit!", "word");
displayClean("Is this bullshit? Yes, it is.", "word");

console.log("\nWord boundaries (avoiding false positives):");
displayCheck("He is an associate professor."); // Should not detect 'ass'
displayCheck("I work as an analyst."); // Should not detect 'anal'
displayCheck("That was a great assignment!"); // Should not detect 'ass'

// 4. List management
displaySection("4. LIST MANAGEMENT");

// Get current list
console.log("Current profanity list size:", allProfanity.list().length);
console.log("First 5 words in the list:", allProfanity.list().slice(0, 5));

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
displayCheck(`Testing ${customWords[0]} and ${customWords[1]}.`); // Should detect profanity

// Remove words
console.log("\nRemoving words from the list:");
console.log(`Removing "${customWord}" from the list...`);
allProfanity.remove(customWord);
displayCheck(`This contains ${customWord}.`); // Should be clean again

// Clean up our custom words to leave the list as we found it
allProfanity.remove(customWords);

// 5. Placeholder settings
displaySection("5. PLACEHOLDER SETTINGS");

// Change default placeholder for character cleaning
console.log("Changing default placeholder character:");
console.log("Default placeholder result:");
displayClean("This is bullshit.", "character");

console.log('\nChanging placeholder to "#":');
allProfanity.setPlaceholder("#");
displayClean("This is bullshit.", "character");

// Reset placeholder to default
console.log('\nResetting placeholder to "*":');
allProfanity.setPlaceholder("*");
displayClean("This is bullshit.", "character");

// Finish the demo
displaySection("END OF ALLPROFANITY DEMO");
console.log("Thank you for exploring the AllProfanity library!\n");
