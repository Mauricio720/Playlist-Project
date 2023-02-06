import { CreatePlaylist } from "application/useCases/CreatePlaylst";
import assert from "assert";
import { Playlist } from "domain/entities/Playlist";
import { PlaylistRepositoryMemory } from "infra/repositories/memory/PlaylistRepository";
import { Identifier } from "infra/security/Identifier";
import { SongRepositoryMemory } from "infra/repositories/memory/SongRepositoryMemory";
import { SongNotFound } from "domain/errors/SongNotFound";
import { Song } from "domain/entities/Song";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { UserRepositoryMemory } from "infra/repositories/memory/UserRepositoryMemory";
import { CreateUser } from "application/useCases/CreateUser";
import { CreateArtist } from "application/useCases/CreateArtist";
import { CreateCategory } from "application/useCases/CreateCategory";
import { Authenticator } from "infra/security/Authenticator";
import { Encrypt } from "infra/security/Encrypt";
import { ArtistRepositoryMemory } from "infra/repositories/memory/ArtistRepositoryMemory";
import { CategoryRepositoryMemory } from "infra/repositories/memory/CategoryRepositoryMemory";
import { User } from "domain/entities/User";

describe("should create playlist", async () => {
  const identifier: Identifier = {
    createId() {
      return "1";
    },
  };

  const INITIAL_VALUES: Playlist.Props = {
    id: "1",
    title: "any",
    userId: "1",
    songs: [
      {
        id: "any",
        title: "any",
        category: {
          id: "any",
          name: "any",
        },
        duration: 1.0,
        pathSongFile: "any",
        artist: {
          id: "any",
          name: "any",
          picture: "any",
        },
        album: {
          id: "any",
          name: "any",
          year: "any",
          cover: "any",
          artist: {
            id: "any",
            name: "any",
            picture: "any",
          },
        },
        userId: "any",
      },

      {
        id: "any",
        title: "any2",
        category: {
          id: "any",
          name: "any",
        },
        duration: 2.0,
        pathSongFile: "any",
        artist: {
          id: "any",
          name: "any",
          picture: "any",
        },
        album: {
          id: "any",
          name: "any",
          year: "any",
          cover: "any",
          artist: {
            id: "any",
            name: "any",
            picture: "any",
          },
        },
        userId: "any",
      },
    ],
  };

  const playlistRepository = new PlaylistRepositoryMemory();
  const songRepository = new SongRepositoryMemory();

  const INITIAL_VALUES_USER: Omit<User.Props, "id"> = {
    name: "any",
    email: "any@any.com",
    permission: "Adm",
    password: "any",
    favoriteCategory: [{ id: "1", name: "rock" }],
    favoriteArtist: [{ id: "1", name: "any" }],
  };

  const userRepository = new UserRepositoryMemory();
  const artistRepository = new ArtistRepositoryMemory();
  const categoryRepository = new CategoryRepositoryMemory();

  const encrypt: Encrypt = {
    async compare(password, encripted) {
      return `${password}_enc` === encripted;
    },
    encript(password) {
      return `${password}_enc`;
    },
  };

  const authenticador: Authenticator = {
    createToken() {
      return "any token";
    },
    decoder() {},
  };

  const createArtist = new CreateArtist(identifier, artistRepository);
  await createArtist.execute({ name: "newArtist" });

  const createCategory = new CreateCategory(identifier, categoryRepository);
  await createCategory.execute("Rock");

  const createUser = new CreateUser(
    identifier,
    encrypt,
    authenticador,
    userRepository,
    artistRepository,
    categoryRepository
  );
  await createUser.execute(INITIAL_VALUES_USER);

  await songRepository.create(INITIAL_VALUES.songs[0] as Song);
  await songRepository.create(INITIAL_VALUES.songs[1] as Song);

  const createPlaylist = new CreatePlaylist(
    playlistRepository,
    songRepository,
    userRepository,
    identifier
  );

  it("should create playlist", async () => {
    const playlist = await createPlaylist.execute(INITIAL_VALUES);

    assert.deepEqual(playlist.id, "1");
    assert.deepEqual(playlist.date.toDateString(), new Date().toDateString());
  });

  it("throw error when some song to list not found", async () => {
    await assert.rejects(async () => {
      await createPlaylist.execute({
        ...INITIAL_VALUES,
        songs: [{ ...INITIAL_VALUES.songs[0], id: "wrongId" }],
      });
    }, new SongNotFound());
  });

  it("throw user not found", async () => {
    await assert.rejects(async () => {
      await createPlaylist.execute({ ...INITIAL_VALUES, userId: "wrongId" });
    }, new ObjectNotFound("User"));
  });
});
