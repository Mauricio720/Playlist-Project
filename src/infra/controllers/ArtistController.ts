import { ArtistRepository } from "application/repositories/ArtistRepository";
import { CreateArtist } from "application/useCases/CreateArtist";
import { Artist } from "domain/entities/Artist";
import { Server } from "infra/http/Server";
import { Identifier } from "infra/security/Identifier";
import { Storage } from "infra/storage/Storage";

export class ArtistController {
  constructor(
    private readonly server: Server,
    private readonly artistRepository: ArtistRepository,
    private readonly identifier: Identifier,
    private readonly storage: Storage
  ) {
    this.server.post(
      "/artist",
      this.storage.middleware({
        key: "file",
        path: "/images/artists",
      }),
      async (req, res) => {
        try {
          const createArtist = new CreateArtist(
            this.identifier,
            this.artistRepository
          );
          const artist = await createArtist.execute(
            req.body as Artist.Props,
            req.file ? req.file.location : undefined
          );
          res.json(artist);
        } catch (err) {
          res.status(400).json(err.message).end();
        }
      }
    );

    this.server.get("/artist", async (req, res) => {
      try {
        const artists = await this.artistRepository.list(
          req.query.name ? req.query.name : ""
        );
        res.json(artists);
      } catch (err) {
        res.status(400).json(err.message).end();
      }
    });
  }
}
