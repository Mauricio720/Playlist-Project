import { PlaylistRepository } from "application/repositories/PlaylistRepository";
import { Playlist } from "domain/entities/Playlist";

export class PlaylistRepositoryMemory implements PlaylistRepository{
    private playlist:Playlist[]=[]
    
    async create(playlist: Playlist): Promise<Playlist> {
        this.playlist.push(playlist);
        return playlist;    
    }

}