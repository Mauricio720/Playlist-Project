import { AlbumRepository } from "application/repositories/AlbumRepository";
import { SongRepository } from "application/repositories/SongRepository";
import { Album } from "domain/entities/Album";
import { Song } from "domain/entities/Song";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";

export class AddSongAlbum {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly songRepository: SongRepository
  ) {}

  async execute(
    idAlbum: string,
    songs: Omit<Song.Props, "album">[]
  ): Promise<Album> {
    const album = await this.albumRepository.findById(idAlbum);

    if (!album) {
      throw new ObjectNotFound("Album");
    }
    await this.verifySongsExists(songs);

    for (const song of songs) {
      album.addSong(song);
    }

    await this.albumRepository.update(album);
    return album;
  }

  private async verifySongsExists(songs: Omit<Song.Props, "album">[]) {
    for (const song of songs) {
      const songExists = await this.songRepository.findById(song.id);

      if (!songExists) {
        throw new ObjectNotFound("Song");
      }
    }
  }
}
