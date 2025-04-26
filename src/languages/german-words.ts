// src/languages/german-words.ts

/**
 * German profanity words list
 * Contains common profanities, insults, and offensive terms. Includes variations.
 * ⚠️ Warning: This file contains explicit language in German
 */
const germanBadWords: string[] = [
  // ========================================
  // === Core Profanities & Genitalia =====
  // ========================================
  "Scheiße",
  "Scheisse", // Shit
  "Arschloch", // Asshole
  "Fotze", // Cunt (very vulgar)
  "Fick",
  "Ficken", // Fuck (noun / verb)
  "Wichser",
  "Wichserin", // Wanker, jerk (masc./fem.)
  "Hure", // Whore
  "Schlampe", // Slut, bitch
  "Mist", // Manure, crap, damn
  "Verdammt", // Damn, damned
  "Arsch", // Ass
  "Schwanz", // Tail / Dick, cock (vulgar)
  "Pimmel", // Dick, cock (childish/vulgar)
  "Muschi", // Pussy (vulgar)
  "Titten", // Tits (vulgar)
  "Busen", // Bosom, breasts (less vulgar than Titten)
  "Eier", // Eggs / Balls (testicles - vulgar)
  "Sack", // Sack / Scrotum / Asshole (regional)

  // ========================================
  // === Variations & Related Terms =======
  // ========================================
  // --- Scheiße ---
  "scheißegal", // Don't give a shit (adj.)
  "scheißkerl", // Shitty guy, bastard
  "scheißladen", // Shitty place/shop
  "bescheuert", // Stupid, daft (related to Scheiße)
  "beschissen", // Shitty, crappy
  "verscheißern", // To kid, to pull someone's leg
  "ankacken", // To shit on / To tell someone off aggressively
  "Kacke", // Poo, crap (slightly less vulgar than Scheiße)
  "Kackbratze", // Shitty brat
  // --- Arschloch / Arsch ---
  "Arschgeige", // Ass violin (absurd insult for idiot/asshole)
  "Arschkriecher", // Ass-kisser
  "Leck mich am Arsch", // Kiss my ass (LMAA abbreviation)
  "verarschen", // To fool, to take the piss out of someone
  "arschlecken", // Ass-licking
  "arschig", // Nasty, mean
  "zum Kotzen", // Makes one puke / Disgusting
  // --- Fotze ---
  "Fotzenlecker", // Cunt licker (extremely vulgar)
  // --- Ficken / Wichser ---
  "verfickt", // Fucking (adjective), fucked up
  "Fickfehler", // Fucking mistake (offspring insult)
  "Fick dich!", // Fuck you!
  "Wichse", // Cum, jizz
  "wichsen", // To wank, masturbate
  "Rumwichsen", // Wanking around, messing about
  // --- Hure / Schlampe ---
  "Hurensohn", // Son of a bitch/whore (very offensive)
  "Hurentochter", // Daughter of a bitch/whore (very offensive)
  "Hurenkind", // Child of a whore
  "Verhurrt", // Whorish
  "Schlampig", // Sloppy, messy (can be unrelated to profanity)
  // --- Mist / Verdammt ---
  "Mistkerl", // Bastard, scoundrel
  "Miststück", // Nasty piece of work (often female)
  "Verdammte Scheiße", // Damn shit!
  "So ein Mist!", // Such crap! Damn it!
  // --- Schwanz / Pimmel / Muschi / Titten / Eier / Sack ---
  "Schwanzlutscher", // Cocksucker
  "Pissnelke", // Prude / Annoying woman (lit. piss carnation)
  "Muschilecker", // Pussy licker
  "Tittenficker", // Tit fucker (highly vulgar)
  "Sackgesicht", // Scrotum face (insult)
  "Sackratte", // Scrotum rat (absurd insult)
  "Geh mir nicht auf den Sack!", // Don't get on my nerves! (lit. don't step on my scrotum)
  "Weichei", // Wimp (lit. soft egg)

  // ========================================
  // === Insults (Stupidity, etc.) ========
  // ========================================
  "Idiot",
  "Idiotin", // Idiot (masc./fem.)
  "Trottel", // Idiot, fool
  "Depp", // Idiot, moron (Southern Germany/Austria)
  "Vollidiot", // Complete idiot
  "Vollpfosten", // Complete idiot (lit. full post)
  "Dummkopf", // Dumb head, stupid person
  "Blödmann", // Stupid man, fool
  "Blödian", // Fool
  "dumm", // Dumb, stupid
  "blöd",
  "blöde", // Stupid, silly
  "doof", // Stupid, dumb (colloquial)
  "bescheuert", // Daft, nuts
  "bekloppt", // Crazy, nuts
  "hirnlos", // Brainless
  "Schwachkopf", // Weak head, simpleton
  "Schwachmat", // Simpleton, weakling
  "Narr",
  "Närrin", // Fool (masc./fem.)
  "Pfeife", // Pipe / Idiot, loser
  "Versager", // Failure, loser
  "Lappen", // Cloth / Wimp
  "Spasti", // Spastic (highly offensive disability slur used as general insult)
  "Mongo", // Mongoloid (highly offensive disability slur used as general insult)
  "behindert", // Disabled / Retarded (used as insult, very offensive)
  "Missgeburt", // Misbirth, monstrosity (very offensive)

  // ========================================
  // === Offensive Slurs (Sexuality, Race, etc.) ===
  // ========================================
  "Schwuchtel", // Faggot (very offensive)
  "Schwuler", // Gay man (can be neutral, but often used offensively)
  "Lesbe", // Lesbian (can be neutral, but often used offensively)
  "Kampflesbe", // Butch lesbian (offensive)
  "Transe", // Tranny (offensive)
  "Neger", // Negro (extremely offensive racial slur)
  "Kanake", // Very offensive slur, originally for Turks, now often for Southern Europeans, Middle Easterners
  "Itaker", // Offensive slur for Italians
  "Polacke", // Offensive slur for Polish people
  "Russe", // Russian (can be used neutrally or derogatorily)
  "Ami", // Yank, American (often derogatory)
  "Ösi", // Derogatory for Austrian
  "Saupreiß", // Derogatory Bavarian term for Prussians/North Germans
  "Kümmeltürke", // Offensive term for Turkish people
  "Schlitzauge", // Slit-eye (offensive for East Asians)

  // ========================================
  // === Other Offensive Terms & Insults ==
  // ========================================
  "Bastard", // Bastard
  "Sau", // Sow (female pig) / Bitch, messy person
  "Drecksau", // Filthy pig / Dirty bastard
  "Schwein", // Pig / Swine
  "Schweinehund", // Pig-dog / Bastard (innerer Schweinehund = inner laziness/weakness)
  "Mistvieh", // Vile creature
  "Aas", // Carrion / Scumbag
  "Luder", // Hussy, minx (can be playful or offensive)
  "Miststück", // Nasty piece of work
  "Göre", // Brat (female child)
  "Bengel", // Rascal (male child)
  "Frechdachs", // Cheeky badger (impudent person)
  "Heuchler", // Hypocrite
  "Lügner", // Liar
  "Betrüger", // Cheat, fraudster
  "Penner", // Bum, tramp
  "Gesindel", // Riff-raff, mob
  "Pack", // Rabble, scum
  "Abschaum", // Scum
  "Ungeziefer", // Vermin
  "Parasit", // Parasite
  "Widerlich", // Disgusting, repulsive
  "Ekelhaft", // Disgusting
  "Kotzbrocken", // Person who makes you want to puke, repulsive person
  "Speichellecker", // Sycophant (lit. spit-licker)
  "Warmduscher", // Wimp (lit. warm-showerer)
  "Schattenparker", // Wimp (lit. shadow-parker)
  "Pissnelke", // Annoying woman / Prude
  "Zicke", // Goat / Bitchy woman
  "mies", // Lousy, mean
  "gemein", // Mean, nasty
  "hässlich", // Ugly

  // ========================================
  // === Bodily Functions (Vulgar Context) ==
  // ========================================
  "pissen", // To piss (vulgar)
  "pinkeln", // To pee (more common, less vulgar)
  "scheißen", // To shit (vulgar)
  "kacken", // To poo (less vulgar)
  "kotzen", // To vomit, puke (common, vulgar)
  "furzen", // To fart
  "pupsen", // To poot (less vulgar)
  "Rotz", // Snot
  "Spucke", // Spit
  "Sperma", // Sperm
  "Sabber", // Drool

  // ========================================
  // === Mild / Contextually Offensive ====
  // ========================================
  "Verflixt", // Darn it! (mild version of verflucht/verdammt)
  "Donnerwetter", // Good heavens! Wow! (lit. thunderstorm)
  "Himmel", // Heaven / Gosh!
  "Teufel", // Devil
  "zum Teufel", // To hell with it / What the hell
  "Quatsch", // Nonsense, rubbish
  "Blödsinn", // Nonsense, foolishness
  "Hau ab!", // Get lost! Buzz off!
  "Verschwinde!", // Disappear! Get lost!
  "Halt die Klappe!", // Shut up! (lit. hold the trap)
  "Halt's Maul!", // Shut your mouth! (more vulgar)
  "Schnauze!", // Snout / Shut up! (vulgar)
];

export default germanBadWords;
