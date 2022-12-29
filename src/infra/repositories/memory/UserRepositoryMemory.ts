import { UserRepository } from "application/repositories/UserRepository";
import { User } from "domain/entities/User";

export class UserRepositoryMemory implements UserRepository{
    private users:User[]=[]
    
    async list():Promise<User[]>{
        return this.users.filter(userItem=>userItem.active)
    }
    
    async create(user: User):Promise<User>{
        this.users.push(user)
        return user;
    }

    async update(user: User):Promise<User>{
        const filterUsers=this.users.filter((userItem)=>userItem.id!==user.id)
        filterUsers.push(user)
        this.users=filterUsers;
        return user;
    }

    async delete(id:string){
        return this.users.find((user) => user.id === id).active=false 
    }

    async findById(id: string):Promise<User | null>{
        return this.users.find((user) => user.id === id) || null;
    }

    async findByEmail(email: string):Promise<User | null>{
        return this.users.find((user) => user.email === email) || null;
    }

}