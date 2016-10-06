import * as matching from "./securityMatcher";
import * as types from "./types";
import * as Promise from "bluebird";
import * as fs from "graceful-fs";
import * as readline from "readline";

export class SecurityFileProcessor {
    private matcher: matching.SecurityMatcher;
    constructor(matcher: matching.SecurityMatcher) {
        this.matcher = matcher;
    }

    public processFiles(provider: types.IProvider, securityType: types.SecurityType, resolution: types.Resolution,
        files: string[], outputDirectory: string, securities: string[]): Promise<{}> {
        console.log("Processing Files");
        let openStreams: { [symbol: string]: OpenStreamData } = {};
        return Promise.each(files, (file, index) => {
            console.log("Processing " + file);
            return this.processFile(openStreams, provider, securityType, resolution, file, securities, outputDirectory);
        }).then(() => {
            // close all the open streams
            for (let symbol of Object.keys(openStreams)) {
                openStreams[symbol].outputStream.close();
            }
            return Promise.resolve("");
        });
    }

    private processFile(openStreams: { [symbol: string]: OpenStreamData }, provider: types.IProvider, securityType: types.SecurityType,
        resolution: types.Resolution, fileName: string, securities: string[], outputDirectory: string): Promise<{}> {

        return new Promise<{}>((resolve, reject) => {
            let lineReader = readline.createInterface(fs.createReadStream(fileName));
            let linePromises: Promise<types.TradeBar>[] = [];
            lineReader.on("line", (line: string) => {
                // coming soon
                linePromises.push(provider.parseRecordFromLine(securityType, resolution, fileName, line));
            });
            lineReader.on("close", () => {
                Promise.all(linePromises)
                    .then((bars) => {
                        return this.processTradeBars(openStreams, bars, securityType, resolution, fileName, outputDirectory);
                    });
            });
        });
    }

    private processTradeBars(openStreams: { [symbol: string]: OpenStreamData }, tradeBars: types.TradeBar[],
        securityType: types.SecurityType, resolution: types.Resolution, fileName: string, outputDirectory: string): Promise<{}> {

        let writePromises: Promise<{}>[] = [];
        tradeBars.forEach((value: types.TradeBar) => {

            // add a new output stream if required
            if (openStreams[value.symbol] !== undefined) {
                let outputFilePath = this.generateOutputFileName(value.symbol, securityType, resolution, fileName, outputDirectory);
                this.addOutputStream(openStreams, value.symbol, outputFilePath);
            }

            writePromises.push(new Promise<{}>((resolve, reject) => {
                openStreams[value.symbol].outputStream.write(this.convertTradeBarToLine(value, securityType, resolution),
                    (err: any, fd: number) => {
                        // 
                    });
            }));
        });

        return Promise.all(writePromises);
    }

    private addOutputStream(openStreams: any, securitySymbol: string, outputFilePath: string) {
        openStreams[securitySymbol] = new OpenStreamData(outputFilePath);
    }

    private generateOutputFileName(securitySymbol: string, securityType: types.SecurityType, resolution: types.Resolution,
        fileName: string, outputDirectory: string): string {
        return "";
    }

    private convertTradeBarToLine(tradeBar: types.TradeBar, securityType: types.SecurityType, resolution: types.Resolution): string {
        return "";
    }
}

class OpenStreamData {
    public fileName: string;
    public outputStream: fs.WriteStream;

    constructor(fileName: string) {
        this.fileName = fileName;
        this.outputStream = fs.createWriteStream(this.fileName, { "flags": "w", "encoding": "utf8" });
    }
}
