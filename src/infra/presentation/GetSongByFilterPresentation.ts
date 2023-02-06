import { Playlist } from "domain/entities/Playlist";
import { Song } from "domain/entities/Song";
import { Auth } from "infra/security/Auth";

export class GetSongByFilterPresentation {
  static async execute(songs: Song[]) {
    const auth = await Auth.getAutenticateUser();
    let filterSongs: Song[] = songs;

    if (auth.permission === "Normal" || auth.permission === "Artist") {
      filterSongs = songs.filter(
        (songItem) => songItem.public && songItem.userId === auth.id
      );
    }

    return filterSongs;
  }
}
