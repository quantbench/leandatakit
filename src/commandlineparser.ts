import * as types from "./types";
import * as yargs from "yargs";

export const INSTRUMENTS_DEFAULT = "*";
export const SOURCE_EXTENSION_DEFAULT = "csv";

export interface CommandLineParserResult {
    options: types.PackageDataForLeanOptions;
    error: string;
}

class CommandLineParserResultImpl implements CommandLineParserResult {
    public options: types.PackageDataForLeanOptions;
    public error: string;

    constructor(options: types.PackageDataForLeanOptions, error: string) {
        this.options = options;
        this.error = error;
    }
}

export class CommandLineParser {
    public parse(args: string[]): CommandLineParserResult {
        let parseErrors: string = "";

        function fail(message: string): any {
            parseErrors = message;
            console.error(message);
        }

        let options: any = yargs.alias("destination-directory", "d")
            .alias("instruments", "i")
            .alias("instruments-file", "f")
            .alias("source-directory", "s")
            .alias("source-extension", "e")
            .default("source-extension", SOURCE_EXTENSION_DEFAULT)
            .default("instruments", INSTRUMENTS_DEFAULT)
            .demand("source-directory")
            .demand("destination-directory")
            .fail(fail)
            .parse(args);

        return new CommandLineParserResultImpl({
            "destinationDirectory": options["destination-directory"],
            "sourceDirectory": options["source-directory"],
            "sourceFileExtension": options["source-extension"],
            "instruments": options.instruments,
            "instrumentsFile": options["instruments-file"],
        }, parseErrors);
    }
}
