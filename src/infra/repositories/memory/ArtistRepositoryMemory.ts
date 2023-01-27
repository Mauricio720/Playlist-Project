import { ArtistRepository } from "application/repositories/ArtistRepository";
import { Artist } from "domain/entities/Artist";

export class ArtistRepositoryMemory implements ArtistRepository {
  private artists: Artist[] = [];

  async list(): Promise<Artist[]> {
    return this.artists;
  }

  async create(artist: Artist): Promise<Artist> {
    this.artists.push(artist);
    return artist;
  }

  async update(artist: Artist): Promise<Artist> {
    const filterArtist = this.artists.filter(
      (artistItem) => artistItem.id !== artist.id
    );
    this.artists = filterArtist;
    return artist;
  }

  async delete(id: string) {
    const filterArtists = this.artists.filter(
      (artistItem) => artistItem.id !== id
    );
    this.artists = filterArtists;
  }

  async findById(id: string): Promise<Artist> {
    return this.artists.find((artistItem) => artistItem.id === id);
  }

  async findByName(name: string): Promise<Artist> {
    return this.artists.find((artistItem) => artistItem.name === name);
  }
}
