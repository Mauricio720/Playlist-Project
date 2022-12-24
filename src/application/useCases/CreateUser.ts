import { Encrypt } from "infra/security/Encrypt";
import { Identifier } from "infra/security/Identifier";
import { UserRepository } from "application/repositories/UserRepository";
import { User } from "domain/entities/User";

export class CreateUser{
    constructor(
        private readonly identifier:Identifier, 
        private readonly encrypt:Encrypt,
        private readonly userRepository:UserRepository
    ){}

    async execute(data:Omit<User.Props,'id'>):Promise<User>{
        const newId=this.identifier.createId()
        const password=this.encrypt.encript(data.password)

        const user=new User({...data,id:newId,password,dateRegister:new Date()})

        await this.userRepository.create(user)
        
        return user;
    }
}