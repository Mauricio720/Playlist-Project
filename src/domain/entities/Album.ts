import "dotenv/config";
import { FieldMissing } from "domain/errors/FieldMissing";
import { Artist } from "./Artist";
import { Song } from "./Song";

export namespace Album {
  export interface Props {
    readonly id: string;
    name: string;
    year: string;
    artist: Artist.Props;
    songs: Omit<Song.Props, "album">[];
    cover?: string;
  }
}

export class Album {
  public readonly id: string;
  public name: string;
  public year: string;
  public artist: Artist.Props;
  public songs: Omit<Song.Props, "album">[];
  public cover = "";

  constructor(props: Album.Props) {
    Object.assign(this, props);
    if (!this.name || !this.year || !this.artist) {
      throw new FieldMissing("Name and Year and Artist");
    }

    if (this.cover) {
      this.cover = `${process.env.URI_BACKEND}${this.cover}`;
    }
  }

  addSong(song: Omit<Song.Props, "album">) {
    this.songs.push(song);
  }

  removeSong(idSong: string) {
    this.songs = this.songs.filter((songItem) => songItem.id !== idSong);
  }
}
