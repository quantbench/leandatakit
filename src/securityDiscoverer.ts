import * as Promise from "bluebird";
import * as glob from "glob";
import * as path from "path";

export class SecurityDiscoverer {
    public discover(sourceDirectory: string, sourceFileExtension: string): Promise<string[]> {

        return new Promise<string[]>((resolve, reject) => {
            let resolvedPath = path.resolve(sourceDirectory);
            let globstring = path.join(resolvedPath + "/**/*." + sourceFileExtension);
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
