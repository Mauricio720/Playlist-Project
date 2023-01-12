export class SongNotFound extends Error{
    constructor() {
        super(`Song is not found`);
        this.name = "SongNotFound";
    }
}