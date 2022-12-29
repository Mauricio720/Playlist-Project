export class UserExists extends Error{
    constructor() {
        super(`User Already Exists`);
    }
}