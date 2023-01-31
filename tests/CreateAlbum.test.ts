import "dotenv/config";
import { CreateAlbum } from "application/useCases/CreateAlbum";
import assert from "assert";
import { Album } from "domain/entities/Album";
import { AlbumRepositoryMemory } from "infra/repositories/memory/AlbumRepositoryMemory";
import { ArtistRepositoryMemory } from "infra/repositories/memory/ArtistRepositoryMemory";
import { Identifier } from "infra/security/Identifier";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { CreateArtist } from "application/useCases/CreateArtist";
import { AlreadyExists } from "domain/errors/AlreadyExists";

describe("Create Album", async () => {
  const INITIAL_VALUE: Album.Props = {
    id: "1",
    name: "any",
    year: "any",
    cover: "any",
    songs: [],
    artist: {
      id: "1",
      name: "any",
    },
  };

  const identifier: Identifier = {
    createId() {
      return "1";
    },
  };

  const albumRepository = new AlbumRepositoryMemory();
  const artistRepository = new ArtistRepositoryMemory();

  const createArtist = new CreateArtist(identifier, artistRepository);
  await createArtist.execute({ name: INITIAL_VALUE.name });

  const createAlbum = new CreateAlbum(
    albumRepository,
    artistRepository,
    identifier
  );

  it("should create album", async () => {
    const album = await createAlbum.execute(INITIAL_VALUE, "any");

    assert.deepEqual(album.id, "1");
    assert.deepEqual(album.name, "any");
    assert.deepEqual(album.cover, `${process.env.URI_BACKEND}any`);
    assert.deepEqual(album.artist, {
      id: "1",
      name: "any",
      picture: undefined,
    });
  });

  it("should create a new artist when id is not send", async () => {
    const createAlbum = new CreateAlbum(
      albumRepository,
      artistRepository,
      identifier
    );
    const album = await createAlbum.execute({
      ...INITIAL_VALUE,
      artist: { ...INITIAL_VALUE.artist, id: "", name: "any2" },
    });

    assert.deepEqual(album.artist.id, "1");
  });

  it("throw artist name already exists", async () => {
    await assert.rejects(async () => {
      await createAlbum.execute({
        ...INITIAL_VALUE,
        artist: { ...INITIAL_VALUE.artist, id: "", name: "any" },
      });
    }, new AlreadyExists("Artist Name"));
  });

  it("throw artist not found", async () => {
    await assert.rejects(async () => {
      await createAlbum.execute({
        ...INITIAL_VALUE,
        artist: { ...INITIAL_VALUE.artist, id: "wrongId" },
      });
    }, new ObjectNotFound("Artist"));
  });
});
