import * as parser from "../src/commandlineparser";

let commandParser = new parser.CommandLineParser();

let result = commandParser.parse(["e", "txt"]);
console.dir(result);
