import { Server } from 'http';
import { resolve } from 'path';

import { AppConfig } from './app-config';

// tslint:disable:no-var-requires
const ejs = require("ejs").__express;
// tslint:disable:no-var-requires
const express = require('express');

export class App {
    private server: Server;

    constructor(
        private appConfig: AppConfig
    ) {
        this.setMiddleware();
        this.setRoutes();
        this.setTemplateEngine();
        this.setStaticAssets();
        this.setOpenIdProvider();
    }

    private setMiddleware() {
        this.appConfig.middleWares.forEach(middleWare => {
            middleWare.initMiddleware();
        })
    }

    private setRoutes() {
        this.appConfig.controllers.forEach(controller => {
            controller.initRoute();
        });
    }

    private setOpenIdProvider() {
        this.appConfig.expressApp.use(this.appConfig.provider.callback);
    }

    private setTemplateEngine() {
        this.appConfig.expressApp.set('views', resolve(__dirname, "../views/"));
        this.appConfig.expressApp.set('view engine', 'ejs');
        this.appConfig.expressApp.engine('.ejs', ejs);
    }

    private setStaticAssets() {
        const views = express.static(resolve(__dirname, "../views/"));
        this.appConfig.expressApp.use(views);
    }

    public listen() {
        this.server = this.appConfig.expressApp.listen(this.appConfig.port, () => {
            // tslint:disable:no-console
            console.log(`App listening on the http://localhost:${this.appConfig.port}`);
        });
    }

    public shutdown() {
        if (this.server && this.server.listening){
            this.server.close();
        }
    }
}