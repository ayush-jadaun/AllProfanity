// src/languages/greek-words.ts

/**
 * Greek profanity words list
 * Contains common profanities, insults, and offensive terms. Includes variations.
 * Contributed by E. Koutsogiannis (github.com/E-Kou).
 *
 * Entries are stored in their accented forms; the engine folds accents at
 * match time, so unaccented and uppercase input (ΜΑΛΑΚΑΣ) is detected too.
 *
 * ⚠️ Warning: This file contains explicit language in Greek
 */
const greekBadWords: string[] = [
  "μουνόπανο",
  "άμβλωση",
  "πρωκτικός",
  "πρωκτός",
  "κώλος",
  "κωλότρυπα",
  "κωλοτρυπίδα",
  "καριόλα",
  "καριόλι",
  "μαλάκας",
  "μαλάκες",
  "αρχίδια",
  "μπάσταρδος",
  "σκύλα",
  "μουνί",
  "βυζιά",
  "κλειτορίς",
  "σκατά",
  "ψωλή",
  "δονητές",
  "εκσπερμάτωση",
  "εκσπερμάτιση",
  "εκσπερμάτισης",
  "πούστης",
  "πούστρα",
  "γαμώ",
  "γαμημένος",
  "καυλιάρης",
  "καυλί",
  "λαγνεία",
  "μαζοχιστής",
  "αυνανίζομαι",
  "οργασμός",
  "οργασμούς",
  "πέος",
  "πορνογραφία",
  "μπουρδέλο",
  "πούτσος",
  "πουτάνα",
  "μαλακία",
  "βιασμός",
  "βιζιά",
  "βιαστής",
  "σαδιστής",
  "σπέρμα",
  "πόρνη",
  "χύσια",
  "όρχις",
];

export default greekBadWords;
