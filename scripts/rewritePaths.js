//
// Based on:
// https://github.com/microsoft/TypeScript/issues/16577#issuecomment-310426634
//

const FileHound = require("filehound");
const fs = require("fs");
const path = require("path");

const files = FileHound.create()
    .paths(path.join(__dirname, "..", "js"))
    .ext("js")
    .find();

files.then((filePaths) => {
    filePaths.forEach((filepath) => {
        fs.readFile(filepath, "utf8", (err, data) => {
            if (!(data.match(/import .* from/g) || data.match(/\.\/assets/g))) {
                return;
            }
            const newData = data
                .replace(/(import .* from\s+['"])(.*)(?=['"])/g, "$1$2.js")
                .replace(/\.\/assets/g, "http://localhost:8080/dist/assets");

            if (err) throw err;

            // console.log(`writing to ${filepath}`)

            fs.writeFile(filepath, newData, function (err) {
                if (err) {
                    throw err;
                }
            });
        });
    });
    console.log("Import path rewrites complete");
});
