import { Encrypt } from "./Encrypt";
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypt{
    async compare(password: string, encripted: string): Promise<boolean> {
        return bcrypt.compare(password,encripted)
    }

    encript(password: string): string {
        return bcrypt.hashSync(password, 10);
    }
}