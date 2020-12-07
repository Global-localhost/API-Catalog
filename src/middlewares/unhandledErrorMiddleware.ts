import * as express from "express";
import { Middleware, ExpressErrorMiddlewareInterface } from "routing-controllers";
import { Logger } from "@paperbits/common/logging";

@Middleware({ type: "after" })
export class UnhandledErrorMiddleware implements ExpressErrorMiddlewareInterface {
    constructor(private readonly logger: Logger) { }

    public error(error: any, request: express.Request, response: express.Response, next: (err?: any) => any): void {
        this.logger.trackError(error);

        response.status(500);
        response.send(error.message);
    }
}