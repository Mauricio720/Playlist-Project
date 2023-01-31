import { CreatePlaylist } from "application/useCases/CreatePlaylst";
import assert from "assert";
import { Playlist } from "domain/entities/Playlist";
import { PlaylistRepositoryMemory } from "infra/repositories/memory/PlaylistRepository";
import { Identifier } from "infra/security/Identifier";
import { SongRepositoryMemory } from "infra/repositories/memory/SongRepositoryMemory";
import { SongNotFound } from "domain/errors/SongNotFound";
import { Song } from "domain/entities/Song";

describe("should create playlist", async () => {
  const identifier: Identifier = {
    createId() {
      return "1";
    },
  };

  const INITIAL_VALUES: Playlist.Props = {
    id: "1",
    title: "any",
    user: {
      id: "any",
      name: "any",
      email: "any",
    },
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
  await songRepository.create(INITIAL_VALUES.songs[0] as Song);
  await songRepository.create(INITIAL_VALUES.songs[1] as Song);

  const createPlaylist = new CreatePlaylist(
    playlistRepository,
    songRepository,
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
});
