import { NotAuthorized } from "domain/errors/NotAuthorized";
import { Strategy } from "infra/security/Strategy";
import passport from "passport";
import { Middleware, NextFunction, Request, Response } from "./Middleware";

export class PassportMidleware implements Middleware{
    constructor(private readonly strategy:Strategy){}
    
    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
      const allowsRoute = [
        "/auth",
        "/user",
      ];
      
      if (allowsRoute.some((route) => req.url.includes(route))) return next();
      await this.strategy.execute()
      
      passport.authenticate('jwt',(err,user)=>{
        if(!user){
            res.status(401).send({error:'Not Authorized'})
        }
        next()
      })(req,res,next)
    }
}