import { CategogyRepository } from "application/repositories/CategoryRepository";
import { Category } from "domain/entities/Category";
import { Database } from "infra/database/Database";

export class CategoryRepositoryDatabase implements CategogyRepository {
  constructor(private readonly connection: Database) {
    this.connection.setDatabase("categories");
  }

  async list(): Promise<Category[]> {
    const response = await this.connection.get({});
    const categories = [];

    for (const category of response) {
      categories.push(new Category(category));
    }

    return categories;
  }

  async create(category: Category): Promise<Category> {
    await this.connection.create(category);
    return category;
  }

  async update(category: Category): Promise<Category> {
    await this.connection.update({ id: category.id }, category);
    return category;
  }

  async delete(id: string): Promise<void> {
    await this.connection.delete({ id });
  }

  async findById(id: string): Promise<Category | null> {
    const categories = await this.connection.get<Category | null>({
      id,
    });

    if (!categories[0]) {
      return null;
    }

    return new Category(categories[0]);
  }

  async findByName(name: string): Promise<Category | null> {
    const categories = await this.connection.get<Category | null>({
      name,
    });

    if (!categories[0]) {
      return null;
    }

    return new Category(categories[0]);
  }
}
