import { AlbumRepository } from "application/repositories/AlbumRepository";
import { ArtistRepository } from "application/repositories/ArtistRepository";
import { SongRepository } from "application/repositories/SongRepository";
import { ChangePublicSong } from "application/useCases/ChangePublicSong";
import { CreateSong } from "application/useCases/CreateSong";
import { Server } from "infra/http/Server";
import { Identifier } from "infra/security/Identifier";
import { Storage } from "infra/storage/Storage";

export class SongController{
    constructor(
        private readonly server:Server,
        private readonly songRepository:SongRepository,
        private readonly artistRepository:ArtistRepository,
        private readonly albumRepository:AlbumRepository,
        private readonly identifier:Identifier,
        private readonly storage:Storage,
    ){

        this.server.post(
            '/song',
            this.storage.middlewareMultiple(
                [
                    { name: "songFile", path: "/songs" },
                    { name: "albumImage", path: "/songs/album" }
                ]
            ),
            async (req,res)=>{
            try{
                const createSong=new CreateSong(
                    this.songRepository,
                    this.artistRepository,
                    this.albumRepository,
                    this.identifier
                )
                const song=await createSong.execute(
                    JSON.parse(req.body.song),
                    req.files.songFile.location
                )
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