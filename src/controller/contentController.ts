import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import { Controller, HttpCode, Get, Put, ContentType, Body, Param, UploadedFile, Res } from "routing-controllers";


@Controller()
export class ContentController {
    private readonly dataPath: string = "./data/content.json";
    private readonly mediaFolder: string = "./data/media";

    @HttpCode(200)
    @ContentType("application/json")
    @Get("/_data/content.json")
    public async getData(): Promise<any> {
        return JSON.parse(await fs.promises.readFile(path.resolve(__dirname, this.dataPath), "utf8"));
    }

    @HttpCode(201)
    @ContentType("application/json")
    @Put("/_data/content.json")
    public async setData(@Body() data: any): Promise<string> {
        await fs.promises.writeFile(path.resolve(__dirname, this.dataPath), JSON.stringify(data));
        return "OK";
    }

    @HttpCode(200)
    @Get("/_media/:blobKey")
    public async getBlob(@Res() response: express.Response, @Param("blobKey") blobKey: string): Promise<any> {
        const filePath = path.resolve(__dirname, this.mediaFolder, blobKey);

        if (!fs.existsSync(filePath)) {
            response.statusCode = 404;
            return null;
        }

        const metadataFile = await fs.promises.readFile(filePath + ".metadata.json", "utf8");
        const metadata = JSON.parse(metadataFile);
        response.contentType(metadata.mimetype);

        const media = await fs.promises.readFile(filePath, { encoding: "binary" });
        return Buffer.from(media, "binary");
    }

    @HttpCode(201)
    @Put("/_media/:blobKey")
    public async uploadBlob(@Param("blobKey") blobKey: string, @UploadedFile("media") media: any): Promise<void> {
        const mediaFolder = path.resolve(__dirname, this.mediaFolder);
        const filePath = path.resolve(mediaFolder, blobKey);

        await fs.promises.mkdir(mediaFolder, { recursive: true });
        await fs.promises.writeFile(filePath, media.buffer);
        await fs.promises.writeFile(filePath + ".metadata.json", JSON.stringify({ mimetype: media.mimetype }));
    }

    @HttpCode(201)
    @Put("/_media/:blobKey")
    public async deleteBlob(@Param("blobKey") blobKey: string): Promise<void> {
        const mediaFolder = path.resolve(__dirname, this.mediaFolder);
        const filePath = path.resolve(mediaFolder, blobKey);

        await fs.promises.unlink(filePath);
        await fs.promises.unlink(filePath + ".metacontent.json");
    }
}
