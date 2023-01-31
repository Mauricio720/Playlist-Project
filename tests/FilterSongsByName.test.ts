import assert from "assert";
import { Song } from "domain/entities/Song";
import { SongRepositoryMemory } from "infra/repositories/memory/SongRepositoryMemory";

describe("Filter Songs By Name", async () => {
  it("should filter songs by name", async () => {
    const INITIAL_VALUE: Song.Props = {
      id: "any",
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
      pathSongFile: "any",
      userId: "1",
    };

    const songRepository = new SongRepositoryMemory();
    await songRepository.create(INITIAL_VALUE as Song);
    await songRepository.create({ ...INITIAL_VALUE, title: "bany" } as Song);
    await songRepository.create({ ...INITIAL_VALUE, title: "cany" } as Song);
    const songs = await songRepository.list("C");

    assert.deepEqual(songs.length, 1);
  });
});
