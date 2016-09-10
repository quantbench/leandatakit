import * as parser from "../src/commandlineparser";
import * as chai from "chai";

chai.should();

describe("CommandLineParser", () => {
    beforeEach(() => {
        this.parser = new parser.CommandLineParser();

    });

    describe("when source and destination directory are specified with no other flags", () => {
        describe("given that the long form is used", () => {
            beforeEach(() => {
                this.sourceDirectory = "somesourcedirectory";
                this.destinationDirectory = "somedestinationdirectory";
                this.parseResult = this.parser.parse(["--source-directory", this.sourceDirectory,
                    "--destination-directory", this.destinationDirectory]);
            });

            it("should parse the sourcedirectory", () => {
                this.parseResult.sourceDirectory.should.be.equal(this.sourceDirectory);
            });

            it("should parse the destinationdirectory", () => {
                this.parseResult.destinationDirectory.should.be.equal(this.destinationDirectory);
            });

            it("should use a default for instruments", () => {
                this.parseResult.instruments.should.deep.equal([parser.INSTRUMENTS_DEFAULT]);
            });

            it("should use a default for source extension", () => {
                this.parseResult.sourceFileExtension.should.be.equal(parser.SOURCE_EXTENSION_DEFAULT);
            });
        });

        describe("given that the short form is used", () => {
            beforeEach(() => {
                this.sourceDirectory = "somesourcedirectory";
                this.destinationDirectory = "somedestinationdirectory";
                this.parseResult = this.parser.parse(["-s", this.sourceDirectory,
                    "-d", this.destinationDirectory]);
            });

            it("should parse the sourcedirectory", () => {
                this.parseResult.sourceDirectory.should.be.equal(this.sourceDirectory);
            });

            it("should parse the destinationdirectory", () => {
                this.parseResult.destinationDirectory.should.be.equal(this.destinationDirectory);
            });

            it("should use a default for instruments", () => {
                this.parseResult.instruments.should.deep.equal([parser.INSTRUMENTS_DEFAULT]);
            });

            it("should use a default for source extension", () => {
                this.parseResult.sourceFileExtension.should.be.equal(parser.SOURCE_EXTENSION_DEFAULT);
            });
        });
    });

    describe("when instruments are specified with no other flags", () => {
        describe("given that the long form is used", () => {
            beforeEach(() => {
                this.instruments = ["abc", "edf"];
                this.parseResult = this.parser.parse(["--instruments", this.instruments]);
            });

            it("should parse the instruments", () => {
                this.parseResult.instruments.should.deep.equal(this.instruments);
            });
        });

        describe("given that the long form is used", () => {
            beforeEach(() => {
                this.instruments = ["abc", "edf"];
                this.parseResult = this.parser.parse(["-i", this.instruments]);
            });

            it("should parse the instruments", () => {
                this.parseResult.instruments.should.deep.equal(this.instruments);
            });
        });
    });

    describe("when instruments are specified from a file with no other flags", () => {
        describe("given that the long form is used", () => {
            beforeEach(() => {
                this.instrumentsFile = "someinstrumentsfile";
                this.parseResult = this.parser.parse(["--instruments-file", this.instrumentsFile]);
            });

            it("should parse the instruments file", () => {
                this.parseResult.instrumentsFile.should.deep.equal(this.instrumentsFile);
            });
        });

        describe("given that the long form is used", () => {
            beforeEach(() => {
                this.instrumentsFile = "someinstrumentsfile";
                this.parseResult = this.parser.parse(["-f", this.instrumentsFile]);
            });

            it("should parse the instruments file", () => {
                this.parseResult.instrumentsFile.should.deep.equal(this.instrumentsFile);
            });
        });
    });

    describe("when source file extensions are specified with no other flags", () => {
        describe("given that the long form is used", () => {
            beforeEach(() => {
                this.sourceFileExtension = "txt";
                this.parseResult = this.parser.parse(["--source-extension", this.sourceFileExtension]);
            });

            it("should parse the source extension", () => {
                this.parseResult.sourceFileExtension.should.equal(this.sourceFileExtension);
            });
        });

        describe("given that the long form is used", () => {
            beforeEach(() => {
                this.sourceFileExtension = "txt";
                this.parseResult = this.parser.parse(["-e", this.sourceFileExtension]);
            });

            it("should parse the source extension", () => {
                this.parseResult.sourceFileExtension.should.equal(this.sourceFileExtension);
            });
        });
    });
});
