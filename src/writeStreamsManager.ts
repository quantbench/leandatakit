import * as utils from "./leanFileUtils";
import * as types from "./types";
import * as Promise from "bluebird";

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

    public closeOpenStreams() {
        for (let symbol of Object.keys(this.openStreams)) {
            this.openStreams[symbol].outputStream.close();
        }
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
}
