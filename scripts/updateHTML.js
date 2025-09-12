const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const indexHTML = fs.readFileSync(path.join(__dirname, "..", "index.html"));

const dom = new JSDOM(indexHTML);

const script = dom.window.document.querySelector("script");
script.src = "app.js";
script.removeAttribute("type");

const link = dom.window.document.head.querySelector("link");
link.parentElement.removeChild(link);

const styles = fs.readFileSync("style.css");
const styleElement = dom.window.document.createElement("style");
styleElement.innerHTML = styles;
dom.window.document.head.appendChild(styleElement);

fs.writeFileSync(
    "dist/index_prod.html",
    dom.window.document.documentElement.outerHTML.replace(/\n|\t/g, ""),
);
