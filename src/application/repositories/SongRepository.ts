import { Song } from "domain/entities/Song";

export interface SongRepository {
  list(nameSongLetter?: string): Promise<Song[]>;
  create(song: Song): Promise<Song>;
  update(song: Song): Promise<Song>;
  delete(id: string): Promise<Song>;
  findByName: (name: string) => Promise<Song | null>;
  findById: (id: string) => Promise<Song | null>;
}
