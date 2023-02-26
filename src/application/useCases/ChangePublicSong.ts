import { SongRepository } from "application/repositories/SongRepository";
import { NotAuthorized } from "domain/errors/NotAuthorized";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { Auth } from "infra/security/Auth";

export class ChangePublicSong {
  constructor(private readonly songRepository: SongRepository) {}

  async execute(id: string) {
    const song = await this.songRepository.findById(id);
    if (!song) {
      throw new ObjectNotFound("Song");
    }
    const auth = await Auth.getAutenticateUser();
    if (song.userId !== auth.id) {
      throw new NotAuthorized();
    }
    song.changePublic();
    await this.songRepository.update(song);
  }
}
