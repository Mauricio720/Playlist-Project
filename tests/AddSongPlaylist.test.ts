import { AddSongPlaylist } from "application/useCases/AddSongPlaylist";
import { CreatePlaylist } from "application/useCases/CreatePlaylst";
import assert from "assert";
import { Playlist } from "domain/entities/Playlist";
import { Song } from "domain/entities/Song";
import { PlaylistRepositoryMemory } from "infra/repositories/memory/PlaylistRepository"
import { SongRepositoryMemory } from "infra/repositories/memory/SongRepositoryMemory";
import { Identifier } from "infra/security/Identifier";

describe("Should Add Song In Playlist",async ()=>{
    const identifier:Identifier={
        createId(){
            return "1"
        }
    }
    
    const INITIAL_VALUES:Playlist.Props={
        id: "1",
        title: "any",
        user: {
            id:"any",
            name:"any",
            email:"any"
        },
        songs:[
            {
                id:"any",
                title:"any",
                category:{
                    id:"any",
                    name:"any",
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
                },
                user:{
                    id:"any",
                    name:"any",
                    email:"any@any.com",
                }
            },
        ]
    }

    const playlistRepository=new PlaylistRepositoryMemory();
    
    const songRepository=new SongRepositoryMemory()
    await songRepository.create(INITIAL_VALUES.songs[0] as Song)
    
    const createPlaylist=new CreatePlaylist(
        playlistRepository,
        songRepository,
        identifier
    );

    const playlist=await createPlaylist.execute(INITIAL_VALUES)

    it("should add song in playlist",async ()=>{
        const addSongPlaylist=new AddSongPlaylist(playlistRepository);

        const newSongValues={
            id:"any2",
            title:"any2",
            category:{
                id:"any",
                name:"any",
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
            },
            user:{
                id:"any",
                name:"any",
                email:"any@any.com",
            }
        };
        
        const newSong=await songRepository.create(newSongValues as Song)
        const actualPlaylist=await addSongPlaylist.execute(playlist.id,newSong)
        
        assert.deepEqual(actualPlaylist.songs.length,2)
    })
})