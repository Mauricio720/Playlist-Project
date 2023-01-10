import { CategogyRepository } from "application/repositories/CategoryRepository";
import { CategoryNotFound } from "domain/errors/CategoryNotFound";
import { Storage } from "infra/storage/Storage";

export class DeleteCategory{
    constructor(
        private readonly categoryRepository:CategogyRepository,
        private readonly storage:Partial<Storage>
    ){}
    
    async execute(id:string){
        const category=await this.categoryRepository.findById(id)
        if(category===null){
            throw new CategoryNotFound();
        }
        this.storage.deleteFile(category.icon)
        await this.categoryRepository.delete(id)
    }
}