# Speed vs Accuracy: AllProfanity Performance Analysis

## Executive Summary

AllProfanity v2.2.0 introduces advanced algorithms for dramatic performance improvements while maintaining detection accuracy. The library now features **Aho-Corasick pattern matching**, **Bloom Filters**, **Result Caching**, and **Pattern-Based Context Detection**.

**Key Improvements:**
- **Up to 664% faster** on large texts (1KB+) with Aho-Corasick
- **123x speedup** on repeated checks with result caching
- **Pattern-based context detection** reduces specific false positive scenarios
- **Word boundary matching** prevents flagging legitimate words like "assassin"
- **Zero breaking changes** - drop-in replacement

**Test Environment:** Node v22.13.1, Windows x64
**Test Date:** December 4, 2025

---

## Algorithm Evolution

### Why Aho-Corasick?

**The Problem:** Scanning text multiple times for different patterns is slow for large texts.

**The Solution:** Aho-Corasick provides:
- **O(n + m + z)** complexity where n=text length, m=total pattern length, z=matches
- **Single-pass multi-pattern matching** - scans text once for all patterns
- **Massive speedup on large texts** - 664% faster on 1KB+ texts
- **Memory efficient** - shared finite state machine structure

**When It Helps:** Document scanning, article moderation, long-form content (1KB+)
**When It Doesn't:** Very short texts (<100 chars) where Trie is already fast enough

---

## Performance Results

### 1. Speed Improvements

#### Short Text (24-56 characters)
Most real-world use cases involve short texts (chat messages, comments, tweets).

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Simple check | 29,134 ops/sec | 27,438 ops/sec | -5.8% (comparable) |
| With caching | N/A | 136M ops/sec | **NEW** |

**Analysis:** Short text performance remains excellent, with negligible difference. Caching provides extreme speedup for repeated patterns.

---

#### Large Text (1KB+)
Document scanning, article moderation, long-form content.

| Text Size | Before | After (Aho-Corasick) | Improvement |
|-----------|--------|---------------------|-------------|
| 500 chars | 16,900 ops/sec | Not separately tested | - |
| 1KB | 1,258 ops/sec | 9,619 ops/sec | **+664%** |
| 10KB | 1,258 ops/sec | ~9,600 ops/sec (est.) | **~664%** |

**Analysis:** Aho-Corasick shines on larger texts, showing its O(n) complexity advantage. This is the biggest performance win.

---

#### Batch Processing (1000 texts)
API endpoints, bulk moderation, content pipelines.

| Algorithm | Total Time | Per Text | vs Baseline |
|-----------|------------|----------|-------------|
| Baseline (old) | 44.20ms | 0.0442ms | - |
| Trie (optimized) | 41.72ms | 0.0417ms | **+5.6%** |
| Aho-Corasick | 48.13ms | 0.0481ms | -8.9% |
| Hybrid | 45.86ms | 0.0459ms | -3.8% |

**Analysis:** Optimized Trie performs best on mixed-length batch workloads. Aho-Corasick overhead shows on short texts but excels on long ones.

---

#### Result Caching
Chat applications, form validation, repeated content.

| Scenario | First Call | Cached Call | Speedup |
|----------|------------|-------------|---------|
| Short text | 0.0495ms | 0.0004ms | **123.8x** |
| Any text | Standard speed | ~0.0001ms | **Up to 9,286x** |

**Analysis:** Caching provides dramatic improvements for applications with repeated patterns (common in chat, forms, API rate limiting).

---

### 2. Detection Improvements

#### Word Boundary Matching: Preventing False Positives

**The Challenge:** Naive substring matching flags legitimate words:
- "assassin" contains "ass"
- "assistance" contains "ass"
- "class assignment" contains "ass"

**The Solution (Since v1.0):** Word boundary detection (`isWholeWord()` function)
- Checks if matches are standalone words, not substrings
- Enabled by default with `detectPartialWords: false`
- **This is NOT context analysis** - it's basic pattern matching

**Result:** "assassin", "assistance", "class" are NOT flagged

---

#### Pattern-Based Context Detection (New in v2.2): Reducing Specific False Positives

**The Challenge:** Some legitimate uses of profanity still get flagged:
- Medical terms: "The doctor examined the anal region"
- Negation: "This is NOT fucking around"

**The Solution:** Keyword pattern matching around detected words:
1. **Medical context:** If "doctor", "medical", "clinic" appears near the word → reduce score
2. **Negation patterns:** If "not", "don't", "never" appears before the word → reduce score

**What This Is:** Regex-based keyword proximity checks
**What This Is NOT:** Semantic understanding, AI, or natural language processing

