import * as dotenv from 'dotenv';
import Provider from 'oidc-provider';
import { resolve } from 'path';

import { MongoAdapter } from './adapters/mongodb/mongo-adapter';
import { MongoSetup } from './adapters/mongodb/mongo-setup';
import { App } from './app/app';
import { AppConfig } from './app/app-config';
import { AbortController } from './controllers/abort-controller';
import { ConfirmController } from './controllers/confirm-controller';
import { ContinueController } from './controllers/continue-controller';
import { LoginController } from './controllers/login-controller';
import { PromptController } from './controllers/prompt-controller';
import { LoggerMiddleware } from './middleware/logger-middleware';
import { RenderMiddleware } from './middleware/render-middleware';
import { ProviderConfiguration } from './provider/provider-configuration';

// tslint:disable:no-var-requires
const express = require('express');

let app: App;

try {
    dotenv.config({ path: resolve(__dirname, "../.env") });

    const mongoSetup = MongoSetup.setup();

    const expressApp = express();

    const providerConfiguration = new ProviderConfiguration(MongoAdapter)
        .getProviderConfiguration();
    const port = +process.env.PORT;
    const issuer = `http://localhost:${port}`
    const provider = new Provider(issuer, providerConfiguration);

    const providerAppConfig = new AppConfig({
        provider,
        expressApp,
        port,
        providerConfiguration,
        controllers: [
            new PromptController(provider, expressApp),
            new LoginController(provider, expressApp),
            new ContinueController(provider, expressApp),
            new ConfirmController(provider, expressApp),
            new AbortController(provider, expressApp),
        ],
        middleWares: [
            new LoggerMiddleware(expressApp),
            new RenderMiddleware(expressApp)
        ]
    });
    app = new App(providerAppConfig);

    Promise.all([
        mongoSetup
    ]).then(() => {
        app.listen();
    });
} catch (error) {
    app?.shutdown();

    // tslint:disable:no-console
    console.error(error);
    process.exitCode = 1;
}
