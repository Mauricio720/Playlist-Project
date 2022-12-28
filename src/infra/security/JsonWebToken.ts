import jsonwebtoken from "jsonwebtoken";
import { Authenticator } from "./Authenticator";
import * as dotenv from "dotenv";

export class JsonWebTokenAdapter implements Authenticator{
   
    createToken(payload: any): string {
        dotenv.config();

        return jsonwebtoken.sign(payload,process.env.JWT_SECRET_KEY as string , {
          expiresIn: "1days",
          mutatePayload: true,
        });
      }
    
      decoder(token: string): any {
        return jsonwebtoken.decode(token);
      }
}