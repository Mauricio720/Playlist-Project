import { UserRepository } from "application/repositories/UserRepository";
import { Middleware, NextFunction, Request, Response } from "./Middleware";

export class PassportMidleware implements Middleware{
    
    constructor(private readonly userRepository:UserRepository,strategy:){}
    
    handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    return '';
    }
}