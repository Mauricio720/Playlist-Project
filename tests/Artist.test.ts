import "dotenv/config";
import assert from "assert";
import { Artist } from "domain/entities/Artist";
import { FieldMissing } from "domain/errors/FieldMissing";

describe("Artist", () => {
  it("should create one artist", () => {
    const artist = new Artist({ id: "any", name: "any", picture: "any" });

    assert.deepEqual(artist.id, "any");
    assert.deepEqual(artist.name, "any");
    assert.deepEqual(artist.picture, `${process.env.URI_BACKEND}any`);
  });

  it("throw error name missing artist", () => {
    assert.throws(() => {
      new Artist({
        id: "any",
        name: "",
      });
    }, new FieldMissing("Name"));
  });
});
