import * as matching from "./securityMatcher";
import * as types from "./types";
import * as Promise from "bluebird";
import * as fs from "graceful-fs";
import * as readline from "readline";

export class SecurityFileProcessor {
    private matcher: matching.SecurityMatcher;
    constructor(matcher: matching.SecurityMatcher) {
        this.matcher = matcher;
    }

    public processFiles(provider: types.IProvider, securityType: types.SecurityType, resolution: types.Resolution,
        files: string[], outputDirectory: string, securities: string[]): Promise<{}> {
        console.log("Processing Files");
        return Promise.each(files, (file, index) => {
            console.log("Processing " + file);
            return this.processFile(provider, securityType, resolution, file, securities);
        });
    }

    private processFile(provider: types.IProvider, securityType: types.SecurityType, resolution: types.Resolution,
        fileName: string, securities: string[]): Promise<{}> {
        return new Promise((resolve, reject) => {
            let lineReader = readline.createInterface(fs.createReadStream(fileName));
            lineReader.on("line", (line: string) => {
                // coming soon
                provider.parseRecordFromLine(securityType, resolution, fileName, line);
            });
            lineReader.on("close", () => {
                // coming soon
            });
        });
    }
}

// .pipe(csv({ "headers": true }))
// .on("data", (data: any) => {
//     if (this.matcher.match(securities, data)) {

//     }
// })
// .on("end", () => {
//     console.log("done with " + fileName);
//     resolve();
// });
