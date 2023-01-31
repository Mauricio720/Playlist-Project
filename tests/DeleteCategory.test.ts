import assert from "assert";

import { CreateCategory } from "application/useCases/CreateCategory";
import { DeleteCategory } from "application/useCases/DeleteCategory";
import { CategoryNotFound } from "domain/errors/CategoryNotFound";
import { CategoryRepositoryMemory } from "infra/repositories/memory/CategoryRepositoryMemory";
import { Identifier } from "infra/security/Identifier";

describe("Delete Category", async () => {
  const identifier: Identifier = {
    createId() {
      return "1";
    },
  };

  const categoryRepository = new CategoryRepositoryMemory();
  const createCategory = new CreateCategory(identifier, categoryRepository);
  const category = await createCategory.execute("any", "any");

  it("should delete category", async () => {
    const deleteCategory = new DeleteCategory(categoryRepository);
    const categoryDeleted = await deleteCategory.execute(category.id);

    assert.deepEqual(categoryDeleted.active, false);
  });

  it("throw error when not found category by id", async () => {
    await assert.rejects(async () => {
      const deleteCategory = new DeleteCategory(categoryRepository);
      await deleteCategory.execute("any");
    }, new CategoryNotFound());
  });
});
