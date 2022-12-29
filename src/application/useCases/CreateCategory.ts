import { CategogyRepository } from "application/repositories/CategoryRepository";
import { Category } from "domain/entities/Category";
import { Identifier } from "infra/security/Identifier";

export class CreateCategory{
    constructor(
        private readonly identifier:Identifier,
        private readonly categoryRepository:CategogyRepository
    ){}

    async execute(data:Category):Promise<Category>{
        const category=new Category({...data,id:this.identifier.createId()})
        
        await this.categoryRepository.create(category)
        
        return category;
    }
}

