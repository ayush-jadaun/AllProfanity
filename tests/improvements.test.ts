import { AllProfanity, ProfanitySeverity } from "../src/index.js";

const silent = (extra = {}) => new AllProfanity({ silent: true, ...extra });

describe("Detection improvements", () => {
  describe("unicode evasion (fullwidth, homoglyphs, diacritics, invisibles)", () => {
    const f = silent();

    test("fullwidth characters", () => {
      expect(f.check("ｆｕｃｋ")).toBe(true);
      expect(f.check("ＦＵＣＫ")).toBe(true);
    });

    test("greek/cyrillic homoglyphs", () => {
      expect(f.check("fυck this")).toBe(true); // greek upsilon
      expect(f.check("bаstard alert")).toBe(true); // cyrillic а
    });

    test("diacritics, composed and combining", () => {
      expect(f.check("fück")).toBe(true); // precomposed u-umlaut
      expect(f.check("fück")).toBe(true); // u + combining diaeresis
    });

    test("zero-width and soft-hyphen injection", () => {
      expect(f.check("f​uck")).toBe(true); // zero-width space
      expect(f.check("f­uck")).toBe(true); // soft hyphen
      expect(f.check("f‍u‌ck")).toBe(true); // ZWJ/ZWNJ
    });

    test("positions and cleaning map back to the original text", () => {
      const text = "say ｆｕｃｋ now";
      const result = f.detect(text);
      expect(result.hasProfanity).toBe(true);
      const pos = result.positions[0];
      expect(text.substring(pos.start, pos.end)).toBe("ｆｕｃｋ");
      expect(result.cleanedText).toBe("say **** now");
    });

    test("does not break non-Latin scripts (Hindi)", () => {
      expect(f.check("यह भोसड़ी वाला")).toBe(true);
      expect(f.check("यह अच्छा वाक्य है")).toBe(false);
    });

    test("plain accented words are not false positives", () => {
      expect(f.check("café au lait")).toBe(false);
      expect(f.check("über cool jalapeño")).toBe(false);
    });
  });

  describe("repeated-character collapse", () => {
    const f = silent();

    test("stretched profanity is detected", () => {
      expect(f.check("fuuuuck this")).toBe(true);
      expect(f.check("fuckkkk")).toBe(true);
      expect(f.check("shiiiiit happens")).toBe(true);
    });

    test("cleaning masks the whole stretched word", () => {
      const result = f.detect("fuuuuck this");
      expect(result.cleanedText).toBe("******* this");
    });

    test("ordinary repeats are not false positives", () => {
      expect(f.check("hmmmm interesting")).toBe(false);
      expect(f.check("soooo good")).toBe(false);
      expect(f.check("aaaand we are back")).toBe(false);
      expect(f.check("hello good fellow")).toBe(false);
    });
  });

  describe("masked-character wildcard (f*ck, f#ck)", () => {
    const f = silent();

    test("single masked vowel is detected", () => {
      expect(f.check("f*ck off")).toBe(true);
      expect(f.check("what the f#ck")).toBe(true);
      expect(f.check("sh*t happens")).toBe(true);
      expect(f.check("f@ck u")).toBe(true);
    });

    test("masks that do not resolve to dictionary words are clean", () => {
      expect(f.check("I write c# code")).toBe(false);
      expect(f.check("get 5% off today")).toBe(false);
      expect(f.check("a*b equals b*a")).toBe(false);
      expect(f.check("email me at mail@example.com")).toBe(false);
      expect(f.check("snake_case and *args")).toBe(false);
    });

    test("masked match cleans correctly", () => {
      const result = f.detect("f*ck off");
      const pos = result.positions[0];
      expect("f*ck off".substring(pos.start, pos.end)).toBe("f*ck");
      expect(result.cleanedText).toBe("**** off");
    });

    test("whitelist applies to masked matches", () => {
      const wl = silent({ whitelistWords: ["hell"] });
      expect(wl.check("h*ll")).toBe(false);
    });
  });

  describe("separated-letter evasion (f u c k)", () => {
    const f = silent();

    test("uniform single separators are detected", () => {
      expect(f.check("f u c k you")).toBe(true);
      expect(f.check("f.u.c.k")).toBe(true);
      expect(f.check("f-u-c-k")).toBe(true);
      expect(f.check("f_u_c_k")).toBe(true);
      expect(f.check("s h i t")).toBe(true);
    });

    test("innocent letter runs are clean", () => {
      expect(f.check("U S A")).toBe(false);
      expect(f.check("a b c d e")).toBe(false);
      expect(f.check("i.e. and e.g.")).toBe(false);
      expect(f.check("plan b or c")).toBe(false);
    });

    test("spelled-out words inside sentences are not partial-matched", () => {
      // joined run must equal a dictionary word exactly - no scanning inside
      expect(f.check("t h e c l a s s i c")).toBe(false);
    });

    test("cleaning masks the whole run", () => {
      const result = f.detect("say f u c k now");
      expect(result.cleanedText).toBe("say ******* now");
    });
  });

  describe("severity NONE for clean text", () => {
    test("clean text reports NONE (0), not MILD", () => {
      const f = silent();
      expect(ProfanitySeverity.NONE).toBe(0);
      expect(f.detect("a perfectly clean sentence").severity).toBe(
        ProfanitySeverity.NONE
      );
      expect(f.detect("").severity).toBe(ProfanitySeverity.NONE);
      expect(f.detect("fuck").severity).toBe(ProfanitySeverity.MILD);
    });
  });

  describe("clean() placeholder consistency", () => {
    test("multi-char placeholder uses first character only, as documented", () => {
      const f = silent();
      expect(f.clean("fuck", "[CENSORED]")).toBe("[[[[");
    });
  });

  describe("check() fast path parity with detect()", () => {
    const battery = [
      "fuck",
      "f*ck off",
      "f u c k you",
      "fuuuuck",
      "ｆｕｃｋ",
      "bаstard alert",
      "what the h3ll",
      "a perfectly clean sentence",
      "I live in Scunthorpe",
      "f.u.c.k!",
      "तुम chutiya हो",
      "",
    ];

    for (const mode of ["trie", "aho-corasick", "hybrid"] as const) {
      test(`check() === detect().hasProfanity in ${mode} mode`, () => {
        const f = silent({ algorithm: { matching: mode } });
        for (const text of battery) {
          expect(f.check(text)).toBe(f.detect(text).hasProfanity);
        }
      });
    }

    test("fromConfig() honors evasionProtection", () => {
      const f = AllProfanity.fromConfig({
        silent: true,
        evasionProtection: {
          unicode: false,
          repeatedCharacters: false,
          maskedCharacters: false,
          separatedLetters: false,
        },
      });
      expect(f.check("fuck")).toBe(true);
      expect(f.check("fuuuuck")).toBe(false);
      expect(f.check("f*ck")).toBe(false);
    });

    test("evasion passes can be disabled", () => {
      const f = silent({
        evasionProtection: {
          unicode: false,
          repeatedCharacters: false,
          maskedCharacters: false,
          separatedLetters: false,
        },
      });
      expect(f.check("fuck")).toBe(true);
      expect(f.check("ｆｕｃｋ")).toBe(false);
      expect(f.check("fuuuuck")).toBe(false);
      expect(f.check("f*ck")).toBe(false);
      expect(f.check("f u c k")).toBe(false);
    });
  });
});
