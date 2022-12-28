export interface Strategy{
    execute(...params:any):Promise<void>
}



