import * as types from "./types";
import * as Promise from "bluebird";
import * as fs from "graceful-fs";
import * as readline from "readline";

export class ReadStreamManager {
    private securityType: types.SecurityType;
    private resolution: types.Resolution;
    private provider: types.IProvider;

    constructor(provider: types.IProvider, conversionOptions: types.LeanDataKitConversionOptions) {
        this.provider = provider;
        this.securityType = conversionOptions.type;
        this.resolution = conversionOptions.resolution;
    }

    public readBarsFromFile(fileName: string): Promise<types.TradeBar[]> {
        return new Promise<types.TradeBar[]>((resolve, reject) => {
            let fileStream = fs.createReadStream(fileName);
            let lineReader = readline.createInterface({ "input": fileStream, "terminal": false });
            let linePromises: Promise<types.TradeBar>[] = [];
            lineReader.on("line", (line: string) => {
                linePromises.push(this.provider.parseRecordFromLine(this.securityType, this.resolution, fileName, line));
            });
            lineReader.on("close", () => {
                Promise.all(linePromises)
                    .then((bars: types.TradeBar[]) => {
                        resolve(bars);
                    }).catch((error) => {
                        reject(error);
                    });
            });
        });
    }
}
