import { CreateCategory } from "application/useCases/CreateCategory"
import { UpdateCategory } from "application/useCases/UpdateCategory"
import assert from "assert"
import { CategoryNotFound } from "domain/errors/CategoryNotFound"
import { CategoryRepositoryMemory } from "infra/repositories/memory/CategoryRepositoryMemory"
import { Identifier } from "infra/security/Identifier"
import { Storage } from "infra/storage/Storage"

describe("Update Category",async ()=>{
    const identifier:Identifier={
        createId(){
            return "1"
        }
    }

    const categoryRepository=new CategoryRepositoryMemory()
    const storage:Partial<Storage>={
        async deleteFile(){}
    }
    const createCategory=new CreateCategory(identifier,categoryRepository)
    const category=await createCategory.execute('any','any')

    it("should update category",async ()=>{
        const updateCategory=new UpdateCategory(categoryRepository,storage)
        const categoryEdit=await updateCategory.execute(category.id,"anyEdit","anyEdit")
        
        assert(categoryEdit.name,"anyEdit")
        assert(categoryEdit.icon,"anyEdit")
    
    })

    it("throw error when not found category by id",async ()=>{
        await assert.rejects(async ()=>{
            const updateCategory=new UpdateCategory(categoryRepository,storage)
            await updateCategory.execute('any',"anyEdit","anyEdit")
        },new CategoryNotFound())
    })
})