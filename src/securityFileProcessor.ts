import * as matching from "./securityMatcher";
import * as types from "./types";
import * as Promise from "bluebird";
import * as fs from "graceful-fs";
import * as path from "path";
import * as readline from "readline";

export class SecurityFileProcessor {
    private matcher: matching.SecurityMatcher;
    constructor(matcher: matching.SecurityMatcher) {
        this.matcher = matcher;
    }

    public processFiles(provider: types.IProvider, securityType: types.SecurityType, resolution: types.Resolution,
        files: string[], outputDirectory: string, securities: string[]): Promise<{}> {
        let openStreams: { [symbol: string]: OpenStreamData } = {};
        return Promise.each(files, (file, index) => {
            return this.processFile(openStreams, provider, securityType, resolution, file, securities, outputDirectory);
        }).then(() => {
            // close all the open streams
            for (let symbol of Object.keys(openStreams)) {
                openStreams[symbol].outputStream.close();
            }
            return Promise.resolve("");
        }).catch((error) => {
            // close all the open streams
            for (let symbol of Object.keys(openStreams)) {
                openStreams[symbol].outputStream.close();
            }
            return Promise.reject(error);
        });
    }

    private processFile(openStreams: { [symbol: string]: OpenStreamData }, provider: types.IProvider, securityType: types.SecurityType,
        resolution: types.Resolution, fileName: string, securities: string[], outputDirectory: string): Promise<{}> {

        return new Promise<{}>((resolve, reject) => {
            try {
                let fileStream = fs.createReadStream(fileName);
                let lineReader = readline.createInterface({ "input": fileStream, "terminal": false });
                let linePromises: Promise<types.TradeBar>[] = [];
                lineReader.on("line", (line: string) => {
                    linePromises.push(provider.parseRecordFromLine(securityType, resolution, fileName, line));
                });
                lineReader.on("close", () => {
                    Promise.all(linePromises)
                        .then((bars) => {
                            return this.processTradeBars(openStreams, bars, securityType, resolution, fileName, outputDirectory);
                        }).then(() => {
                            resolve();
                        });
                });
            } catch (error) {
                reject();
            }
        });
    }

    private processTradeBars(openStreams: { [symbol: string]: OpenStreamData }, tradeBars: types.TradeBar[],
        securityType: types.SecurityType, resolution: types.Resolution, fileName: string, outputDirectory: string): Promise<{}> {

        let writePromises: Promise<{}>[] = [];
        tradeBars.forEach((value: types.TradeBar) => {
            if (value === null) {
                return;
            }
            // add a new output stream if required
            if (openStreams[value.symbol] === undefined) {
                let outputFilePath = this.generateOutputFileName(value.symbol, securityType, resolution, fileName, outputDirectory);
                this.addOutputStream(openStreams, value.symbol, outputFilePath);
            }

            writePromises.push(new Promise<{}>((resolve, reject) => {
                let line = this.convertTradeBarToLine(value, securityType, resolution);
                if (!line.endsWith("\n")) {
                    line += "\n";
                }
                openStreams[value.symbol].outputStream.write(line,
                    (err: any, fd: number) => {
                        // 
                        if (err === undefined) {
                            resolve();
                        } else {
                            reject();
                        }
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
        if (securityType === types.SecurityType.equity && resolution === types.Resolution.daily) {
            return path.join(outputDirectory, securitySymbol.toLowerCase() + ".csv");
        }
        return "";
    }

    private convertTradeBarToLine(tradeBar: types.TradeBar, securityType: types.SecurityType, resolution: types.Resolution): string {
        let line = tradeBar.time.getFullYear().toString() + this.padZeros(tradeBar.time.getMonth() + 1)
            + this.padZeros(tradeBar.time.getDate())
            + " 00:00," + tradeBar.open * 10000 + "," + tradeBar.high * 10000 + "," + tradeBar.low * 10000 + "," + tradeBar.close * 10000
            + "," + tradeBar.volume;
        return line;
    }

    private padZeros(numberToPad: number): string {
        return numberToPad < 10 ? ("00" + numberToPad).slice(-2) : numberToPad.toString();
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
