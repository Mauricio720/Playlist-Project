import { PlaylistRepository } from "application/repositories/PlaylistRepository";
import { Playlist } from "domain/entities/Playlist";
import { Database } from "infra/database/Database";

export class PlaylistRepositoryDatabase implements PlaylistRepository {
  constructor(private readonly connection: Database) {
    this.connection.setDatabase("playlist");
  }

  async list(namePlaylistLetter: string): Promise<Playlist[]> {
    const regex = new RegExp(namePlaylistLetter, "i");

    const response = await this.connection.get<Playlist | null>(
      namePlaylistLetter
        ? {
            name: { $regex: regex },
          }
        : {}
    );
    const playlists = [];

    for (const playlist of response) {
      playlists.push(new Playlist(playlist));
    }
    return playlists;
  }

  async create(playlist: Playlist): Promise<Playlist> {
    await this.connection.create(playlist);
    return playlist;
  }

  async update(playlist: Playlist): Promise<Playlist> {
    await this.connection.update({ id: playlist.id }, playlist);

    return playlist;
  }

  async findById(id: string): Promise<Playlist> {
    const playlist = this.connection.get<Playlist>({ id });

    if (!playlist[0]) {
      return null;
    }

    return new Playlist(playlist[0]);
  }
}
