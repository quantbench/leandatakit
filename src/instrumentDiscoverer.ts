import * as Promise from "bluebird";
import * as glob from "glob";
import * as path from "path";

export class InstrumentDiscoverer {
    public discover(sourceDirectory: string, sourceFileExtension: string): Promise<string[]> {

        return new Promise<string[]>((resolve, reject) => {
            let resolvedPath = path.resolve(sourceDirectory);
            console.log("PATH " + resolvedPath);
            let globstring = path.join(resolvedPath + "/**/*." + sourceFileExtension);
            console.log(globstring);
            glob(globstring, (err, files) => {
                if (err == null) {
                    resolve(files);
                } else {
                    reject(err);
                }
            });
        });
    }
}
