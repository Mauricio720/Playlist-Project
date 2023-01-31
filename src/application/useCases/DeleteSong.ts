import { SongRepository } from "application/repositories/SongRepository";
import { Song } from "domain/entities/Song";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";

export class DeleteSong {
  constructor(private readonly songRepository: SongRepository) {}

  async execute(idSong: string): Promise<Song> {
    const song = await this.songRepository.findById(idSong);
    if (!song) {
      throw new ObjectNotFound("Song");
    }
    return await this.songRepository.delete(idSong);
  }
}
