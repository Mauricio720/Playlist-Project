import { AlbumRepository } from "application/repositories/AlbumRepository";
import { Album } from "domain/entities/Album";
import { Database } from "infra/database/Database";

export class AlbumRepositoryDatabase implements AlbumRepository {
  constructor(private readonly connection: Database) {
    this.connection.setDatabase("albuns");
  }

  async list(nameAlbumLetter: string): Promise<Album[]> {
    const regex = new RegExp(nameAlbumLetter, "i");

    const response = await this.connection.get<Album>(
      nameAlbumLetter
        ? {
            name: { $regex: regex },
          }
        : {}
    );
    const albuns = [];

    for (const album of response) {
      albuns.push(album);
    }
    return albuns;
  }

  async create(album: Album): Promise<Album> {
    await this.connection.create(album);
    return album;
  }

  async update(album: Album): Promise<Album> {
    await this.connection.update({ id: album.id }, album);
    return album;
  }

  async delete(id: string): Promise<void> {
    this.connection.delete(id);
  }

  async findById(id: string): Promise<Album> {
    const albuns = await this.connection.get({ id });

    if (!albuns[0]) {
      return null;
    }

    return albuns[0];
  }
}
