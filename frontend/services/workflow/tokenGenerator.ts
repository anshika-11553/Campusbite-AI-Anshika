class TokenGeneratorService {
  private activeTokens: Set<number> = new Set([27, 84, 10]); // Initial demo active tokens
  private lastAllocatedToken = 27;

  /**
   * Generates a unique two-digit token number (01-99).
   * Prevents duplicate active tokens and recycles numbers after collection/cancellation.
   */
  generateNextToken(): string {
    let candidate = (this.lastAllocatedToken % 99) + 1;
    let attempts = 0;

    while (this.activeTokens.has(candidate) && attempts < 99) {
      candidate = (candidate % 99) + 1;
      attempts++;
    }

    this.activeTokens.add(candidate);
    this.lastAllocatedToken = candidate;

    return candidate.toString().padStart(2, '0');
  }

  /**
   * Recycles a token number back into the available pool after order completion/cancellation.
   */
  releaseToken(tokenString: string): void {
    const tokenNum = parseInt(tokenString, 10);
    if (!isNaN(tokenNum)) {
      this.activeTokens.delete(tokenNum);
    }
  }

  getActiveTokens(): string[] {
    return Array.from(this.activeTokens).map((t) => t.toString().padStart(2, '0'));
  }
}

export const tokenGeneratorService = new TokenGeneratorService();
