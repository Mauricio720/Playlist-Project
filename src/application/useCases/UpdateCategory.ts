import { CategogyRepository } from "application/repositories/CategoryRepository";
import { Category } from "domain/entities/Category";
import { Storage } from "infra/storage/Storage";

export class UpdateCategory{
    constructor(
        private readonly categoryRepository:CategogyRepository,
        private readonly storage:Omit<Storage,"middleware">
    ){}

    async execute(id:string,name:string, file?:string):Promise<Category>{
        const category=await this.categoryRepository.findById(id)
        
        if(file !== undefined){
            this.deleteOldIcon(category)
        }
        
        category.update({name,icon:file})
        
        await this.categoryRepository.update(category)
        
        return category;
    }

    private deleteOldIcon(category){
        this.storage.deleteFile(category.icon)
    }
}