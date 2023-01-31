import { AlbumRepository } from "application/repositories/AlbumRepository";
import { ArtistRepository } from "application/repositories/ArtistRepository";
import { SongRepository } from "application/repositories/SongRepository";
import { Album } from "domain/entities/Album";
import { Artist } from "domain/entities/Artist";
import { Category } from "domain/entities/Category";
import { Song } from "domain/entities/Song";
import { User } from "domain/entities/User";
import { AlreadyExists } from "domain/errors/AlreadyExists";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { Identifier } from "infra/security/Identifier";

export class CreateSong {
  constructor(
    private readonly songRepository: SongRepository,
    private readonly artistRepository: ArtistRepository,
    private readonly albumRepository: AlbumRepository,
    private readonly identifier: Identifier
  ) {}

  async execute(
    data: CreateSongDTO,
    songFile: string,
    artistFile?: string,
    albumFile?: string
  ) {
    if (!data.artist.id) {
      await this.verifyArtistName(data.artist.name);
      data.artist = await this.artistRepository.create(
        new Artist({
          ...data.artist,
          id: this.identifier.createId(),
          picture: artistFile,
        })
      );
    } else {
      data.artist = await this.artistRepository.findById(data.artist.id);
      if (!data.artist) {
        throw new ObjectNotFound("Artist");
      }
    }

    if (!data.album.id) {
      data.album = await this.albumRepository.create(
        new Album({
          ...data.album,
          id: this.identifier.createId(),
          cover: albumFile,
          songs: [],
        })
      );
    } else {
      data.artist = await this.albumRepository.findById(data.album.id);
      if (!data.artist) {
        throw new ObjectNotFound("Album");
      }
    }

    const song = new Song({
      ...data,
      id: this.identifier.createId(),
      pathSongFile: songFile,
    });

    return await this.songRepository.create(song);
  }

  private async verifyArtistName(artistName: string) {
    const artist = await this.artistRepository.findByName(artistName);

    if (artist && artist.name === artistName) {
      throw new AlreadyExists("Artist Name");
    }
  }
}

export type CreateSongDTO = {
  title: string;
  category: Omit<Category.Props, "cover">;
  duration: number;
  artist: Artist.Props;
  album: Omit<Album.Props, "songs">;
  userId: string;
};
