import { UserRepository } from "application/repositories/UserRepository";
import { User } from "domain/entities/User";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";

export class DeleteUser{
    constructor(private readonly userRepository:UserRepository){}

    async execute(id:string):Promise<User>{
        const user=await this.userRepository.findById(id);
        if(!user){
            throw new ObjectNotFound("User")
        }
        
        user.delete()
        return await this.userRepository.delete(user.id)
    }
}