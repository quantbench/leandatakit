import * as types from "../types";
import * as Promise from "bluebird";
let csv = require("fast-csv");

const PROVIDERKEY = "eoddatacsv1";

class EODDataCSVProvider1 implements types.IProvider {
    public parseRecordFromLine(securityType: types.SecurityType, resolution: types.Resolution,
        fileName: string, line: string): Promise<types.TradeBar> {

        if (securityType === types.SecurityType.Equity && resolution === types.Resolution.Daily) {
            return this.parseEODEquityCSVFileLine(securityType, resolution, fileName, line);
        }

        return null;
    }

    private parseEODEquityCSVFileLine(securityType: types.SecurityType, resolution: types.Resolution,
        fileName: string, line: string): Promise<types.TradeBar> {
        return new Promise<types.TradeBar>((resolve, reject) => {
            csv.fromString(line)
                .on("data", () => {
                    // get data
                })
                .on("end", () => {
                    // end
                });
        });
    }
}

export = (registrator: types.IProviderRegistrator) => {
    registrator.registerProvider(PROVIDERKEY, new EODDataCSVProvider1());
};
