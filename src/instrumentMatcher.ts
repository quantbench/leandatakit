export class InstrumentMatcher {
    public match(matchableInstruments: string[], data: any): boolean {
        return matchableInstruments.indexOf(data.Symbol) !== -1;
    }
}
