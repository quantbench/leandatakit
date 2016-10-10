import * as types from "./types";
import * as path from "path";

export class LeanFileUtils {
    public static generateOutputFileName(securitySymbol: string, securityType: types.SecurityType, resolution: types.Resolution,
        fileName: string, outputDirectory: string): string {
        if (securityType === types.SecurityType.equity && resolution === types.Resolution.daily) {
            return path.join(outputDirectory, securitySymbol.toLowerCase() + ".csv");
        }
        return "";
    }

    public static convertTradeBarToLine(tradeBar: types.TradeBar, securityType: types.SecurityType, resolution: types.Resolution): string {
        let line = tradeBar.time.getFullYear().toString() + this.padZeros(tradeBar.time.getMonth() + 1)
            + this.padZeros(tradeBar.time.getDate())
            + " 00:00," + tradeBar.open * 10000 + "," + tradeBar.high * 10000 + "," + tradeBar.low * 10000 + "," + tradeBar.close * 10000
            + "," + tradeBar.volume;
        return line;
    }

    private static padZeros(numberToPad: number): string {
        return numberToPad < 10 ? ("00" + numberToPad).slice(-2) : numberToPad.toString();
    }
}
