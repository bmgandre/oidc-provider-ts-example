import { Application, NextFunction, Request, Response } from 'express';

import { AppMiddleware } from './app-middleware';

export class RenderMiddleware extends AppMiddleware {

    constructor(app: Application) {
        super(app);
    }

    initMiddleware(): void {
        this.app.use((req: Request, res: Response, next: NextFunction) => this.registerRender(req, res, next));
    }

    registerRender(req: Request, res: Response, next: NextFunction) {
        const orig = res.render;
        // you'll probably want to use a full blown render engine capable of layouts
        res.render = (view, locals) => {
            this.app.render(view, locals, (err: Error, html: string) => {
                if (err)  {
                    throw err;
                }

                orig.call(res, '_layout', {...locals, body: html});
            });
        };
        next();
    }
}
