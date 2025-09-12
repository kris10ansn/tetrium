const fs = require("fs");

let set = false;
let x;
const arg = process.argv[2];
if (arg === "--set") {
    x = process.argv[3];
    set = true;
} else {
    x = arg ? Number(arg) : 1;
}

let manifest = JSON.parse(fs.readFileSync("dist/manifest.json"));
let package = JSON.parse(fs.readFileSync("package.json"));

let newVersion = manifest.version;

if (set) {
    newVersion = x;
} else {
    const version = manifest.version.split(".");
    newVersion = version
        .map((n, i) => (i === version.length - 1 ? Number(n) + x : n))
        .join(".");
}

manifest.version = package.version = newVersion;

fs.writeFileSync("dist/manifest.json", JSON.stringify(manifest, null, 2));
fs.writeFileSync("package.json", JSON.stringify(package, null, 2));
