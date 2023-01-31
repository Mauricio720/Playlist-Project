import assert from "assert";
import { ArtistRepositoryMemory } from "infra/repositories/memory/ArtistRepositoryMemory";

describe("Filter Artist By Name", async () => {
  it("should filter artist by name", async () => {
    const artistRepository = new ArtistRepositoryMemory();
    await artistRepository.create({ id: "any", name: "any", picture: "any" });
    await artistRepository.create({ id: "any", name: "bany", picture: "any" });
    await artistRepository.create({ id: "any", name: "cany", picture: "any" });

    const artists = await artistRepository.list("C");
    assert.deepEqual(artists.length, 1);
  });
});
