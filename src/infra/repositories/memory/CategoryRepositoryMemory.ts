import { CategogyRepository } from "application/repositories/CategoryRepository";
import { Category } from "domain/entities/Category";

export class CategoryRepositoryMemory implements CategogyRepository {
  private categories: Category[] = [];

  async list(nameCategoryLetter: string): Promise<Category[]> {
    let categories = this.categories;
    if (nameCategoryLetter) {
      categories = this.categories.filter((categoryItem) => {
        let categoryFilter = false;
        for (let index = 0; index < categoryItem.name.length; index++) {
          if (
            categoryItem.name.charAt(index) === nameCategoryLetter.toLowerCase()
          ) {
            categoryFilter = true;
          }
        }
        return categoryFilter;
      });
    }

    return categories;
  }

  async create(category: Category): Promise<Category> {
    this.categories.push(category);
    return category;
  }

  async update(category: Category): Promise<Category> {
    const filterCategories = this.categories.filter(
      (categoryItem) => categoryItem.id !== categoryItem.id
    );
    filterCategories.push(category);
    this.categories = filterCategories;
    return category;
  }

  async delete(id: string): Promise<Category> {
    const index = this.categories.findIndex((category) => category.id === id);
    this.categories[index].active = false;
    return this.categories[index];
  }

  async findById(id: string): Promise<Category | null> {
    return this.categories.find((category) => category.id === id) || null;
  }

  async findByName(name: string): Promise<Category | null> {
    return this.categories.find((category) => category.name === name) || null;
  }
}
