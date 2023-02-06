import { Auth } from "infra/security/Auth";
import { Strategy } from "infra/security/Strategy";
import { Middleware, NextFunction, Request, Response } from "./Middleware";

export class AuthMidleware implements Middleware {
  constructor(private readonly strategy: Strategy) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    new Auth(this.strategy);
    next();
  }
}
