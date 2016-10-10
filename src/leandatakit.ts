#!/usr/bin/env node

import * as parsing from "./commandlineparser";
import * as conversion from "./convertor";
import * as loader from "./providerLoader";
import * as reading from "./readStreamManager";
import * as discovery from "./securityDiscoverer";
import * as processing from "./securityFileProcessor";
import * as matching from "./securityMatcher";
import * as types from "./types";
import * as writing from "./writeStreamsManager";
import * as path from "path";

let parser = new parsing.CommandLineParser();
let conversionOptionsResult = parser.parse(process.argv);
if (conversionOptionsResult.error !== "") {
    console.log(conversionOptionsResult.error);
    process.exit(1);
}

let conversionOptions = conversionOptionsResult.options;

let providerLoader = new loader.ProviderLoader();
providerLoader.loadProviders(path.join(__dirname, "providers"))
    .then((providers: { [key: string]: types.IProvider }) => {
        // try find a provider for the one supplied
        let provider = providers[conversionOptions.dataProvider];
        if (provider === undefined) {
            console.log("The provider supplied is not available.");
            process.exit(1);
        }

        let cli = new conversion.Convertor(
            conversionOptions,
            new discovery.SecurityDiscoverer(),
            new processing.SecurityFileProcessor(new matching.SecurityMatcher(),
                new writing.WriteStreamsManager(conversionOptions),
                new reading.ReadStreamManager(provider, conversionOptions))
        );
        // got the providers, start the conversion
        cli.convert(providers)
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
