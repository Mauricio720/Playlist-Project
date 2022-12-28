import { Album } from "./Album";
import { Artist } from "./Artist";
import { Category } from "./Category";
import { User } from "./User";

export namespace Song{
    export interface Props{
        readonly id: string;
        title:string;
        category:Category;
        duration:number;
        pathSongFile:string;
        artist:Artist;
        album:Album;
        dateRegister:Date;
        user:User.Props;
    }
}

export class Song{
    public readonly id:string;
    public title:string;
    public category:Category;
    public duration:number;
    public pathSongFile:string;
    public artist:Artist;
    public album:Album;
    public dateRegister:Date;
    public user:User;

    constructor(props:Song.Props){
        Object.assign(this,props)
    }
}