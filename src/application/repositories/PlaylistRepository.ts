import { Playlist } from "domain/entities/Playlist";

export interface PlaylistRepository {
  list(namePlaylistLetter?: string): Promise<Playlist[]>;
  create(playlist: Playlist): Promise<Playlist>;
  update(playlist: Playlist): Promise<Playlist>;
  findById(idPlaylist: string): Promise<Playlist | null>;
}
