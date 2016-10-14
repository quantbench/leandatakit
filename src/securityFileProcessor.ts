import * as readstream from "./readStreamManager";
import * as matching from "./securityMatcher";
import * as types from "./types";
import * as writestreams from "./writeStreamsManager";
import * as Promise from "bluebird";

export class SecurityFileProcessor {
    private matcher: matching.SecurityMatcher;
    private writeStreamsManager: writestreams.WriteStreamsManager;
    private readStreamManager: readstream.ReadStreamManager;

    constructor(matcher: matching.SecurityMatcher,
        writestreamsManager: writestreams.WriteStreamsManager,
        readStreamManager: readstream.ReadStreamManager) {
        this.matcher = matcher;
        this.writeStreamsManager = writestreamsManager;
        this.readStreamManager = readStreamManager;
    }

    public processFiles(files: string[], outputDirectory: string, securities: string[]): Promise<{}> {
        return Promise.each(files, (file, index) => {
            return this.processFile(file, securities, outputDirectory);
        }).then(() => {
            // close all the open streams
            return this.writeStreamsManager.closeOpenStreams();
        }).catch((error) => {
            // close all the open streams
            return this.writeStreamsManager.closeOpenStreams();
        });
    }

    private processFile(fileName: string, securities: string[], outputDirectory: string): Promise<{}> {
        return this.readStreamManager.readBarsFromFile(fileName)
            .then((bars) => {
                return this.processTradeBars(bars, fileName,
                    securities, outputDirectory);
            });
    }

    private processTradeBars(tradeBars: types.TradeBar[], fileName: string, securities: string[], outputDirectory: string): Promise<{}> {
        let writePromises: Promise<{}>[] = [];
        tradeBars.forEach((value: types.TradeBar) => {
            if (value === null) {
                return;
            }

            if (!this.matcher.match(securities, value)) {
                return;
            }
            // add a new output stream if required
            this.writeStreamsManager.addOutputStreamForSecurity(value.symbol, fileName);
            writePromises.push(new Promise<{}>((resolve, reject) => {
                this.writeStreamsManager.writeTradeBarToStream(value)
                    .then(() => {
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }));
        });

        return Promise.all(writePromises);
    }
}
