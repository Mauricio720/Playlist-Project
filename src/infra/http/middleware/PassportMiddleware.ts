import { Strategy } from "infra/security/Strategy";
import passport from "passport";
import { Middleware, NextFunction, Request, Response } from "./Middleware";

export class PassportMidleware implements Middleware{
    constructor(private readonly strategy:Strategy){}
    
    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
      const allowsRoute = [
        "/auth",
        "/user",
        "/album"
      ];
      
      if (allowsRoute.some((route) => req.url.includes(route))) return next();
      await this.strategy.execute()
      
      passport.authenticate('jwt',(err,user)=>{
        if(!user){
            return res.status(401).json("Not Authorized").end()
        }
        return next()
      })(req,res,next)
    }
}
