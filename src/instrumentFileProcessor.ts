import * as matching from "./instrumentMatcher";
import * as Promise from "bluebird";
let csv = require("fast-csv");
import * as fs from "graceful-fs";
import * as path from "path";

export class InstrumentFileProcessor {
    private matcher: matching.InstrumentMatcher;
    constructor(matcher: matching.InstrumentMatcher) {
        this.matcher = matcher;
    }

    public processFiles(files: string[], outputDirectory: string, instruments: string[]): Promise<{}> {
        console.log("Processing Files");
        return Promise.each(files, (file, index) => {
            console.log("Processing " + file);
            return this.processFile(file, instruments);
        });
    }

    private processFile(fileName: string, instruments: string[]): Promise<{}> {
        return new Promise((resolve, reject) => {
            fs.createReadStream(fileName)
                .pipe(csv({ "headers": true }))
                .on("data", (data: any) => {
                    if (this.matcher.match(instruments, data)) {

                    }
                })
                .on("end", () => {
                    console.log("done with " + fileName);
                    resolve();
                });
        });
    }
}

class InProgressStream {
    public instrumentName: string;
    public instrumentStream: fs.WriteStream;
    public outputFile: string;
    constructor(instrumentName: string, outputPath: string) {
        this.outputFile = path.join(outputPath, instrumentName + ".raw");
        this.instrumentStream = fs.createWriteStream(this.outputFile);
    }
}