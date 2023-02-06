import { PlaylistRepository } from "application/repositories/PlaylistRepository";
import { SongRepository } from "application/repositories/SongRepository";
import { Playlist } from "domain/entities/Playlist";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";

export class RemoveSongPlaylist {
  constructor(
    private readonly playlistRepository: PlaylistRepository,
    private readonly songRepository: SongRepository
  ) {}

  async execute(idPlaylist: string, idSong: string): Promise<Playlist> {
    const playlist = await this.playlistRepository.findById(idPlaylist);
    if (!playlist) {
      throw new ObjectNotFound("Playlist");
    }
    const song = await this.songRepository.findById(idSong);
    if (!song) {
      throw new ObjectNotFound("Song");
    }

    playlist.removeSong(idSong);

    await this.playlistRepository.update(playlist);
    return playlist;
  }
}
