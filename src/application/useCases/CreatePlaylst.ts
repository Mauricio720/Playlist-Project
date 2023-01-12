import { PlaylistRepository } from "application/repositories/PlaylistRepository";
import { SongRepository } from "application/repositories/SongRepository";
import { UserRepository } from "application/repositories/UserRepository";
import { Playlist } from "domain/entities/Playlist";
import { Song } from "domain/entities/Song";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { SongNotFound } from "domain/errors/SongNotFound";
import { Identifier } from "infra/security/Identifier";

export class CreatePlaylist{
    constructor(
        private readonly playlistRepository:PlaylistRepository,
        private readonly songRepository:SongRepository,
        private readonly identifier:Identifier
    ){}

    async execute(data:Playlist.Props):Promise<Playlist>{
        const playlist=new Playlist({...data,id:this.identifier.createId()})
        await this.validateSongs(playlist.songs)
        return await this.playlistRepository.create(playlist);
    }
    
    private async validateSongs(songs:Song[]){
        for(const song of songs){
            if(! await this.songRepository.findById(song.id)){
                throw new SongNotFound()
            }
        }
    }
}