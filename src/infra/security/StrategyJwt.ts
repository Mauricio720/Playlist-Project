import { UserRepository } from "application/repositories/UserRepository";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { Strategy } from "./Strategy";
import * as dotenv from "dotenv";
import passport from "passport";
import { NotAuthorized } from "domain/errors/NotAuthorized";

export class StrategyJwt implements Strategy{
    constructor(
        private readonly userRepository:UserRepository,
    ){}
    
    async execute() {
        dotenv.config();

        const options={
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:process.env.JWT_SECRET_KEY as string
        }
        
        passport.use(new JWTStrategy(options,async (payload,done)=>{
            const user=await this.userRepository.findById(payload.id)
            
            if(user){
                return done(null,user)
            }

            return done(null,false);
        }));

        passport.serializeUser(function (user, done) {
            done(null, user);
        })
    }

    
}