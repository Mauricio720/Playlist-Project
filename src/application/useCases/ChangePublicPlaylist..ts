import { ObjectNotFound } from "domain/errors/ObjectNotFound";

export class ChangePublicPlaylist {
  constructor(private readonly playlistRepository) {}

  async execute(idPlaylist: string) {
    const playlist = await this.playlistRepository.findById(idPlaylist);
    if (!playlist) {
      throw new ObjectNotFound("Playlist");
    }
    playlist.changePublic();
    await this.playlistRepository.update(playlist);
  }
}
