import { Encrypt } from "infra/security/Encrypt";
import { Identifier } from "infra/security/Identifier";
import { UserRepository } from "application/repositories/UserRepository";
import { User } from "domain/entities/User";
import { Authenticator } from "infra/security/Authenticator";

export class CreateUser{
    constructor(
        private readonly identifier:Identifier, 
        private readonly encrypt:Encrypt,
        private readonly autenticator: Authenticator,
        private readonly userRepository:UserRepository
    ){}

    async execute(data:Omit<User.Props,'id'>){
        const newId=this.identifier.createId()
        const password=this.encrypt.encript(data.password)

        const user=new User({...data,id:newId,password,dateRegister:new Date()})

        await this.userRepository.create(user)
        
        const token=this.autenticator.createToken({id:user.id,email:user.email})
        
        return {user,token};
    }
}