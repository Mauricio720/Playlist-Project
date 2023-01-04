export class CategoryNotFound extends Error{
    constructor() {
        super(`Category is not found`);
    }
}