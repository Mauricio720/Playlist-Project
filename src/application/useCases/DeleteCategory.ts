import { CategogyRepository } from "application/repositories/CategoryRepository";
import { CategoryNotFound } from "domain/errors/CategoryNotFound";

export class DeleteCategory {
  constructor(private readonly categoryRepository: CategogyRepository) {}

  async execute(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (category === null) {
      throw new CategoryNotFound();
    }

    return await this.categoryRepository.delete(id);
  }
}
