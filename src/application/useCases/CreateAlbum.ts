import { AlbumRepository } from "application/repositories/AlbumRepository";
import { ArtistRepository } from "application/repositories/ArtistRepository";
import { Album } from "domain/entities/Album";
import { Artist } from "domain/entities/Artist";
import { AlreadyExists } from "domain/errors/AlreadyExists";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { Identifier } from "infra/security/Identifier";

export class CreateAlbum {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly artistRepository: ArtistRepository,
    private readonly identifier: Identifier
  ) {}

  async execute(albumData: Album.Props, coverFile?: string): Promise<Album> {
    if (!albumData.artist.id) {
      await this.verifyArtistName(albumData.artist.name);
      albumData.artist = await this.artistRepository.create(
        new Artist({ ...albumData.artist, id: this.identifier.createId() })
      );
    } else {
      albumData.artist = await this.artistRepository.findById(
        albumData.artist.id
      );
      if (!albumData.artist) {
        throw new ObjectNotFound("Artist");
      }
    }

    const album = new Album({
      ...albumData,
      id: this.identifier.createId(),
      cover: coverFile,
    });

    return await this.albumRepository.create(album);
  }

  private async verifyArtistName(artistName: string) {
    const artist = await this.artistRepository.findByName(artistName);

    if (artist && artist.name === artistName) {
      throw new AlreadyExists("Artist Name");
    }
  }
}
