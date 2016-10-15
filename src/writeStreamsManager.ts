import * as utils from "./leanFileUtils";
import * as types from "./types";
import * as Promise from "bluebird";
import * as fs from "graceful-fs";
let JSZip = require("jszip");
import * as path from "path";

export class WriteStreamsManager {
    public openStreams: { [symbol: string]: types.OpenStreamData };
    private securityType: types.SecurityType;
    private resolution: types.Resolution;
    private outputDirectory: string;
    constructor(conversionOptions: types.LeanDataKitConversionOptions) {
        this.openStreams = {};
        this.securityType = conversionOptions.type;
        this.resolution = conversionOptions.resolution;
        this.outputDirectory = conversionOptions.outputDirectory;
    }

    public closeOpenStreams(): Promise<{}> {
        let promises: Promise<{}>[] = [];
        for (let symbol of Object.keys(this.openStreams)) {
            this.openStreams[symbol].outputStream.close();
            promises.push(this.compressFile(this.openStreams[symbol].fileName));

        }

        return Promise.all(promises);
    }

    public addOutputStreamForSecurity(symbol: string, fileName: string) {
        if (this.openStreams[symbol] === undefined) {
            let outputFilePath = utils.LeanFileUtils.generateOutputFileName(symbol,
                this.securityType,
                this.resolution,
                fileName,
                this.outputDirectory);
            this.addOutputStream(this.openStreams, symbol, outputFilePath);
        }
    }

    public writeTradeBarToStream(tradeBar: types.TradeBar): Promise<{}> {
        let localthis = this;
        return new Promise((resolve, reject) => {
            let line = utils.LeanFileUtils.convertTradeBarToLine(tradeBar, this.securityType, this.resolution);
            if (!line.endsWith("\n")) {
                line += "\n";
            }
            localthis.openStreams[tradeBar.symbol].outputStream.write(line,
                (err: any, fd: number) => {
                    if (err === undefined) {
                        resolve();
                    } else {
                        reject();
                    }
                });
        });
    }

    private addOutputStream(openStreams: { [symbol: string]: types.OpenStreamData }, securitySymbol: string, outputFilePath: string) {
        this.openStreams[securitySymbol] = new types.OpenStreamData(outputFilePath);
    }

    private compressFile(fileName: string): Promise<{}> {
        let baseFileName = path.basename(fileName);
        let extName = "\\" + path.extname(fileName) + "$";
        let regExp = new RegExp(extName);
        let zipFileName = fileName.replace(regExp, ".zip");
        return new Promise((resolve, reject) => {
            let zip = new JSZip();
            zip
                .file(baseFileName, fs.createReadStream(fileName))
                .generateNodeStream({
                    "compression": "DEFLATE", "compressionOptions": { "level": 6 }, "streamFiles": false,
                    "type": "nodebuffer", "platform": process.platform,
                })
                .pipe(fs.createWriteStream(zipFileName))
                .on("finish", () => {
                    fs.unlink(fileName, (err) => {
                        if (err) {
                            reject();
                        }
                        resolve();
                    });
                });
        });
    }
}
