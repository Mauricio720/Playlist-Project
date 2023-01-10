import { AlbumRepository } from "application/repositories/AlbumRepository";
import { ArtistRepository } from "application/repositories/ArtistRepository";
import { Album } from "domain/entities/Album";
import { Artist } from "domain/entities/Artist";
import { Identifier } from "infra/security/Identifier";

export class CreateAlbum{
    constructor(
        private readonly albumRepository:AlbumRepository,
        private readonly artistRepository:ArtistRepository,
        private readonly identifier:Identifier,
    ){}

    async execute(data:Album.Props,coverFile?:string):Promise<Album>{
        if(!data.artist.id){
            const artist=new Artist({...data,id:this.identifier.createId()})
            data.artist=artist;
            await this.artistRepository.create(artist)
        }
        
        const album=new Album({...data,id:this.identifier.createId(),cover:coverFile})
        return await this.albumRepository.create(album);
    }
}