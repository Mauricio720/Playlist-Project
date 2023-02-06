import { SongRepository } from "application/repositories/SongRepository";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";

export class ChangePublicSong {
  constructor(private readonly songRepository: SongRepository) {}

  async execute(id: string) {
    const song = await this.songRepository.findById(id);
    if (!song) {
      throw new ObjectNotFound("Song");
    }
    song.changePublic();
    await this.songRepository.update(song);
  }
}
