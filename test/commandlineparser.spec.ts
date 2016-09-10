import * as parser from "../src/commandlineparser";

describe("CommandLineParser", () => {
    describe("when receiving command line arguments", () => {
        beforeEach(() => {
            this.parser = new parser.CommandLineParser();
            this.arguments = ["-a", "hello"];
        });

        it("should parse the argument array", () => {
            let result = this.parser.parse(this.arguments);
            console.log(result);
        });
    });
});
