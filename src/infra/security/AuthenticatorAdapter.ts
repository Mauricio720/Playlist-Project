import { Authenticator } from "./Authenticator";

export class AuthenticatorAdapter implements Authenticator{
    createToken(payload: any){
        return 'any'
    }
    
    decoder(token: string){}
}