import { Identifier } from "infra/security/Identifier";
import { Encrypt } from "infra/security/Encrypt";
import { CreateUser } from "application/useCases/CreateUser";
import assert from "assert";
import { UserRepositoryMemory } from "infra/repositories/memory/UserRepositoryMemory";
import { Authenticator } from 'infra/security/Authenticator'
import { AuthUser } from "application/useCases/AuthUser";
import { AuthInvalid } from "domain/errors/AuthInvalid";

describe('Auth User',async ()=>{
    const userRepository=new UserRepositoryMemory()
    
    const identifier:Identifier={
        createId(){
            return "1"
        }
    }
    
    const encrypt: Encrypt = {
        compare(password, encripted) {
          return `${password}_enc` === encripted;
        },
        encript(password) {
          return `${password}_enc`;
        },
    };

    const authenticador: Authenticator = {
        createToken() {
            return "any token";
        },
        decoder() {},
    };

    const createUser=new CreateUser(identifier,encrypt,authenticador,userRepository)
    await createUser.execute({
        name:"any",
        email: "any@any.com",
        password: "any",
        favoriteCategory: [
            { id: "any", name: "rock" },
            { id: "any", name: "rap" },
          ],
        favoriteArtist: [{ id: "any", name: "any" }],
    })

    const authUser=new AuthUser(authenticador,encrypt,userRepository)
    
    it('should authenticate user',async ()=>{
        const {token}=await authUser.execute({email:'any@any.com',password:'any'})
        assert.deepEqual(token, "any token"); 
    });

    it('should throws an error when email is not found',async ()=>{
        await assert.rejects(
            async () => await authUser.execute({email:'any@error.com',password:'any'}),
            new AuthInvalid()
        );
    })

    it("should throw an exception when password is invalid", async () => {
        await assert.rejects(
          async () => await authUser.execute({email:"any@any.com", password:"abc"}),
          new AuthInvalid()
        );
    });

    
})