import { CategogyRepository } from "application/repositories/CategoryRepository";
import { Category } from "domain/entities/Category";
import { AlreadyExists } from "domain/errors/AlreadyExists";
import { Identifier } from "infra/security/Identifier";

export class CreateCategory {
  constructor(
    private readonly identifier: Identifier,
    private readonly categoryRepository: CategogyRepository
  ) {}

  async execute(name: string, file?: string): Promise<Category> {
    const category = new Category({
      id: this.identifier.createId(),
      name,
      icon: file,
    } as Category);

    const categoryAlreadyExists = await this.categoryRepository.findByName(
      name
    );
    if (categoryAlreadyExists) {
      throw new AlreadyExists("Category");
    }
    await this.categoryRepository.create(category);

    return category;
  }
}
