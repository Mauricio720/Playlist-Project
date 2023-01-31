import { Artist } from "domain/entities/Artist";

export interface ArtistRepository {
  list(nameArtistLetter?: string): Promise<Artist[]>;
  create(artist: Artist): Promise<Artist>;
  update(artist: Artist): Promise<Artist>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Artist | null>;
  findByName(name: string): Promise<Artist | null>;
}
