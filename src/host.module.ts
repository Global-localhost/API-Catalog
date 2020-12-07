import { ContentController } from "./controller/contentController";
import * as path from "path";
import { FileSystemBlobStorage } from "./components/filesystemBlobStorage";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { XmlHttpRequestClient } from "@paperbits/common/http";
import { UnhandledErrorMiddleware } from "./middlewares/unhandledErrorMiddleware";
import { StaticContentMiddleware } from "./middlewares/staticContentMiddleware";
import { ConsoleLogger } from "@paperbits/common/logging";


export class HostModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindSingleton("logger", ConsoleLogger);
        injector.bindSingleton("httpClient", XmlHttpRequestClient);
        injector.bind("errorHandler", UnhandledErrorMiddleware);
        injector.bindSingleton("staticContentMiddleware", StaticContentMiddleware);
        injector.bindSingleton("dataController", ContentController);

        const designerStorage = new FileSystemBlobStorage(path.resolve(__dirname, "../designer"));
        const websiteStorage = new FileSystemBlobStorage(path.resolve(__dirname, "../website"));
        injector.bindInstance("websiteStorage", websiteStorage);
        injector.bindInstance("designerStorage", designerStorage);
    }
}