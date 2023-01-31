import assert from "assert";
import { Category } from "domain/entities/Category";
import { CategoryRepositoryMemory } from "infra/repositories/memory/CategoryRepositoryMemory";

describe("Filter Categories By Name", async () => {
  it("should filter categories by name", async () => {
    const categoryRepository = new CategoryRepositoryMemory();
    await categoryRepository.create({ id: "any", name: "any" } as Category);
    await categoryRepository.create({ id: "any", name: "bany" } as Category);
    await categoryRepository.create({ id: "any", name: "cany" } as Category);

    const categories = await categoryRepository.list("C");

    assert.deepEqual(categories.length, 1);
  });
});
