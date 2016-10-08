import * as types from "../types";
import * as Promise from "bluebird";
let csv = require("fast-csv");

const PROVIDERKEY = "eoddatacsv";

class EODDataCSVProvider implements types.IProvider {
    public parseRecordFromLine(securityType: types.SecurityType, resolution: types.Resolution,
        fileName: string, line: string): Promise<types.TradeBar> {

        if (securityType === types.SecurityType.equity && resolution === types.Resolution.daily) {
            return this.parseEODEquityCSVFileLine(securityType, resolution, fileName, line);
        }
        return null;
    }

    private parseEODEquityCSVFileLine(securityType: types.SecurityType, resolution: types.Resolution,
        fileName: string, line: string): Promise<types.TradeBar> {
        return new Promise<types.TradeBar>((resolve, reject) => {
            try {
                csv.fromString(line)
                    .on("data", (data: string[]) => {
                        if (data.length > 0 && data[0] === "Symbol") {
                            resolve(null);
                        } else {
                            let tradebar = new types.TradeBar(data[0],
                                new Date(data[1]),
                                Math.round(parseFloat(data[2])),
                                Math.round(parseFloat(data[3])),
                                Math.round(parseFloat(data[4])),
                                Math.round(parseFloat(data[5])),
                                Math.round(parseFloat(data[6]))
                            );
                            resolve(tradebar);
                        }
                    });
            } catch (error) {
                reject(error);
            }
        });
    }
}

export = (registrator: types.IProviderRegistrator) => {
    registrator.registerProvider(PROVIDERKEY, new EODDataCSVProvider());
};
