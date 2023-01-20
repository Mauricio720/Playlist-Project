import { PlaylistRepository } from "application/repositories/PlaylistRepository";
import { Playlist } from "domain/entities/Playlist";
import { Song } from "domain/entities/Song";

export class AddSongPlaylist{
    constructor(private readonly playlistRepository:PlaylistRepository){}

    async execute(idPlaylist:string, song:Song):Promise<Playlist>{
        const playlist=await this.playlistRepository.findById(idPlaylist);
        playlist.addSong(song);
        await this.playlistRepository.update(playlist);
        return playlist;
    }
}