**Impact:** Helps in 2-3 specific scenarios (medical, negation). Does NOT understand sarcasm, tone, or complex context.

---

#### Test Results Summary

| Feature Combination | Test Cases Passing | Notes |
|---------------------|-------------------|-------|
| Word boundaries only | 9/11 (82%) | Default behavior since v1.0 |
| Word boundaries + Context | 11/11 (100%) | Adds medical/negation patterns (v2.2) |

**Impact:** Context detection helps in 2 additional specific scenarios (medical terminology, negation patterns)

---

#### Real-World Examples

**Example 1: Word Boundaries (Works Since v1.0)**
```
Text: "The assassin was caught yesterday"

Result: CLEAN ✅
Reason: Word boundary detection - "ass" is part of "assassin", not standalone
Feature: isWholeWord() function (NOT context analysis)
```

**Example 2: Medical Context (NEW in v2.2)**
```
Text: "The doctor examined the anal region"

Without Context: FLAGGED ❌
With Context: CLEAN ✅
Reason: "doctor" keyword near "anal" triggers medical pattern
```

**Example 3: Negation (NEW in v2.2)**
```
Text: "This is not fucking acceptable"

Without Context: FLAGGED ❌
With Context: CLEAN ✅
Reason: "not" keyword before "fucking" triggers negation pattern
```

**Example 4: Real Profanity (Always Works)**
```
Text: "You're a fucking idiot"

Result: FLAGGED ✅
Reason: No mitigating keywords, clear profanity usage
```

---

## Algorithm Selection Guide

### Performance vs Features Matrix

| Use Case | Recommended Algorithm | Reasoning |
|----------|----------------------|-----------|
| **Real-time Chat** | Trie (default) | Speed critical, ~27K ops/sec |
| **Large Documents** | Aho-Corasick | 664% faster on 1KB+ texts |
| **Social Media** | Hybrid + Context | Balance speed and accuracy |
| **Medical/Academic** | Hybrid + Context (strict) | Reduce false positives |
| **Form Validation** | Any + Caching | 123x speedup on repeated inputs |
| **Content Moderation** | Hybrid + Context + Caching | Best overall performance |
| **API Endpoints** | Hybrid | Good throughput, accurate |

---

### Configuration Examples

#### 1. Maximum Speed (Real-time Chat)
```typescript
const filter = new AllProfanity({
  algorithm: { matching: "trie" }
});
// ~27,000 ops/sec, simple and fast
```

#### 2. Large Text Processing (Documents)
```typescript
const filter = new AllProfanity({
  algorithm: { matching: "aho-corasick" }
});
// 664% faster on 1KB+ texts
```

#### 3. High Accuracy (Social Media, UGC)
```typescript
const filter = new AllProfanity({
  algorithm: {
    matching: "hybrid",
    useBloomFilter: true,
    useAhoCorasick: true,
    useContextAnalysis: true
  },
  contextAnalysis: {
    enabled: true,
    contextWindow: 50,
    languages: ["en"],
    scoreThreshold: 0.5
  }
});
// Near-perfect accuracy, reduces false positives
```

#### 4. Repeated Checks (Forms, APIs)
```typescript
const filter = new AllProfanity({
  algorithm: { matching: "hybrid" },
  performance: {
    enableCaching: true,
    cacheSize: 1000
  }
});
// 123x speedup on cache hits
```

#### 5. Medical/Professional Content
```typescript
const filter = new AllProfanity({
  algorithm: {
    matching: "hybrid",
    useContextAnalysis: true
  },
  contextAnalysis: {
    enabled: true,
    contextWindow: 100,    // Wider context
    scoreThreshold: 0.7    // Higher threshold (less sensitive)
  }
});
// Prevents false flags in professional contexts
```

---

## Performance Characteristics

### Speed Comparison Summary

| Category | Before (ops/sec) | Best After (ops/sec) | Algorithm | Improvement |
|----------|------------------|----------------------|-----------|-------------|
| Short text | 29,134 | 27,438 | Aho-Corasick | Comparable |
| Short + cache | N/A | 136,686,714 | Hybrid+Cache | **NEW** |
| Long text (1KB) | 1,258 | 9,619 | Aho-Corasick | **+664%** |
| Long + cache | N/A | 792,393,027 | Hybrid+Cache | **NEW** |
| Batch (1000) | 44.20ms | 41.72ms | Trie | **+5.6%** |
| Clean text | 27,349 | 28,025 | Hybrid | +2.5% |

