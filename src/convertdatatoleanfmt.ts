import * as parsing from "./commandlineparser";
import * as discovery from "./instrumentDiscoverer";
import * as processing from "./instrumentFileProcessor";

import * as Promise from "bluebird";

export class ConvertDataToLeanFmt {
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
        return this.discoverer.discover(parseResult.options.sourceDirectory, parseResult.options.sourceFileExtension)
            .then((files) => {
                return Promise.resolve()
                    .then(() => {
                        return this.processFiles(files, parseResult.options.instruments);
                    });
            });

    }

    private processFiles(files: string[], instruments: string[]): Promise<{}> {
        return Promise.each(files, (file, index) => {
            this.processor.processFile(file, instruments);
        });
    }
}
