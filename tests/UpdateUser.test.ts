import { CreateUser } from "application/useCases/CreateUser";
import { UserRepositoryMemory } from "infra/repositories/memory/UserRepositoryMemory";
import { Encrypt } from "infra/security/Encrypt";
import { Identifier } from "infra/security/Identifier";
import { Authenticator } from "infra/security/Authenticator";
import { User } from "domain/entities/User";
import assert from "assert";
import { UpdateUser } from "application/useCases/UpdateUser";
import { UserExists } from "domain/errors/UserExists";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { ArtistRepositoryMemory } from "infra/repositories/memory/ArtistRepositoryMemory";
import { CategoryRepositoryMemory } from "infra/repositories/memory/CategoryRepositoryMemory";

describe("Update User", async () => {
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
  const userData: Omit<User.Props, "id"> = {
    name: "any",
    email: "any@any.com",
    password: "any",
    favoriteCategory: [
      { id: "any", name: "rock" },
      { id: "any", name: "rap" },
    ],
    favoriteArtist: [{ id: "any", name: "any" }],
  };

  const { user } = await createUser.execute(userData);

  it("should update user", async () => {
    const updateUser = new UpdateUser(userRepository, encrypt);
    const userModify = await updateUser.execute({
      id: user.id,
      name: "anyEdit",
      email: "anyEdit@anyEdit.com",
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

    assert.deepEqual(userModify.id, user.id);
    assert.deepEqual(userModify.name, "anyEdit");
    assert.deepEqual(userModify.email, "anyEdit@anyEdit.com");
    assert.deepEqual(userModify.password, "anyEdit_enc");
    assert.deepEqual(userModify.favoriteCategory.length, 3);
    assert.deepEqual(userModify.favoriteCategory[2].name, "eletronica");
    assert.deepEqual(userModify.favoriteArtist.length, 2);
  });

  it("throw error user not found", async () => {
    const updateUser = new UpdateUser(userRepository, encrypt);

    assert.rejects(async () => {
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

  it("throw error user already exists", async () => {
    const updateUser = new UpdateUser(userRepository, encrypt);

    assert.rejects(async () => {
      await updateUser.execute({
        id: user.id,
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
    }, new UserExists());
  });
});
