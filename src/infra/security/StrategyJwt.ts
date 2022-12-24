import { UserRepository } from "application/repositories/UserRepository";
import { OptionsStrategy, Strategy, StrategyCallback } from "./Strategy";

export class StrategyJwt implements Strategy{
    constructor(private readonly userRepository:UserRepository){}
    
    async execute(): Promise<void> {
        
    }
}