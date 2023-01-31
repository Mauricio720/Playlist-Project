import "dotenv/config";
import { FieldMissing } from "domain/errors/FieldMissing";
import { Album } from "./Album";
import { Artist } from "./Artist";
import { Category } from "./Category";

export namespace Song {
  export interface Props {
    readonly id: string;
    title: string;
    category: Category.Props;
    duration: number;
    pathSongFile: string;
    artist: Artist.Props;
    album: Omit<Album.Props, "songs">;
    userId: string;
  }
}

export class Song {
  public readonly id: string;
  public title: string;
  public category: Category;
  public duration: number;
  public pathSongFile: string;
  public artist: Artist;
  public album: Omit<Album.Props, "songs">;
  public dateRegister: Date;
  public userId: string;
  public public = false;
  public active = true;

  constructor(props: Song.Props) {
    Object.assign(this, props);
    this.missingInputs();
    this.dateRegister = new Date();
    this.pathSongFile = `${process.env.URI_BACKEND}${this.pathSongFile}`;
  }

  changePublic() {
    this.public = !this.public;
  }

  private missingInputs() {
    if (
      !this.title ||
      !this.category ||
      !this.duration ||
      !this.artist ||
      !this.album ||
      !this.userId
    ) {
      throw new FieldMissing(
        "Title or Category or Duration or PathSongFile or Artist or Album or User"
      );
    }
  }
}
