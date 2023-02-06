import { User } from "domain/entities/User";
import assert from "assert";
import { FieldMissing } from "domain/errors/FieldMissing";

describe("User", () => {
  const INITIAL_VALUES: User.Props = {
    id: "any",
    name: "any",
    email: "any@any.com",
    password: "any",
    permission: "Adm",
    dateRegister: new Date(),
    favoriteCategory: [
      { id: "any", name: "rock" },
      { id: "any", name: "rap" },
    ],
    favoriteArtist: [{ id: "any", name: "any" }],
  };

  it("should create one new user", () => {
    const user = new User(INITIAL_VALUES);
    assert.deepEqual(user.name, "any");
    assert.deepEqual(user.email, "any@any.com");
    assert.deepEqual(user.password, "any");
    assert.deepEqual(
      new Date(user.dateRegister).toDateString(),
      new Date().toDateString()
    );
    assert.deepEqual(user.active, true);
    assert.deepEqual(user.permission, "Adm");
    assert.deepEqual(user.favoriteCategory.length, 2);
    assert.deepEqual(user.favoriteArtist.length, 1);
  });

  it("throw error name or email or permission missing user", () => {
    assert.throws(() => {
      new User({
        ...INITIAL_VALUES,
        name: "",
        email: "",
        permission: "" as User.Permissions,
      });
    }, new FieldMissing("Name or Email or Permission"));
  });
});
