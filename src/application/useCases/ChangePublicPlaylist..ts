import { NotAuthorized } from "domain/errors/NotAuthorized";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { Auth } from "infra/security/Auth";

export class ChangePublicPlaylist {
  constructor(private readonly playlistRepository) {}

  async execute(idPlaylist: string) {
    const playlist = await this.playlistRepository.findById(idPlaylist);
    if (!playlist) {
      throw new ObjectNotFound("Playlist");
    }
    const auth = await Auth.getAutenticateUser();
    if (playlist.userId !== auth.id) {
      throw new NotAuthorized();
    }

    playlist.changePublic();
    await this.playlistRepository.update(playlist);
  }
}
