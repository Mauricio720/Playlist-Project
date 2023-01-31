import { PlaylistRepository } from "application/repositories/PlaylistRepository";
import { Playlist } from "domain/entities/Playlist";

export class PlaylistRepositoryMemory implements PlaylistRepository {
  private playlist: Playlist[] = [];

  async list(): Promise<Playlist[]> {
    return this.playlist;
  }

  async create(playlist: Playlist): Promise<Playlist> {
    this.playlist.push(playlist);
    return playlist;
  }

  async update(playlist: Playlist): Promise<Playlist> {
    const filterPlaylist = this.playlist.filter(
      (playlistItem) => playlistItem.id !== playlist.id
    );
    filterPlaylist.push(playlist);
    this.playlist = filterPlaylist;

    return playlist;
  }

  async findById(idPlaylist: string): Promise<Playlist> {
    return this.playlist.find((playlistItem) => playlistItem.id === idPlaylist);
  }
}
