import { PlaylistRepository } from "application/repositories/PlaylistRepository";
import { SongRepository } from "application/repositories/SongRepository";
import { UserRepository } from "application/repositories/UserRepository";
import { CreatePlaylist } from "application/useCases/CreatePlaylst";
import { Playlist } from "domain/entities/Playlist";
import { Server } from "infra/http/Server";
import { Identifier } from "infra/security/Identifier";

export class PlaylistController{
    constructor(
        private readonly server:Server,
        private readonly playlistRepository:PlaylistRepository,
        private readonly songRepository:SongRepository,
        private readonly userRepository:UserRepository,
        private readonly identifier:Identifier,
    ){
        this.server.post('/playlist',async (req,res)=>{
            try {
                const createPlaylist=new CreatePlaylist(
                    this.playlistRepository,
                    this.songRepository,
                    this.userRepository,
                    this.identifier
                )

                const playlist=await createPlaylist.execute(req.body as Playlist.Props)
                res.json(playlist).end();
            } catch (err) {
                res.status(400).json(err.message).end();
            }
        })
    }
}