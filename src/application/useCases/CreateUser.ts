import { Encrypt } from "infra/security/Encrypt";
import { Identifier } from "infra/security/Identifier";
import { UserRepository } from "application/repositories/UserRepository";
import { User } from "domain/entities/User";
import { Authenticator } from "infra/security/Authenticator";
import { Artist } from "domain/entities/Artist";
import { ArtistRepository } from "application/repositories/ArtistRepository";
import { CategogyRepository } from "application/repositories/CategoryRepository";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { Category } from "domain/entities/Category";

export class CreateUser {
  constructor(
    private readonly identifier: Identifier,
    private readonly encrypt: Encrypt,
    private readonly autenticator: Authenticator,
    private readonly userRepository: UserRepository,
    private readonly artistRepository: ArtistRepository,
    private readonly categoryRepository: CategogyRepository
  ) {}

  async execute(data: Omit<User.Props, "id">) {
    const newId = this.identifier.createId();
    const password = this.encrypt.encript(data.password);

    const user = new User({
      ...data,
      id: newId,
      password,
      dateRegister: new Date(),
    });

    const artistNotFound = await this.verifyExistArtist(user.favoriteArtist);
    if (!artistNotFound) {
      throw new ObjectNotFound("Artist");
    }

    const categoryNotFound = await this.verifyExistCategory(
      user.favoriteCategory
    );
    if (!categoryNotFound) {
      throw new ObjectNotFound("Category");
    }

    await this.userRepository.create(user);

    const token = this.autenticator.createToken({
      id: user.id,
      email: user.email,
    });

    return { user, token };
  }

  private async verifyExistArtist(favoriteArtists: Artist[]) {
    let exists = true;

    for (const artistItem of favoriteArtists) {
      const artist = await this.artistRepository.findById(artistItem.id);
      if (!artist) {
        exists = false;
      }
    }

    return exists;
  }

  private async verifyExistCategory(favoriteCategories: Category[]) {
    let exists = true;

    for (const categoryItem of favoriteCategories) {
      const category = await this.categoryRepository.findById(categoryItem.id);
      if (!category) {
        exists = false;
      }
    }

    return exists;
  }
}
