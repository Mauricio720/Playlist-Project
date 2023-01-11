import { AlbumRepository } from "application/repositories/AlbumRepository";
import { ArtistRepository } from "application/repositories/ArtistRepository";
import { SongRepository } from "application/repositories/SongRepository";
import { Album } from "domain/entities/Album";
import { Artist } from "domain/entities/Artist";
import { Category } from "domain/entities/Category";
import { Song } from "domain/entities/Song";
import { User } from "domain/entities/User";
import { Identifier } from "infra/security/Identifier";

export class CreateSong{
    constructor(
        private readonly songRepository:SongRepository,
        private readonly artistRepository:ArtistRepository,
        private readonly albumRepository:AlbumRepository,
        private readonly identifier:Identifier,
    ){}

    async execute(
        data:CreateSongDTO,
        songFile:string,
        artistFile?:string,
        albumFile?:string){
        
        const newId=this.identifier.createId()
        
        if(!data.artist.id){
            const artist=new Artist({
                ...data.artist
                ,id:this.identifier.createId(),
                picture:artistFile
            })
            
            await this.artistRepository.create(artist);
            
            data.artist=artist;
            data.album.artist=artist;
        }

        if(!data.album.id){
            const album=new Album({
                ...data.album,
                id:this.identifier.createId(),
                cover:albumFile
            })
            await this.albumRepository.create(album)
            data.album=album;
        }

        const song=new Song({...data,id:newId,
            pathSongFile:songFile,
        })
        
        return await this.songRepository.create(song)
    }
}

export type CreateSongDTO={
    title:string,
    category:Omit<Category.Props,'cover'>,
    duration:number,
    artist:Artist.Props,
    album:Album.Props,
    user:User.Props
}