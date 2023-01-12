export class EmptyPlaylist extends Error{
    constructor() {
        super(`Playlist Is Song Empty`);
    }
}