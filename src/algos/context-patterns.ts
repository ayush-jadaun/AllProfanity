/**
 * Universal context patterns for multi-language profanity detection
 */

export interface UniversalContextPattern {
  type:
    | "negation"
    | "possessive"
    | "compound"
    | "proper_noun"
    | "article"
    | "quotation"
    | "medical"
    | "anatomical";
  pattern: RegExp;
  weight: number;
  languages: string[];
  description: string;
  examples: string[];
}

export interface ContextRule {
  pattern: RegExp;
  action: "reduce_score" | "increase_score" | "whitelist" | "flag";
  weight: number;
  priority: number;
}

/**
 * Universal context patterns that work across multiple languages
 */
export const UNIVERSAL_CONTEXT_PATTERNS: UniversalContextPattern[] = [
  // Negation patterns
  {
    type: "negation",
    pattern:
      /\b(not|don't|won't|can't|never|ne|pas|nicht|no|नहीं|不|non|niente|нет|nie)\b.{0,30}PROFANE_WORD/i,
    weight: 0.2,
    languages: ["*"],
    description: "Negation words that reduce profanity likelihood",
    examples: ["not bad", "don't call me that", "never say that"],
  },

  // Possessive patterns
  {
    type: "possessive",
    pattern: /\b\w+(['s]|du|de|का|की|के|の|del|della|от|od)\s+PROFANE_WORD\b/i,
    weight: 0.4,
    languages: ["*"],
    description: "Possessive constructions that may be innocent",
    examples: ["dog's mouth", "cat's ass", "bird's ass"],
  },

  // Article patterns
  {
    type: "article",
    pattern:
      /\b(the|a|an|le|la|les|un|une|der|die|das|ein|eine|el|la|los|las|il|lo|gli|le)\s+PROFANE_WORD\b/i,
    weight: 0.6,
    languages: ["*"],
    description: "Articles that may indicate neutral reference",
    examples: ["the ass of the donkey", "a hell of a time"],
  },

  // Compound word patterns
  {
    type: "compound",
    pattern:
      /\b(smart|silly|cute|funny|little|big|old|new|good|bad|nice|sweet)\s*[-]?\s*PROFANE_WORD\b/i,
    weight: 0.5,
    languages: ["*"],
    description: "Adjective-noun compounds that may be innocent",
    examples: ["smart-ass", "silly ass", "cute little ass"],
  },

  // Proper noun patterns
  {
    type: "proper_noun",
    pattern: /\b[A-Z][a-z]+\s+PROFANE_WORD\b/,
    weight: 0.3,
    languages: ["en", "fr", "de", "es", "it"],
    description: "Proper nouns followed by potential profanity",
    examples: ["Hell Michigan", "Ass River"],
  },

  // Quotation patterns
  {
    type: "quotation",
    pattern: /["'«»„"‚'].*PROFANE_WORD.*["'«»„"‚']/i,
    weight: 0.7,
    languages: ["*"],
    description: "Quoted text which may be reporting speech",
    examples: ['"Don\'t be an ass"', "'What the hell'"],
  },

  // Medical/anatomical context
  {
    type: "medical",
    pattern:
      /\b(medical|anatomy|doctor|hospital|clinic|patient|diagnosis|treatment|surgical|clinical)\b.{0,50}PROFANE_WORD/i,
    weight: 0.1,
    languages: ["*"],
    description: "Medical contexts where anatomical terms are appropriate",
    examples: [
      "medical examination of the ass",
      "doctor checked the damn thing",
    ],
  },

  // Anatomical context
  {
    type: "anatomical",
    pattern:
      /\b(body|part|muscle|bone|skin|tissue|organ|limb|extremity)\b.{0,30}PROFANE_WORD/i,
    weight: 0.3,
    languages: ["*"],
    description: "Anatomical contexts for body parts",
    examples: ["body part called ass", "muscle in the ass"],
  },
];

/**
 * Language-specific context patterns
 */
export const LANGUAGE_SPECIFIC_PATTERNS: Record<
  string,
  UniversalContextPattern[]
> = {
  en: [
    {
      type: "compound",
      pattern: /\b(jack|dumb|smart|bad|kick)\s*[-]?\s*PROFANE_WORD\b/i,
      weight: 0.4,
      languages: ["en"],
      description: "English-specific compound patterns",
      examples: ["jackass", "dumbass", "badass"],
    },
  ],

  fr: [
    {
      type: "negation",
      pattern: /\b(ne|n'|pas|point|jamais|rien|personne)\b.{0,30}PROFANE_WORD/i,
      weight: 0.2,
      languages: ["fr"],
      description: "French negation patterns",
      examples: ["ne pas dire", "jamais ça"],
    },
  ],

  de: [
    {
      type: "compound",
      pattern: /\bPROFANE_WORD(kopf|zeug|ding|sache)\b/i,
      weight: 0.5,
      languages: ["de"],
      description: "German compound word patterns",
      examples: ["Scheißzeug", "Arschloch"],
    },
  ],

  es: [
    {
      type: "possessive",
      pattern: /\b(el|la|los|las)\s+PROFANE_WORD\s+(de|del|de la)\b/i,
      weight: 0.4,
      languages: ["es"],
      description: "Spanish possessive patterns",
      examples: ["el culo de la mesa"],
    },
  ],
};

/**
 * Context rule generator
 */
export class ContextPatternMatcher {
  private patterns: UniversalContextPattern[];
  private languagePatterns: Map<string, UniversalContextPattern[]>;

  constructor(languages: string[] = ["en"]) {
    this.patterns = [...UNIVERSAL_CONTEXT_PATTERNS];
    this.languagePatterns = new Map();

    // Load language-specific patterns
    for (const lang of languages) {
      if (LANGUAGE_SPECIFIC_PATTERNS[lang]) {
        this.languagePatterns.set(lang, LANGUAGE_SPECIFIC_PATTERNS[lang]);
      }
    }
  }

  /**
   * Generate context rules for a specific word
   */
  generateRules(word: string, languages: string[] = ["en"]): ContextRule[] {
    const rules: ContextRule[] = [];
    const allPatterns = [...this.patterns];

    // Add language-specific patterns
    for (const lang of languages) {
      const langPatterns = this.languagePatterns.get(lang) || [];
      allPatterns.push(...langPatterns);
    }

    for (const pattern of allPatterns) {
      // Skip if pattern doesn't apply to any of the specified languages
      if (
        !pattern.languages.includes("*") &&
        !pattern.languages.some((lang) => languages.includes(lang))
      ) {
        continue;
      }

      // Replace PROFANE_WORD placeholder with actual word
      const regexSource = pattern.pattern.source.replace(
        "PROFANE_WORD",
        this.escapeRegex(word)
      );
      const regex = new RegExp(regexSource, pattern.pattern.flags);

      let action: "reduce_score" | "increase_score" | "whitelist" | "flag";
      if (pattern.weight < 0.3) {
        action = "reduce_score";
      } else if (pattern.weight > 0.8) {
        action = "increase_score";
      } else {
        action = "reduce_score";
      }

      rules.push({
        pattern: regex,
        action,
        weight: pattern.weight,
        priority: this.getPriority(pattern.type),
      });
    }

    return rules.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Get priority for pattern type
   */
  private getPriority(type: string): number {
    const priorities: Record<string, number> = {
      medical: 1,
      anatomical: 2,
      negation: 3,
      quotation: 4,
      proper_noun: 5,
      possessive: 6,
      article: 7,
      compound: 8,
    };
    return priorities[type] || 9;
  }

  /**
   * Escape regex special characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
  }

  /**
   * Add custom pattern
   */
  addPattern(pattern: UniversalContextPattern): void {
    this.patterns.push(pattern);
  }

  /**
   * Add language-specific pattern
   */
  addLanguagePattern(language: string, pattern: UniversalContextPattern): void {
    if (!this.languagePatterns.has(language)) {
      this.languagePatterns.set(language, []);
    }
    this.languagePatterns.get(language)!.push(pattern);
  }

  /**
   * Get all patterns for debugging
   */
  getAllPatterns(): {
    universal: UniversalContextPattern[];
    languageSpecific: Map<string, UniversalContextPattern[]>;
  } {
    return {
      universal: [...this.patterns],
      languageSpecific: new Map(this.languagePatterns),
    };
  }
}

/**
 * Context analyzer for scoring matches
 */
export class ContextAnalyzer {
  private patternMatcher: ContextPatternMatcher;
  private contextWindow: number = 50; // Characters before and after the match

  constructor(languages: string[] = ["en"]) {
    this.patternMatcher = new ContextPatternMatcher(languages);
  }

  /**
   * Analyze context around a potential profanity match
   */
  analyzeContext(
    text: string,
    matchStart: number,
    matchEnd: number,
    word: string
  ): {
    score: number;
    confidence: "high" | "medium" | "low";
    appliedRules: Array<{ rule: ContextRule; matched: boolean }>;
    context: string;
  } {
    // Extract context window
    const contextStart = Math.max(0, matchStart - this.contextWindow);
    const contextEnd = Math.min(text.length, matchEnd + this.contextWindow);
    const context = text.substring(contextStart, contextEnd);

    // Get rules for this word
    const rules = this.patternMatcher.generateRules(word);

    let score = 1.0; // Start with full profanity score
    const appliedRules: Array<{ rule: ContextRule; matched: boolean }> = [];

    // Apply context rules
    for (const rule of rules) {
      const matched = rule.pattern.test(context);
      appliedRules.push({ rule, matched });

      if (matched) {
        if (rule.action === "reduce_score") {
          score *= rule.weight;
        } else if (rule.action === "increase_score") {
          score *= 2 - rule.weight; // Increase score
        } else if (rule.action === "whitelist") {
          score = 0; // Complete whitelist
          break;
        }
      }
    }

    // Determine confidence based on number of matching rules
    const matchingRules = appliedRules.filter((ar) => ar.matched).length;
    let confidence: "high" | "medium" | "low";

    if (matchingRules === 0) {
      confidence = "high"; // No context rules matched, likely profanity
    } else if (matchingRules <= 2) {
      confidence = "medium";
    } else {
      confidence = "low"; // Many context rules matched, likely innocent
    }

    return {
      score: Math.max(0, Math.min(1, score)), // Clamp between 0 and 1
      confidence,
      appliedRules,
      context,
    };
  }

  /**
   * Set context window size
   */
  setContextWindow(size: number): void {
    this.contextWindow = Math.max(10, Math.min(200, size));
  }

  /**
   * Add custom pattern to the analyzer
   */
  addCustomPattern(pattern: UniversalContextPattern): void {
    this.patternMatcher.addPattern(pattern);
  }
}
