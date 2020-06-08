import { Application } from 'express';
import Provider, { Configuration } from 'oidc-provider';

import { AppController } from './controllers/app-controller';
import { AppMiddleware } from './middleware/app-middleware';

export class ProviderAppConfig {
    constructor(init?: ProviderAppConfig) {
        Object.assign(this, init);
    }

    port: number;
    expressApp: Application;
    provider: Provider;
    middleWares: AppMiddleware[];
    controllers: AppController[];
    providerConfiguration: Configuration;
}