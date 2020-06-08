import { Application } from "express";

export abstract class AppMiddleware {
    constructor(
        protected app: Application
    ) { }

    abstract initMiddleware(): void;
}