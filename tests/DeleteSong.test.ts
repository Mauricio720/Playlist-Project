import { CreateSong, CreateSongDTO } from "application/useCases/CreateSong";
import assert from "assert";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { AlbumRepositoryMemory } from "infra/repositories/memory/AlbumRepositoryMemory";
import { ArtistRepositoryMemory } from "infra/repositories/memory/ArtistRepositoryMemory";
import { SongRepositoryMemory } from "infra/repositories/memory/SongRepositoryMemory";
import { Identifier } from "infra/security/Identifier";
import { CreateAlbum } from "application/useCases/CreateAlbum";
import { CreateArtist } from "application/useCases/CreateArtist";
import { UserRepositoryMemory } from "infra/repositories/memory/UserRepositoryMemory";
import { CreateUser } from "application/useCases/CreateUser";
import { Encrypt } from "infra/security/Encrypt";
import { Authenticator } from "infra/security/Authenticator";
import { CategoryRepositoryMemory } from "infra/repositories/memory/CategoryRepositoryMemory";
import { User } from "domain/entities/User";
import { DeleteSong } from "application/useCases/DeleteSong";

describe("Delete Song", async () => {
  const identifier: Identifier = {
    createId() {
      return "1";
    },
  };

  const INITIAL_VALUE: CreateSongDTO = {
    title: "any",
    category: {
      id: "any",
      name: "any",
    },
    duration: 1.0,
    artist: {
      id: "1",
      name: "any",
      picture: "any",
    },
    album: {
      id: "1",
      name: "any",
      year: "any",
      cover: "any",
      artist: {
        id: "1",
        name: "any",
        picture: "any",
      },
    },
    userId: "any",
  };

  const encrypt: Encrypt = {
    async compare(password, encripted) {
      return `${password}_enc` === encripted;
    },
    encript(password) {
      return `${password}_enc`;
    },
  };

  const INITIAL_VALUES_USER: User.Props = {
    id: "any",
    name: "any",
    email: "any@any.com",
    password: "any",
    dateRegister: new Date(),
    favoriteCategory: [],
    favoriteArtist: [],
  };

  const songRepository = new SongRepositoryMemory();
  const artistRepository = new ArtistRepositoryMemory();
  const albumRepository = new AlbumRepositoryMemory();
  const userRepository = new UserRepositoryMemory();
  const categoryRepository = new CategoryRepositoryMemory();

  const createAlbum = new CreateAlbum(
    albumRepository,
    artistRepository,
    identifier
  );

  const createArtist = new CreateArtist(identifier, artistRepository);

  const createSong = new CreateSong(
    songRepository,
    artistRepository,
    albumRepository,
    identifier
  );

  const authenticador: Authenticator = {
    createToken() {
      return "any token";
    },
    decoder() {},
  };

  const createUser = new CreateUser(
    identifier,
    encrypt,
    authenticador,
    userRepository,
    artistRepository,
    categoryRepository
  );

  await createUser.execute(INITIAL_VALUES_USER);
  await createArtist.execute(INITIAL_VALUE.artist);
  await createAlbum.execute({ ...INITIAL_VALUE.album, songs: [] });
  await createSong.execute(INITIAL_VALUE, "any");

  const deleteSong = new DeleteSong(songRepository);

  it("should delete song", async () => {
    const song = await deleteSong.execute("1");
    assert.deepEqual(song.active, false);
  });

  it("throw song not found", async () => {
    await assert.rejects(async () => {
      await deleteSong.execute("wrongId");
    }, new ObjectNotFound("Song"));
  });
});
