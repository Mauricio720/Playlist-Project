import { SongRepository } from "application/repositories/SongRepository";
import { CreateSong } from "application/useCases/CreateSong";
import { Song } from "domain/entities/Song";
import { Server } from "infra/http/Server";
import { Identifier } from "infra/security/Identifier";

export class SongController{
    constructor(
        private readonly server:Server,
        private readonly songRepository:SongRepository,
        private readonly identifier:Identifier
    ){

        this.server.post('/song',async (req,res)=>{
            try{
                const createSong=new CreateSong(this.songRepository,this.identifier)
                const song=await createSong.execute(req.body as Omit<Song.Props,'id'>)
                res.json(song).end()
            }catch(err){
                res.status(400).json(err.message).end()
            }
        })

        this.server.get('/all_songs',async (req,res)=>{
            try{
                const songs=await this.songRepository.list()
                res.json(songs).end()
            }catch(err){
                res.status(400).json(err.message).end()
            }
        })

    }
}