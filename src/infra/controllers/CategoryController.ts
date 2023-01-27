import { CategogyRepository } from "application/repositories/CategoryRepository";
import { CreateCategory } from "application/useCases/CreateCategory";
import { DeleteCategory } from "application/useCases/DeleteCategory";
import { UpdateCategory } from "application/useCases/UpdateCategory";
import { Server } from "infra/http/Server";
import { Identifier } from "infra/security/Identifier";
import { Storage } from "infra/storage/Storage";

export class CategoryController {
  constructor(
    private readonly server: Server,
    private readonly categoryRepository: CategogyRepository,
    private readonly identifier: Identifier,
    private readonly storage: Storage
  ) {
    this.server.post(
      "/category",
      this.storage.middleware({
        key: "file",
        path: "/images/categories/icons",
      }),
      async (req, res) => {
        try {
          const createCategory = new CreateCategory(
            this.identifier,
            this.categoryRepository
          );
          const category = await createCategory.execute(
            req.body.name,
            req.file ? req.file.location : undefined
          );
          res.json(category).end();
        } catch (err) {
          this.storage.deleteFile(req.file.key);
          res.status(400).json(err.message).end();
        }
      }
    );

    this.server.put(
      "/category",
      this.storage.middleware({ key: "file", path: "/images/categories" }),
      async (req, res) => {
        try {
          const updateCategory = new UpdateCategory(
            this.categoryRepository,
            this.storage
          );
          const category = await updateCategory.execute(
            req.body.id,
            req.body.name,
            req.file.location
          );
          res.json(category).end();
        } catch (err) {
          this.storage.deleteFile(req.file.key);
          res.status(400).json(err.message).end();
        }
      }
    );

    this.server.delete("/category", async (req, res) => {
      try {
        const deleteCategory = new DeleteCategory(
          this.categoryRepository,
          this.storage
        );
        await deleteCategory.execute(req.body.id);
        res.end();
      } catch (err) {
        res.status(400).json(err.message).end();
      }
    });

    this.server.get("/all_categories", async (req, res) => {
      try {
        const categories = await this.categoryRepository.list();
        res.json(categories).end();
      } catch (err) {
        res.status(400).json(err.message).end();
      }
    });
  }
}
