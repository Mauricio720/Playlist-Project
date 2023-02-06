import "dotenv/config";
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
import { CreateCategory } from "application/useCases/CreateCategory";
import { AlreadyExists } from "domain/errors/AlreadyExists";

describe("Create Song", async () => {
  const identifier: Identifier = {
    createId() {
      return "1";
    },
  };

  const INITIAL_VALUE: CreateSongDTO = {
    title: "any",
    category: {
      id: "1",
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
    userId: "1",
  };

  const encrypt: Encrypt = {
    async compare(password, encripted) {
      return `${password}_enc` === encripted;
    },
    encript(password) {
      return `${password}_enc`;
    },
  };

  const INITIAL_VALUES_USER: Omit<User.Props, "id"> = {
    name: "any",
    email: "any@any.com",
    permission: "Adm",
    password: "any",
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

  it("should create new song", async () => {
    const song = await createSong.execute(INITIAL_VALUE, "any");

    assert.deepEqual(song.id, "1");
    assert.deepEqual(song.title, "any");
    assert.deepEqual(song.category.id, "1");
    assert.deepEqual(song.category.name, "any");
    assert.deepEqual(song.duration, 1);
    assert.deepEqual(song.pathSongFile, `${process.env.URI_BACKEND}any`);
    assert.deepEqual(song.artist.id, "1");
    assert.deepEqual(song.artist.name, "any");
    assert.deepEqual(
      new Date(song.dateRegister).toDateString(),
      new Date().toDateString()
    );
    assert.deepEqual(song.album.id, "1");
    assert.deepEqual(song.album.name, "any");
    assert.deepEqual(song.album.year, "any");
    assert.deepEqual(song.userId, "1");
  });

  it("should create new artist when id is not send", async () => {
    const song = await createSong.execute(
      {
        ...INITIAL_VALUE,
        title: "newSong",
        artist: { ...INITIAL_VALUE.artist, id: "", name: "wrongArtist" },
      },
      "any"
    );

    assert.deepEqual(song.artist.id, "1");
  });

  it("should create new album when id is not send", async () => {
    const song = await createSong.execute(
      {
        ...INITIAL_VALUE,
        title: "newSong3",
        album: {
          ...INITIAL_VALUE.album,
          id: "",
          artist: { ...INITIAL_VALUE.album, id: "" },
        },
      },
      "any"
    );

    assert.deepEqual(song.album.id, "1");
  });

  it("should throw name song already exists ", async () => {
    await assert.rejects(async () => {
      await createSong.execute(INITIAL_VALUE, "any");
    }, new AlreadyExists("Song"));
  });

  it("should throw when not found album", async () => {
    await assert.rejects(async () => {
      await createSong.execute(
        {
          ...INITIAL_VALUE,
          album: {
            ...INITIAL_VALUE.album,
            id: "wrongId",
          },
        },
        "any"
      );
    }, new ObjectNotFound("Album"));
  });

  it("should throw when not found artist", async () => {
    await assert.rejects(async () => {
      await createSong.execute(
        {
          ...INITIAL_VALUE,
          artist: { ...INITIAL_VALUE.artist, id: "wrongId" },
        },
        "any"
      );
    }, new ObjectNotFound("Artist"));
  });

  it("throw user not found", async () => {
    await assert.rejects(async () => {
      await createSong.execute({ ...INITIAL_VALUE, userId: "wrongId" }, "any");
    }, new ObjectNotFound("User"));
  });

  it("throw category not found", async () => {
    await assert.rejects(async () => {
      await createSong.execute(
        {
          ...INITIAL_VALUE,
          category: { ...INITIAL_VALUE.category, id: "wrongId" },
        },
        "any"
      );
    }, new ObjectNotFound("Category"));
  });
});
