import assert from 'assert';
import { NextFunction, Request, Response, Router } from 'express';
import Provider from 'oidc-provider';

import { AppController } from './app-controller';

export class ConfirmController  extends AppController {
    constructor(
        private provider: Provider,
        private router: Router
    ) {
        super();
    }

    initRoute(): void {
        this.router.post('/interaction/:uid/confirm', this.setNoCache, this.body,
        async (req: Request, res: Response, next: NextFunction) => this.handleConfirm(req, res, next));
    }

    private async handleConfirm(req: Request, res: Response, next: NextFunction) {
        try {
            const { prompt: { name, details } } = await this.provider.interactionDetails(req, res);
            assert.equal(name, 'consent');

            const consent = {
                // any scopes you do not wish to grant go in here
                //   otherwise details.scopes.new.concat(details.scopes.accepted) will be granted
                rejectedScopes: [],

                // any claims you do not wish to grant go in here
                //   otherwise all claims mapped to granted scopes
                //   and details.claims.new.concat(details.claims.accepted) will be granted
                rejectedClaims: [],

                // replace = false means previously rejected scopes and claims remain rejected
                // changing this to true will remove those rejections in favour of just what you rejected above
                replace: false
            };

            const result = { consent };
            await this.provider.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
        } catch (err) {
            next(err);
        }
    }
}