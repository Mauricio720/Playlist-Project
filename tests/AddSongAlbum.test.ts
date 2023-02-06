import { AddSongAlbum } from "application/useCases/AddSongAlbum";
import { CreateAlbum } from "application/useCases/CreateAlbum";
import { CreateArtist } from "application/useCases/CreateArtist";
import { CreateSong, CreateSongDTO } from "application/useCases/CreateSong";
import assert from "assert";
import { Album } from "domain/entities/Album";
import { Song } from "domain/entities/Song";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { AlbumRepositoryMemory } from "infra/repositories/memory/AlbumRepositoryMemory";
import { ArtistRepositoryMemory } from "infra/repositories/memory/ArtistRepositoryMemory";
import { CategoryRepositoryMemory } from "infra/repositories/memory/CategoryRepositoryMemory";
import { SongRepositoryMemory } from "infra/repositories/memory/SongRepositoryMemory";
import { UserRepositoryMemory } from "infra/repositories/memory/UserRepositoryMemory";
import { Identifier } from "infra/security/Identifier";

describe("Add song in album", async () => {
  const INITIAL_VALUE_SONG: Omit<Song.Props, "album"> = {
    id: "1",
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
    userId: "any",
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

  const INITIAL_VALUE_SONG_ONE: CreateSongDTO = {
    title: "any",
    category: {
      id: "any",
      name: "any",
    },
    duration: 1.0,
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
  };

  const identifier: Identifier = {
    createId() {
      return "1";
    },
  };

  const albumRepository = new AlbumRepositoryMemory();
  const songRepository = new SongRepositoryMemory();
  const userRepository = new UserRepositoryMemory();
  const artistRepository = new ArtistRepositoryMemory();
  const categoryRepository = new CategoryRepositoryMemory();

  const createArtist = new CreateArtist(identifier, artistRepository);
  const createAlbum = new CreateAlbum(
    albumRepository,
    artistRepository,
    identifier
  );

  const createSong = new CreateSong(
    songRepository,
    artistRepository,
    albumRepository,
    userRepository,
    categoryRepository,
    identifier
  );

  await createArtist.execute({ name: "any" });
  await createAlbum.execute(INITIAL_VALUE_ALBUM);
  await createSong.execute(INITIAL_VALUE_SONG_ONE, "any");

  const addSongAlbum = new AddSongAlbum(albumRepository, songRepository);

  it("should add songs in album", async () => {
    const album = await addSongAlbum.execute(INITIAL_VALUE_ALBUM.id, [
      INITIAL_VALUE_SONG,
    ]);

    assert.deepEqual(album.songs.length, 1);
  });

  it("throw album not found", async () => {
    await assert.rejects(async () => {
      await addSongAlbum.execute("wrongId", [
        { ...INITIAL_VALUE_SONG, id: "wrongId" },
      ]);
    }, new ObjectNotFound("Album"));
  });

  it("throw song not found", async () => {
    await assert.rejects(async () => {
      await addSongAlbum.execute(INITIAL_VALUE_ALBUM.id, [
        { ...INITIAL_VALUE_SONG, id: "wrongId" },
      ]);
    }, new ObjectNotFound("Song"));
  });
});
