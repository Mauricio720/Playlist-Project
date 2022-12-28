import { Server } from "infra/http/Server";
import { UserRepository } from "application/repositories/UserRepository";
import { Authenticator } from "infra/security/Authenticator";
import { AuthUser, AuthUserProps } from "application/useCases/AuthUser";
import { Encrypt } from "infra/security/Encrypt";

export class AuthController{
    constructor(
        private readonly server:Server,
        private readonly userRepository:UserRepository,
        private readonly autenticator:Authenticator,
        private readonly encrypt:Encrypt,
    ){
        this.server.post("/auth",async (req,res)=>{
            try {
                const authUser=new AuthUser(this.autenticator,this.encrypt,this.userRepository)
                const data=await authUser.execute(req.body as AuthUserProps)
                res.status(200).json({ token: data.token, user: data.user });
            } catch (error) {
                res.status(401).json(error);
            }
        })
    }
}