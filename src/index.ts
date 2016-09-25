#!/usr/bin/env node

import * as parsing from "./commandlineparser";
import * as conversion from "./convertdatatoleanfmt";
import * as discovery from "./instrumentDiscoverer";
import * as processing from "./instrumentFileProcessor";



let cli = new conversion.ConvertDataToLeanFmt(
    new parsing.CommandLineParser(),
    new discovery.InstrumentDiscoverer(),
    new processing.InstrumentFileProcessor()
);

cli.convert(process.argv);
