import * as types from "./types";

export class SecurityMatcher {
    public match(matchableSecurities: string[], data: types.TradeBar): boolean {
        if (matchableSecurities.indexOf("*") !== -1) {
            return true;
        } else {
            return matchableSecurities.indexOf(data.symbol) !== -1;
        }
    }
}
