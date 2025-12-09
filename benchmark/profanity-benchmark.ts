/**
 * Comprehensive benchmark suite for AllProfanity
 * Tests performance across different scenarios and dataset sizes
 */

import { performance } from "perf_hooks";
import profanity from "../src/index.js";

interface BenchmarkResult {
  name: string;
  operations: number;
  totalTime: number;
  avgTime: number;
  opsPerSecond: number;
  memoryUsed?: number;
}

interface BenchmarkSuite {
  suiteName: string;
  results: BenchmarkResult[];
  totalTime: number;
}

class ProfanityBenchmark {
  private results: BenchmarkSuite[] = [];

  /**
   * Run a benchmark test
   */
  private benchmark(
    name: string,
    fn: () => void,
    iterations: number = 10000
  ): BenchmarkResult {
    // Warm up
    for (let i = 0; i < 100; i++) {
      fn();
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    const memBefore = process.memoryUsage().heapUsed;
    const startTime = performance.now();

    for (let i = 0; i < iterations; i++) {
      fn();
    }

    const endTime = performance.now();
    const memAfter = process.memoryUsage().heapUsed;

    const totalTime = endTime - startTime;
    const avgTime = totalTime / iterations;
    const opsPerSecond = (iterations / totalTime) * 1000;
    const memoryUsed = Math.max(0, memAfter - memBefore);

    return {
      name,
      operations: iterations,
      totalTime: Number(totalTime.toFixed(2)),
      avgTime: Number(avgTime.toFixed(4)),
      opsPerSecond: Number(opsPerSecond.toFixed(2)),
      memoryUsed,
    };
  }

  /**
   * Benchmark: Simple profanity check
   */
  benchmarkSimpleCheck(): BenchmarkSuite {
    console.log("\n🔍 Benchmarking: Simple Profanity Check");

    const suite: BenchmarkSuite = {
      suiteName: "Simple Profanity Check",
      results: [],
      totalTime: 0,
    };

    const tests = [
      { text: "This is a clean sentence.", desc: "Clean text (short)" },
      { text: "This is fucking bullshit.", desc: "Single profanity" },
      { text: "fuck shit damn hell ass", desc: "Multiple profanities" },
      {
        text: "The quick brown fox jumps over the lazy dog.",
        desc: "Clean text (medium)",
      },
      {
        text: "What the f#ck is this bullsh!t a55hole doing?",
        desc: "Leet-speak profanity",
      },
    ];

    for (const test of tests) {
      const result = this.benchmark(
        `check() - ${test.desc}`,
        () => profanity.check(test.text),
        10000
      );
      suite.results.push(result);
      suite.totalTime += result.totalTime;
    }

    this.results.push(suite);
    return suite;
  }

  /**
   * Benchmark: Detailed detection with positions
   */
  benchmarkDetailedDetection(): BenchmarkSuite {
    console.log("\n🔍 Benchmarking: Detailed Detection");

    const suite: BenchmarkSuite = {
      suiteName: "Detailed Detection (detect method)",
      results: [],
      totalTime: 0,
    };

    const tests = [
      { text: "This is a clean sentence.", desc: "Clean text" },
      {
        text: "This is fucking bullshit and damn terrible.",
        desc: "Multiple profanities",
      },
      {
        text: "What the f#ck is this bullsh!t a55hole doing here?",
        desc: "Leet-speak",
      },
      {
        text: "The fucking bastard is a goddamn piece of shit asshole.",
        desc: "Heavy profanity",
      },
    ];

    for (const test of tests) {
      const result = this.benchmark(
        `detect() - ${test.desc}`,
        () => profanity.detect(test.text),
        5000
      );
      suite.results.push(result);
      suite.totalTime += result.totalTime;
    }

    this.results.push(suite);
    return suite;
  }

  /**
   * Benchmark: Text cleaning operations
   */
  benchmarkCleaning(): BenchmarkSuite {
    console.log("\n🔍 Benchmarking: Text Cleaning");

    const suite: BenchmarkSuite = {
      suiteName: "Text Cleaning Operations",
      results: [],
      totalTime: 0,
    };

    const text = "This is fucking bullshit and damn terrible goddamn mess.";

    const tests = [
      {
        fn: () => profanity.clean(text),
        desc: "clean() - Character replacement",
      },
      {
        fn: () => profanity.clean(text, "#"),
        desc: "clean() - Custom placeholder",
      },
      {
        fn: () => profanity.cleanWithPlaceholder(text),
        desc: "cleanWithPlaceholder() - Word replacement",
      },
      {
        fn: () => profanity.cleanWithPlaceholder(text, "[CENSORED]"),
        desc: "cleanWithPlaceholder() - Custom word",
      },
    ];

    for (const test of tests) {
      const result = this.benchmark(test.desc, test.fn, 5000);
      suite.results.push(result);
      suite.totalTime += result.totalTime;
    }

    this.results.push(suite);
    return suite;
  }

  /**
   * Benchmark: Multi-language detection
   */
  benchmarkMultiLanguage(): BenchmarkSuite {
    console.log("\n🔍 Benchmarking: Multi-Language Detection");

    const suite: BenchmarkSuite = {
      suiteName: "Multi-Language Detection",
      results: [],
      totalTime: 0,
    };

    // Load additional languages
    profanity.loadLanguages(["french", "german", "spanish", "bengali"]);

    const tests = [
      { text: "This is bullshit.", desc: "English" },
      { text: "यह चूतिया है।", desc: "Hindi (Devanagari)" },
      { text: "Ye chutiya hai.", desc: "Hinglish (Roman)" },
      { text: "Ce mot est merde.", desc: "French" },
      { text: "Das ist scheiße.", desc: "German" },
      { text: "Esto es mierda.", desc: "Spanish" },
      {
        text: "This is bullshit and यह चूतिया है and merde.",
        desc: "Mixed languages",
      },
    ];

    for (const test of tests) {
      const result = this.benchmark(
        `check() - ${test.desc}`,
        () => profanity.check(test.text),
        5000
      );
      suite.results.push(result);
      suite.totalTime += result.totalTime;
    }

    this.results.push(suite);
    return suite;
  }

  /**
   * Benchmark: Large text processing
   */
  benchmarkLargeText(): BenchmarkSuite {
    console.log("\n🔍 Benchmarking: Large Text Processing");

    const suite: BenchmarkSuite = {
      suiteName: "Large Text Processing",
      results: [],
      totalTime: 0,
    };

    // Generate texts of various sizes
    const cleanSentence = "The quick brown fox jumps over the lazy dog. ";
    const profaneSentence = "This is fucking bullshit and damn terrible. ";

    const texts = [
      {
        text: cleanSentence.repeat(10),
        desc: "Clean text (500 chars)",
        iter: 2000,
      },
      {
        text: profaneSentence.repeat(10),
        desc: "Profane text (500 chars)",
        iter: 2000,
      },
      {
        text: cleanSentence.repeat(50),
        desc: "Clean text (2.5K chars)",
        iter: 1000,
      },
      {
        text: profaneSentence.repeat(50),
        desc: "Profane text (2.5K chars)",
        iter: 1000,
      },
      {
        text: cleanSentence.repeat(200),
        desc: "Clean text (10K chars)",
        iter: 500,
      },
      {
        text: profaneSentence.repeat(200),
        desc: "Profane text (10K chars)",
        iter: 500,
      },
    ];

    for (const test of texts) {
      const result = this.benchmark(
        `detect() - ${test.desc}`,
        () => profanity.detect(test.text),
        test.iter
      );
      suite.results.push(result);
      suite.totalTime += result.totalTime;
    }

    this.results.push(suite);
    return suite;
  }

  /**
   * Benchmark: Dynamic word management
   */
  benchmarkDynamicWords(): BenchmarkSuite {
    console.log("\n🔍 Benchmarking: Dynamic Word Management");

    const suite: BenchmarkSuite = {
      suiteName: "Dynamic Word Management",
      results: [],
      totalTime: 0,
    };

    const customWords = ["badword1", "badword2", "badword3", "badword4"];

    // Add words
    const addResult = this.benchmark(
      "add() - Adding 4 words",
      () => {
        profanity.add(customWords);
      },
      1000
    );
    suite.results.push(addResult);
    suite.totalTime += addResult.totalTime;

    // Check with custom words
    const checkResult = this.benchmark(
      "check() - After adding custom words",
      () => profanity.check("This is badword1 and badword2"),
      5000
    );
    suite.results.push(checkResult);
    suite.totalTime += checkResult.totalTime;

    // Remove words
    const removeResult = this.benchmark(
      "remove() - Removing 4 words",
      () => {
        profanity.remove(customWords);
      },
      1000
    );
    suite.results.push(removeResult);
    suite.totalTime += removeResult.totalTime;

    this.results.push(suite);
    return suite;
  }

  /**
   * Benchmark: Whitelist operations
   */
  benchmarkWhitelist(): BenchmarkSuite {
    console.log("\n🔍 Benchmarking: Whitelist Operations");

    const suite: BenchmarkSuite = {
      suiteName: "Whitelist Operations",
      results: [],
      totalTime: 0,
    };

    const whitelistWords = ["ass", "hell", "damn"];

    // Add to whitelist
    const addResult = this.benchmark(
      "addToWhitelist() - Adding 3 words",
      () => {
        profanity.addToWhitelist(whitelistWords);
      },
      1000
    );
    suite.results.push(addResult);
    suite.totalTime += addResult.totalTime;

    // Check with whitelisted words
    const checkResult = this.benchmark(
      "check() - With whitelisted words",
      () => profanity.check("This is ass and hell and damn"),
      5000
    );
    suite.results.push(checkResult);
    suite.totalTime += checkResult.totalTime;

    // Remove from whitelist
    const removeResult = this.benchmark(
      "removeFromWhitelist() - Removing 3 words",
      () => {
        profanity.removeFromWhitelist(whitelistWords);
      },
      1000
    );
    suite.results.push(removeResult);
    suite.totalTime += removeResult.totalTime;

    this.results.push(suite);
    return suite;
  }

  /**
   * Benchmark: Configuration changes
   */
  benchmarkConfiguration(): BenchmarkSuite {
    console.log("\n🔍 Benchmarking: Configuration Changes");

    const suite: BenchmarkSuite = {
      suiteName: "Configuration Changes",
      results: [],
      totalTime: 0,
    };

    const text = "What the f#ck is this bullsh!t?";

    const tests = [
      {
        config: { enableLeetSpeak: true },
        desc: "With leet-speak enabled",
      },
      {
        config: { enableLeetSpeak: false },
        desc: "With leet-speak disabled",
      },
      {
        config: { caseSensitive: true },
        desc: "With case-sensitive mode",
      },
      {
        config: { caseSensitive: false },
        desc: "With case-insensitive mode",
      },
      {
        config: { strictMode: true },
        desc: "With strict mode enabled",
      },
      {
        config: { strictMode: false },
        desc: "With strict mode disabled",
      },
    ];

    for (const test of tests) {
      profanity.updateConfig(test.config);
      const result = this.benchmark(
        `check() - ${test.desc}`,
        () => profanity.check(text),
        5000
      );
      suite.results.push(result);
      suite.totalTime += result.totalTime;
    }

    // Reset to defaults
    profanity.updateConfig({
      enableLeetSpeak: true,
      caseSensitive: false,
      strictMode: false,
    });

    this.results.push(suite);
    return suite;
  }

  /**
   * Print formatted results
   */
  printResults(): void {
    console.log("\n" + "=".repeat(80));
    console.log("📊 BENCHMARK RESULTS");
    console.log("=".repeat(80));

    for (const suite of this.results) {
      console.log(`\n${suite.suiteName}`);
      console.log("-".repeat(80));
      console.log(
        `${"Test Name".padEnd(45)} ${"Ops/sec".padStart(12)} ${"Avg (ms)".padStart(
          12
        )} ${"Memory".padStart(10)}`
      );
      console.log("-".repeat(80));

      for (const result of suite.results) {
        const opsPerSec = result.opsPerSecond.toLocaleString();
        const avgTime = result.avgTime.toFixed(4);
        const memory = result.memoryUsed
          ? `${(result.memoryUsed / 1024 / 1024).toFixed(2)}MB`
          : "N/A";

        console.log(
          `${result.name.padEnd(45)} ${opsPerSec.padStart(12)} ${avgTime.padStart(
            12
          )} ${memory.padStart(10)}`
        );
      }

      console.log(
        `\nSuite Total Time: ${suite.totalTime.toFixed(2)}ms (${(
          suite.totalTime / 1000
        ).toFixed(2)}s)`
      );
    }

    const grandTotal = this.results.reduce(
      (sum, suite) => sum + suite.totalTime,
      0
    );
    console.log("\n" + "=".repeat(80));
    console.log(
      `Grand Total Time: ${grandTotal.toFixed(2)}ms (${(grandTotal / 1000).toFixed(
        2
      )}s)`
    );
    console.log("=".repeat(80));
  }

  /**
   * Export results to JSON
   */
  async exportToJSON(filename: string): Promise<void> {
    const fs = await import("fs");
    const data = {
      timestamp: new Date().toISOString(),
      node_version: process.version,
      platform: process.platform,
      arch: process.arch,
      results: this.results,
    };

    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`\n✅ Results exported to ${filename}`);
  }

  /**
   * Run all benchmarks
   */
  async runAll(): Promise<void> {
    console.log("🚀 Starting AllProfanity Benchmark Suite");
    console.log(`Node Version: ${process.version}`);
    console.log(`Platform: ${process.platform} ${process.arch}`);

    const startTime = performance.now();

    this.benchmarkSimpleCheck();
    this.benchmarkDetailedDetection();
    this.benchmarkCleaning();
    this.benchmarkMultiLanguage();
    this.benchmarkLargeText();
    this.benchmarkDynamicWords();
    this.benchmarkWhitelist();
    this.benchmarkConfiguration();

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    this.printResults();

    console.log(
      `\n⏱️  Total benchmark execution time: ${(totalTime / 1000).toFixed(2)}s`
    );

    // Export results
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await this.exportToJSON(`benchmark/results/benchmark-${timestamp}.json`);
  }
}

export default ProfanityBenchmark;

// Run benchmarks if executed directly
const benchmark = new ProfanityBenchmark();
 benchmark.runAll();
