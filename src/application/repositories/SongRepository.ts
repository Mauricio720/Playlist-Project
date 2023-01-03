import { Song } from "domain/entities/Song";

export interface SongRepository{
    list():Promise<Song[]>;
    create(song:Song):Promise<Song>;
    update(song:Song):Promise<Song>;
    delete(id:string):void;
}