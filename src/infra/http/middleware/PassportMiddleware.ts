import { Strategy } from "infra/security/Strategy";
import passport from "passport";
import { Middleware, NextFunction, Request, Response } from "./Middleware";

export class PassportMidleware implements Middleware {
  constructor(private readonly strategy: Strategy) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (this.allowsRoutes(req)) {
      return next();
    }
    await this.strategy.execute();

    passport.authenticate("jwt", (err, user) => {
      if (!user) {
        return res.status(401).json("Not Authorized").end();
      }
      return next();
    })(req, res, next);
  }

  private allowsRoutes(req: Request) {
    const allowsRoute = [
      { route: "/auth", method: "POST" },
      { route: "/user", method: "POST" },
    ];

    let isAllows = false;

    if (
      allowsRoute.find(
        (allowsRoute) =>
          allowsRoute.route === req.url && req.method === allowsRoute.method
      )
    ) {
      isAllows = true;
    }

    return isAllows;
  }
}
