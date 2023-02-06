import { Identifier } from "infra/security/Identifier";
import { Encrypt } from "infra/security/Encrypt";
import { CreateUser } from "application/useCases/CreateUser";
import assert from "assert";
import { UserRepositoryMemory } from "infra/repositories/memory/UserRepositoryMemory";
import { Authenticator } from "infra/security/Authenticator";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { User } from "domain/entities/User";
import { ArtistRepositoryMemory } from "infra/repositories/memory/ArtistRepositoryMemory";
import { CreateArtist } from "application/useCases/CreateArtist";
import { CategoryRepositoryMemory } from "infra/repositories/memory/CategoryRepositoryMemory";
import { CreateCategory } from "application/useCases/CreateCategory";
import { AlreadyExists } from "domain/errors/AlreadyExists";

describe("Create User", async () => {
  const INITIAL_VALUES: Omit<User.Props, "id"> = {
    name: "any",
    email: "any@any.com",
    permission: "Adm",
    password: "any",
    favoriteCategory: [{ id: "1", name: "rock" }],
    favoriteArtist: [{ id: "1", name: "any" }],
  };

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

  const createArtist = new CreateArtist(identifier, artistRepository);
  await createArtist.execute({ name: "newArtist" });

  const createCategory = new CreateCategory(identifier, categoryRepository);
  await createCategory.execute("Rock");

  it("should create user", async () => {
    const { user, token } = await createUser.execute(INITIAL_VALUES);
    assert.deepEqual(token, "any token");
    assert.deepEqual(user.id, "1");
    assert.deepEqual(user.password, "any_enc");
    assert.deepEqual(
      user.dateRegister.toDateString(),
      new Date().toDateString()
    );
  });

  it("throw email already exists", async () => {
    await assert.rejects(async () => {
      await createUser.execute({
        name: "any",
        email: "any@any.com",
        permission: "Adm",
        password: "any",
        favoriteCategory: [
          { id: "any", name: "rock" },
          { id: "any", name: "rap" },
        ],
        favoriteArtist: [{ id: "any", name: "any" }],
      });
    }, new AlreadyExists("Email"));
  });

  it("throw artist not exists", async () => {
    await assert.rejects(async () => {
      await createUser.execute({
        name: "any",
        email: "any2@any.com",
        permission: "Adm",
        password: "any",
        favoriteCategory: [
          { id: "any", name: "rock" },
          { id: "any", name: "rap" },
        ],
        favoriteArtist: [{ id: "any", name: "any" }],
      });
    }, new ObjectNotFound("Artist"));
  });

  it("throw category not exists", async () => {
    await assert.rejects(async () => {
      await createUser.execute({
        name: "any",
        email: "any3@any.com",
        permission: "Adm",
        password: "any",
        favoriteCategory: [
          { id: "any", name: "rock" },
          { id: "any", name: "rap" },
        ],
        favoriteArtist: [{ id: "1", name: "any" }],
      });
    }, new ObjectNotFound("Category"));
  });
});
