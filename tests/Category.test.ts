import assert from "assert";
import { Category } from "domain/entities/Category";
import { FieldMissing } from "domain/errors/FieldMissing";

describe("Category", () => {
  it("should create one category", () => {
    const category = new Category({ id: "any", name: "any" });
    assert.deepEqual(category.id, "any");
    assert.deepEqual(category.name, "any");
  });

  it("throw error name missing category", () => {
    assert.throws(() => {
      new Category({ id: "any", name: "" });
    }, new FieldMissing("Name"));
  });
});
