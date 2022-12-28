import { FieldMissing } from "domain/errors/FieldMissing";
import { Artist } from "./Artist";

export namespace Album{
    export interface Props{
        readonly id:string;
        name:string;
        year:string;
        artist:Artist;
        cover?:string;
    }
}

export class Album{
    public readonly id:string;
    public name:string;
    public year:string;
    public artist:Artist;
    public cover:string;

    constructor(props:Album.Props){
        Object.assign(this,props);
        if(!this.name || !this.year || !this.artist){
            throw new FieldMissing("Name and Year and Artist")
        }

    }
}