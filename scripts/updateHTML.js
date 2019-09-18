const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const indexHTML = fs.readFileSync(path.join(__dirname, "..", "index.html"));

const dom = new JSDOM(indexHTML);

const script = dom.window.document.querySelector("script");
script.src = "app.js";
script.removeAttribute("type");

fs.writeFileSync(
	"dist/index_prod.html",
	dom.window.document.documentElement.outerHTML.replace(/\n|\t/g, "")
);
