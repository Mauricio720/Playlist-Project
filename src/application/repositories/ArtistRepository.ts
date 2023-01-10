import { Artist } from "domain/entities/Artist";

export interface ArtistRepository{
    list():Promise<Artist[]>;
    create(artist:Artist):Promise<Artist>;
    update(artist:Artist):Promise<Artist>;
    delete(id:string):Promise<void>;
    findById(id:string):Promise<Artist | null>
}