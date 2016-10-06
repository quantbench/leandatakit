import * as parser from "../src/commandlineparser";
import * as chai from "chai";

chai.should();

describe("CommandLineParser", () => {
    beforeEach(() => {
        this.parser = new parser.CommandLineParser();

    });

    describe("when source and output directory are specified with no other flags", () => {
        describe("given that the long form is used", () => {
            beforeEach(() => {
                this.inputDirectory = "someinputDirectory";
                this.outputDirectory = "someoutputdirectory";
                this.parseResult = this.parser.parse(["--input-directory", this.inputDirectory,
                    "--output-directory", this.outputDirectory]);
            });

            it("should parse the inputDirectory", () => {
                this.parseResult.options.inputDirectory.should.be.equal(this.inputDirectory);
            });

            it("should parse the outputdirectory", () => {
                this.parseResult.options.outputDirectory.should.be.equal(this.outputDirectory);
            });

            it("should use a default for securities", () => {
                this.parseResult.options.securities.should.deep.equal([parser.SECURITIES_DEFAULT]);
            });

            it("should use a default for source extension", () => {
                this.parseResult.options.sourceFileExtension.should.be.equal(parser.SOURCE_EXTENSION_DEFAULT);
            });

            it("should result in no errors", () => {
                this.parseResult.error.should.have.lengthOf(0);
            });
        });

        describe("given that the short form is used", () => {
            beforeEach(() => {
                this.inputDirectory = "someinputDirectory";
                this.outputDirectory = "someoutputdirectory";
                this.parseResult = this.parser.parse(["-i", this.inputDirectory,
                    "-d", this.outputDirectory]);
            });

            it("should parse the inputDirectory", () => {
                this.parseResult.options.inputDirectory.should.be.equal(this.inputDirectory);
            });

            it("should parse the outputdirectory", () => {
                this.parseResult.options.outputDirectory.should.be.equal(this.outputDirectory);
            });

            it("should use a default for securities", () => {
                this.parseResult.options.securities.should.deep.equal([parser.SECURITIES_DEFAULT]);
            });

            it("should use a default for source extension", () => {
                this.parseResult.options.sourceFileExtension.should.be.equal(parser.SOURCE_EXTENSION_DEFAULT);
            });

            it("should result in no errors", () => {
                this.parseResult.error.should.have.lengthOf(0);
            });
        });
    });

    describe("when securities are specified along with the default flags", () => {
        describe("given that the long form is used", () => {
            beforeEach(() => {
                this.securities = "abc, edf";
                this.inputDirectory = "someinputDirectory";
                this.outputDirectory = "someoutputdirectory";
                this.parseResult = this.parser.parse(["--input-directory", this.inputDirectory,
                    "--output-directory", this.outputDirectory, "--securities", this.securities]);
            });

            it("should parse the securities", () => {
                this.parseResult.options.securities.should.deep.equal(this.securities.split(","));
            });

            it("should result in no errors", () => {
                this.parseResult.error.should.have.lengthOf(0);
            });
        });

        describe("given that the short form is used", () => {
            beforeEach(() => {
                this.securities = "abc, edf";
                this.inputDirectory = "someinputDirectory";
                this.outputDirectory = "someoutputdirectory";
                this.parseResult = this.parser.parse(["--input-directory", this.inputDirectory,
                    "--output-directory", this.outputDirectory, "-s", this.securities]);
            });

            it("should parse the securities", () => {
                this.parseResult.options.securities.should.deep.equal(this.securities.split(","));
            });

            it("should result in no errors", () => {
                this.parseResult.error.should.have.lengthOf(0);
            });
        });
    });

    describe("when securities are specified from a file along with the default flags", () => {
        describe("given that the long form is used", () => {
            beforeEach(() => {
                this.securitiesFile = "somesecuritiesfile";
                this.inputDirectory = "someinputDirectory";
                this.outputDirectory = "someoutputdirectory";
                this.parseResult = this.parser.parse(["--input-directory", this.inputDirectory,
                    "--output-directory", this.outputDirectory, "--securities-file", this.securitiesFile]);
            });

            it("should parse the securities file", () => {
                this.parseResult.options.securitiesFile.should.deep.equal(this.securitiesFile);
            });

            it("should result in no errors", () => {
                this.parseResult.error.should.have.lengthOf(0);
            });
        });

        describe("given that the long form is used", () => {
            beforeEach(() => {
                this.securitiesFile = "somesecuritiesfile";
                this.inputDirectory = "someinputDirectory";
                this.outputDirectory = "someoutputdirectory";
                this.parseResult = this.parser.parse(["--input-directory", this.inputDirectory,
                    "--output-directory", this.outputDirectory, "-f", this.securitiesFile]);
            });

            it("should parse the securities file", () => {
                this.parseResult.options.securitiesFile.should.deep.equal(this.securitiesFile);
            });

            it("should result in no errors", () => {
                this.parseResult.error.should.have.lengthOf(0);
            });
        });
    });

    describe("when source file extensions are specified along with the default flags", () => {
        describe("given that the long form is used", () => {
            beforeEach(() => {
                this.sourceFileExtension = "txt";
                this.inputDirectory = "someinputDirectory";
                this.outputDirectory = "someoutputdirectory";
                this.parseResult = this.parser.parse(["--input-directory", this.inputDirectory,
                    "--output-directory", this.outputDirectory, "--source-extension", this.sourceFileExtension]);
            });

            it("should parse the source extension", () => {
                this.parseResult.options.sourceFileExtension.should.equal(this.sourceFileExtension);
            });

            it("should result in no errors", () => {
                this.parseResult.error.should.have.lengthOf(0);
            });
        });

        describe("given that the long form is used", () => {
            beforeEach(() => {
                this.sourceFileExtension = "txt";
                this.inputDirectory = "someinputDirectory";
                this.outputDirectory = "someoutputdirectory";
                this.parseResult = this.parser.parse(["--input-directory", this.inputDirectory,
                    "--output-directory", this.outputDirectory, "-e", this.sourceFileExtension]);
            });

            it("should parse the source extension", () => {
                this.parseResult.options.sourceFileExtension.should.equal(this.sourceFileExtension);
            });

            it("should result in no errors", () => {
                this.parseResult.error.should.have.lengthOf(0);
            });
        });
    });

    describe("when no arguments are supplied", () => {
        beforeEach(() => {
            this.parseResult = this.parser.parse([]);
        });

        it("should result in errors", () => {
            console.log("ARG");
            this.parseResult.error.length.should.be.above(0);
        });
    });
});
