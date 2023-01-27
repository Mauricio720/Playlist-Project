import { SongRepository } from "application/repositories/SongRepository";
import { throws } from "assert";
import { Song } from "domain/entities/Song";
import { Database } from "infra/database/Database";

export class SongRepositoryDatabase implements SongRepository {
  constructor(private readonly connection: Database) {
    this.connection.setDatabase("songs");
  }

  async list(): Promise<Song[]> {
    const response = await this.connection.get<Song>({});
    const songs = [];

    for (const song of response) {
      songs.push(new Song(song));
    }

    return songs;
  }

  async create(song: Song): Promise<Song> {
    await this.connection.create(song);
    return song;
  }

  async update(song: Song): Promise<Song> {
    await this.connection.update({ id: song.id }, song);
    return song;
  }

  async delete(id: string): Promise<void> {
    await this.connection.delete(id);
  }

  async findById(id: string): Promise<Song | null> {
    const songs = await this.connection.get({ id });
    if (!songs[0]) {
      return null;
    }

    return songs[0];
  }
}
