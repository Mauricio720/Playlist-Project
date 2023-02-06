import { GateAdapter } from "infra/security/GateAdapter";
import { Strategy } from "infra/security/Strategy";
import { Middleware, NextFunction, Request, Response } from "./Middleware";

export class GatesJwtMidleware implements Middleware {
  constructor(private readonly strategy: Strategy) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    new GateAdapter(this.strategy);

    GateAdapter.registerGate("JUST_ADM", async (user) => {
      return user.permission === "Adm";
    });

    GateAdapter.registerGate("JUST_ARTIST", async (user) => {
      return user.permission === "Artist";
    });

    GateAdapter.registerGate("JUST_NORMAL", async (user) => {
      return user.permission === "Normal";
    });

    next();
  }
}
