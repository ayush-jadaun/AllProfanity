/**
 * Bloom Filter implementation for efficient set membership testing
 */

export class BloomFilter {
  private bitArray: Uint8Array;
  private size: number;
  private hashCount: number;
  private itemCount: number = 0;

  constructor(expectedItems: number, falsePositiveRate: number = 0.01) {
    // Calculate optimal size and hash count
    this.size = this.calculateOptimalSize(expectedItems, falsePositiveRate);
    this.hashCount = this.calculateOptimalHashCount(this.size, expectedItems);
    this.bitArray = new Uint8Array(Math.ceil(this.size / 8));
  }

  /**
   * Calculate optimal bit array size
   */
  private calculateOptimalSize(n: number, p: number): number {
    return Math.ceil((-n * Math.log(p)) / Math.log(2) ** 2);
  }

  /**
   * Calculate optimal number of hash functions
   */
  private calculateOptimalHashCount(m: number, n: number): number {
    return Math.ceil((m / n) * Math.log(2));
  }

  /**
   * Hash function 1 (FNV-1a variant)
   */
  private hash1(item: string): number {
    let hash = 2166136261;
    for (let i = 0; i < item.length; i++) {
      hash ^= item.charCodeAt(i);
      hash *= 16777619;
    }
    return Math.abs(hash) % this.size;
  }

  /**
   * Hash function 2 (djb2 variant)
   */
  private hash2(item: string): number {
    let hash = 5381;
    for (let i = 0; i < item.length; i++) {
      hash = (hash << 5) + hash + item.charCodeAt(i);
    }
    return Math.abs(hash) % this.size;
  }

  /**
   * Generate k hash values for an item using double hashing
   */
  private getHashes(item: string): number[] {
    const hash1 = this.hash1(item);
    const hash2 = this.hash2(item);
    const hashes: number[] = [];

    for (let i = 0; i < this.hashCount; i++) {
      const hash = (hash1 + i * hash2) % this.size;
      hashes.push(Math.abs(hash));
    }

    return hashes;
  }

  /**
   * Set a bit in the bit array
   */
  private setBit(index: number): void {
    const byteIndex = Math.floor(index / 8);
    const bitIndex = index % 8;
    this.bitArray[byteIndex] |= 1 << bitIndex;
  }

  /**
   * Get a bit from the bit array
   */
  private getBit(index: number): boolean {
    const byteIndex = Math.floor(index / 8);
    const bitIndex = index % 8;
    return (this.bitArray[byteIndex] & (1 << bitIndex)) !== 0;
  }

  /**
   * Add an item to the bloom filter
   */
  add(item: string): void {
    const hashes = this.getHashes(item);
    for (const hash of hashes) {
      this.setBit(hash);
    }
    this.itemCount++;
  }

  /**
   * Add multiple items to the bloom filter
   */
  addAll(items: string[]): void {
    for (const item of items) {
      this.add(item);
    }
  }

  /**
   * Test if an item might be in the set
   */
  mightContain(item: string): boolean {
    const hashes = this.getHashes(item);
    for (const hash of hashes) {
      if (!this.getBit(hash)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Test multiple items at once
   */
  mightContainAny(items: string[]): boolean {
    return items.some((item) => this.mightContain(item));
  }

  /**
   * Filter items that might be in the set
   */
  filter(items: string[]): string[] {
    return items.filter((item) => this.mightContain(item));
  }

  /**
   * Clear the bloom filter
   */
  clear(): void {
    this.bitArray.fill(0);
    this.itemCount = 0;
  }

  /**
   * Get current false positive probability
   */
  getCurrentFalsePositiveRate(): number {
    const ratio = this.itemCount / this.size;
    return Math.pow(1 - Math.exp(-this.hashCount * ratio), this.hashCount);
  }

  /**
   * Get bloom filter statistics
   */
  getStats(): {
    size: number;
    hashCount: number;
    itemCount: number;
    bitsSet: number;
    loadFactor: number;
    estimatedFalsePositiveRate: number;
  } {
    let bitsSet = 0;
    for (let i = 0; i < this.size; i++) {
      if (this.getBit(i)) {
        bitsSet++;
      }
    }

    const loadFactor = bitsSet / this.size;
    const estimatedFalsePositiveRate = Math.pow(loadFactor, this.hashCount);

    return {
      size: this.size,
      hashCount: this.hashCount,
      itemCount: this.itemCount,
      bitsSet,
      loadFactor,
      estimatedFalsePositiveRate,
    };
  }

  /**
   * Serialize bloom filter to JSON
   */
  toJSON(): {
    size: number;
    hashCount: number;
    itemCount: number;
    bitArray: number[];
  } {
    return {
      size: this.size,
      hashCount: this.hashCount,
      itemCount: this.itemCount,
      bitArray: Array.from(this.bitArray),
    };
  }

  /**
   * Deserialize bloom filter from JSON
   */
  static fromJSON(data: {
    size: number;
    hashCount: number;
    itemCount: number;
    bitArray: number[];
  }): BloomFilter {
    const filter = Object.create(BloomFilter.prototype);
    filter.size = data.size;
    filter.hashCount = data.hashCount;
    filter.itemCount = data.itemCount;
    filter.bitArray = new Uint8Array(data.bitArray);
    return filter;
  }

  /**
   * Union operation with another bloom filter
   */
  union(other: BloomFilter): BloomFilter {
    if (this.size !== other.size || this.hashCount !== other.hashCount) {
      throw new Error(
        "Bloom filters must have same size and hash count for union operation"
      );
    }

    const result = new BloomFilter(1, 0.01);
    result.size = this.size;
    result.hashCount = this.hashCount;
    result.bitArray = new Uint8Array(this.bitArray.length);
    result.itemCount = this.itemCount + other.itemCount;

    for (let i = 0; i < this.bitArray.length; i++) {
      result.bitArray[i] = this.bitArray[i] | other.bitArray[i];
    }

    return result;
  }

  /**
   * Intersection operation with another bloom filter
   */
  intersect(other: BloomFilter): BloomFilter {
    if (this.size !== other.size || this.hashCount !== other.hashCount) {
      throw new Error(
        "Bloom filters must have same size and hash count for intersection operation"
      );
    }

    const result = new BloomFilter(1, 0.01);
    result.size = this.size;
    result.hashCount = this.hashCount;
    result.bitArray = new Uint8Array(this.bitArray.length);
    result.itemCount = Math.min(this.itemCount, other.itemCount);

    for (let i = 0; i < this.bitArray.length; i++) {
      result.bitArray[i] = this.bitArray[i] & other.bitArray[i];
    }

    return result;
  }
}
