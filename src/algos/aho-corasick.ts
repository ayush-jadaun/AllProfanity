/**
 * Aho-Corasick algorithm implementation for efficient multi-pattern string matching
 */

export interface Match {
  pattern: string;
  start: number;
  end: number;
  patternIndex: number;
}

interface TrieNode {
  children: Map<string, TrieNode>;
  output: string[];
  outputIndices: number[];
  failure: TrieNode | null;
  isEndOfPattern: boolean;
}

export class AhoCorasick {
  private root: TrieNode;
  private patterns: string[];
  private compiled: boolean = false;

  constructor(patterns: string[] = []) {
    this.patterns = [...patterns];
    this.root = this.createNode();
    if (patterns.length > 0) {
      this.buildAutomaton();
    }
  }

  /**
   * Create a new trie node
   */
  private createNode(): TrieNode {
    return {
      children: new Map<string, TrieNode>(),
      output: [],
      outputIndices: [],
      failure: null,
      isEndOfPattern: false,
    };
  }

  /**
   * Add patterns to the automaton
   */
  addPatterns(patterns: string[]): void {
    this.patterns.push(...patterns);
    this.compiled = false;
  }

  /**
   * Add a single pattern to the automaton
   */
  addPattern(pattern: string): void {
    if (pattern && pattern.length > 0) {
      this.patterns.push(pattern);
      this.compiled = false;
    }
  }

  /**
   * Build the Aho-Corasick automaton
   */
  private buildAutomaton(): void {
    this.buildTrie();
    this.buildFailureLinks();
    this.buildOutputLinks();
    this.compiled = true;
  }

  /**
   * Build the trie structure
   */
  private buildTrie(): void {
    this.root = this.createNode();

    for (let i = 0; i < this.patterns.length; i++) {
      const pattern = this.patterns[i];
      let current = this.root;

      for (const char of pattern) {
        if (!current.children.has(char)) {
          current.children.set(char, this.createNode());
        }
        current = current.children.get(char)!;
      }

      current.isEndOfPattern = true;
      current.output.push(pattern);
      current.outputIndices.push(i);
    }
  }

  /**
   * Build failure links using BFS
   */
  private buildFailureLinks(): void {
    const queue: TrieNode[] = [];

    // Initialize failure links for depth 1 nodes
    for (const child of this.root.children.values()) {
      child.failure = this.root;
      queue.push(child);
    }

    // Build failure links for deeper nodes
    while (queue.length > 0) {
      const current = queue.shift()!;

      for (const [char, child] of current.children) {
        queue.push(child);

        let failure = current.failure;
        while (failure !== null && !failure.children.has(char)) {
          failure = failure.failure;
        }

        child.failure = failure ? failure.children.get(char)! : this.root;
      }
    }
  }

  /**
   * Build output links for failure transitions
   */
  private buildOutputLinks(): void {
    const queue: TrieNode[] = [];

    for (const child of this.root.children.values()) {
      queue.push(child);
    }

    while (queue.length > 0) {
      const current = queue.shift()!;

      // Add failure node outputs to current node
      if (current.failure && current.failure.output.length > 0) {
        current.output.push(...current.failure.output);
        current.outputIndices.push(...current.failure.outputIndices);
      }

      for (const child of current.children.values()) {
        queue.push(child);
      }
    }
  }

  /**
   * Find all pattern matches in the given text
   */
  findAll(text: string): Match[] {
    if (!this.compiled) {
      this.buildAutomaton();
    }

    const matches: Match[] = [];
    let current = this.root;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      // Follow failure links until we find a transition or reach root
      while (current !== this.root && !current.children.has(char)) {
        current = current.failure!;
      }

      // Transition to next state if possible
      if (current.children.has(char)) {
        current = current.children.get(char)!;
      }

      // Report all patterns that end at this position
      for (let j = 0; j < current.output.length; j++) {
        const pattern = current.output[j];
        const patternIndex = current.outputIndices[j];
        const start = i - pattern.length + 1;

        matches.push({
          pattern,
          start,
          end: i + 1,
          patternIndex,
        });
      }
    }

    return matches;
  }

  /**
   * Check if text contains any patterns
   */
  hasMatch(text: string): boolean {
    if (!this.compiled) {
      this.buildAutomaton();
    }

    let current = this.root;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      while (current !== this.root && !current.children.has(char)) {
        current = current.failure!;
      }

      if (current.children.has(char)) {
        current = current.children.get(char)!;
      }

      if (current.output.length > 0) {
        return true;
      }
    }

    return false;
  }

  /**
   * Find first match in text
   */
  findFirst(text: string): Match | null {
    if (!this.compiled) {
      this.buildAutomaton();
    }

    let current = this.root;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      while (current !== this.root && !current.children.has(char)) {
        current = current.failure!;
      }

      if (current.children.has(char)) {
        current = current.children.get(char)!;
      }

      if (current.output.length > 0) {
        const pattern = current.output[0];
        const patternIndex = current.outputIndices[0];
        const start = i - pattern.length + 1;

        return {
          pattern,
          start,
          end: i + 1,
          patternIndex,
        };
      }
    }

    return null;
  }

  /**
   * Get the patterns stored in this automaton
   */
  getPatterns(): string[] {
    return [...this.patterns];
  }

  /**
   * Clear all patterns and reset the automaton
   */
  clear(): void {
    this.patterns = [];
    this.root = this.createNode();
    this.compiled = false;
  }

  /**
   * Get statistics about the automaton
   */
  getStats(): {
    patternCount: number;
    nodeCount: number;
    averagePatternLength: number;
  } {
    const nodeCount = this.countNodes(this.root);
    const averagePatternLength =
      this.patterns.length > 0
        ? this.patterns.reduce((sum, p) => sum + p.length, 0) /
          this.patterns.length
        : 0;

    return {
      patternCount: this.patterns.length,
      nodeCount,
      averagePatternLength,
    };
  }

  /**
   * Count total nodes in the trie
   */
  private countNodes(node: TrieNode): number {
    let count = 1;
    for (const child of node.children.values()) {
      count += this.countNodes(child);
    }
    return count;
  }
}
