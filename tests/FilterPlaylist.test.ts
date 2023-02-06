import assert from "assert";
import { Playlist } from "domain/entities/Playlist";
import { PlaylistRepositoryMemory } from "infra/repositories/memory/PlaylistRepository";

describe("Filter Playlist By Name", async () => {
  it("should filter playlist by name", async () => {
    const INITIAL_VALUE = {
      id: "any",
      title: "any",
      userId: "any",
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
      ],
    };

    const playlistRepository = new PlaylistRepositoryMemory();
    await playlistRepository.create(INITIAL_VALUE as Playlist);
    await playlistRepository.create({
      ...INITIAL_VALUE,
      title: "bany",
    } as Playlist);

    await playlistRepository.create({
      ...INITIAL_VALUE,
      title: "cany",
    } as Playlist);

    const playlists = await playlistRepository.list("C");

    assert.deepEqual(playlists.length, 1);
  });
});
