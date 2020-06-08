import { NextFunction, Request, Response, Router } from 'express';
import Provider from 'oidc-provider';

import { AppController } from './app-controller';

export class AbortController extends AppController {
    constructor(
        private provider: Provider,
        private router: Router
    ) {
        super();
    }

    initRoute(): void {
        this.router.get('/interaction/:uid/abort', this.setNoCache,
            async (req: Request, res: Response, next: NextFunction) => this.handleAbort(req, res, next));
    }

    private async handleAbort(req: Request, res: Response, next: NextFunction) {
        try {
            const result = {
                error: 'access_denied',
                error_description: 'End-User aborted interaction',
            };
            await this.provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
        } catch (err) {
            next(err);
        }
    }
}