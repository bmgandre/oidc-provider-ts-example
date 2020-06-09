import * as dotenv from 'dotenv';
import Provider from 'oidc-provider';
import { resolve } from 'path';

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

dotenv.config({ path: resolve(__dirname, "../.env") })

// tslint:disable:no-var-requires
const express = require('express');

const expressApp = express();
const providerConfiguration = new ProviderConfiguration()
    .getProviderConfiguration();
const port = +process.env.PORT;
const issuer = `http://localhost:${port}`
const provider = new Provider(issuer, providerConfiguration);

const providerAppConfig = new AppConfig({
    provider,
    expressApp,
    port,
    providerConfiguration,
    controllers:[
        new AbortController(provider, expressApp),
        new ConfirmController(provider, expressApp),
        new ContinueController(provider, expressApp),
        new PromptController(provider, expressApp),
        new LoginController(provider, expressApp)
    ],
    middleWares: [
        new LoggerMiddleware(expressApp),
        new RenderMiddleware(expressApp)
    ]
});
const app = new App(providerAppConfig);

try {
    app.listen();
} catch(error) {
    // tslint:disable:no-console
    console.error(error);
    process.exitCode = 1;
}
