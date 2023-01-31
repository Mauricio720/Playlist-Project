import { EmptyPlaylist } from "domain/errors/EmptyPlaylist";
import { FieldMissing } from "domain/errors/FieldMissing";
import { Song } from "./Song";
import { User } from "./User";

export namespace Playlist {
  export interface Props {
    readonly id: string;
    title: string;
    user: User.Props;
    songs: Song.Props[];
  }
}

export class Playlist {
  public readonly id: string;
  public title: string;
  public date: Date;
  public user: User.Props;
  public songs: Song[];

  constructor(props: Playlist.Props) {
    Object.assign(this, props);

    if (!this.title) {
      throw new FieldMissing("Title");
    }

    if (!this.user) {
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
}
