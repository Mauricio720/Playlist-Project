import { SongRepository } from "application/repositories/SongRepository";
import { Song } from "domain/entities/Song";

export class SongRepositoryMemory implements SongRepository {
  private songs: Song[] = [];

  async list(): Promise<Song[]> {
    return this.songs;
  }

  async create(song: Song): Promise<Song> {
    this.songs.push(song);
    return song;
  }

  async update(song: Song): Promise<Song> {
    const filterSongs = this.songs.filter(
      (songItem) => songItem.id !== song.id
    );
    filterSongs.push(song);
    this.songs = filterSongs;
    return song;
  }

  async delete(id: string): Promise<Song> {
    const index = this.songs.findIndex((songItem) => songItem.id === id);
    this.songs[index].active = false;
    return this.songs[index];
  }

  async findById(id: string): Promise<Song> {
    return this.songs.find((song) => song.id === id) || null;
  }
}
