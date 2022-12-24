export interface Strategy{
    execute(...params:any):Promise<void>
}

export type OptionsStrategy={
    attributes: {
        [key: string]: any;
    },
}

export type StrategyCallback={
    callback:(...params:any)=>Promise<void>
}

