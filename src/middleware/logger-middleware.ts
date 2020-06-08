import { Application, NextFunction, Request, Response } from 'express';

import { AppMiddleware } from './app-middleware';

export class LoggerMiddleware extends AppMiddleware {

    constructor(app: Application) {
        super(app);
    }

    initMiddleware(): void {
        this.app.use((req: Request, res: Response, next: NextFunction) => this.registerLogger(req, res, next));
    }

    registerLogger(req: Request, res: Response, next: NextFunction) {
        // tslint:disable:no-console
        console.log('Request logged:', req.method, req.path);
        next();
    }
}
