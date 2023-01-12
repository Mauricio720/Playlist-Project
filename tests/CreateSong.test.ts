import "dotenv/config";
import { CreateSong, CreateSongDTO } from "application/useCases/CreateSong"
import assert from "assert"
import { Artist } from "domain/entities/Artist"
import { ObjectNotFound } from "domain/errors/ObjectNotFound"
import { AlbumRepositoryMemory } from "infra/repositories/memory/AlbumRepositoryMemory"
import { ArtistRepositoryMemory } from "infra/repositories/memory/ArtistRepositoryMemory"
import { SongRepositoryMemory } from "infra/repositories/memory/SongRepositoryMemory"
import { Identifier } from "infra/security/Identifier"
import { Album } from "domain/entities/Album";

describe("Create Song",async ()=>{
    const identifier:Identifier={
        createId(){
            return "1"
        }
    }

    const INITIAL_VALUE:CreateSongDTO={
        title:"any",
        category:{
            id:"any",
            name:"any"
        },
        duration:1.0,
        artist:{
            id:"any",
            name:"any",
            picture:"any"
        },
        album:{
            id:"any",
            name:"any",
            year:"any",
            cover:"any"
        },
        user:{
            id:"any",
            name:"any",
            email:"any@any.com",
        }
    }

    const songRepository=new SongRepositoryMemory()
    const artistRepository=new ArtistRepositoryMemory()
    const albumRepository=new AlbumRepositoryMemory()

    await albumRepository.create(INITIAL_VALUE.album as Album)
    await artistRepository.create(INITIAL_VALUE.album.artist as Artist)

    const createSong=new CreateSong(
        songRepository,
        artistRepository,
        albumRepository,
        identifier
    );

    it("should create new song",async ()=>{
        const song=await createSong.execute(INITIAL_VALUE,"any")
        
        assert.deepEqual(song.id,"1")
        assert.deepEqual(song.title,"any")
        assert.deepEqual(song.category.id,"any")
        assert.deepEqual(song.category.name,"any")
        assert.deepEqual(song.duration,1)
        assert.deepEqual(song.pathSongFile,`${process.env.URI_BACKEND}any`)
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
        assert.deepEqual(song.user.id,"any")
        assert.deepEqual(song.user.name,"any")
        assert.deepEqual(song.user.email,"any@any.com")
    })

    it("should create new artist when id is not send",async ()=>{
        const song=await createSong.execute(
            {...INITIAL_VALUE,artist:{...INITIAL_VALUE.artist,id:""}},
            "any",
        )

        assert.deepEqual(song.artist.id,"1")
    })

    it("should create new album when id is not send",async ()=>{
       const song=await createSong.execute(
            {...INITIAL_VALUE,
                album:{
                    ...INITIAL_VALUE.album,id:"",
                    artist:{...INITIAL_VALUE.album,id:""}
                },
            },
            "any",
        )
           
        assert.deepEqual(song.album.id,"1")
    })
    
    it("should throw when not found album",async ()=>{
        assert.rejects(async ()=>{
            await createSong.execute(
                {...INITIAL_VALUE,
                    album:{
                        ...INITIAL_VALUE.album,id:"wrongId",
                    },
                },
                "any",
            );
        },new ObjectNotFound("Album"))
    })

    it("should throw when not found artist",async ()=>{
        assert.rejects(async ()=>{
            await createSong.execute(
                {...INITIAL_VALUE,
                    album:{
                        ...INITIAL_VALUE.album,
                        artist:{...INITIAL_VALUE.album.artist,id:"wrongId"}
                    },
                },
                "any"
            );
        },new ObjectNotFound("Artist"))
    })
})