import { AlbumRepository } from "application/repositories/AlbumRepository";
import { SongRepository } from "application/repositories/SongRepository";
import { Album } from "domain/entities/Album";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";

export class RemoveSongAlbum {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly songRepository: SongRepository
  ) {}

  async execute(idAlbum: string, idSong: string): Promise<Album> {
    const album = await this.albumRepository.findById(idAlbum);
    if (!album) {
      throw new ObjectNotFound("Album");
    }
    const songExists = await this.songRepository.findById(idSong);
    if (!songExists) {
      throw new ObjectNotFound("Song");
    }

    album.removeSong(idSong);

    await this.albumRepository.update(album);
    return album;
  }
}
