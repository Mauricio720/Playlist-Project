export class AuthInvalid extends Error{
    constructor(){
        super('Email or Password Invalid')
    }
}