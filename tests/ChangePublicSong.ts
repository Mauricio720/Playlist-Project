import { ChangePublicSong } from "application/useCases/ChangePublicSong"
import { CreateSong } from "application/useCases/CreateSong"
import assert from "assert"
import { Song } from "domain/entities/Song"
import { SongRepositoryMemory } from "infra/repositories/memory/SongRepositoryMemory"
import { Identifier } from "infra/security/Identifier"

describe("Change Public Song",async ()=>{
    const identifier:Identifier={
        createId(){
            return "1"
        }
    }

    const INITIAL_VALUE:Song.Props={
        id:identifier.createId(),
        title:"any",
        category:{
            id:"any",
            name:"any"
        },
        duration:1.0,
        pathSongFile:"any",
        artist:{
            id:"any",
            name:"any",
            picture:"any"
        },
        album:{
            id:"any",
            name:"any",
            year:"any",
            cover:"any",
            artist:{
                id:"any",
                name:"any",
                picture:"any"
            }
        },
        user:{
            id:"any",
            name:"any",
            email:"any@any.com",
        }
    }

    const songRepository=new SongRepositoryMemory()
    const createSong=new CreateSong(songRepository,identifier)
    const songCreated=await createSong.execute(INITIAL_VALUE,"any");

    it("should change public song",async ()=>{
        const changePublicSong=new ChangePublicSong(songRepository)
        await changePublicSong.execute(songCreated.id);

        const songFinded=await songRepository.findById(songCreated.id)
        assert.deepEqual(songFinded.public,true)

        await changePublicSong.execute(songCreated.id);
        assert.deepEqual(songFinded.public,false)
    })
})