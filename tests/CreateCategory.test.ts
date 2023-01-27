import { CreateCategory } from "application/useCases/CreateCategory";
import assert from "assert";
import { AlreadyExists } from "domain/errors/AlreadyExists";
import { CategoryRepositoryMemory } from "infra/repositories/memory/CategoryRepositoryMemory";
import { Identifier } from "infra/security/Identifier";

describe("Create New Category", () => {
  const identifier: Identifier = {
    createId() {
      return "1";
    },
  };

  const categoryRepository = new CategoryRepositoryMemory();
  const createCategory = new CreateCategory(identifier, categoryRepository);

  it("should create new category", async () => {
    const category = await createCategory.execute("any", "any");

    assert.deepEqual(category.id, "1");
    assert.deepEqual(category.name, "any");
    assert.deepEqual(category.icon, "any");
  });

  it("throw category already exists", async () => {
    await assert.rejects(async () => {
      await createCategory.execute("any", "any");
    }, new AlreadyExists("Category"));
  });
});
