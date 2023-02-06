import { User } from "domain/entities/User";
import { Strategy } from "./Strategy";

export class Auth {
  static strategy: Strategy;

  constructor(private readonly strategy: Strategy) {
    Auth.strategy = this.strategy;
  }

  static async getAutenticateUser() {
    return await Auth.strategy.getAuthenticateUser();
  }
}
