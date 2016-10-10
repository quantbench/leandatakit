import * as Promise from "bluebird";
import * as fs from "graceful-fs";

export interface LeanDataKitConversionOptions {
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

    constructor(symbol: string, time: Date, open: number, high: number, low: number, close: number, volume: number) {
        this.symbol = symbol;
        this.time = time;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume;
    }
}

export class QuoteBar implements IBar, IBaseBar {
    public symbol: string;
    public time: Date;
    public open: number;
    public high: number;
    public low: number;
    public close: number;
}

export class OpenStreamData {
    public fileName: string;
    public outputStream: fs.WriteStream;

    constructor(fileName: string) {
        this.fileName = fileName;
        this.outputStream = fs.createWriteStream(this.fileName, { "flags": "w", "encoding": "utf8" });
    }
}

export enum SecurityType {
    equity,
    option,
    forex
}

export enum Resolution {
    daily,
    hourly,
    minute,
    second,
    tick
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
