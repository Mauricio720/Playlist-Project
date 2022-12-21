import { Server } from "./Server";
import express, { Express } from "express";
import { Handler, Method } from "./Http";

export class ExpressServer implements Server {
  private app: Express = express();

  constructor() {
    this.app.use(express.json());
  }

  registerMiddleware(handler: Handler): void {
    this.app.use(handler);
  }

  static(path: string): void {
    this.app.use(express.static(path));
  }

  listen(port: number, callback: () => void): void {
    this.app.listen(port, callback);
  }

  get(route: string, ...handler: Handler[]): void {
    this.app.get(route, ...handler);
  }

  post(method:Method,route: string, ...handler: Handler[]): void {
    this.app.post(method,route, ...handler);
  }

  put(route: string, ...handler: Handler[]): void {
    this.app.put(route, ...handler);
  }

  delete(route: string, ...handler: Handler[]): void {
    this.app.delete(route, ...handler);
  }
}
