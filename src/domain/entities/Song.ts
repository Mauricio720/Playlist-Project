import { FieldMissing } from "domain/errors/FieldMissing";
import { Album } from "./Album";
import { Artist } from "./Artist";
import { Category } from "./Category";
import { User } from "./User";

export namespace Song{
    export interface Props{
        readonly id: string;
        title:string;
        category:Category.Props;
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
        
        this.missingInputs()
    }

    private missingInputs(){
        if(!this.title || !this.category || !this.duration || !this.pathSongFile || !this.artist || !this.album || !this.user){
            throw new FieldMissing("Title or Category or Duration or PathSongFile or Artist or Album or User")
        }
    }
}