import { ExpressServer } from "infra/http/ExpressServer";
import * as dotenv from "dotenv";

dotenv.config();

const expressServer = new ExpressServer();
expressServer.static("public");

expressServer.listen(parseInt(process.env.PORT as string), () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
