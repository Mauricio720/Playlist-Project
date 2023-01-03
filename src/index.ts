import { ExpressServer } from "infra/http/ExpressServer";
import * as dotenv from "dotenv";
import cors from "cors"
import { UserRepositoryMemory } from "infra/repositories/memory/UserRepositoryMemory";
import { BcryptAdapter } from "infra/security/BcryptAdapter";
import { CryptoIdentifier } from "infra/security/CryptoIdentifier";
import { UserController } from "infra/controllers/UserController";
import passport from "passport";
import { PassportMidleware } from "infra/http/middleware/PassportMiddleware";
import { StrategyJwt } from "infra/security/StrategyJwt";
import { JsonWebTokenAdapter } from "infra/security/JsonWebToken";
import { AuthController } from "infra/controllers/AuthController";
import { SongController } from "infra/controllers/SongController";
import { SongRepositoryMemory } from "infra/repositories/memory/SongRepositoryMemory";
import { CategoryController } from "infra/controllers/CategoryController";
import { CategoryRepositoryMemory } from "infra/repositories/memory/CategoryRepositoryMemory";
import { LocalStorageAdapter } from "infra/storage/LocalStorageAdapter";

dotenv.config();

const server = new ExpressServer();
server.static("public");

server.registerMiddleware(cors({origin:"*"}))
server.registerMiddleware(passport.initialize())

const encript=new BcryptAdapter()
const identifier=new CryptoIdentifier()

const userRepository=new UserRepositoryMemory()
const strategyJwt=new StrategyJwt(userRepository)
const passportMidleware=new PassportMidleware(strategyJwt)

server.registerMiddleware((req,res,next)=>{
  passportMidleware.handle(req,res,next)
})

const jsonWebTokenAdapter = new JsonWebTokenAdapter();
const storage=new LocalStorageAdapter();

const songRepository=new SongRepositoryMemory()
const categoryRepository=new CategoryRepositoryMemory()

new UserController(server,userRepository,identifier,encript,jsonWebTokenAdapter)
new AuthController(server,userRepository,jsonWebTokenAdapter,encript)
new SongController(server,songRepository,identifier)
new CategoryController(server,categoryRepository,identifier,storage)

server.listen(parseInt(process.env.PORT as string), () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
