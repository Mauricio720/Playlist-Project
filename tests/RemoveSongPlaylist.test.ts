import { AddSongPlaylist } from "application/useCases/AddSongPlaylist";
import { CreateAlbum } from "application/useCases/CreateAlbum";
import { CreateArtist } from "application/useCases/CreateArtist";
import { CreateCategory } from "application/useCases/CreateCategory";
import { CreatePlaylist } from "application/useCases/CreatePlaylst";
import { CreateUser } from "application/useCases/CreateUser";
import { RemoveSongPlaylist } from "application/useCases/RemoveSongPlaylist";
import assert from "assert";
import { Album } from "domain/entities/Album";
import { Playlist } from "domain/entities/Playlist";
import { Song } from "domain/entities/Song";
import { User } from "domain/entities/User";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { AlbumRepositoryMemory } from "infra/repositories/memory/AlbumRepositoryMemory";
import { ArtistRepositoryMemory } from "infra/repositories/memory/ArtistRepositoryMemory";
import { CategoryRepositoryMemory } from "infra/repositories/memory/CategoryRepositoryMemory";
import { PlaylistRepositoryMemory } from "infra/repositories/memory/PlaylistRepository";
import { SongRepositoryMemory } from "infra/repositories/memory/SongRepositoryMemory";
import { UserRepositoryMemory } from "infra/repositories/memory/UserRepositoryMemory";
import { Authenticator } from "infra/security/Authenticator";
import { Encrypt } from "infra/security/Encrypt";
import { Identifier } from "infra/security/Identifier";

describe("Should Add Song In Playlist", async () => {
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
      },
    ],
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
    favoriteCategory: [{ id: "1", name: "rock" }],
    favoriteArtist: [{ id: "1", name: "any" }],
  };

  const INITIAL_VALUE_ALBUM: Album.Props = {
    id: "1",
    name: "any",
    year: "any",
    cover: "any",
    artist: {
      id: "1",
      name: "any",
    },
    songs: [],
  };

  const authenticador: Authenticator = {
    createToken() {
      return "any token";
    },
    decoder() {},
  };

  const albumRepository = new AlbumRepositoryMemory();
  const songRepository = new SongRepositoryMemory();
  const userRepository = new UserRepositoryMemory();
  const categoryRepository = new CategoryRepositoryMemory();
  const artistRepository = new ArtistRepositoryMemory();
  const playlistRepository = new PlaylistRepositoryMemory();

  const createArtist = new CreateArtist(identifier, artistRepository);
  await createArtist.execute({ name: "any" });

  const createAlbum = new CreateAlbum(
    albumRepository,
    artistRepository,
    identifier
  );
  await createAlbum.execute(INITIAL_VALUE_ALBUM);

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

  const song = await songRepository.create(INITIAL_VALUES.songs[0] as Song);

  const createPlaylist = new CreatePlaylist(
    playlistRepository,
    songRepository,
    userRepository,
    identifier
  );
  const playlist = await createPlaylist.execute(INITIAL_VALUES);

  const addSongPlaylist = new AddSongPlaylist(
    playlistRepository,
    songRepository
  );
  await addSongPlaylist.execute(playlist.id, song);

  const removeSongPlaylist = new RemoveSongPlaylist(
    playlistRepository,
    songRepository
  );

  it("should remove song in playlist", async () => {
    const actualPlaylist = await removeSongPlaylist.execute(playlist.id, "any");
    assert.deepEqual(actualPlaylist.songs.length, 0);
  });

  it("throw playlist not found", async () => {
    await assert.rejects(async () => {
      await removeSongPlaylist.execute("wrongId", "any");
    }, new ObjectNotFound("Playlist"));
  });

  it("throw song not found", async () => {
    await assert.rejects(async () => {
      await removeSongPlaylist.execute(playlist.id, "wrongId");
    }, new ObjectNotFound("Song"));
  });
});
