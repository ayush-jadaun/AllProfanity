// src/languages/french-words.ts

/**
 * French profanity words list
 * Contains common profanities, insults, and offensive terms. Includes variations.
 * ⚠️ Warning: This file contains explicit language in French
 */
const frenchBadWords: string[] = [
  // ========================================
  // === Core Profanities & Genitalia =====
  // ========================================
  "merde", // Shit
  "putain", // Whore / Fuck! (very common interjection)
  "con",
  "conne", // Idiot, asshole, cunt (fem./masc.)
  "connard",
  "connasse", // Bigger asshole/bitch (masc./fem.)
  "cul", // Ass
  "bite", // Dick, cock (vulgar)
  "chatte", // Pussy, cunt (vulgar)
  "couilles", // Balls (vulgar)
  "enculé",
  "enculée", // Motherfucker, asshole (lit. fucked in the ass) (masc./fem.)
  "salope", // Bitch, slut
  "salaud", // Bastard, swine (male)
  "bordel", // Brothel / Mess / Fuck!, Damn! (interjection)
  "foutre", // Sperm, cum / To do / To fuck / Nothing (je m'en fous - I don't give a fuck)
  "niquer", // To fuck (verlan slang, very common & vulgar)
  "baise",
  "baiser", // Kiss (standard) / Fuck (verb/noun - vulgar)
  "chier", // To shit
  "pisser", // To piss
  "gueule", // Animal mouth / Shut up! (ta gueule!)

  // ========================================
  // === Variations & Related Terms =======
  // ========================================
  // --- Merde ---
  "merdeux",
  "merdeuse", // Shitty kid, brat
  "merdique", // Shitty, crappy
  "emmerder", // To piss off, to annoy
  "emmerdeur",
  "emmerdeuse", // Annoying person
  "démerder",
  "se démerder", // To manage, to sort things out (informal)
  "putain de merde", // Fucking shit
  "sac à merde", // Piece of shit (lit. bag of shit)
  // --- Putain ---
  "putain de", // Fucking (adjective modifier, e.g., putain de voiture - fucking car)
  "fils de pute", // Son of a bitch
  "fille de pute", // Daughter of a bitch
  "putasserie", // Bitchy behavior / Whore stuff
  "pute", // Short for putain, whore
  // --- Con / Connard ---
  "connerie", // Stupidity, bullshit
  "déconner", // To talk nonsense, to screw up
  "à la con", // Shitty, stupid (adjectival phrase)
  "pauvre con", // Poor idiot / Pathetic asshole
  "roi des cons", // King of idiots
  // --- Cul ---
  "trou du cul",
  "trouduc", // Asshole (lit. ass hole)
  "lèche-cul", // Ass-kisser
  "botter le cul", // Kick someone's ass
  "avoir le cul bordé de nouilles", // To be very lucky (vulgar)
  "se casser le cul", // Bust one's ass (work hard)
  "faux-cul", // Hypocrite
  // --- Bite / Chatte / Couilles ---
  "casse-couilles", // Annoying person (lit. ball-breaker)
  "avoir des couilles", // To have guts/balls
  "petite bite", // Small dick (insult)
  "lécher la chatte", // Lick pussy
  "sucer la bite", // Suck dick
  // --- Enculé / Salope / Salaud ---
  "enculage", // Act of sodomy / Getting screwed over
  "enculer (qqn)", // To fuck someone (in the ass) / To screw someone over
  "va te faire enculer", // Go fuck yourself
  "espèce de salope", // You bitch
  "grosse salope", // Fat bitch/slut
  "vieux salaud", // Old bastard
  // --- Bordel ---
  "quel bordel!", // What a mess! / What the fuck!
  "foutre le bordel", // To make a mess, to cause chaos
  // --- Foutre / Niquer / Baiser ---
  "va te faire foutre", // Go fuck yourself
  "rien à foutre", // Don't give a fuck
  "s'en foutre", // Not to give a fuck
  "je m'en fous", // I don't give a fuck
  "foutu",
  "foutue", // Screwed, broken, damned
  "nique ta mère", // Fuck your mother (very offensive)
  "nique sa mère", // Fuck his/her mother / Expression of anger/frustration
  "va te faire niquer", // Go get fucked
  "baisable", // Fuckable
  "baiseur",
  "baiseuse", // Fucker (one who fucks)
  // --- Chier / Pisser ---
  "fait chier", // It's annoying / Pisses me off
  "casse les pieds", // Annoying (milder than fait chier)
  "va chier", // Go take a shit / Fuck off
  "pipi", // Pee (childish, but used)
  // --- Gueule ---
  "ta gueule!", // Shut up! (very common, aggressive)
  "ferme ta gueule", // Shut your mouth! (stronger)
  "gueuler", // To shout, to yell
  "engueuler", // To tell someone off, to scold
  "gueule de bois", // Hangover
  "sale gueule", // Ugly face / Untrustworthy look

  // ========================================
  // === Insults (Stupidity, etc.) ========
  // ========================================
  "idiot",
  "idiote", // Idiot
  "imbécile", // Imbecile
  "stupide", // Stupid
  "débile", // Moron, retarded (offensive)
  "crétin",
  "crétine", // Cretin
  "abruti",
  "abrutie", // Dimwit, numbskull
  "andouille", // Idiot (lit. sausage)
  "bouffon",
  "bouffonne", // Buffoon, clown
  "nul",
  "nulle", // Useless, sucks
  "minable", // Pathetic, lousy
  "taré",
  "tarée", // Crazy, nuts (offensive)
  "cinglé",
  "cinglée", // Crazy, nuts
  "fou",
  "folle", // Mad, crazy
  "niais",
  "niaise", // Simpleton, naive

  // ========================================
  // === Offensive Slurs (Sexuality, Race, etc.) ===
  // ========================================
  "pédé", // Faggot (very offensive slang for homosexual)
  "gouine", // Dyke (very offensive slang for lesbian)
  "travelo", // Tranny (offensive for transvestite/transgender)
  "nègre",
  "négresse", // Negro (extremely offensive racial slur)
  "bougnoule", // Very offensive slur for North Africans/Arabs
  "chinetoque", // Very offensive slur for Chinese/East Asian people
  "rital", // Offensive slur for Italian people
  "polack", // Offensive slur for Polish people
  "yid", // Offensive slur for Jewish people (from Yiddish)
  "youpin",
  "youpine", // Offensive slur for Jewish people

  // ========================================
  // === Other Offensive Terms & Insults ==
  // ========================================
  "bâtard",
  "bâtarde", // Bastard
  "ordure", // Scum, filth (person)
  "pourriture", // Rot, decay / Scum, rotten person
  "raclure", // Scum (lit. scrapings)
  "fumier", // Manure / Bastard, swine
  "chien",
  "chienne", // Dog / Bitch
  "porc", // Pig / Dirty person
  "cochon",
  "cochonne", // Pig / Dirty person / Kinky
  "vache", // Cow / Bitch! (interjection)
  "chameau", // Camel / Mean person (fem.)
  "morue", // Codfish / Whore, bitch
  "thune", // Money (slang, can be used dismissively)
  "pognon", // Money (slang, dough)
  "fric", // Money (slang, cash)
  "crevard",
  "crevarde", // Selfish freeloader, scumbag
  "clochard",
  "clocharde", // Bum, tramp
  "moche", // Ugly
  "laid",
  "laide", // Ugly
  "dégueulasse", // Disgusting, gross
  "puant",
  "puante", // Stinking / Obnoxious person
  "plouc", // Hick, country bumpkin
  "pécor", // Hick, peasant (derogatory)
  "blaireau", // Badger / Idiot, loser
  "gland", // Acorn / Idiot, dickhead
  "branleur",
  "branleuse", // Wanker (lit. one who wanks)
  "branler", // To wank, masturbate / To do nothing
  "se branler", // To masturbate
  "ne rien branler", // To do fuck all
  "poufiasse", // Vulgar term for woman (bimbo, slutty - very offensive)

  // ========================================
  // === Mild / Contextually Offensive ====
  // ========================================
  "mince", // Thin / Damn!, Shoot! (mild euphemism for merde)
  "zut", // Darn!, Shoot! (mild)
  "flûte", // Flute / Darn! (mild)
  "saperlipopette", // Good grief! (old-fashioned, humorous)
  "purée", // Mashed potatoes / Euphemism for putain
  "punaise", // Thumb tack / Euphemism for putain
  "sacré bleu", // Good heavens! (stereotypical, old)
  "la vache!", // The cow! / Wow!, Holy cow! (expression of surprise)
  "dégage!", // Get lost!, Beat it!
  "fiche le camp!", // Get lost!, Piss off! (stronger than dégage)
  "tais-toi!", // Be quiet! (can be rude depending on tone)
];

export default frenchBadWords;
