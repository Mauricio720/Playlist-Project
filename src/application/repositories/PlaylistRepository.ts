import { Playlist } from "domain/entities/Playlist";

export interface PlaylistRepository{
    create(playlist: Playlist):Promise<Playlist>
}