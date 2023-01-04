import { SongRepository } from "application/repositories/SongRepository";

export class ChangePublicSong{
    constructor(private readonly songRepository:SongRepository){}
    
    async execute(id:string){
        const song=await this.songRepository.findById(id)
        song.changePublic();
        await this.songRepository.update(song)
    }
}