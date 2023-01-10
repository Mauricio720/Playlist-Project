import { FieldMissing } from "domain/errors/FieldMissing";
import { Album } from "./Album";
import { Artist } from "./Artist";
import { Category } from "./Category";
import { User } from "./User";
import "dotenv/config";


export namespace Song{
    export interface Props{
        readonly id: string;
        title:string;
        category:Category.Props;
        duration:number;
        pathSongFile:string;
        artist:Artist.Props;
        album:Album.Props;
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
    public public=false;

    constructor(props:Song.Props){
        Object.assign(this,props)
        this.missingInputs()
        this.dateRegister=new Date()
        this.pathSongFile=`${process.env.URI_BACKEND}${this.pathSongFile}`
    }

    changePublic(){
        this.public=!this.public;
    }

    private missingInputs(){
        if(!this.title || !this.category || !this.duration || !this.artist || !this.album || !this.user){
            throw new FieldMissing("Title or Category or Duration or PathSongFile or Artist or Album or User")
        }
    }
}