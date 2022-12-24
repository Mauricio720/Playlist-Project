export interface Authenticator {
    createToken(payload: any): string;
    decoder(token: string): unknown;
  }
  