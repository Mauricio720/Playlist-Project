import { Handler } from "infra/http/Http";

export type StorageProps= {path: string; key: string}

export interface Storage {
    middleware(props:StorageProps, mimeType?:string):Handler;
    deleteFile(name: string): Promise<void>
}