import { NextFunction, Request, Response } from 'express';

export abstract class AppController {
    abstract initRoute(): void;

    protected setNoCache(req: Request, res: Response, next: NextFunction) {
        res.set('Pragma', 'no-cache');
        res.set('Cache-Control', 'no-cache, no-store');
        next();
    }
}