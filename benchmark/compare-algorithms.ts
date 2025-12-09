/**
 * Comparative benchmark: Test performance of different algorithms
 */

import { performance } from "perf_hooks";
import { AllProfanity, AllProfanityOptions } from "../src/index.js";

interface BenchResult {
  algorithm: string;
  opsPerSec: number;
  avgTimeMs: number;
  totalTimeMs: number;
}

function benchmark(name: string, fn: () => void, iterations: number = 10000): BenchResult {
  // Warm up
  for (let i = 0; i < 100; i++) fn();

  const start = performance.now();
  for (let i = 0; i < iterations; i++) fn();
  const end = performance.now();

  const totalTime = end - start;
  const avgTime = totalTime / iterations;
  const opsPerSec = (iterations / totalTime) * 1000;

  return {
    algorithm: name,
    opsPerSec: Number(opsPerSec.toFixed(2)),
    avgTimeMs: Number(avgTime.toFixed(4)),
    totalTimeMs: Number(totalTime.toFixed(2)),
  };
}

console.log("🔬 AllProfanity Algorithm Performance Comparison\n");
console.log("=".repeat(80));

// Test texts
const testCases = [
  { name: "Short profane", text: "This is fucking bullshit" },
  { name: "Medium profane", text: "This is fucking bullshit and damn terrible goddamn mess" },
  { name: "Clean text", text: "The quick brown fox jumps over the lazy dog" },
  { name: "Long text (1K)", text: "This is fucking bullshit. ".repeat(40) },
];

const iterations = 5000;

// Configuration for each algorithm
const configs: Array<{ name: string; options?: AllProfanityOptions }> = [
  {
    name: "1. Trie (Baseline)",
    options: undefined, // Default
  },
  {
    name: "2. Aho-Corasick",
    options: {
      algorithm: { matching: "aho-corasick", useAhoCorasick: true },
      ahoCorasick: { enabled: true },
    },
  },
  {
    name: "3. Hybrid (Bloom + Aho)",
    options: {
      algorithm: {
        matching: "hybrid",
        useBloomFilter: true,
        useAhoCorasick: true,
      },
      bloomFilter: { enabled: true, expectedItems: 1000, falsePositiveRate: 0.01 },
      ahoCorasick: { enabled: true },
    },
  },
  {
    name: "4. Trie + Caching",
    options: {
      performance: { enableCaching: true, cacheSize: 1000 },
    },
  },
  {
    name: "5. Hybrid + Caching",
    options: {
      algorithm: {
        matching: "hybrid",
        useBloomFilter: true,
        useAhoCorasick: true,
      },
      bloomFilter: { enabled: true, expectedItems: 1000, falsePositiveRate: 0.01 },
      ahoCorasick: { enabled: true },
      performance: { enableCaching: true, cacheSize: 1000 },
    },
  },
];

for (const testCase of testCases) {
  console.log(`\n📝 Test Case: ${testCase.name}`);
  console.log(`   Text: "${testCase.text.substring(0, 50)}${testCase.text.length > 50 ? "..." : ""}"`);
  console.log("-".repeat(80));
  console.log(`${"Algorithm".padEnd(30)} ${"Ops/sec".padStart(15)} ${"Avg Time".padStart(15)}`);
  console.log("-".repeat(80));

  const results: BenchResult[] = [];

  for (const config of configs) {
    const filter = new AllProfanity(config.options);
    const result = benchmark(
      config.name,
      () => filter.detect(testCase.text),
      iterations
    );
    results.push(result);

    console.log(
      `${config.name.padEnd(30)} ${result.opsPerSec
        .toLocaleString()
        .padStart(15)} ${result.avgTimeMs.toFixed(4).padStart(15)}ms`
    );
  }

  // Show relative performance
  const baseline = results[0];
  console.log("\n📊 Relative Performance (vs Baseline):");
  for (let i = 1; i < results.length; i++) {
    const speedup = ((results[i].opsPerSec / baseline.opsPerSec - 1) * 100).toFixed(1);
    const symbol = results[i].opsPerSec > baseline.opsPerSec ? "↑" : "↓";
    const color = results[i].opsPerSec > baseline.opsPerSec ? "faster" : "slower";
    console.log(
      `   ${results[i].algorithm}: ${symbol} ${Math.abs(
        Number(speedup)
      ).toFixed(1)}% ${color}`
    );
  }
}

// Cache performance test
console.log("\n\n💾 Cache Performance Test");
console.log("=".repeat(80));
const cachedFilter = new AllProfanity({
  performance: { enableCaching: true, cacheSize: 100 },
});
const testText = "This is fucking bullshit";

// First call (not cached)
const firstStart = performance.now();
cachedFilter.detect(testText);
const firstEnd = performance.now();
const firstTime = firstEnd - firstStart;

// Second call (cached)
const secondStart = performance.now();
cachedFilter.detect(testText);
const secondEnd = performance.now();
const secondTime = secondEnd - secondStart;

const cacheSpeedup = (firstTime / secondTime).toFixed(1);
console.log(`   First call (not cached):  ${firstTime.toFixed(4)}ms`);
console.log(`   Second call (cached):     ${secondTime.toFixed(4)}ms`);
console.log(`   Speedup:                  ${cacheSpeedup}x faster`);

// Large batch test
console.log("\n\n📦 Batch Processing Test (1000 texts)");
console.log("=".repeat(80));
const batchTexts = Array(1000)
  .fill(0)
  .map((_, i) => `Text ${i}: This might contain bullshit or not`);

for (const config of [configs[0], configs[1], configs[2]]) {
  const filter = new AllProfanity(config.options);
  const start = performance.now();
  for (const text of batchTexts) {
    filter.detect(text);
  }
  const end = performance.now();
  const totalTime = end - start;
  const perText = totalTime / batchTexts.length;
  console.log(
    `${config.name.padEnd(30)} Total: ${totalTime.toFixed(
      2
    )}ms, Per text: ${perText.toFixed(4)}ms`
  );
}

console.log("\n" + "=".repeat(80));
console.log("✅ Benchmark completed successfully!");
console.log("\n💡 Recommendations:");
console.log("   - For general use: Trie (default) - simple and reliable");
console.log("   - For high throughput: Aho-Corasick - best for many patterns");
console.log("   - For production: Hybrid + Caching - best balance");
console.log("   - For repeated checks: Enable caching - massive speedup");
