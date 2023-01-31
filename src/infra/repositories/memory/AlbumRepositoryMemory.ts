import { AlbumRepository } from "application/repositories/AlbumRepository";
import { Album } from "domain/entities/Album";

export class AlbumRepositoryMemory implements AlbumRepository {
  private albums: Album[] = [];

  async list(nameAlbumLetter): Promise<Album[]> {
    let albums = this.albums;
    if (nameAlbumLetter) {
      albums = this.albums.filter((albumItem) => {
        let albumFilter = false;
        for (let index = 0; index < albumItem.name.length; index++) {
          if (albumItem.name.charAt(index) === nameAlbumLetter.toLowerCase()) {
            albumFilter = true;
          }
        }
        return albumFilter;
      });
    }

    return albums;
  }

  async create(album: Album): Promise<Album> {
    this.albums.push(album);
    return album;
  }

  async update(album: Album): Promise<Album> {
    const filterAlbum = this.albums.filter(
      (albumItem) => albumItem.id !== album.id
    );
    filterAlbum.push(album);
    this.albums = filterAlbum;
    return album;
  }

  async delete(id: string): Promise<void> {
    const filterAlbums = this.albums.filter((albumItem) => albumItem.id !== id);
    this.albums = filterAlbums;
  }

  async findById(id: string): Promise<Album> {
    return this.albums.find((albumItem) => albumItem.id === id);
  }
}
