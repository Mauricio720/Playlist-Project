import "dotenv/config";
import { CreateAlbum } from "application/useCases/CreateAlbum";
import assert from "assert";
import { Album } from "domain/entities/Album";
import { AlbumRepositoryMemory } from "infra/repositories/memory/AlbumRepositoryMemory";
import { ArtistRepositoryMemory } from "infra/repositories/memory/ArtistRepositoryMemory";
import { Identifier } from "infra/security/Identifier";



describe("Create Album",async ()=>{
    const INITIAL_VALUE:Album.Props={
        id:"1",
        name:"any",
        year:"any",
        cover:"any",
        artist:{
            id:"any",
            name:"any",
        }            
    }
    
    const identifier:Identifier={
        createId(){
            return "1"
        }
    }
    
    const albumRepository=new AlbumRepositoryMemory();
    const artistRepository= new ArtistRepositoryMemory()
    
    it("should create album",async ()=>{
        const createAlbum=new CreateAlbum(albumRepository,artistRepository,identifier)
        const album=await createAlbum.execute(INITIAL_VALUE,'any')
        
        
        assert.deepEqual(album.id,"1")
        assert.deepEqual(album.name,"any")
        assert.deepEqual(album.cover,`${process.env.URI_BACKEND}any`)
        assert.deepEqual(album.artist,{
            id:"any",
            name:"any"
        })
    })

    it("should create a new artist when id is not send",async ()=>{
        const createAlbum=new CreateAlbum(albumRepository,artistRepository,identifier)
        const album=await createAlbum.execute(
            {...INITIAL_VALUE,artist:{...INITIAL_VALUE.artist,id:""}}
        );

        assert.deepEqual(album.artist.id,"1")
    })
})