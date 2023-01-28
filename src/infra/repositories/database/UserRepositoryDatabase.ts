import { UserRepository } from "application/repositories/UserRepository";
import { User } from "domain/entities/User";
import { Database } from "infra/database/Database";

export class UserRepositoryDatabase implements UserRepository {
  constructor(private readonly connection: Database) {
    this.connection.setDatabase("users");
  }

  async list(): Promise<User[]> {
    const response = await this.connection.get({ active: true });
    const users = [];

    for (const user of response) {
      delete user.password;
      users.push(new User(user));
    }

    return users;
  }

  async create(user: User): Promise<User> {
    await this.connection.create(user);
    return user;
  }

  async update(user: User): Promise<User> {
    await this.connection.update({ id: user.id }, user);
    return user;
  }

  async delete(id: string): Promise<User> {
    await this.connection.update({ id }, { active: false });
    return await this.findById(id);
  }

  async findById(id: string): Promise<User | null> {
    const users = await this.connection.get<User | null>({
      id,
      active: true,
    });

    if (!users[0]) {
      return null;
    }

    return new User(users[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.connection.get<User | null>({
      email,
      active: true,
    });

    if (!users[0]) {
      return null;
    }

    return new User(users[0]);
  }
}
