import * as discoverer from "../src/instrumentDiscoverer";

let disco: discoverer.InstrumentDiscoverer = new discoverer.InstrumentDiscoverer();
disco.discover("./test/data/", "*.csv")
    .then((files) => {
        console.dir(files);
    });
