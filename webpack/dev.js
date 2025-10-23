const { merge } = require("webpack-merge");
const webpack = require("webpack");
const vendorModules = require('../vendor/vendorModules');
const base = require("./base.js");

const path = require("path");
const sourcePath = path.join(__dirname, "../src");
const vendorManifest = require("../vendor/vendorManifest.json");

module.exports = merge(base, {
  mode: "development",
  entry: {
    app: [
      path.join(sourcePath, "index.jsx"),
      "webpack-hot-middleware/client?path=http://127.0.0.1:3000/__webpack_hmr&timeout=20000&reload=true",
    ],
    vendor: vendorModules,
  },
  optimization: {
    moduleIds: "named",
    emitOnErrors: false,
    splitChunks: { name: "vendor" },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      publicPath: 'http://127.0.0.1:3000/',
      fileContext: 'public',
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: vendorManifest,
    }),
    new webpack.DefinePlugin({
      "process.env.production": false,
    }),
  ],
  output: {
    path: path.join(__dirname, "..", "dev"),
    filename: "[name].js",
    publicPath: "http://127.0.0.1:3000/dev/",
  },
});
