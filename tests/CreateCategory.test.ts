import { CreateCategory } from "application/useCases/CreateCategory"
import assert from "assert"
import { CategoryRepositoryMemory } from "infra/repositories/memory/CategoryRepositoryMemory"
import { Identifier } from "infra/security/Identifier"


describe("Create New Category",()=>{
    const identifier:Identifier={
        createId(){
            return "1"
        }
    }

    it("should create new category",async ()=>{
        const categoryRepository=new CategoryRepositoryMemory()
        const createCategory=new CreateCategory(identifier,categoryRepository)
        const category=await createCategory.execute({
            id:identifier.createId(),
            name:'any',
            icon:'any'
        })
        
        assert.deepEqual(category.id,'1')
        assert.deepEqual(category.name,'any')
        assert.deepEqual(category.icon,'any')
    })
    
})