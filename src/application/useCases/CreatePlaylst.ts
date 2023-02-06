import { PlaylistRepository } from "application/repositories/PlaylistRepository";
import { SongRepository } from "application/repositories/SongRepository";
import { UserRepository } from "application/repositories/UserRepository";
import { Playlist } from "domain/entities/Playlist";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { SongNotFound } from "domain/errors/SongNotFound";
import { Identifier } from "infra/security/Identifier";

export class CreatePlaylist {
  constructor(
    private readonly playlistRepository: PlaylistRepository,
    private readonly songRepository: SongRepository,
    private readonly userRepository: UserRepository,
    private readonly identifier: Identifier
  ) {}

  async execute(data: Playlist.Props): Promise<Playlist> {
    const playlist = new Playlist({ ...data, id: this.identifier.createId() });
    for (const song of playlist.songs) {
      const songRegister = await this.songRepository.findById(song.id);
      if (!songRegister) {
        throw new SongNotFound();
      }
    }

    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new ObjectNotFound("User");
    }

    return await this.playlistRepository.create(playlist);
  }
}
