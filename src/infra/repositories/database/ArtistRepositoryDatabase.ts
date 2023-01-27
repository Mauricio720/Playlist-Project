import { ArtistRepository } from "application/repositories/ArtistRepository";
import { Artist } from "domain/entities/Artist";
import { Database } from "infra/database/Database";

export class ArtistRepositoryDatabase implements ArtistRepository {
  constructor(private readonly connection: Database) {
    this.connection.setDatabase("artists");
  }

  async list(): Promise<Artist[]> {
    const response = await this.connection.get({});
    const artists = [];

    for (const artist of response) {
      artists.push(new Artist(artist));
    }

    return artists;
  }

  async create(artist: Artist): Promise<Artist> {
    await this.connection.create(artist);
    return artist;
  }

  async update(artist: Artist): Promise<Artist> {
    await this.connection.update({ id: artist.id }, artist);
    return artist;
  }

  async delete(id: string) {
    await this.connection.delete({ id });
  }

  async findById(id: string): Promise<Artist> {
    const artist = await this.connection.get<Artist | null>({
      id,
    });

    if (!artist[0]) {
      return null;
    }

    return artist[0];
  }

  async findByName(name: string): Promise<Artist> {
    const artist = await this.connection.get<Artist | null>({
      name,
    });

    if (!artist[0]) {
      return null;
    }

    return artist[0];
  }
}
