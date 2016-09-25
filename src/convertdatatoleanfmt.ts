#!/usr/bin/env node

import * as parsing from "./commandlineparser";
import * as conversion from "./convertor";
import * as discovery from "./instrumentDiscoverer";
import * as processing from "./instrumentFileProcessor";

let cli = new conversion.Convertor(
    new parsing.CommandLineParser(),
    new discovery.InstrumentDiscoverer(),
    new processing.InstrumentFileProcessor()
);

cli.convert(process.argv)
    .then(() => {
        console.log("ALl Done");
    })
    .catch((error) => {
        console.log("FAILED...");
        console.log(error);
    });
