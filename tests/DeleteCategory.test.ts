import { CreateCategory } from "application/useCases/CreateCategory"
import { DeleteCategory } from "application/useCases/DeleteCategory"
import assert from "assert"
import { CategoryNotFound } from "domain/errors/CategoryNotFound"
import { CategoryRepositoryMemory } from "infra/repositories/memory/CategoryRepositoryMemory"
import { Identifier } from "infra/security/Identifier"
import { Storage } from "infra/storage/Storage"

describe("Delete Category",async ()=>{
    const identifier:Identifier={
        createId(){
            return "1"
        }
    }

    const categoryRepository=new CategoryRepositoryMemory()
    const createCategory=new CreateCategory(identifier,categoryRepository)
    const category=await createCategory.execute('any','any')
    const storage:Omit<Storage,"middleware">={
        async deleteFile(){}
    }

    it("should delete category",async ()=>{
        const deleteCategory=new DeleteCategory(categoryRepository,storage);
        await deleteCategory.execute(category.id)

        const categoryDeleted=await categoryRepository.findById(category.id)
        assert.deepEqual(categoryDeleted,null)
    })
    
    it("throw error when not found category by id",async ()=>{
        await assert.rejects(async ()=>{
            const deleteCategory=new DeleteCategory(categoryRepository,storage);
            await deleteCategory.execute("any")
        },new CategoryNotFound())
    })
    
})