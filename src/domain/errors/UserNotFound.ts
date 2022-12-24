export class UserNotFound extends Error{
    constructor() {
        super(`User is not found`);
    }
}