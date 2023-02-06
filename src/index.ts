import "dotenv/config";
import cors from "cors";
import { ExpressServer } from "infra/http/ExpressServer";
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
import { AlbumRepositoryMemory } from "infra/repositories/memory/AlbumRepositoryMemory";
import { ArtistRepositoryMemory } from "infra/repositories/memory/ArtistRepositoryMemory";
import { AlbumController } from "infra/controllers/AlbumController";
import { PlaylistRepositoryMemory } from "infra/repositories/memory/PlaylistRepository";
import { PlaylistController } from "infra/controllers/PlaylistController";
import { UserRepositoryDatabase } from "infra/repositories/database/UserRepositoryDatabase";
import { DatabaseAdapter } from "infra/database/DatabaseAdapter";
import { MongoDBConnect } from "infra/database/MongoDBConnect";
import { ArtistController } from "infra/controllers/ArtistController";
import { ArtistRepositoryDatabase } from "infra/repositories/database/ArtistRepositoryDatabase";
import { CategoryRepositoryDatabase } from "infra/repositories/database/CategoryRepositoryDatabase";
import { SongRepositoryDatabase } from "infra/repositories/database/SongRepositoryDatabase";
import { AlbumRepositoryDatabase } from "infra/repositories/database/AlbumRepositoryDatabase";
import { PlaylistRepositoryDatabase } from "infra/repositories/database/PlaylistRepositoryDatabase";
import { GatesJwtMidleware } from "infra/http/middleware/GatesJwtMidleware";
import { AuthMidleware } from "infra/http/middleware/AuthMidleware";

const server = new ExpressServer();
server.static("public");

server.registerMiddleware(cors({ origin: "*" }));
server.registerMiddleware(passport.initialize());

const encript = new BcryptAdapter();
const identifier = new CryptoIdentifier();

const userRepository = new UserRepositoryDatabase(
  new DatabaseAdapter(new MongoDBConnect())
);
const strategyJwt = new StrategyJwt(userRepository);
const passportMidleware = new PassportMidleware(strategyJwt);

server.registerMiddleware((req, res, next) => {
  passportMidleware.handle(req, res, next);
});

const gatesJwtMidleware = new GatesJwtMidleware(strategyJwt);
server.registerMiddleware((req, res, next) => {
  gatesJwtMidleware.handle(req, res, next);
});

const authMidleware = new AuthMidleware(strategyJwt);
server.registerMiddleware((req, res, next) => {
  authMidleware.handle(req, res, next);
});

const jsonWebTokenAdapter = new JsonWebTokenAdapter();
const storage = new LocalStorageAdapter();

const songRepository = new SongRepositoryDatabase(
  new DatabaseAdapter(new MongoDBConnect())
);
const categoryRepository = new CategoryRepositoryDatabase(
  new DatabaseAdapter(new MongoDBConnect())
);
const artistRepository = new ArtistRepositoryDatabase(
  new DatabaseAdapter(new MongoDBConnect())
);
const albumRepository = new AlbumRepositoryDatabase(
  new DatabaseAdapter(new MongoDBConnect())
);
const playlistRepository = new PlaylistRepositoryDatabase(
  new DatabaseAdapter(new MongoDBConnect())
);

new UserController(
  server,
  userRepository,
  artistRepository,
  categoryRepository,
  identifier,
  encript,
  jsonWebTokenAdapter
);
new AuthController(server, userRepository, jsonWebTokenAdapter, encript);
new ArtistController(server, artistRepository, identifier, storage);
new SongController(
  server,
  songRepository,
  artistRepository,
  albumRepository,
  userRepository,
  categoryRepository,
  identifier,
  storage
);
new CategoryController(server, categoryRepository, identifier, storage);
new AlbumController(
  server,
  albumRepository,
  artistRepository,
  songRepository,
  identifier,
  storage
);
new PlaylistController(server, playlistRepository, songRepository, identifier);

server.listen(parseInt(process.env.PORT as string), () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
