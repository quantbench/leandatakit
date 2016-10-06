import * as discoverer from "../src/securityDiscoverer";

let disco: discoverer.SecurityDiscoverer = new discoverer.SecurityDiscoverer();
disco.discover("./test/data/", "*.csv")
    .then((files) => {
        console.dir(files);
    });
