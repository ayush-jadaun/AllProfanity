import { AllProfanity } from "../src/index.js";

const silent = (extra = {}) => new AllProfanity({ silent: true, ...extra });

describe("embedded strong-profanity detection", () => {
  const f = silent();

  test("profanity glued into non-words is detected", () => {
    expect(f.check("sisfuck")).toBe(true);
    expect(f.check("sfsfuck got out?")).toBe(true);
    expect(f.check("Ayushfuck")).toBe(true);
    expect(f.check("xxbitchxx")).toBe(true);
    expect(f.check("totalshitshow")).toBe(true);
  });

  test("cleaning masks the whole containing token", () => {
    const result = f.detect("well sisfuck happened");
    expect(result.hasProfanity).toBe(true);
    const pos = result.positions[0];
    expect("well sisfuck happened".substring(pos.start, pos.end)).toBe(
      "sisfuck"
    );
    expect(result.cleanedText).toBe("well ******* happened");
  });

  test("classic false-positive traps stay clean", () => {
    expect(f.check("I live in Scunthorpe")).toBe(false); // contains "cunt"
    expect(f.check("that was a mishit shot")).toBe(false); // contains "shit"
    expect(f.check("he sniggered quietly")).toBe(false); // contains "nigger"
    expect(f.check("shitake mushrooms")).toBe(false); // alt spelling of shiitake
    expect(f.check("a classic bass class assignment")).toBe(false);
    expect(f.check("Hitchcock and Dickens marathon")).toBe(false);
    expect(f.check("the cocktail therapist")).toBe(false);
  });

  test("whitelisting the containing word suppresses the match", () => {
    const wl = silent({ whitelistWords: ["sisfuck"] });
    expect(wl.check("sisfuck")).toBe(false);
  });

  test("removing the stem from the dictionary disables its embedded matches", () => {
    const g = silent();
    expect(g.check("sisfuck")).toBe(true);
    g.remove(["fuck"]);
    expect(g.check("sisfuck")).toBe(false);
  });

  test("pass can be disabled via evasionProtection", () => {
    const g = silent({ evasionProtection: { embeddedWords: false } });
    expect(g.check("sisfuck")).toBe(false);
    expect(g.check("fuck")).toBe(true);
  });

  test("check()/detect() parity across algorithm modes", () => {
    for (const mode of ["trie", "aho-corasick", "hybrid"] as const) {
      const g = silent({ algorithm: { matching: mode } });
      for (const text of ["sisfuck", "I live in Scunthorpe", "mishit"]) {
        expect(g.check(text)).toBe(g.detect(text).hasProfanity);
      }
    }
  });
});
