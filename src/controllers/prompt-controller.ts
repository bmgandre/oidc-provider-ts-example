import { NextFunction, Request, Response, Router } from 'express';
import { Provider } from 'oidc-provider';

import { AppController } from './app-controller';
import { PromptModel } from './prompt-model';

export class PromptController extends AppController {
  constructor(
      private provider: Provider,
      private router: Router
  ) {
      super();
  }

  initRoute(): void {
    this.router.get('/interaction/:uid', this.setNoCache,
      async (req: Request, res: Response, next: NextFunction) => this.handlePrompt(req, res, next));
}

  private async handlePrompt(req: Request, res: Response, next: NextFunction) {
    try {
      const interaction = await this.provider.interactionDetails(req, res);
      const promptModel = await this.createPromptModel(req, res);

      switch (interaction.prompt.name) {
        case 'select_account':
          if (!interaction.session) {
            return this.provider
              .interactionFinished(req, res, { select_account: {} }, { mergeWithLastSubmission: false });
          }
        case 'login':
        case 'consent':
          return res.render(interaction.prompt.name, promptModel);
        default:
          return undefined;
      }
    } catch (err) {
      return next(err);
    }
  }

  private async createPromptModel(req: Request, res: Response): Promise<PromptModel> {
    const interaction = await this.provider.interactionDetails(req, res);
    const client = await this.provider.Client.find(interaction.params.client_id);

    const accountId = interaction.session?.accountId as string;
    const account = await this.provider.Account.findAccount(null, accountId);
    const accountClaims = account ? await account.claims('prompt', 'email', { email: null }, []) : undefined;

    return {
      uid: interaction.uid,
      email: accountClaims?.email,
      client,
      title: titleMap.get(interaction.prompt.name),
      params: interaction.params,
      promptDetail: interaction.prompt.details,
      session: interaction.session,
      promptDebug: {
        params: flatObject(interaction.params),
        prompt: flatObject(interaction.prompt),
        session: flatObject(interaction.session)
      }
    };
  }
}

const titleMap = new Map<string, string>([
  [ 'select_account', 'Sign-in' ],
  [ 'login', 'Sign-in' ],
  [ 'consent', 'Authorize' ],
]);

const getEntries = (obj: any, prefix: string = ''): any => {
  if (obj === undefined) {
    return [];
  }

  return Object.entries(obj)
    .flatMap(([key, value]) => {
      return Object(value) === value
        ? getEntries(value, `${prefix}${key}.`)
        : [ [`${prefix}${key}`, value] ]
    });
}

const flatObject = (obj: any) => {
  return Object.fromEntries(getEntries(obj));
}
