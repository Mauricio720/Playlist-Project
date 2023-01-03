import { CreateSong } from "application/useCases/CreateSong"
import assert from "assert"
import { Song } from "domain/entities/Song"
import { SongRepositoryMemory } from "infra/repositories/memory/SongRepositoryMemory"
import { Identifier } from "infra/security/Identifier"

describe("Create Song",()=>{
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
        dateRegister:new Date(),
        user:{
            id:"any",
            name:"any",
            email:"any@any.com",
        }
    }

    const songRepository=new SongRepositoryMemory()

    it("should create new song",async ()=>{
        const createSong=new CreateSong(songRepository,identifier)
        const song=await createSong.execute(INITIAL_VALUE)
        
        assert.deepEqual(song.id,"1")
        assert.deepEqual(song.title,"any")
        assert.deepEqual(song.category.id,"any")
        assert.deepEqual(song.category.name,"any")
        assert.deepEqual(song.duration,1)
        assert.deepEqual(song.pathSongFile,"any")
        assert.deepEqual(song.artist.id,"any")
        assert.deepEqual(song.artist.name,"any")
        assert.deepEqual(song.artist.picture,"any")
        assert.deepEqual(
            new Date(song.dateRegister).toDateString(),
            new Date().toDateString()
        );
        assert.deepEqual(song.album.id,"any")
        assert.deepEqual(song.album.name,"any")
        assert.deepEqual(song.album.year,"any")
        assert.deepEqual(song.album.cover,"any")
        assert.deepEqual(song.album.cover,"any")
        assert.deepEqual(song.album.artist.id,"any")
        assert.deepEqual(song.album.artist.name,"any")
        assert.deepEqual(song.album.artist.picture,"any")
        assert.deepEqual(song.user.id,"any")
        assert.deepEqual(song.user.name,"any")
        assert.deepEqual(song.user.email,"any@any.com")
    })
})