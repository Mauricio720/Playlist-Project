import { SongRepository } from "application/repositories/SongRepository";
import { Song } from "domain/entities/Song";
import { Identifier } from "infra/security/Identifier";

export class CreateSong{
    constructor(
        private readonly songRepository:SongRepository,
        private readonly identifier:Identifier,
    ){}

    async execute(data:Omit<Song.Props,'id'>){
        const newId=this.identifier.createId()
        const song=new Song({...data,id:newId})
        
        return await this.songRepository.create(song)
    }
}