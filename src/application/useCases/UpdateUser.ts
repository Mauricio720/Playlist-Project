import { UserRepository } from "application/repositories/UserRepository";
import { User } from "domain/entities/User";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { UserExists } from "domain/errors/UserExists";
import { Encrypt } from "infra/security/Encrypt";

export class UpdateUser{
    constructor(
        private readonly userRepository:UserRepository,
        private readonly encrypt:Encrypt,
    ){}

    async execute(data:Partial<User.Props>):Promise<User>{
        const user=await this.userRepository.findById(data.id)
        
        if(!user){
            throw new ObjectNotFound("User")
        }

       if(await this.verifyUserExists(user) === true){
            throw new UserExists()
       }

        if(data.password !== undefined){
            data.password=this.encrypt.encript(data.password)
        }

        user.update(data)
        await this.userRepository.update(user)
        
        return user;
    }

    private async verifyUserExists(user:User){
        const userAlreadyExist=await this.userRepository.findByEmail(user.email)
        return (userAlreadyExist && user.id !== userAlreadyExist.id)
    }
}