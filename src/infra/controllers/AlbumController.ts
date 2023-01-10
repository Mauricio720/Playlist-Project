import { AlbumRepository } from "application/repositories/AlbumRepository";
import { ArtistRepository } from "application/repositories/ArtistRepository";
import { CreateAlbum } from "application/useCases/CreateAlbum";
import { Album } from "domain/entities/Album";
import { Server } from "infra/http/Server";
import { Identifier } from "infra/security/Identifier";
import { Storage } from "infra/storage/Storage";

export class AlbumController{
    constructor(
        private readonly server:Server,
        private readonly albumRepository:AlbumRepository,
        private readonly artistRepository:ArtistRepository,
        private readonly identifier:Identifier,
        private readonly storage:Storage
    ){
        this.server.post(
            '/album',
            this.storage.middlewareMultiple(
                [
                    { name: "albumImage", path: "/songs/album" },
                    { name: "artistImage", path: "/songs/artist" }
                ]
            ),
            async (req,res)=>{
            try {
                const createAlbum=await new CreateAlbum(
                    this.albumRepository,
                    this.artistRepository,
                    this.identifier
                );
                
                req.body.artist=JSON.parse(req.body.artist)
                const album=await createAlbum.execute(req.body as Album.Props,req.file.location);
                res.json(album).end();
            } catch (err) {
                res.status(400).json(err.message).end()
            }
        })
    }
}