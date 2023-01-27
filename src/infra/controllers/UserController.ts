import { ArtistRepository } from "application/repositories/ArtistRepository";
import { CategogyRepository } from "application/repositories/CategoryRepository";
import { UserRepository } from "application/repositories/UserRepository";
import { CreateUser } from "application/useCases/CreateUser";
import { DeleteUser } from "application/useCases/DeleteUser";
import { UpdateUser } from "application/useCases/UpdateUser";
import { User } from "domain/entities/User";
import { Server } from "infra/http/Server";
import { Authenticator } from "infra/security/Authenticator";
import { Encrypt } from "infra/security/Encrypt";
import { Identifier } from "infra/security/Identifier";

export class UserController {
  constructor(
    private readonly server: Server,
    private readonly userRepository: UserRepository,
    private readonly artistRepository: ArtistRepository,
    private readonly categoryRepository: CategogyRepository,
    private readonly identifier: Identifier,
    private readonly encrypt: Encrypt,
    private readonly autenticator: Authenticator
  ) {
    this.server.post("/user", async (req, res) => {
      try {
        const createUser = new CreateUser(
          this.identifier,
          this.encrypt,
          this.autenticator,
          this.userRepository,
          this.artistRepository,
          this.categoryRepository
        );

        const user = await createUser.execute(
          req.body as Omit<User.Props, "id">
        );
        res.json(user).end();
      } catch (err) {
        res.status(400).json(err.message);
      }
    });

    this.server.put("/user", async (req, res) => {
      try {
        const updateUser = new UpdateUser(this.userRepository, this.encrypt);
        const user = await updateUser.execute(req.body as Partial<User.Props>);
        res.json(user).end();
      } catch (err) {
        res.status(400).json(err.message);
      }
    });

    this.server.delete("/user", async (req, res) => {
      try {
        const deleteUser = new DeleteUser(this.userRepository);
        await deleteUser.execute(req.body.id);
        res.end();
      } catch (err) {
        res.status(400).json(err.message);
      }
    });

    this.server.get("/user", async (req, res) => {
      try {
        const user = await this.userRepository.findById(req.query.id);
        res.json(user).end();
      } catch (err) {
        res.status(400).json(err.message);
      }
    });

    this.server.get("/all_users", async (req, res) => {
      try {
        const users = await this.userRepository.list();
        res.json(users).end();
      } catch (err) {
        res.status(400).json(err.message).end();
      }
    });
  }
}
