import { ArtistRepository } from "application/repositories/ArtistRepository";
import { Artist } from "domain/entities/Artist";
import { AlreadyExists } from "domain/errors/AlreadyExists";
import { Identifier } from "infra/security/Identifier";

export class CreateArtist {
  constructor(
    private readonly identifier: Identifier,
    private readonly artistRepository: ArtistRepository
  ) {}

  async execute(
    data: Omit<Artist.Props, "id">,
    file?: string
  ): Promise<Artist> {
    const artist = new Artist({
      ...data,
      id: this.identifier.createId(),
      picture: file,
    });
    const artistAlreadyExists = await this.artistRepository.findByName(
      artist.name
    );

    if (artistAlreadyExists) {
      throw new AlreadyExists("Artist");
    }

    await this.artistRepository.create(artist);
    return artist;
  }
}
