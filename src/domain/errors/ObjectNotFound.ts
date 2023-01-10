export class ObjectNotFound extends Error{
    constructor(object:string) {
        super(`${object} not found`);
        this.name = "ObjectNotFound";
    }
}