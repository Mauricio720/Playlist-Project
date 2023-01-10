import { Handler } from "infra/http/Http";

export type StorageFields={
    name:string,
    path:string,
    mimeType?:string,
    maxCount?:number,
    
}

export type StorageProps= {path: string; key: string}

export interface Storage {
    middleware(props:StorageProps, mimeType?:string):Handler;
    middlewareMultiple(props: StorageFields[]):Handler;
    deleteFile(name: string): Promise<void>
}