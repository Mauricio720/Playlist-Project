import { AlbumRepository } from "application/repositories/AlbumRepository";
import { ArtistRepository } from "application/repositories/ArtistRepository";
import { SongRepository } from "application/repositories/SongRepository";
import { Album } from "domain/entities/Album";
import { Artist } from "domain/entities/Artist";
import { Song } from "domain/entities/Song";
import { ObjectNotFound } from "domain/errors/ObjectNotFound";
import { Identifier } from "infra/security/Identifier";

export class CreateSong{
    constructor(
        private readonly songRepository:SongRepository,
        private readonly artistRepository:ArtistRepository,
        private readonly albumRepository:AlbumRepository,
        private readonly identifier:Identifier,
    ){}

    async execute(data:Omit<Song.Props,'id'>,songFile:string){
        const newId=this.identifier.createId()
        
        if(!data.artist.id){
            const artist=new Artist({...data.artist,id:this.identifier.createId()})
            data.artist=artist;
            data.album.artist=artist;
        }

        if(!data.album.id){
            const album=new Album({...data.album,id:this.identifier.createId()})
            data.album=album;
        }

        const song=new Song({...data,id:newId,
            pathSongFile:songFile,
        })
        
        return await this.songRepository.create(song)
    }
}