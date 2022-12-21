import { UserRepository } from "application/repositories/UserRepository";
import { User } from "domain/entities/User";

export class UserRepositoryMemory implements UserRepository{
    private users:User[]=[]
    
    async list():Promise<User[]>{
        return this.users
    }
    
    async createUser(user: User):Promise<User>{
        this.users.push(user)
        return user;
    }

    async updateUser(user: User):Promise<User>{
        const filterUsers=this.users.filter((userItem)=>userItem.id!==user.id)
        filterUsers.push(user)
        this.users=filterUsers;
        return user;
    }

    async deleteUser(id:string){
        const filterUsers=this.users.filter((userItem)=>userItem.id!==id)
        this.users=filterUsers;
    }

    async findById(id: string):Promise<User>{
        const index=this.users.findIndex((userItem)=>userItem.id===id)
        return this.users[index]
    }
}