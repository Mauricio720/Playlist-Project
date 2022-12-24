import { NextFunction, Request, Response } from 'infra/http/Http'

export { Request, Response, NextFunction } from 'infra/http/Http'

export interface Middleware{
    handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}