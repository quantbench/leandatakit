import * as types from "./types";
import * as Promise from "bluebird";
import * as fs from "fs";
import * as path from "path";
let fsAsync: any = Promise.promisifyAll(fs);

export class ProviderLoader implements types.IProviderRegistrator {
    private providers: { [key: string]: types.IProvider } = {};

    public loadProviders(pluginPath: string): Promise<{}> {

        let thisLocal = this;
        return Promise.resolve().then(() => {
            return fsAsync.lstatAsync(pluginPath)
                .then((stat: fs.Stats) => {
                    if (stat.isDirectory()) {

                        // we have a directory: do a tree walk
                        return fsAsync.readdirAsync(pluginPath)
                            .then((files: string[]) => {
                                let f: string = "";
                                let l: number = files.length;
                                let providerPromises: any[] = [];
                                for (let i = 0; i < l; i++) {
                                    f = path.join(pluginPath, files[i]);
                                    if (f.endsWith(".js")) {
                                        providerPromises.push(this.loadProviders(f));
                                    }
                                }
                                return Promise.all(providerPromises);
                            });
                    } else {
                        // we have a file: load it
                        require(pluginPath)(thisLocal);
                    }
                });
        }).then(() => {
            return Promise.resolve(thisLocal.providers);
        });
    }

    public registerProvider(key: string, provider: types.IProvider): void {
        this.providers[key] = provider;
    }
}
