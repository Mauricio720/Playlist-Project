import { Identifier } from "infra/security/Identifier";
import { Encrypt } from "infra/security/Encrypt";
import { CreateUser } from "application/useCases/CreateUser";
import { UserRepositoryMemory } from "infra/repositories/memory/UserRepositoryMemory";
import { Authenticator } from "infra/security/Authenticator";
import assert from "assert";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { UpdateUser } from "application/useCases/UpdateUser";
import { DeleteUser } from "application/useCases/DeleteUser";
import { Category } from "domain/entities/Category";
import { ArtistRepositoryMemory } from "infra/repositories/memory/ArtistRepositoryMemory";
import { CategoryRepositoryMemory } from "infra/repositories/memory/CategoryRepositoryMemory";

describe("Delete User", async () => {
  const userRepository = new UserRepositoryMemory();
  const artistRepository = new ArtistRepositoryMemory();
  const categoryRepository = new CategoryRepositoryMemory();

  const identifier: Identifier = {
    createId() {
      return "1";
    },
  };

  const encrypt: Encrypt = {
    async compare(password, encripted) {
      return `${password}_enc` === encripted;
    },
    encript(password) {
      return `${password}_enc`;
    },
  };

  const authenticador: Authenticator = {
    createToken() {
      return "any token";
    },
    decoder() {},
  };

  const createUser = new CreateUser(
    identifier,
    encrypt,
    authenticador,
    userRepository,
    artistRepository,
    categoryRepository
  );
  const { user } = await createUser.execute({
    name: "any",
    email: "any@any.com",
    password: "any",
    favoriteCategory: [
      { id: "any", name: "rock" } as Category,
      { id: "any", name: "rap" } as Category,
    ],
    favoriteArtist: [{ id: "any", name: "any" }],
  });

  it("should delete user", async () => {
    const deleteUser = new DeleteUser(userRepository);
    const userDeleted = await deleteUser.execute(user.id);

    assert.deepEqual(userDeleted.active, false);
  });

  it("throw error user not found", async () => {
    const updateUser = new UpdateUser(userRepository, encrypt);

    await assert.rejects(async () => {
      await updateUser.execute({
        id: "not found",
        name: "anyEdit",
        email: "any@any.com",
        password: "anyEdit",
        favoriteCategory: [
          { id: "any", name: "rock" },
          { id: "any", name: "hip-hop" },
          { id: "any", name: "eletronica" },
        ],
        favoriteArtist: [
          { id: "any", name: "any" },
          { id: "any", name: "any2" },
        ],
      });
    }, new ObjectNotFound("User"));
  });
});
