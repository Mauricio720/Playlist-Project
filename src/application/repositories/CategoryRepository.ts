import { Category } from "domain/entities/Category";

export interface CategogyRepository{
    list():Promise<Category[]>;
    create(category:Category):Promise<Category>;
    update(category:Category):Promise<Category>;
    delete(id:string):Promise<void>;
}

