export interface Encrypt {
    compare(password: string, encripted: string): Promise<boolean>;
    encript(password: string): string;
  }
  