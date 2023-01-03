import { CategogyRepository } from "application/repositories/CategoryRepository";
import { Category } from "domain/entities/Category";

export class CategoryRepositoryMemory implements CategogyRepository{
    private categories:Category[]=[];
    
    async list():Promise<Category[]>{
        return this.categories; 
    }
    
    async create(category: Category): Promise<Category> {
        this.categories.push(category)
        return category;
    }

    async update(category: Category): Promise<Category> {
        const filterCategories=this.categories.filter((categoryItem)=>categoryItem.id!==categoryItem.id)
        filterCategories.push(category)
        this.categories=filterCategories;
        return category;
    }

    async delete(id: string): Promise<void> {
        const filterCategories=this.categories.filter((categoryItem)=>categoryItem.id!==id)
        this.categories=filterCategories;
    }

    async findById(id: string):Promise<Category | null>{
        return this.categories.find((category) => category.id === id) || null;
    }

}