import * as Promise from "bluebird";

export interface ConvertDataToLeanFmtOptions {
    inputDirectory: string;
    outputDirectory: string;
    securities?: string[];
    securitiesFile?: string;
    sourceFileExtension: string;
    dataProvider: string;
    resolution: Resolution;
    type: SecurityType;
}

export interface IBar {
    close: number;
    high: number;
    low: number;
    open: number;
}

export interface IBaseBar {
    symbol: string;
    time: Date;
}

export class TradeBar implements IBar, IBaseBar {
    public symbol: string;
    public time: Date;
    public open: number;
    public high: number;
    public low: number;
    public close: number;
    public volume: number;
}

export class QuoteBar implements IBar, IBaseBar {
    public symbol: string;
    public time: Date;
    public open: number;
    public high: number;
    public low: number;
    public close: number;
}

export enum SecurityType {
    Equity,
    Option,
    Forex
}

export enum Resolution {
    Daily,
    Hourly,
    Minute,
    Second,
    Tick
}

export enum TickType {
    Trade,
    Quote
}

export interface IProvider {
    parseRecordFromLine(securityType: SecurityType, resolution: Resolution, fileName: string, line: string): Promise<TradeBar>;
}

export interface IProviderRegistrator {
    registerProvider(key: string, provider: IProvider): void;
}
