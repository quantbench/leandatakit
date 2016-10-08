#!/usr/bin/env node

import * as parsing from "./commandlineparser";
import * as conversion from "./convertor";
import * as loader from "./providerLoader";
import * as discovery from "./securityDiscoverer";
import * as processing from "./securityFileProcessor";
import * as matching from "./securityMatcher";
import * as path from "path";

let cli = new conversion.Convertor(
    new parsing.CommandLineParser(),
    new discovery.SecurityDiscoverer(),
    new processing.SecurityFileProcessor(new matching.SecurityMatcher())
);

let providerLoader = new loader.ProviderLoader();

providerLoader.loadProviders(path.join(__dirname, "providers"))
    .then((providers) => {
        // got the providers

        cli.convert(process.argv, providers)
            .then(() => {
                console.log("Conversion Done");
                process.exit(0);
            })
            .catch((error) => {
                console.log("Conversion Failed");
                console.dir(error);
                process.exit(1);
            });
    });
