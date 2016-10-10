import * as discovery from "./securityDiscoverer";
import * as processing from "./securityFileProcessor";
import * as types from "./types";
import * as Promise from "bluebird";

export class Convertor {
    private discoverer: discovery.SecurityDiscoverer;
    private processor: processing.SecurityFileProcessor;
    private conversionOptions: types.ConvertDataToLeanFmtOptions;

    constructor(
        conversionOptions: types.ConvertDataToLeanFmtOptions,
        discoverer: discovery.SecurityDiscoverer,
        processor: processing.SecurityFileProcessor) {

        this.conversionOptions = conversionOptions;
        this.discoverer = discoverer;
        this.processor = processor;
    }

    public convert(providers: { [key: string]: types.IProvider }): Promise<{}> {

        // try find a provider for the one supplied
        let provider = providers[this.conversionOptions.dataProvider];
        if (provider === undefined) {
            return Promise.reject(new Error("The provider supplied is not available."));
        }

        return this.discoverer.discover(this.conversionOptions.inputDirectory, this.conversionOptions.sourceFileExtension)
            .then((files) => {
                return Promise.resolve()
                    .then(() => {
                        return this.processor.processFiles(files, this.conversionOptions.outputDirectory,
                            this.conversionOptions.securities);
                    });
            })
            .catch((error) => {
                console.dir(error);
            });

    }
}
