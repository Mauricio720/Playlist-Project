import { PlaylistRepository } from "application/repositories/PlaylistRepository";
import { SongRepository } from "application/repositories/SongRepository";
import { Playlist } from "domain/entities/Playlist";
import { Song } from "domain/entities/Song";
import { NotAuthorized } from "domain/errors/NotAuthorized";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { Auth } from "infra/security/Auth";

export class AddSongPlaylist {
  constructor(
    private readonly playlistRepository: PlaylistRepository,
    private readonly songRepository: SongRepository
  ) {}

  async execute(idPlaylist: string, song: Song): Promise<Playlist> {
    const playlist = await this.playlistRepository.findById(idPlaylist);
    if (!playlist) {
      throw new ObjectNotFound("Playlist");
    }
    const songFinded = await this.songRepository.findById(song.id);
    if (!songFinded) {
      throw new ObjectNotFound("Song");
    }
    const auth = await Auth.getAutenticateUser();
    if (songFinded.userId !== auth.id || playlist.userId !== playlist.userId) {
      throw new NotAuthorized();
    }
    playlist.addSong(song);
    await this.playlistRepository.update(playlist);
    return playlist;
  }
}
