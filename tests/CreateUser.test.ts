import { Identifier } from "infra/security/Identifier";
import { Encrypt } from "infra/security/Encrypt";
import { CreateUser } from "application/useCases/CreateUser";
import assert from "assert";
import { UserRepositoryMemory } from "infra/repositories/memory/UserRepositoryMemory";

describe("Create User", () => {
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
    
    it("should create user",async ()=>{
        const createUser=new CreateUser(identifier,encrypt,userRepository)
        const user=await createUser.execute({
            name:"any",
            email: "any@any.com",
            password: "any",
            favoriteCategory: [
                { id: "any", name: "rock" },
                { id: "any", name: "rap" },
              ],
            favoriteArtist: [{ id: "any", name: "any" }],
        })

        assert.deepEqual(user.id,'1')
        assert.deepEqual(user.password,'any_enc')
        assert.deepEqual(user.dateRegister.toDateString(),new Date().toDateString())

    })
});
