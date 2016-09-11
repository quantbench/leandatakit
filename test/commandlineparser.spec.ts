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
                this.parseResult.options.sourceDirectory.should.be.equal(this.sourceDirectory);
            });

            it("should parse the destinationdirectory", () => {
                this.parseResult.options.destinationDirectory.should.be.equal(this.destinationDirectory);
            });

            it("should use a default for instruments", () => {
                this.parseResult.options.instruments.should.equal(parser.INSTRUMENTS_DEFAULT);
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
                this.sourceDirectory = "somesourcedirectory";
                this.destinationDirectory = "somedestinationdirectory";
                this.parseResult = this.parser.parse(["-s", this.sourceDirectory,
                    "-d", this.destinationDirectory]);
            });

            it("should parse the sourcedirectory", () => {
                this.parseResult.options.sourceDirectory.should.be.equal(this.sourceDirectory);
            });

            it("should parse the destinationdirectory", () => {
                this.parseResult.options.destinationDirectory.should.be.equal(this.destinationDirectory);
            });

            it("should use a default for instruments", () => {
                this.parseResult.options.instruments.should.equal(parser.INSTRUMENTS_DEFAULT);
            });

            it("should use a default for source extension", () => {
                this.parseResult.options.sourceFileExtension.should.be.equal(parser.SOURCE_EXTENSION_DEFAULT);
            });

            it("should result in no errors", () => {
                this.parseResult.error.should.have.lengthOf(0);
            });
        });
    });

    describe("when instruments are specified along with the default flags", () => {
        describe("given that the long form is used", () => {
            beforeEach(() => {
                this.instruments = "abc, edf";
                this.sourceDirectory = "somesourcedirectory";
                this.destinationDirectory = "somedestinationdirectory";
                this.parseResult = this.parser.parse(["--source-directory", this.sourceDirectory,
                    "--destination-directory", this.destinationDirectory, "--instruments", this.instruments]);
            });

            it("should parse the instruments", () => {
                this.parseResult.options.instruments.should.equal(this.instruments);
            });

            it("should result in no errors", () => {
                this.parseResult.error.should.have.lengthOf(0);
            });
        });

        describe("given that the short form is used", () => {
            beforeEach(() => {
                this.instruments = "abc, edf";
                this.sourceDirectory = "somesourcedirectory";
                this.destinationDirectory = "somedestinationdirectory";
                this.parseResult = this.parser.parse(["--source-directory", this.sourceDirectory,
                    "--destination-directory", this.destinationDirectory, "-i", this.instruments]);
            });

            it("should parse the instruments", () => {
                this.parseResult.options.instruments.should.equal(this.instruments);
            });

            it("should result in no errors", () => {
                this.parseResult.error.should.have.lengthOf(0);
            });
        });
    });

    describe("when instruments are specified from a file along with the default flags", () => {
        describe("given that the long form is used", () => {
            beforeEach(() => {
                this.instrumentsFile = "someinstrumentsfile";
                this.sourceDirectory = "somesourcedirectory";
                this.destinationDirectory = "somedestinationdirectory";
                this.parseResult = this.parser.parse(["--source-directory", this.sourceDirectory,
                    "--destination-directory", this.destinationDirectory, "--instruments-file", this.instrumentsFile]);
            });

            it("should parse the instruments file", () => {
                this.parseResult.options.instrumentsFile.should.deep.equal(this.instrumentsFile);
            });

            it("should result in no errors", () => {
                this.parseResult.error.should.have.lengthOf(0);
            });
        });

        describe("given that the long form is used", () => {
            beforeEach(() => {
                this.instrumentsFile = "someinstrumentsfile";
                this.sourceDirectory = "somesourcedirectory";
                this.destinationDirectory = "somedestinationdirectory";
                this.parseResult = this.parser.parse(["--source-directory", this.sourceDirectory,
                    "--destination-directory", this.destinationDirectory, "-f", this.instrumentsFile]);
            });

            it("should parse the instruments file", () => {
                this.parseResult.options.instrumentsFile.should.deep.equal(this.instrumentsFile);
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
                this.sourceDirectory = "somesourcedirectory";
                this.destinationDirectory = "somedestinationdirectory";
                this.parseResult = this.parser.parse(["--source-directory", this.sourceDirectory,
                    "--destination-directory", this.destinationDirectory, "--source-extension", this.sourceFileExtension]);
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
                this.sourceDirectory = "somesourcedirectory";
                this.destinationDirectory = "somedestinationdirectory";
                this.parseResult = this.parser.parse(["--source-directory", this.sourceDirectory,
                    "--destination-directory", this.destinationDirectory, "-e", this.sourceFileExtension]);
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
            this.parseResult.error.length.should.be.above(0);
        });
    });
});
