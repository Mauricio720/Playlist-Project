import { Playlist } from "domain/entities/Playlist";
import { Auth } from "infra/security/Auth";

export class GetPlaylistByFilterPresentation {
  static async execute(playlists: Playlist[]) {
    const auth = await Auth.getAutenticateUser();
    let filterPlaylist: Playlist[] = playlists;

    if (auth.permission === "Normal" || auth.permission === "Artist") {
      filterPlaylist = playlists.filter((playlistItem) => playlistItem.public);
    }

    return filterPlaylist;
  }
}
