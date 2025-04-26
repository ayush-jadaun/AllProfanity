// src/languages/spanish-words.ts

/**
 * Spanish profanity words list
 * Contains common profanities, insults, and offensive terms. Includes variations.
 * Covers terms common in both Spain and Latin America, though regional differences exist.
 * ⚠️ Warning: This file contains explicit language in Spanish
 */
const spanishBadWords: string[] = [
  // ========================================
  // === Core Profanities & Genitalia =====
  // ========================================
  "mierda", // Shit
  "joder", // Fuck (verb/interjection)
  "puta", // Whore, bitch (fem.) / Fuck (interjection)
  "puto", // Male whore, faggot (derogatory), fucking (adjective)
  "coño", // Cunt (vulgar), Damn/Fuck (interjection - common in Spain)
  "cojones", // Balls (vulgar), Guts
  "polla", // Dick, cock (vulgar - common in Spain)
  "verga", // Dick, cock (vulgar - common in LatAm)
  "picha", // Dick, cock (vulgar - regional)
  "cipote", // Dick, cock (vulgar - Spain)
  "carajo", // Dick (vulgar), Hell/Damn (interjection)
  "culo", // Ass, butt
  "teta", // Tit, boob
  "tetas", // Tits, boobs
  "chocho", // Pussy, cunt (vulgar - Spain)
  "concha", // Pussy, cunt (vulgar - LatAm, can be innocuous shell in Spain)
  "capullo", // Asshole, idiot (lit. cocoon/foreskin - Spain)
  "gilipollas", // Asshole, jerk, idiot (vulgar - Spain)
  "cabrón", // Bastard, asshole, cuckold (male)
  "cabrona", // Bitch, asshole (female)
  "hostia", // Host (religious), Damn/Fuck/Shit/Hit (interjection/noun - Spain)
  "ostia", // Common misspelling of hostia
  "pendejo", // Asshole, idiot, dumbass (LatAm - very common), Pubic hair (Spain - rare)
  "pendeja", // Fem. of pendejo
  "boludo", // Idiot, dumbass (Arg, Uru - can be informal/friendly too)
  "boluda", // Fem. of boludo
  "pelotudo", // Stronger version of boludo (Arg, Uru)
  "pelotuda", // Fem. of pelotudo

  // ========================================
  // === Variations & Related Terms =======
  // ========================================
  // --- Mierda ---
  "mierdoso",
  "mierdosa", // Shitty
  "puta mierda", // Fucking shit
  "comer mierda", // Eat shit
  "una mierda", // Like shit / Worthless
  "vete a la mierda", // Go to hell / Fuck off
  // --- Joder ---
  "jodido",
  "jodida", // Fucked, screwed, difficult
  "jódete", // Fuck you / Screw you
  "que te jodan", // Fuck you / Screw you (plural/formal)
  "no me jodas", // Don't fuck with me / No kidding?!
  "jodienda", // Annoyance, bother
  "joderse", // To get screwed / To have to suck it up
  // --- Puta / Puto ---
  "putita",
  "putito", // Little whore/faggot (diminutive, still offensive)
  "putazo", // Big hit / Slur for gay man (LatAm)
  "putero", // Whoremonger
  "putería", // Whorehouse / Whore behavior
  "putear", // To curse someone out, to treat badly
  "hijo de puta", // Son of a bitch
  "hija de puta", // Daughter of a bitch
  "putamadre",
  "puta madre", // Motherfucker / Fucking awesome (dual use)
  "de puta madre", // Fucking great
  "ni puto caso", // Paying no fucking attention
  // --- Coño / Cojones ---
  "cojonudo",
  "cojonuda", // Fucking great, ballsy (Spain)
  "acojonado",
  "acojonada", // Scared shitless (Spain)
  "hasta los cojones", // Fed up (lit. up to the balls - Spain)
  "tócate los cojones", // Expression of disbelief/annoyance (Spain)
  "del coño", // Shitty, annoying (Spain)
  // --- Polla / Verga / Picha / etc. ---
  "pollas en vinagre", // Nonsense phrase (Spain)
  "me importa una polla", // I don't give a fuck (Spain)
  "me importa una verga", // I don't give a fuck (LatAm)
  "vergazo", // Big hit with a dick-like object / Big dick (LatAm)
  "valer verga", // To be worthless (LatAm)
  "chupar polla", // Suck dick (Spain)
  "chupar verga", // Suck dick (LatAm)
  "mamahuevo", // Cocksucker (LatAm - very vulgar)
  "güevo",
  "guevo", // Egg / Ball (testicle - LatAm slang)
  "huevón",
  "huevona", // Lazy / Stupid / Guy (LatAm - varies by country)
  // --- Culo ---
  "gilipuertas", // Idiot, jerk (Spain)
  "partirse el culo", // Laugh your ass off
  "cara de culo", // Ass-face (sour expression)
  " lameculos", // Ass-kisser
  "patada en el culo", // Kick in the ass
  // --- Cabrón / Cabrona ---
  "cabronazo",
  "cabronaza", // Big asshole/bastard
  "cabronada", // A dick move, a shitty action
  // --- Hostia ---
  "hostia puta", // Fucking hell (Spain)
  "mala hostia", // Bad mood / Bad intention (Spain)
  "darse una hostia", // To crash / To hit oneself hard (Spain)
  "ser la hostia", // To be the shit / To be awesome (Spain)
  // --- Gilipollas / Capullo ---
  "gilipollez", // Stupidity, bullshit (Spain)
  "agilipollado", // Acting like a gilipollas (Spain)
  // --- Pendejo / Boludo / Pelotudo ---
  "pendejada", // Stupidity, bullshit (LatAm)
  "boludez", // Stupidity, nonsense (Arg, Uru)
  "pelotudez", // Stupidity, nonsense (stronger - Arg, Uru)

  // ========================================
  // === Insults (Stupidity, etc.) ========
  // ========================================
  "tonto",
  "tonta", // Idiot, fool (common, less vulgar)
  "tonto del culo", // Fucking idiot (vulgar)
  "idiota", // Idiot (common)
  "imbécil", // Imbecile (common)
  "estúpido",
  "estúpida", // Stupid
  "subnormal", // Retarded (highly offensive)
  "retrasado",
  "retrasada", // Retarded (highly offensive)
  "mongólico",
  "mongólica", // Derogatory term for Down syndrome, used as insult
  "mongolo",
  "mongola", // Shortened version
  "lerdo",
  "lerda", // Slow-witted, dull
  "memo",
  "mema", // Dumb,傻瓜 (Spain)
  "bobo",
  "boba", // Silly, foolish
  "zopenco",
  "zopenca", // Blockhead, dunce
  "tarado",
  "tarada", // Freak, weirdo / Retarded (offensive)
  "cretino",
  "cretina", // Cretin, idiot
  "necio",
  "necia", // Foolish, stupid

  // ========================================
  // === Offensive Slurs (Sexuality, Race, etc.) ===
  // ========================================
  "maricón", // Faggot (very offensive)
  "marica", // Faggot (offensive, sometimes reclaimed/less harsh)
  "maricón de mierda", // Fucking faggot
  "puto", // Can be used as 'faggot' (offensive)
  "bollera", // Dyke (offensive - Spain)
  "tortillera", // Dyke (offensive - LatAm)
  "sudaca", // Derogatory for South American (Spain)
  "machupichu", // Derogatory for indigenous South American (Spain)
  "gringo", // Derogatory/neutral for American/foreigner (LatAm)
  "gabacho", // Derogatory for French person (Spain)
  "negrata", // Derogatory for Black person (offensive)
  "moro", // Moor, derogatory for North African/Arab (Spain)

  // ========================================
  // === Other Offensive Terms & Insults ==
  // ========================================
  "bastardo",
  "bastarda", // Bastard
  "mamón",
  "mamona", // Asshole, jerk (lit. sucker)
  "payaso",
  "payasa", // Clown (used as idiot)
  "lameculos", // Ass-kisser
  "baboso",
  "babosa", // Slimy person, creep (lit. drooler)
  "perra", // Bitch (dog, used for women)
  "zorra", // Fox / Slut, bitch (very common)
  "bruja", // Witch
  "malparido",
  "malparida", // Badly born (lit.), like son of a bitch (LatAm)
  "hp",
  "hpt",
  "hijueputa", // Abbreviations/variations of Hijo de Puta (LatAm)
  "gonorrea", // Gonorrhea (used as a severe insult in Colombia)
  "sapo", // Toad / Snitch (LatAm)
  "rata", // Rat / Thief
  "cerdo",
  "cerda", // Pig / Dirty person
  "marrano",
  "marrana", // Pig / Dirty person
  "puerco",
  "puerca", // Pig / Dirty person
  "muérete", // Die
  "chiflado",
  "chiflada", // Crazy, nuts
  "loco",
  "loca", // Crazy
  "pinche", // Fucking (adjective, very common in Mexico)
  "culero", // Asshole (Mexico, vulgar)
  "chingar", // To fuck / To annoy / To screw up (Mexico, very versatile & vulgar)
  "chinga tu madre", // Fuck your mother (Mexico)
  "chingadera", // Bullshit, junk (Mexico)
  "pendejo", // Already listed, but emphasizing its commonality in LatAm
  "weon",
  "hueón", // Dude / Idiot (Chile, common, versatile)
  "concha tu madre",
  "ctm", // Your mother's cunt (LatAm, very offensive)
  "la concha de tu hermana", // Your sister's cunt (Arg, very offensive)
  "forro",
  "forra", // Condom / Asshole, idiot (Arg)
  "gato", // Cat / Low-life servant / Wannabe (Arg)
  "grasiento",
  "grasienta", // Greasy / Low-class, tasteless
  "guarro",
  "guarra", // Filthy, disgusting person (Spain)
  "sinvergüenza", // Shameless person
  "caradura", // Cheeky, shameless person
  "chulo", // Pimp / Cocky (Spain) / Cool (Mexico)
  "chula", // Fem. of chulo
  "malnacido",
  "malnacida", // Badly born (similar to malparido)

  // ========================================
  // === Bodily Functions (Vulgar Context) ==
  // ========================================
  "mear", // To piss
  "meo", // Piss
  "cagar", // To shit
  "cagada", // A fuck-up, mess / Shit (noun)
  "cagón",
  "cagona", // Coward (lit. shitter) / Whiny
  "pedo", // Fart / Drunkenness (Mexico/LatAm)
  "tirarse un pedo", // To fart
  "potar", // To vomit (Spain slang)
  "vomitar", // To vomit
  "moco", // Snot
  "escupir", // To spit
  "semen", // Semen
  "corrida", // Cumshot / Orgasm (Spain) / Run (standard)
  "paja", // Wank, handjob (lit. straw)
  "hacerse una paja", // To masturbate (male)
  "dedos", // Fingers (used in sexual context)
  "follar", // To fuck (Spain - very direct)
  "coger", // To take/grab (Standard) / To fuck (LatAm - VERY common, use with caution!)
  "singar", // To fuck (vulgar, less common)
  "culear", // To fuck (from culo - vulgar, LatAm)
  "cachondo",
  "cachonda", // Horny (Spain)
  "caliente", // Hot (temperature) / Horny (LatAm)

  // ========================================
  // === Mild / Contextually Offensive ====
  // ========================================
  "jolin", // Darn, gosh (mild version of joder - Spain)
  "jope", // Darn, gosh (mild version of joder - Spain)
  "miercoles", // Wednesday (euphemism for mierda)
  "ostras", // Oysters (euphemism for hostia - Spain)
  "rayos", // Lightning bolts (euphemism for carajo/etc.)
  "demontre", // Demon (euphemism)
  "fastidiar", // To annoy (can be euphemism for joder)
  "lavate la boca", // Wash your mouth (telling someone off)
];

export default spanishBadWords;
