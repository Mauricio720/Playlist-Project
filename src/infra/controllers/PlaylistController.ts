import { PlaylistRepository } from "application/repositories/PlaylistRepository";
import { SongRepository } from "application/repositories/SongRepository";
import { UserRepository } from "application/repositories/UserRepository";
import { AddSongPlaylist } from "application/useCases/AddSongPlaylist";
import { ChangePublicPlaylist } from "application/useCases/ChangePublicPlaylist.";
import { CreatePlaylist } from "application/useCases/CreatePlaylst";
import { RemoveSongPlaylist } from "application/useCases/RemoveSongPlaylist";
import { Playlist } from "domain/entities/Playlist";
import { Server } from "infra/http/Server";
import { GetPlaylistByFilterPresentation } from "infra/presentation/GetPlaylistByFilterPresentation";
import { Identifier } from "infra/security/Identifier";

export class PlaylistController {
  constructor(
    private readonly server: Server,
    private readonly playlistRepository: PlaylistRepository,
    private readonly songRepository: SongRepository,
    private readonly userRepository: UserRepository,
    private readonly identifier: Identifier
  ) {
    this.server.post("/playlist", async (req, res) => {
      try {
        const createPlaylist = new CreatePlaylist(
          this.playlistRepository,
          this.songRepository,
          this.userRepository,
          this.identifier
        );

        const playlist = await createPlaylist.execute(
          req.body as Playlist.Props
        );
        res.json(playlist).end();
      } catch (err) {
        res.status(400).json(err.message).end();
      }
    });

    this.server.get("/playlist", async (req, res) => {
      try {
        const playlists = await this.playlistRepository.findById(req.body.id);
        res.json(playlists).end();
      } catch (err) {
        res.status(400).json(err.message).end();
      }
    });

    this.server.get("/all_playlist", async (req, res) => {
      try {
        const playlists = await GetPlaylistByFilterPresentation.execute(
          await this.playlistRepository.list()
        );
        res.json(playlists).end();
      } catch (err) {
        res.status(400).json(err.message).end();
      }
    });

    this.server.post("/playlist/changePublic", async (req, res) => {
      try {
        const changePublicPlaylist = new ChangePublicPlaylist(
          this.playlistRepository
        );
        const playlist = await changePublicPlaylist.execute(req.body.id);
        res.json(playlist).end();
      } catch (err) {
        res.status(400).json(err.message).end();
      }
    });

    this.server.post("/playlist/add_song", async (req, res) => {
      try {
        const addSongPlaylist = new AddSongPlaylist(
          this.playlistRepository,
          this.songRepository
        );
        const playlist = await addSongPlaylist.execute(
          req.body.idPlaylist,
          req.body.song
        );
        res.json(playlist).end();
      } catch (err) {
        res.status(400).json(err.message).end();
      }
    });

    this.server.post("/playlist/remove_song", async (req, res) => {
      try {
        const removeSongPlaylist = new RemoveSongPlaylist(
          this.playlistRepository,
          this.songRepository
        );
        const playlist = await removeSongPlaylist.execute(
          req.body.idPlaylist,
          req.body.idSong
        );
        res.json(playlist).end();
      } catch (err) {
        res.status(400).json(err.message).end();
      }
    });
  }
}
