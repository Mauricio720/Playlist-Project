import { ExpressServer } from "infra/http/ExpressServer";
import * as dotenv from "dotenv";
import cors from "cors"
import { UserRepositoryMemory } from "infra/repositories/memory/UserRepositoryMemory";
import { BcryptAdapter } from "infra/security/BcryptAdapter";
import { CryptoIdentifier } from "infra/security/CryptoIdentifier";
import { UserController } from "infra/controllers/UserController";



dotenv.config();

const server = new ExpressServer();
server.static("public");
server.registerMiddleware(cors({origin:"*"}))

const userRepository=new UserRepositoryMemory()
const encript=new BcryptAdapter()
const identifier=new CryptoIdentifier()

new UserController(server,userRepository,identifier,encript)

server.listen(parseInt(process.env.PORT as string), () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
