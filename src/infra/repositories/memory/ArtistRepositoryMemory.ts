import { ArtistRepository } from "application/repositories/ArtistRepository";
import { Artist } from "domain/entities/Artist";

export class ArtistRepositoryMemory implements ArtistRepository {
  private artists: Artist[] = [];

  async list(nameArtistLetter?: string): Promise<Artist[]> {
    let artists = this.artists;
    if (nameArtistLetter) {
      artists = this.artists.filter((artistItem) => {
        let artistFilter = false;
        for (let index = 0; index < artistItem.name.length; index++) {
          if (
            artistItem.name.charAt(index) === nameArtistLetter.toLowerCase()
          ) {
            artistFilter = true;
          }
        }
        return artistFilter;
      });
    }

    return artists;
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
