import { User } from "domain/entities/User";

export interface UserRepository{
    list:()=>Promise<User[]>
    createUser:(data:User)=>Promise<User>
    updateUser:(data:User)=>Promise<User>
    deleteUser:(id:string)=>void
    findById:(id:string)=>Promise<User>
}