import { User } from "domain/entities/User";

export interface Strategy {
  execute(...params: any): Promise<void>;
  getAuthenticateUser(): Promise<User>;
}
