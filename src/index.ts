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

dotenv.config();

const server = new ExpressServer();
server.static("public");

server.registerMiddleware(cors({origin:"*"}))
server.registerMiddleware(passport.initialize())

const userRepository=new UserRepositoryMemory()
const encript=new BcryptAdapter()
const identifier=new CryptoIdentifier()

const strategyJwt=new StrategyJwt(userRepository)
const passportMidleware=new PassportMidleware(strategyJwt)

server.registerMiddleware((req,res,next)=>{
  passportMidleware.handle(req,res,next)
})

const jsonWebTokenAdapter = new JsonWebTokenAdapter();

new UserController(server,userRepository,identifier,encript,jsonWebTokenAdapter)
new AuthController(server,userRepository,jsonWebTokenAdapter,encript)

server.listen(parseInt(process.env.PORT as string), () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
