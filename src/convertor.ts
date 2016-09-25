import * as parsing from "./commandlineparser";
import * as discovery from "./instrumentDiscoverer";
import * as processing from "./instrumentFileProcessor";

import * as Promise from "bluebird";

export class Convertor {
    private parser: parsing.CommandLineParser;
    private discoverer: discovery.InstrumentDiscoverer;
    private processor: processing.InstrumentFileProcessor;
    constructor(
        parser: parsing.CommandLineParser,
        discoverer: discovery.InstrumentDiscoverer,
        processor: processing.InstrumentFileProcessor) {

        this.parser = parser;
        this.discoverer = discoverer;
        this.processor = processor;
    }

    public convert(conversionOptions: string[]): Promise<{}> {
        let parseResult = this.parser.parse(conversionOptions);
        console.log("Discovering");
        return this.discoverer.discover(parseResult.options.sourceDirectory, parseResult.options.sourceFileExtension)
            .then((files) => {
                console.log("Found Files ");
                console.dir(files);
                return Promise.resolve()
                    .then(() => {
                        return this.processFiles(files, parseResult.options.instruments);
                    });
            })
            .catch((error) => {
                console.log(error);
            });

    }

    private processFiles(files: string[], instruments: string[]): Promise<{}> {
        console.log("Processing Files");
        return Promise.each(files, (file, index) => {
            console.log("Processing " + file);
            return this.processor.processFile(file, instruments);
        });
    }
}
