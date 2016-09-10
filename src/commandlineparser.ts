let parse = require("yargs-parser");
import * as yargs from "yargs";

export class CommandLineParser {
    public parse(args: any[]): yargs.Argv {
        return parse(args);
    }
}
