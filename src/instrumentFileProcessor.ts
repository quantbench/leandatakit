import * as Promise from "bluebird";
let csv = require("fast-csv");
import * as fs from "graceful-fs";

export class InstrumentFileProcessor {
    public processFile(fileName: string, instruments: string[]): Promise<{}> {
        return new Promise((resolve, reject) => {
            fs.createReadStream(fileName)
                .pipe(csv({ "headers": true }))
                .on("data", (data: any) => {
                    console.log(data);
                })
                .on("end", () => {
                    console.log("done with " + fileName);
                    resolve();
                });
        });
    }
}
