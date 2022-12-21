export interface Authenticator {
    createToken(payload: unknown): string;
    decoder(token: string): unknown;
  }
  