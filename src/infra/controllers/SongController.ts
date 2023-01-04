import { SongRepository } from "application/repositories/SongRepository";
import { ChangePublicSong } from "application/useCases/ChangePublicSong";
import { CreateSong } from "application/useCases/CreateSong";
import { Song } from "domain/entities/Song";
import { Server } from "infra/http/Server";
import { Identifier } from "infra/security/Identifier";
import { Storage } from "infra/storage/Storage";

export class SongController{
    constructor(
        private readonly server:Server,
        private readonly songRepository:SongRepository,
        private readonly identifier:Identifier,
        private readonly storage:Storage,
    ){

        this.server.post(
            '/song',
            this.storage.middleware({ key: "file", path: "/songs" }),
            async (req,res)=>{
            try{
                const createSong=new CreateSong(this.songRepository,this.identifier)
                const song=await createSong.execute(JSON.parse(req.body.song),req.file.location)
                res.json(song).end()
            }catch(err){
                res.status(400).json(err.message).end()
            }
        })

        this.server.get(
            '/song',
            async (req,res)=>{
            try{
                const song=await this.songRepository.findById(req.query.id)
                res.json(song).end()
            }catch(err){
                res.status(400).json(err.message).end()
            }
        })


        this.server.put(
            '/change_public_song',
            async (req,res)=>{
            try{
                const createSong=new ChangePublicSong(this.songRepository)
                await createSong.execute(req.body.id)
                res.end()
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