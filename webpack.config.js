const path = require("path");

module.exports = {
	mode: "production",
	entry: "./src/index.ts",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
				include: [
					path.resolve(__dirname, 'src')
				]
			}
		]
	},
	resolve: {
		extensions: [".ts"]
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "app.js"
	}
};
