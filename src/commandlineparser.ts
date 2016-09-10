let parse = require("yargs-parser");
import * as types from "./types";

export const INSTRUMENTS_DEFAULT = "*";
export const SOURCE_EXTENSION_DEFAULT = "csv";

export class CommandLineParser {
    public parse(args: any[]): types.PackageDataForLeanOptions {
        let options: any = parse(args, {
            "alias": {
                "destination-directory": ["d"],
                "instruments": ["i"],
                "instruments-file": ["f"],
                "source-directory": ["s"],
                "source-extension": ["e"],
            },
            "default": {
                "source-extension": SOURCE_EXTENSION_DEFAULT,
                "instruments": [INSTRUMENTS_DEFAULT],
            },
            "array": ["instruments"],
        });
        return {
            "destinationDirectory": options["destination-directory"],
            "sourceDirectory": options["source-directory"],
            "sourceFileExtension": options["source-extension"],
            "instruments": options.instruments,
            "instrumentsFile": options["instruments-file"],
        };
    }
}
