export class NotAuthorized extends Error{
    constructor() {
        super(`Not Authorized`);
        this.name="Not Authorized"
    }
}