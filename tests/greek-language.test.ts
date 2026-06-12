import { AllProfanity, greekBadWords } from "../src/index.js";

const silent = (extra = {}) => new AllProfanity({ silent: true, ...extra });

describe("Greek language support (PR #3)", () => {
  const f = silent({ languages: ["greek"] });

  test("greek is available and loads", () => {
    expect(f.getAvailableLanguages()).toContain("greek");
    expect(f.getLoadedLanguages()).toContain("greek");
    expect(Array.isArray(greekBadWords)).toBe(true);
    expect(greekBadWords.length).toBeGreaterThan(40);
  });

  test("detects Greek profanity as written (accented)", () => {
    expect(f.check("είσαι μαλάκας")).toBe(true);
    expect(f.check("τι σκατά είναι αυτό")).toBe(true);
  });

  test("detects unaccented and uppercase variants", () => {
    expect(f.check("εισαι μαλακας")).toBe(true); // accents dropped
    expect(f.check("ΕΙΣΑΙ ΜΑΛΑΚΑΣ")).toBe(true); // uppercase drops accents
    expect(f.check("ΣΚΑΤΑ")).toBe(true);
  });

  test("clean Greek text passes", () => {
    expect(f.check("καλημέρα φίλε μου, τι κάνεις;")).toBe(false);
    expect(f.check("ο Περσικός κόλπος είναι μεγάλος")).toBe(false); // gulf
    expect(f.check("μια κτηνώδης επίθεση")).toBe(false); // "brutal" - news word
    expect(f.check("μεγαλεπήβολος")).toBe(false);
  });

  test("cleaning masks Greek matches in the original text", () => {
    const text = "είσαι μαλάκας φίλε";
    const result = f.detect(text);
    expect(result.hasProfanity).toBe(true);
    const pos = result.positions[0];
    expect(text.substring(pos.start, pos.end)).toBe("μαλάκας");
    expect(result.cleanedText).toBe("είσαι ******* φίλε");
  });
});

describe("accent-insensitive dictionary matching (all languages)", () => {
  test("accented dictionary entries match unaccented input", () => {
    const f = silent();
    f.add(["pédé"]); // accented entry, as in the French dictionary
    expect(f.check("pede")).toBe(true);
    expect(f.check("pédé")).toBe(true);
  });

  test("custom accented words match folded input and vice versa", () => {
    const f = silent();
    f.add(["niño"]);
    expect(f.check("nino")).toBe(true);
    expect(f.check("niño")).toBe(true);
  });

  test("removing an accented word also removes its folded form", () => {
    const f = silent();
    f.add(["pédé"]);
    expect(f.check("pede")).toBe(true);
    f.remove(["pédé"]);
    expect(f.check("pédé")).toBe(false);
    expect(f.check("pede")).toBe(false);
  });
});
