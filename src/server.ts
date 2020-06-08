import * as dotenv from 'dotenv';
import Provider from 'oidc-provider';
import { resolve } from 'path';

import { AbortController } from './controllers/abort-controller';
import { ConfirmController } from './controllers/confirm-controller';
import { ContinueController } from './controllers/continue-controller';
import { LoginController } from './controllers/login-controller';
import { PromptController } from './controllers/prompt-controller';
import { LoggerMiddleware } from './middleware/logger-middleware';
import { RenderMiddleware } from './middleware/render-middleware';
import { ProviderApp } from './provider-app';
import { ProviderAppConfig } from './provider-app-config';
import { AppProviderConfiguration } from './provider/app-provider-configuration';

dotenv.config({ path: resolve(__dirname, "../.env") })

// tslint:disable:no-var-requires
const express = require('express');

const expressApp = express();
const providerConfiguration = new AppProviderConfiguration()
    .getProviderConfiguration();
const port = +process.env.PORT;
const issuer = `http://localhost:${port}`
const provider = new Provider(issuer, providerConfiguration);

const providerAppConfig = new ProviderAppConfig({
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
        new  LoggerMiddleware(expressApp),
        new RenderMiddleware(expressApp)
    ]
});
const app = new ProviderApp(providerAppConfig);

try {
    app.listen();
} catch(error) {
    // tslint:disable:no-console
    console.error(error);
    process.exitCode = 1;
}
