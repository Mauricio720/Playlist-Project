import { CreateArtist } from "application/useCases/CreateArtist";
import assert from "assert";
import { AlreadyExists } from "domain/errors/AlreadyExists";
import { ArtistRepositoryMemory } from "infra/repositories/memory/ArtistRepositoryMemory";
import { Identifier } from "infra/security/Identifier";

describe("Create Artist", async () => {
  const identifier: Identifier = {
    createId() {
      return "1";
    },
  };

  const artistRepositoryMemory = new ArtistRepositoryMemory();
  const createArtist = new CreateArtist(identifier, artistRepositoryMemory);

  it("should create artist", async () => {
    const artist = await createArtist.execute({ name: "any", picture: "any" });

    assert.deepEqual(artist.id, "1");
    assert.deepEqual(artist.name, "any");
  });

  it("throw artist already exists", async () => {
    await assert.rejects(async () => {
      await createArtist.execute({ name: "any", picture: "any" });
    }, new AlreadyExists("Artist"));
  });
});
