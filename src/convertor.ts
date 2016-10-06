import * as parsing from "./commandlineparser";
import * as discovery from "./securityDiscoverer";
import * as processing from "./securityFileProcessor";
import * as types from "./types";
import * as Promise from "bluebird";

export class Convertor {
    private parser: parsing.CommandLineParser;
    private discoverer: discovery.SecurityDiscoverer;
    private processor: processing.SecurityFileProcessor;

    constructor(
        parser: parsing.CommandLineParser,
        discoverer: discovery.SecurityDiscoverer,
        processor: processing.SecurityFileProcessor) {

        this.parser = parser;
        this.discoverer = discoverer;
        this.processor = processor;
    }

    public convert(conversionOptions: string[], providers: { [key: string]: types.IProvider }): Promise<{}> {
        let parseResult = this.parser.parse(conversionOptions);
        // try find a provider for the one supplied
        let provider = providers[parseResult.options.dataProvider];
        if (provider === undefined) {
            return Promise.reject(new Error("The provider supplied is not available."));
        }

        console.log("Discovering");
        return this.discoverer.discover(parseResult.options.inputDirectory, parseResult.options.sourceFileExtension)
            .then((files) => {
                console.log("Found Files ");
                console.dir(files);
                return Promise.resolve()
                    .then(() => {
                        return this.processor.processFiles(provider, parseResult.options.type, parseResult.options.resolution,
                            files, parseResult.options.outputDirectory, parseResult.options.securities);
                    });
            })
            .catch((error) => {
                console.log(error);
            });

    }
}
