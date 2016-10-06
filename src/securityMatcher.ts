export class SecurityMatcher {
    public match(matchableSecurities: string[], data: any): boolean {
        return matchableSecurities.indexOf(data.Symbol) !== -1;
    }
}
