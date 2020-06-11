import assert from 'assert';
import { NextFunction, Request, Response, Router } from 'express';
import Provider from 'oidc-provider';

import { Account } from '../support/account';
import { AppController } from './app-controller';

export class LoginController extends AppController {
    constructor(
        private provider: Provider,
        private router: Router
    ) {
        super();
    }

    initRoute(): void {
        this.router.post('/interaction/:uid/login', this.setNoCache, this.body,
            async (req: Request, res: Response, next: NextFunction) => this.handleLogin(req, res, next));
    }

    private async handleLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const { prompt: { name } } = await this.provider.interactionDetails(req, res);
            assert.equal(name, 'login');
            const account = await Account.findByLogin(req.body.login);

            const result = {
                select_account: {}, // make sure its skipped by the interaction policy since we just logged in
                login: {
                    account: account.accountId,
                },
            };

            await this.provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
        } catch (err) {
            next(err);
        }
    }
}