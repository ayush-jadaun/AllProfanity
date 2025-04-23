// src/hindi-words.ts

/**
 * Hindi/Hinglish profanity words list
 * Contains common profanities in both Devanagari and Roman scripts
 * ⚠️ Warning: This file contains explicit language in Hindi
 */
const hindiBadWords: string[] = [
  // ========================================
  // === Original Seed Words ===
  // ========================================
  // Roman script Hindi/Hinglish profanities
  "behen chod",
  "behenchod",
  "bc", // Abbreviation
  "bhenchod",
  "bakchod",
  "chutiya",
  "chutiyapa",
  "gandu",
  "gaandu",
  "harami",
  "haramzada",
  "kutta",
  "kutte",
  "kamina",
  "lund",
  "lauda",
  "loda",
  "randi",
  "saala",
  "madarchod",
  "mc", // Abbreviation
  "chod",
  "chodu",

  // Devanagari script profanities
  "भड़वा",
  "भोसड़ी",
  "बहन चोद",
  "भेन चोद",
  "चूतिया",
  "हरामी",
  "हरामज़ादा",
  "कमीना",
  "लंड",
  "लौड़ा",
  "रंडी",
  "साला",
  "मादरचोद",

  // Common misspellings and variations (Original)
  "bhnchd", // Abbreviation/Variation
  "behanchod",
  "bhanchod",
  "bhen chod",
  "chutia",
  "rendi",
  "maderchod",
  "madarchood",
  "madarjaat",
  "gandoo",

  // ========================================
  // === Expanded List (Roman Script) ===
  // ========================================

  // --- Variations of 'Behenchod' ---
  "behanchood", "behenchood", "bhenchood", "bhainchod", "bhain chood", "bahenchod",
  "behnchod", "behncod", "behn chod", "bhen cod", "bhen chood", "bahanchod", "bhenco",
  "bhencho", "b c", "be si", "bee see", "behenkechodo", "bhenkelode", // Compound
  "bkl", // Abbreviation for Behen ke Lode
  "bahan chod", "bahan ke",

  // --- Variations of 'Madarchod' ---
  "madar chod", "madarchodd", "madarchoddd", "madar chood", "madrchod", "madarchud",
  "mader chod", "maderchood", "maderchod", "modarchod", "mother chod",
  "motherchodd", "mother fucker", // English, but used in Hinglish context
  "maachod", "maa chod", "ma chod", "maa chood", "m c", "em cee", "em see",
  "madarjaad", "madarzaat", "madarjatt", "madarchom", // Slang/Typo
  "teri maa chod", "teri ma ki chut", // Compound

  // --- Variations of 'Chutiya' ---
  "chutiyaa", "chutiye", "chuthiya", "chutya", "chutiyaap", "chutiyap", "chutyapa",
  "chutiyapaa", "chutiyapanti", "chutiyapnatee", "chutiyapanti", "chootiya", "chootya",
  "chootiye", "chootiyapa", "chut", "choot", "chuchiya", // Mishearing/variation
  "chodu ram", // Mocking name
  "chutmarike", // Vulgar insult, lit. born of vagina
  "chut ke", // Your vagina's... (implying offspring)
  "maha chutiya", // Great idiot
  "ek number ka chutiya", // Number one idiot
  "asli chutiya", // Real idiot

  // --- Variations of 'Gandu' / 'Gaand' ---
  "gandu lal", // Mocking name
  "gandul", "ganduu", "gand", "gaand", "g@ndu", "g@nd", "gaandfat", // Scared (lit. ass ripped)
  "gandfattu", "gaand mara", // Get your ass f***ed
  "gaand marwa", // Get your ass f***ed
  "gaandmasti", // Fooling around (can be offensive)
  "gandu giri", "gaandu giri", "gandu augmentation", // Nonsense phrase sometimes used humorously/insultingly
  "gandfaad", // Ass-ripping (intense action/insult)
  "gandu bachcha", // Asshole kid
  "teri gaand mein", // In your ass... (common start to insults)

  // --- Variations of 'Lund' / 'Lauda' ---
  "laund", "lawda", "lora", "laura", "lulla", // Slang/childish for penis
  "lund choos", // Dick sucker
  "lund fakir", // Useless person (lit. dick beggar)
  "lund hilana", // Masturbate
  "lund ka baal", // Pubic hair (implying worthless)
  "lundtopi", // Glans penis (used insultingly)
  "laude", // Vocative form of lauda
  "laude lag gaye", // Things got f***ed up
  "lauda lasan", // Nonsense rhyming insult
  "mere lund se", // From my dick (expressing indifference/contempt)

  // --- Variations of 'Bhosda' / 'Bhosdike' ---
  "bhosda", // Vagina (extremely vulgar)
  "bhosada", "bhosra", "bhosrika", "bhosarike", "bhosdike", // Born of a vagina (extremely vulgar insult)
  "bhoshdike", "bhosdi ke",
  "bhosdiwala", "bhosdiwale", "bhosdiwaale", "bhosadchod", // Vagina f***er
  "bhosad", // Shortened
  "teri maa ka bhosda", // Your mother's vagina (extreme insult)

  // --- Variations of 'Randi' ---
  "randvi", "randwe", // Male equivalent (insulting)
  "randibaaz", "randibaazi", "randibaj", "randi ka", // Implying son of...
  "randi ki aulad", // Offspring of a prostitute
  "randi khana", // Brothel (used insultingly)
  "chakke", // Eunuch/trans (often used with randi)
  "gashti", // Prostitute (Urdu/Punjabi influence)
  "patur", // Prostitute (regional)
  "beswa", // Prostitute

  // --- Variations of 'Harami' / 'Haramzada' ---
  "haraami", "harami pilla", // Bastard puppy
  "haramipana", // Act of being a harami
  "haramzade", "haramzadeh", "haram zaada", "haramjada", "haramjaade",
  "haramkhor", "haraamkhor", "haram ka", // Illegitimate / forbidden
  "haram ka pilla", // Illegitimate puppy

  // --- Variations of 'Kamina' ---
  "kameena", "kaminay", "kaminey", "kaminapan", "kaminpana", "kamini", // Female

  // --- Variations of 'Kutta' ---
  "kutte kamine", // Compound insult
  "kutti", "kutiya", "kutya", "kuttiya", "kutri", // Derogatory female
  "kutte ki maut", // Dog's death (miserable death)
  "kutte ka pilla", // Puppy (insult)
  "gali ka kutta", // Street dog (worthless)
  "kutte ki aulad", // Offspring of a dog

  // --- Variations of 'Saala' ---
  "sale", "saale", "saaley", "sala kutta", "sala harami", // Compound
  "saale chutiye",

  // --- Variations of 'Chod' / 'Chodu' ---
  "chodd", "chhod", // Sometimes used for 'leave', but context is key
  "chodumal", // Mocking name
  "choduram", "chhodu", "chud", // Act of f***ing / getting f***ed
  "chudai", // The act of f***ing
  "chudwa", // Get f***ed
  "chudakkad", // Someone obsessed with sex
  "chudasi", // Horny (female - vulgar)
  "chudasa", // Horny (male - vulgar)
  "chudwana", "chudwaana", "chudwaya",
  "chodne", // To f***

  // --- Variations of 'Bakchod' / 'Bakchodi' ---
  "bakchodd", "bakchodi", "bakchodiya", "bakchodhi", "bakchodi pelna", // To bullshit
  "bakait", // Braggart/Bullshitter
  "bakwaas", // Nonsense (less profane but used insultingly)

  // --- Bodily Functions / Parts (Vulgar) ---
  "jhaant", "jhaat", "jhant", "jhantu", "jhatu", "jantoo", "jhaat barabar", // Worthless as pubic hair
  "jhaat ka baal", // Pubic hair
  "tatte", "tatta", "tatti", "tati", "tat", // Testicles/Shit
  "tatti khana", // Eat shit
  "tatti surat", // Shitty face
  "goo", "gu", "goobar", // Dung/shit
  "mut", "moot", "mutra", // Piss/Urine
  "mutna", // To piss
  "peshab", // Urine (less vulgar but can be used insultingly)
  "muth", "mutthi", // Masturbation
  "muthal", // Someone who masturbates (insult)
  "hastmaithun", // Masturbation (formal, rarely used as insult)

  // --- Slurs & Related Insults ---
  "hijra", "hijda", "hijraa", "hizra", "hijjra",
  "chakka", "chhakka", "chaka",
  "namard", "naamard", "namardangi", // Impotence
  "napunsak", "napunsakta", // Impotence
  "khusra", // Eunuch/Transgender (derogatory)
  "khassi", // Castrated (animal, used insultingly for humans)
  "launda", // Boy (can be used derogatorily, implying effeminate or young lover)
  "laundiya", // Girl (can be used derogatorily)
  "laundebaaz", // Sodomite / Boy-lover (offensive)

  // --- General Insults & Offensive Terms ---
  "bhadwa", // Pimp (highly offensive)
  "bhadwe",
  "bharwa", "bhadua", "bhadva",
  "dalal", // Broker, pimp (insult)
  "dalla", "dalaal",
  "besharam", // Shameless
  "besharm", "besaram", "besharmi", // Shamelessness
  "behaya", // Shameless
  "behayaa", "behayaai", // Shamelessness
  "neech", // Low-life, despicable person
  "nich", "neech admi", // Low-life person
  "paaji", // Mean, low (Punjabi influence)
  "paji", "pajji",
  "badmaash", // Bad character, hooligan
  "badmash", "badmashi", // Hooliganism
  "luchha", // Lewd, debauched person
  "lucha", "luchchai", // Lewdness
  "lafanga", // Loafer, rogue
  "lafange", "lafangey", "lafantar",
  "awaara", // Vagrant, loafer
  "gadha", // Donkey (insult for stupid)
  "gadhe", "gadhi",
  "ullu", // Owl (stupid)
  "ullu ka pattha", // Son of an owl (insult for stupid)
  "ullu ki patthi", // Daughter of an owl
  "bandar", // Monkey
  "suar", // Pig (insult)
  "suwar", "soar", "pig",
  "suar ki aulad", // Offspring of a pig
  "janwar", // Animal (dehumanizing)
  "shaitan", // Devil
  "rakshas", // Demon
  "chichora", // Petty, shallow
  "charsi", // Drug addict (hashish)
  "ganjedi", // Drug addict (marijuana)
  "bewakoof", "bevakoof", "bewaqoof", // Idiot (common, less profane)
  "murkh", // Fool (formal)
  "paagal", "pagal", "pagla", "pagli", // Mad, crazy
  "dekh lunga", // I'll see you / I'll deal with you (threat)
  "aukat", // Status / standing (used in challenges: "teri aukat kya hai?")
  "aukaat",
  "chapri", // Low-class, tacky (modern slang insult)
  "nibba", "nibbi", // Immature online person (modern slang)
  "dhakkan", // Lid (stupid)
  "paltu", // Turncoat
  "chamcha", // Sycophant
  "bhikari", // Beggar
  "kanjoos", // Miser
  "makhi choos", // Extreme miser (lit. sucks flies)
  "phattu", // Scaredy-cat
  "darpok", // Coward
  "kayar", // Coward
  "ghatiya", // Low quality, despicable
  "khota", // Donkey / Fake (coin)
  "haram ka khana", // Eating illegitimate earnings
  "muh kala karna", // Blacken face (bring shame)
  "izzat lutna", // Rob honor (rape/molestation)
  "phitte muh", // Shame on you (Punjabi)
  "dur fitte muh", // Stronger version of above
  "mar ja", // Go die
  "khudkushi kar le", // Commit suicide (extremely harsh)
  "joota maru", // I'll hit you with a shoe
  "joota", // Shoe (implying worthlessness)
  "nalayak", // Worthless, undeserving
  "nikamma", // Useless
  "kamchor", // Shirker
  "gawar", // Rustic, uncivilized
  "jungli", // Wild, uncivilized

  // --- Compound Insults & Phrases ---
  "madarchod gandu", "gandu madarchod", "behenchod chutiya", "chutiya behenchod",
  "saala kutta kamina", "harami kutta", "kaminey suar", "randi ki beti", // Daughter of a prostitute
  "bhadwe ki aulad", "bhosdi ke kutte", "lund fakir chutiya", "chutiya sala", "gandu sala",
  "abe saale", "oye harami", "chal be chutiye", "nikal laude", // Get lost, dick
  "teri maa ka yaar", // Your mother's lover
  "teri behen ka yaar", // Your sister's lover
  "baap ka maal", // Father's property (objectifying women)
  "gandi naali ke keede", // Worm from a dirty drain
  "tere baap ka naukar", // Your father's servant? (challenging)
  "khandan pe mat ja", // Don't involve my family
  "behen ke lode", // Sister's dick (highly offensive)
  "teri maa ki", // Your mother's... (start of a common insult, often implies '...vagina')

  // --- More Obscure/Regional/Figurative ---
  "chutiya sala gandu", // Triple combo
  "bhen ke takke", // Sister's ... (similar to lode, very offensive)
  "khatey", // Testicles (regional slang)
  "pataka", // Firecracker (sometimes used for attractive woman, can be objectifying/vulgar)
  "maal", // Goods/Stuff (objectifying term for women)
  "item", // Item (objectifying term for women)
  "topibaaz", // Deceiver, trickster (lit. hat-wearer)
  "dhongi", // Hypocrite, imposter
  "pakhandi", // Hypocrite
  "ghoos khor", // Bribe taker
  "char sau bees", // 420 (IPC section for cheating, used for cheater)
  "dedh shana", // Over-smart (lit. one and a half clever)
  "bitodi", // Woman (derogatory, regional)
  "chidimar", // Bird catcher (implying low status/predatory)
  "natak karna", // To act/pretend (used like 'stop bullshitting')
  "raand", // Widow (can be used extremely derogatorily, similar to Randi in some contexts)


  // ========================================
  // === Expanded List (Devanagari Script) ===
  // ========================================
  "बहनचोद", "भैनचोद", "भेनचोड", "बहेनचोद", "बी सी", "बकलोल", // Related insult sometimes abbreviated as BKL
  "मादर चोद", "मादरचूड", "मदरचोद", "माचोद", "मादरजात", "तेरी माँ चोद", "तेरी माँ की चूत", "एम् सी",
  "चूतिये", "चूतियापा", "चूतियापंती", "चूत", "चूचीया", "चूतड़", // Buttocks, sometimes used like idiot
  "चूतर", // Buttocks
  "चूत मारीके", "महा चूतिया", "असली चूतिया",
  "गांड", "गांद", "गंड", "गांडफत", "गांडू गिरी", "गांड मरा", "गांड मरवा", "तेरी गांड में",
  "लौड़ा", "लोड़ा", "लवड़ा", "लंड चूस", "लंड का बाल", "लौड़े", "मेरे लंड से",
  "भोसड़ा", "भोसड़ीके", "भोसडीके", "भोस्डिके", "भोसड़ी वाला", "भोसड़ी वाले", "तेरी माँ का भोसड़ा",
  "रंडीबाज़", "रंडी की औलाद", "रंडीखाना", "गश्ती", "बेसवा",
  "हरामीपना", "हरामज़ादे", "हरामखोर", "हराम का",
  "कमीने", "कमीनी", "कमीनापन",
  "कुत्ती", "कुतिया", "कुत्ते की मौत", "कुत्ते का पिल्ला", "गली का कुत्ता", "कुत्ते की औलाद",
  "साले", "साले कुत्ते",
  "छोड़", "चोदू", "चुदक्कड़", "चुदाई", "चुदवाना", "चोदने",
  "बकचोदी", "बकैत", "बकवास",
  "झांट", "झाँट", "झाटू", "झाँटू", "टट्टे", "टट्टी", "गू", "गोबर", "मूत", "मूत्र", "पेशाब", "मूठ", "मुठ्ठी", "मुठल", "हस्तमैथुन",
  "हिजड़ा", "छक्का", "नामर्द", "नपुंसक", "खुसरा", "खस्सी", "लौंडा", "लौंडिया", "लौंडेबाज़",
  "भरवा", "दलाल", "दल्ला", "बेशर्म", "बेशर्मी", "बेहया", "नीच", "पाजी", "बदमाश",
  "बदमाशी", "लुच्चा", "लफंगा", "आवारा", "गधा", "गधी", "उल्लू", "उल्लू का पट्ठा", "बंदर",
  "सूअर", "सुअर", "सूअर की औलाद", "जानवर", "शैतान", "राक्षस", "चिचोरा", "चर्सी", "गंजेड़ी",
  "बेवकूफ", "मूर्ख", "पागल", "पगला", "पगली", "देख लूँगा", "औकात", "ढक्कन", "पलटू", "चमचा",
  "भिखारी", "कंजूस", "मक्खीचूस", "फट्टू", "डरपोक", "कायर", "घटिया", "खोटा", "नालायक",
  "निकम्मा", "कामचोर", "गंवार", "जंगली", "फिट्टे मुह", "मर जा", "जूता मारूं",
  "मादरचोद गांडू", "बहनचोद चूतिया", "साला कुत्ता कमीना", "हरामी कुत्ता", "कमीने सूअर",
  "रंडी की बेटी", "भड़वे की औलाद", "भोसड़ी के कुत्ते", "चूतिया साला", "अबे साले", "निकल लौड़े",
  "तेरी माँ का यार", "तेरी बहन का यार", "गंदी नाली के कीड़े", "तेरे बाप का नौकर",
  "बहन के टके", // Bhen ke takke
  "खाते", // Khatey (Testicles)
  "पटाका", // Pataka
  "माल", // Maal
  "आइटम", // Item
  "टोपीबाज़", // Topibaaz
  "ढोंगी", // Dhongi
  "पाखंडी", // Pakhandi
  "घूसखोर", // Ghooskhor
  "चार सौ बीस", // Char sau bees
  "डेढ़ शाणा", // Dedh shana
  "रांड", // Raand (Widow - derogatory use)
  "तेरी माँ की", // Teri maa ki... (start of insult)
  "बहन के लोड़े", // Behen ke lode (Sister's dick - offensive)

  // Add more words

];


export default hindiBadWords;
