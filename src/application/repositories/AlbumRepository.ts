import { Album } from "domain/entities/Album";

export interface AlbumRepository {
  list(nameAlbum: string): Promise<Album[]>;
  create(album: Album): Promise<Album>;
  update(album: Album): Promise<Album>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Album | null>;
}
