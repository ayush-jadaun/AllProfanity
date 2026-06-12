import { AllProfanity } from "../src/index.js";
import { AhoCorasick } from "../src/algos/aho-corasick.js";
import { BloomFilter } from "../src/algos/bloom-filter.js";

describe("Bug fixes", () => {
  describe("leet-speak position mapping with length-changing mappings", () => {
    test("detects words hidden behind multi-char leet ('ph' -> 'f')", () => {
      const f = new AllProfanity({ silent: true });
      f.add(["fuss"]);
      expect(f.check("what a phuss here")).toBe(true);
    });

    test("reports positions and cleaned text against the original string", () => {
      const f = new AllProfanity({ silent: true });
      f.add(["fuss"]);
      const text = "what a phuss here";
      const result = f.detect(text);
      expect(result.hasProfanity).toBe(true);
      expect(result.positions).toHaveLength(1);
      const pos = result.positions[0];
      expect(text.substring(pos.start, pos.end)).toBe("phuss");
      expect(result.cleanedText).toBe("what a ***** here");
    });

    test("leet positions are correct in aho-corasick mode too", () => {
      const f = new AllProfanity({
        algorithm: { matching: "aho-corasick" },
        silent: true,
      });
      f.add(["fuss"]);
      const text = "what a phuss here";
      const result = f.detect(text);
      expect(result.hasProfanity).toBe(true);
      const pos = result.positions[0];
      expect(text.substring(pos.start, pos.end)).toBe("phuss");
      expect(result.cleanedText).toBe("what a ***** here");
    });
  });

  describe("leet mappings no longer rewrite plain letters", () => {
    test("'z' is not treated as 's'", () => {
      const f = new AllProfanity({ silent: true });
      f.add(["hiss"]);
      expect(f.check("hizz")).toBe(false);
    });

    test("'j' is not treated as 'y'", () => {
      const f = new AllProfanity({ silent: true });
      f.add(["yes"]);
      expect(f.check("jes")).toBe(false);
    });

    test("'v' is not treated as 'u'", () => {
      const f = new AllProfanity({ silent: true });
      f.add(["bus"]);
      expect(f.check("bvs")).toBe(false);
    });

    test("digit/symbol leet still works", () => {
      const f = new AllProfanity({ silent: true });
      f.add(["hiss"]);
      expect(f.check("h1ss")).toBe(true);
      expect(f.check("h!ss")).toBe(true);
    });
  });

  describe("remove() and clearList() reach all data structures", () => {
    test("remove() works in aho-corasick mode", () => {
      const f = new AllProfanity({
        algorithm: { matching: "aho-corasick" },
        silent: true,
      });
      f.add(["zzzbadzzz"]);
      expect(f.check("zzzbadzzz")).toBe(true);
      f.remove(["zzzbadzzz"]);
      expect(f.check("zzzbadzzz")).toBe(false);
    });

    test("remove() works in hybrid mode", () => {
      const f = new AllProfanity({
        algorithm: { matching: "hybrid" },
        silent: true,
      });
      f.add(["zzzbadzzz"]);
      expect(f.check("zzzbadzzz")).toBe(true);
      f.remove(["zzzbadzzz"]);
      expect(f.check("zzzbadzzz")).toBe(false);
    });

    test("clearList() clears the aho-corasick automaton", () => {
      const f = new AllProfanity({
        algorithm: { matching: "aho-corasick" },
        silent: true,
      });
      expect(f.check("fuck")).toBe(true);
      f.clearList();
      expect(f.check("fuck")).toBe(false);
    });
  });

  describe("result cache invalidation and bounds", () => {
    test("cache is invalidated when words are added", () => {
      const f = new AllProfanity({
        performance: { enableCaching: true },
        silent: true,
      });
      expect(f.check("zzznewword")).toBe(false);
      f.add(["zzznewword"]);
      expect(f.check("zzznewword")).toBe(true);
    });

    test("cache is invalidated when words are removed", () => {
      const f = new AllProfanity({
        performance: { enableCaching: true },
        silent: true,
      });
      f.add(["zzznewword"]);
      expect(f.check("zzznewword")).toBe(true);
      f.remove(["zzznewword"]);
      expect(f.check("zzznewword")).toBe(false);
    });

    test("cache is invalidated when the placeholder changes", () => {
      const f = new AllProfanity({
        performance: { enableCaching: true },
        silent: true,
      });
      expect(f.clean("fuck")).toBe("****");
      f.setPlaceholder("#");
      expect(f.clean("fuck")).toBe("####");
    });

    test("cache respects the configured cacheSize", () => {
      const f = new AllProfanity({
        performance: { enableCaching: true, cacheSize: 5 },
        silent: true,
      });
      for (let i = 0; i < 10; i++) {
        f.check(`filler sentence number ${i}`);
      }
      const cache = (f as any).resultCache as Map<string, unknown>;
      expect(cache.size).toBeLessThanOrEqual(5);
    });
  });

  describe("config options that were silently ignored", () => {
    test("contextAnalysis.scoreThreshold is honored", () => {
      // "the ass" matches the article context pattern (weight 0.6):
      // score 0.6 passes the default 0.5 threshold but not a 0.7 one.
      const strict = new AllProfanity({
        contextAnalysis: { enabled: true, scoreThreshold: 0.7 },
        silent: true,
      });
      expect(strict.check("look at the ass")).toBe(false);

      const defaults = new AllProfanity({
        contextAnalysis: { enabled: true },
        silent: true,
      });
      expect(defaults.check("look at the ass")).toBe(true);
    });

    test("ahoCorasick.prebuild compiles the automaton at construction", () => {
      const f = new AllProfanity({
        ahoCorasick: { enabled: true, prebuild: true },
        silent: true,
      });
      expect(((f as any).ahoCorasickAutomaton as any).compiled).toBe(true);
    });
  });

  describe("rebuild keeps all structures in sync", () => {
    test("toggling caseSensitive rebuilds the aho-corasick automaton", () => {
      const f = new AllProfanity({
        algorithm: { matching: "aho-corasick" },
        silent: true,
      });
      f.add(["TestBad"]);
      expect(f.check("TESTBAD")).toBe(true);

      f.updateConfig({ caseSensitive: true });
      expect(f.check("TestBad")).toBe(true);
      expect(f.check("testbad")).toBe(false);
    });

    test("AhoCorasick does not accumulate duplicate patterns", () => {
      const ac = new AhoCorasick();
      ac.addPattern("dup");
      ac.addPattern("dup");
      expect(ac.getPatterns()).toHaveLength(1);
      expect(ac.findAll("a dup b")).toHaveLength(1);
    });

    test("AhoCorasick.removePattern removes a pattern", () => {
      const ac = new AhoCorasick(["one", "two"]);
      expect(ac.removePattern("one")).toBe(true);
      expect(ac.findAll("one two")).toHaveLength(1);
      expect(ac.removePattern("missing")).toBe(false);
    });
  });

  describe("logging goes through the Logger abstraction", () => {
    test("silent filter does not write validation warnings to console", () => {
      const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
      try {
        const f = new AllProfanity({ silent: true });
        f.add(["okword", 123 as any]);
        expect(spy).not.toHaveBeenCalled();
      } finally {
        spy.mockRestore();
      }
    });
  });

  describe("hybrid mode correctness (regression guards for bloom prefilter)", () => {
    test("detects single words and stays quiet on clean text", () => {
      const f = new AllProfanity({
        algorithm: { matching: "hybrid" },
        silent: true,
      });
      expect(f.check("this is fuck")).toBe(true);
      expect(f.check("a totally clean sentence")).toBe(false);
    });

    test("detects multi-word dictionary phrases", () => {
      const f = new AllProfanity({
        algorithm: { matching: "hybrid" },
        silent: true,
      });
      f.add(["multi word bad"]);
      expect(f.check("a multi word bad thing")).toBe(true);
    });

    test("detects partial matches when detectPartialWords is on", () => {
      const f = new AllProfanity({
        algorithm: { matching: "hybrid" },
        detectPartialWords: true,
        silent: true,
      });
      expect(f.check("xxfuckxx")).toBe(true);
    });

    test("detects non-Latin script profanity, including embedded", () => {
      const f = new AllProfanity({
        algorithm: { matching: "hybrid" },
        silent: true,
      });
      expect(f.check("इस वाक्य में भोसड़ी शब्द है।")).toBe(true);
      expect(f.check("हाभोसड़ीहा")).toBe(true);
    });
  });

  describe("bloom filter regression guards", () => {
    test("never produces false negatives", () => {
      const bloom = new BloomFilter(1000, 0.01);
      const words: string[] = [];
      for (let i = 0; i < 1000; i++) {
        words.push(`word-${i}-${(i * 31) % 97}`);
        bloom.add(words[i]);
      }
      for (const w of words) {
        expect(bloom.mightContain(w)).toBe(true);
      }
    });

    test("serialization round-trips membership results", () => {
      const bloom = new BloomFilter(100, 0.01);
      bloom.add("hello");
      bloom.add("world");
      const restored = BloomFilter.fromJSON(bloom.toJSON());
      expect(restored.mightContain("hello")).toBe(true);
      expect(restored.mightContain("world")).toBe(true);
    });
  });
});
