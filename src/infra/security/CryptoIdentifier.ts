import { randomUUID } from 'crypto'
import { Identifier } from './Identifier';

export class CryptoIdentifier implements Identifier{
    createId(): string {
        return randomUUID().toString()
    }
}