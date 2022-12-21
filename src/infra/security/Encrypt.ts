export interface Encrypt {
    compare(password: string, encripted: string): boolean;
    encript(password: string): string;
  }
  