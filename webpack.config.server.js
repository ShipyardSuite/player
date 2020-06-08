const nodeExternals = require("webpack-node-externals");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const path = require("path");

const smp = new SpeedMeasurePlugin();

module.exports = () => {
    return smp.wrap({
        context: __dirname,
        mode: "production",
        name: "server",
        node: false,
        entry: [path.join(__dirname, "./src/server/index.js")],
        target: "node",
        output: {
            path: path.join(__dirname, "/dist/server"),
            filename: "bundle.js",
            publicPath: "/dist/",
            libraryTarget: "commonjs2"
        },
        externals: [nodeExternals()],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: ["babel-loader"]
                }
            ]
        },
        plugins: []
    });
};
