import assert from 'assert';
import { NextFunction, Request, Response, Router } from 'express';
import Provider from 'oidc-provider';

import { AppController } from './app-controller';

export class ContinueController extends AppController {
    constructor(
        private provider: Provider,
        private router: Router
    ) {
        super();
    }

    initRoute(): void {
        this.router.post('/interaction/:uid/continue', this.setNoCache, this.body,
            async (req: Request, res: Response, next: NextFunction) => this.handleContinue(req, res, next));
    }

    private async handleContinue(req: Request, res: Response, next: NextFunction) {
        try {
            const interaction = await this.provider.interactionDetails(req, res);
            const { prompt: { name, details } } = interaction;
            assert.equal(name, 'select_account');

            if (req.body.switch) {
                if (interaction.params.prompt) {
                    const prompts = new Set(interaction.params.prompt.split(' '));
                    prompts.add('login');
                    interaction.params.prompt = [...prompts].join(' ');
                } else {
                    interaction.params.prompt = 'login';
                }
                await interaction.save();
            }

            const result = { select_account: {} };
            await this.provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
        } catch (err) {
            next(err);
        }
    }
}