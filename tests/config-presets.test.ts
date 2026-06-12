import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { AllProfanity } from "../src/index.js";

const presetDir = join(process.cwd(), "examples-config");
const presetFiles = readdirSync(presetDir).filter((f) => f.endsWith(".json"));

const loadPreset = (file: string) =>
  AllProfanity.fromConfig(
    JSON.parse(readFileSync(join(presetDir, file), "utf-8"))
  );

describe("Configuration presets", () => {
  test("preset directory contains the documented presets", () => {
    expect(presetFiles.sort()).toEqual(
      [
        "chat-app.json",
        "content-moderation.json",
        "family-friendly-max.json",
        "high-throughput-api.json",
        "low-latency-minimal.json",
        "medical-professional.json",
        "multilingual-global.json",
      ].sort()
    );
  });

  test.each(presetFiles)("%s loads and detects plain profanity", (file) => {
    const filter = loadPreset(file);
    expect(filter.check("fuck")).toBe(true);
    expect(filter.check("a perfectly clean sentence")).toBe(false);
  });

  test("chat-app catches evasion attempts", () => {
    const filter = loadPreset("chat-app.json");
    expect(filter.check("f u c k you")).toBe(true);
    expect(filter.check("f*ck")).toBe(true);
    expect(filter.check("fuuuuck")).toBe(true);
    expect(filter.check("ｆｕｃｋ")).toBe(true);
  });

  test("medical-professional tolerates clinical context", () => {
    const filter = loadPreset("medical-professional.json");
    expect(filter.check("the patient had an anal examination")).toBe(false);
    expect(filter.check("you are a fucking idiot")).toBe(true);
  });

  test("family-friendly-max flags embedded profanity but honors its whitelist", () => {
    const filter = loadPreset("family-friendly-max.json");
    expect(filter.check("absofuckinglutely")).toBe(true);
    expect(filter.check("my class starts at 5")).toBe(false);
    expect(filter.check("a classic movie")).toBe(false);
    expect(filter.check("bass guitar lessons")).toBe(false);
  });

  test("low-latency-minimal only matches literal words", () => {
    const filter = loadPreset("low-latency-minimal.json");
    expect(filter.check("fuck")).toBe(true);
    expect(filter.check("f*ck")).toBe(false);
    expect(filter.check("sh1t")).toBe(false);
  });

  test("multilingual-global loads all nine languages", () => {
    const filter = loadPreset("multilingual-global.json");
    expect(filter.getLoadedLanguages().sort()).toEqual(
      [
        "bengali",
        "brazilian",
        "english",
        "french",
        "german",
        "hindi",
        "spanish",
        "tamil",
        "telugu",
      ].sort()
    );
    expect(filter.check("merde alors")).toBe(true); // French
    expect(filter.check("das ist scheisse")).toBe(true); // German
  });
});

describe("whitelist of containing words in partial-word mode", () => {
  test("whitelisting a containing word suppresses embedded matches", () => {
    const filter = new AllProfanity({
      silent: true,
      detectPartialWords: true,
      whitelistWords: ["classic"],
    });
    expect(filter.check("a classic movie")).toBe(false);
    // unwhitelisted embedding still flags
    expect(filter.check("absofuckinglutely")).toBe(true);
  });
});
