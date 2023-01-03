import { Server } from "./Server";
import express, { Express } from "express";
import { Handler} from "./Http";

export class ExpressServer implements Server {
  private server: Express = express();

  constructor() {
    this.server.use(express.json({limit:"50mb"}));
  }

  registerMiddleware(handler: Handler): void {
    this.server.use(handler);
  }

  static(path: string): void {
    this.server.use(express.static(path));
  }

  listen(port: number, callback: () => void): void {
    this.server.listen(port, callback);
  }

  get(route: string, ...handler: Handler[]): void {
    this.server.get(route, ...handler);
  }

  post(route: string, ...handlers: Handler[]): void {
    this.server.post(route, ...handlers);
  }

  put(route: string, ...handler: Handler[]): void {
    this.server.put(route, ...handler);
  }

  delete(route: string, ...handler: Handler[]): void {
    this.server.delete(route, ...handler);
  }
}
