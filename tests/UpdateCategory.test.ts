import { CreateCategory } from "application/useCases/CreateCategory"
import { UpdateCategory } from "application/useCases/UpdateCategory"
import assert from "assert"
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
    const storage:Omit<Storage,"middleware">={
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
})