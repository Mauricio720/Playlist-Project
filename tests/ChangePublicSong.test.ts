import { ChangePublicSong } from "application/useCases/ChangePublicSong";
import { CreateAlbum } from "application/useCases/CreateAlbum";
import { CreateArtist } from "application/useCases/CreateArtist";
import { CreateCategory } from "application/useCases/CreateCategory";
import { CreateSong } from "application/useCases/CreateSong";
import { CreateUser } from "application/useCases/CreateUser";
import assert from "assert";
import { Song } from "domain/entities/Song";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { AlbumRepositoryMemory } from "infra/repositories/memory/AlbumRepositoryMemory";
import { ArtistRepositoryMemory } from "infra/repositories/memory/ArtistRepositoryMemory";
import { CategoryRepositoryMemory } from "infra/repositories/memory/CategoryRepositoryMemory";
import { SongRepositoryMemory } from "infra/repositories/memory/SongRepositoryMemory";
import { UserRepositoryMemory } from "infra/repositories/memory/UserRepositoryMemory";
import { Identifier } from "infra/security/Identifier";
import { Authenticator } from "infra/security/Authenticator";
import { Encrypt } from "infra/security/Encrypt";
import { User } from "domain/entities/User";

describe("Change Public Song", async () => {
  const identifier: Identifier = {
    createId() {
      return "1";
    },
  };

  const INITIAL_VALUE: Song.Props = {
    id: identifier.createId(),
    title: "any",
    category: {
      id: "1",
      name: "any",
    },
    duration: 1.0,
    pathSongFile: "any",
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
    userId: "1",
  };

  const INITIAL_VALUES_USER: User.Props = {
    id: "1",
    name: "any",
    email: "anySong@any.com",
    permission: "Adm",
    password: "any",
    dateRegister: new Date(),
    favoriteCategory: [],
    favoriteArtist: [],
  };

  const encrypt: Encrypt = {
    async compare(password, encripted) {
      return `${password}_enc` === encripted;
    },
    encript(password) {
      return `${password}_enc`;
    },
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
    userRepository,
    categoryRepository,
    identifier
  );

  const createCategory = new CreateCategory(identifier, categoryRepository);

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

  await createArtist.execute(INITIAL_VALUE.artist);
  await createAlbum.execute({ ...INITIAL_VALUE.album, songs: [] });
  await createCategory.execute("any");
  await createUser.execute(INITIAL_VALUES_USER);

  const songCreated = await createSong.execute(INITIAL_VALUE, "any");

  const changePublicSong = new ChangePublicSong(songRepository);
  await changePublicSong.execute(songCreated.id);

  it("should change public song", async () => {
    const songFinded = await songRepository.findById(songCreated.id);
    assert.deepEqual(songFinded.public, true);

    await changePublicSong.execute(songCreated.id);
    assert.deepEqual(songFinded.public, false);
  });

  it("throw song not found", async () => {
    await assert.rejects(async () => {
      await changePublicSong.execute("wrongId");
    }, new ObjectNotFound("Song"));
  });
});
