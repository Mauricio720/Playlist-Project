import assert from "assert";
import { Album } from "domain/entities/Album";
import { AlbumRepositoryMemory } from "infra/repositories/memory/AlbumRepositoryMemory";

describe("Filter Album By Name", async () => {
  it("should filter album by name", async () => {
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

    const albumRepository = new AlbumRepositoryMemory();
    await albumRepository.create(INITIAL_VALUE as Album);
    await albumRepository.create({ ...INITIAL_VALUE, name: "bany" } as Album);
    await albumRepository.create({ ...INITIAL_VALUE, name: "cany" } as Album);

    const albuns = await albumRepository.list("C");
    assert.deepEqual(albuns.length, 1);
  });
});
