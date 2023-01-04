import { SongRepository } from "application/repositories/SongRepository";
import { Song } from "domain/entities/Song";
import { Identifier } from "infra/security/Identifier";

export class CreateSong{
    constructor(
        private readonly songRepository:SongRepository,
        private readonly identifier:Identifier,
    ){}

    async execute(data:Omit<Song.Props,'id'>,file:string){
        console.log(file);
        
        const newId=this.identifier.createId()
        const song=new Song({...data,id:newId,pathSongFile:file})
        
        return await this.songRepository.create(song)
    }
}