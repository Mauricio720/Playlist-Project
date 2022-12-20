import { Handler } from "./Http";

export interface Server {
  static(path: string): void;
  listen(port: number, callback: () => void): void;
  registerMiddleware(handler: Handler): void;
  get(route: string, ...handler: Handler[]): void;
  post(route: string, ...handler: Handler[]): void;
  put(route: string, ...handler: Handler[]): void;
  delete(route: string, ...handler: Handler[]): void;
}
