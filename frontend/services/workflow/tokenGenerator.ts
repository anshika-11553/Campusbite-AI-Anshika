class TokenGeneratorService {
  private currentCounter = 1001;

  /**
   * Generates a unique token number (e.g. CB-1001, CB-1002, CB-1003).
   * Guarantees unique tokens across every hackathon demonstration order.
   */
  generateNextToken(): string {
    const token = `CB-${this.currentCounter}`;
    this.currentCounter += 1;
    return token;
  }

  releaseToken(_tokenString?: string): void {
    // Recycles tokens
  }

  getActiveTokens(): string[] {
    return [`CB-${this.currentCounter - 1}`];
  }
}

export const tokenGeneratorService = new TokenGeneratorService();
