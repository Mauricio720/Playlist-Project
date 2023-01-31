import { AlbumRepository } from "application/repositories/AlbumRepository";
import { ArtistRepository } from "application/repositories/ArtistRepository";
import { SongRepository } from "application/repositories/SongRepository";
import { AddSongAlbum } from "application/useCases/AddSongAlbum";
import { CreateAlbum } from "application/useCases/CreateAlbum";
import { RemoveSongAlbum } from "application/useCases/RemoveSongAlbum";
import { Album } from "domain/entities/Album";
import { Server } from "infra/http/Server";
import { Identifier } from "infra/security/Identifier";
import { Storage } from "infra/storage/Storage";

export class AlbumController {
  constructor(
    private readonly server: Server,
    private readonly albumRepository: AlbumRepository,
    private readonly artistRepository: ArtistRepository,
    private readonly songRepository: SongRepository,
    private readonly identifier: Identifier,
    private readonly storage: Storage
  ) {
    this.server.post(
      "/album",
      this.storage.middlewareMultiple([
        { name: "albumImage", path: "/songs/album" },
        { name: "artistImage", path: "/songs/artist" },
      ]),
      async (req, res) => {
        try {
          const createAlbum = await new CreateAlbum(
            this.albumRepository,
            this.artistRepository,
            this.identifier
          );

          req.body.artist = JSON.parse(req.body.artist);
          const album = await createAlbum.execute(
            req.body as Album.Props,
            req.file ? req.file.location : ""
          );
          res.json(album).end();
        } catch (err) {
          res.status(400).json(err.message).end();
        }
      }
    );

    this.server.get("/album", async (req, res) => {
      try {
        const album = await this.albumRepository.findById(req.query.id);
        res.json(album).end();
      } catch (err) {
        res.status(400).json(err.message).end();
      }
    });

    this.server.get("/all_albuns", async (req, res) => {
      try {
        const album = await this.albumRepository.list();
        res.json(album).end();
      } catch (err) {
        res.status(400).json(err.message).end();
      }
    });

    this.server.post("/album/addSong", async (req, res) => {
      try {
        const addSongAlbum = await new AddSongAlbum(
          this.albumRepository,
          this.songRepository
        );

        const album = await addSongAlbum.execute(
          req.body.idAlbum,
          JSON.parse(req.body.songs)
        );

        res.json(album).end();
      } catch (err) {
        res.status(400).json(err.message).end();
      }
    });

    this.server.post("/album/removeSong", async (req, res) => {
      try {
        const removeSongAlbum = await new RemoveSongAlbum(
          this.albumRepository,
          this.songRepository
        );

        const album = await removeSongAlbum.execute(
          req.body.idAlbum,
          req.body.idSong
        );

        res.json(album).end();
      } catch (err) {
        res.status(400).json(err.message).end();
      }
    });
  }
}