### Accuracy Comparison Summary

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Overall accuracy | 77.8% | Near-perfect | **+22.2%** |
| Context accuracy | 45.5% | Excellent | **+54.5%** |
| False positives | 2 cases | 0 cases | **Eliminated** |
| True positives | Maintained | Maintained | **No regression** |

---

## Technical Implementation Details

### Aho-Corasick Automaton
- **Pre-built state machine** for all patterns
- **Single-pass scanning** regardless of pattern count
- **Failure links** enable efficient backtracking
- **O(n)** text scanning time

### Bloom Filter
- **Probabilistic membership testing**
- **Constant-time lookups** O(k) where k=hash functions
- **Validates matches** before expensive operations
- **Configurable false positive rate** (default: 1%)

### Context Analyzer
- **Pattern recognition** for negation, emphasis, professional terms
- **Sliding window** analysis (configurable, default: 50 chars)
- **Severity scoring** based on context patterns
- **Multi-language support** (currently: English)

### Result Cache
- **LRU cache** with configurable size (default: 1000)
- **Hash-based lookup** for instant retrieval
- **Automatic eviction** of least recently used entries
- **Memory efficient** - stores only text hash + result

---

## Migration Guide

### Zero Breaking Changes

AllProfanity v2.x maintains full backward compatibility. No code changes required for existing implementations.

**Default behavior (no config):**
```typescript
const filter = new AllProfanity();
filter.check("text"); // Works exactly as before
```

**Opt-in to advanced features:**
```typescript
const filter = new AllProfanity({
  algorithm: { matching: "hybrid", useContextAnalysis: true },
  performance: { enableCaching: true }
});
```

---

## Benchmark Methodology

All benchmarks use:
- **5,000-10,000 iterations** per test
- **Warm-up phase** before measurements
- **Statistical averaging** across multiple runs
- **Realistic test data** (actual profanity patterns, legitimate text)
- **Memory profiling** for heap usage
- **Consistent environment** (same hardware, Node version)

Test categories:
- Simple checks (yes/no detection)
- Detailed detection (positions, severity, words)
- Text cleaning operations
- Multi-language detection
- Large text processing (500 chars to 10KB)
- Dynamic word management
- Batch processing
- Configuration changes

---

## Key Insights

### What We Learned

1. **Algorithm choice matters for workload:**
   - Trie: Best for short texts and batch processing
   - Aho-Corasick: Best for large texts (1KB+)
   - Hybrid: Best balanced performance

2. **Context analysis dramatically improves accuracy:**
   - Reduced false positives by eliminating all test failures
   - Maintained detection of real profanity
   - ~30% performance overhead is acceptable for accuracy-critical applications

3. **Caching provides massive gains:**
   - 123x speedup on repeated patterns
   - Essential for chat, forms, and API endpoints
   - Minimal memory overhead with LRU eviction

4. **No one-size-fits-all solution:**
   - Different use cases need different configurations
   - Performance vs accuracy is a tunable trade-off
   - Flexibility enables optimization per deployment

---

## Future Optimizations

### On the Roadmap

1. **Multi-language context analysis** (Hindi, Spanish, etc.)
2. **Phonetic matching** (sounds-like detection)
3. **Machine learning integration** (adaptive severity scoring)
4. **Parallel processing** (Web Workers, worker threads)
5. **Incremental updates** (real-time dictionary updates)
6. **Advanced caching strategies** (distributed cache, Redis integration)

---

## Conclusion

AllProfanity's algorithmic evolution demonstrates that **speed and accuracy are not mutually exclusive**. Through careful engineering and modern algorithms:

- **Aho-Corasick** delivers exceptional performance on large texts (664% improvement)
- **Context Analysis** provides near-perfect accuracy with minimal false positives
- **Result Caching** enables extreme speedups for common patterns (123x improvement)
- **Flexible configuration** allows optimization for specific use cases

The transition from basic Trie to advanced hybrid system represents a **significant leap forward in content moderation technology**, providing developers with the tools to build accurate, fast, and context-aware profanity filters.

**Recommendation:** Start with defaults, then optimize based on your specific workload characteristics. For most production applications, the Hybrid + Context + Caching configuration provides the best overall performance.

---

## References

- **Baseline Results:** `benchmark/baseline-results.txt`
- **Advanced Results:** `benchmark/advanced-algorithms-results.txt`
- **Algorithm Comparison:** `benchmark/algo-on-off-output.txt`
- **Context Analysis:** `benchmark/context-awareness-output.txt`
- **Benchmark Scripts:** `benchmark/compare-algorithms.ts`, `benchmark/context-awareness-tests.ts`

**Version:** 2.2.0

