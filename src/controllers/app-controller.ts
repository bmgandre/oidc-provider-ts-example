import { NextFunction, Request, Response, urlencoded } from 'express';

export abstract class AppController {
    protected body = urlencoded({ extended: false });

    abstract initRoute(): void;

    protected setNoCache(req: Request, res: Response, next: NextFunction) {
        res.set('Pragma', 'no-cache');
        res.set('Cache-Control', 'no-cache, no-store');
        next();
    }
}