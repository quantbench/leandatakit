import * as types from "./types";
import * as yargs from "yargs";

export const SECURITIES_DEFAULT = "*";
export const SOURCE_EXTENSION_DEFAULT = "csv";

export interface CommandLineParserResult {
    options: types.ConvertDataToLeanFmtOptions;
    error: string;
}

class CommandLineParserResultImpl implements CommandLineParserResult {
    public options: types.ConvertDataToLeanFmtOptions;
    public error: string;

    constructor(options: types.ConvertDataToLeanFmtOptions, error: string) {
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

        let options: any = yargs.alias("output-directory", "o")
            .alias("securities", "s")
            .alias("securities-file", "f")
            .alias("input-directory", "i")
            .alias("source-extension", "e")
            .alias("data-provider", "p")
            .demand("p", "the name of the data provider that supports the input data format.")
            .alias("resolution", "r")
            .choices("r", ["daily", "hourly", "minute", "second", "tick"])
            .default("r", "daily")
            .alias("type", "t")
            .choices("t", ["equity", "option", "forex"])
            .default("t", "equity")
            .default("source-extension", SOURCE_EXTENSION_DEFAULT)
            .default("securities", SECURITIES_DEFAULT)
            .demand("input-directory")
            .demand("output-directory")
            .fail(fail)
            .parse(args);

        return new CommandLineParserResultImpl({
            "outputDirectory": options["output-directory"],
            "inputDirectory": options["input-directory"],
            "sourceFileExtension": options["source-extension"],
            "securities": options.securities.split(","),
            "securitiesFile": options["securities-file"],
            "dataProvider": options["data-provider"],
            "resolution": (<any> types.Resolution)[options.resolution],
            "type": (<any> types.SecurityType)[options.type],
        }, parseErrors);
    }
}
