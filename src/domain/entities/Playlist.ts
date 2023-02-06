import { EmptyPlaylist } from "domain/errors/EmptyPlaylist";
import { FieldMissing } from "domain/errors/FieldMissing";
import { Song } from "./Song";

export namespace Playlist {
  export interface Props {
    readonly id: string;
    title: string;
    userId: string;
    songs: Song.Props[];
  }
}

export class Playlist {
  public readonly id: string;
  public title: string;
  public public = true;
  public date: Date;
  public userId: string;
  public songs: Song[];

  constructor(props: Playlist.Props) {
    Object.assign(this, props);

    if (!this.title) {
      throw new FieldMissing("Title");
    }

    if (!this.userId) {
      throw new FieldMissing("User");
    }

    if (!this.songs) {
      throw new FieldMissing("Songs List");
    }

    if (this.songs.length === 0) {
      throw new EmptyPlaylist();
    }

    this.date = new Date();
  }

  addSong(song: Song) {
    this.songs.push(song);
  }

  removeSong(idSong: string) {
    this.songs = this.songs.filter((songItem) => songItem.id !== idSong);
  }

  changePublic() {
    this.public = !this.public;
  }
}
